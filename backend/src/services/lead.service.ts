import { LeadRepository, LeadFilterOptions } from '../repositories/lead.repository';
import { LeadTimelineRepository } from '../repositories/leadTimeline.repository';
import { LeadNotesRepository } from '../repositories/leadNotes.repository';
import { TimelineEventType, LeadSource, LeadStatus } from '../enums/lead.enums';
import { ApiError } from '../utils/apiError';
import { MessageModel } from '../models/Message.model';


export interface CreateLeadPayload {
  name: string;
  phone: string;
  email?: string;
  source: LeadSource;
  campaign?: string;
  project?: string;
  industry?: string;
  budget?: string;
  timeline?: string;
  location?: string;
  notes?: string;
  organizationId: string;
  createdBy?: string;
}

export class LeadService {
  private leadRepository: LeadRepository;
  private timelineRepository: LeadTimelineRepository;
  private notesRepository: LeadNotesRepository;

  constructor() {
    this.leadRepository = new LeadRepository();
    this.timelineRepository = new LeadTimelineRepository();
    this.notesRepository = new LeadNotesRepository();
  }

  public async createLead(payload: CreateLeadPayload) {
    const lead = await this.leadRepository.create({
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      source: payload.source,
      campaign: payload.campaign,
      project: payload.project,
      industry: payload.industry,
      budget: payload.budget,
      timeline: payload.timeline,
      location: payload.location,
      organizationId: payload.organizationId,
      status: LeadStatus.NEW,
      qualificationScore: 0,
      isDeleted: false,
    });

    // Automatically log timeline event
    await this.timelineRepository.logEvent(
      String(lead._id),
      TimelineEventType.LEAD_CREATED,
      'Lead Ingested',
      `Lead ingested via ${payload.source}`,
      'SYSTEM',
      payload.createdBy
    );

    if (payload.notes && payload.createdBy) {
      await this.notesRepository.addNote(String(lead._id), payload.createdBy, payload.notes);
    }

    return lead;
  }

  public async getLeadsWithFilters(organizationId: string, options: LeadFilterOptions) {
    const result = await this.leadRepository.findAllWithFilters(organizationId, options);
    return {
      leads: result.leads.map((lead) => ({
        id: String(lead._id),
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        source: lead.source,
        campaign: lead.campaign,
        project: lead.project,
        industry: lead.industry,
        budget: lead.budget,
        timeline: lead.timeline,
        location: lead.location,
        status: lead.status,
        qualificationScore: lead.qualificationScore,
        assignedSalesUser: lead.assignedSalesUser,
        organizationId: lead.organizationId,
        createdAt: lead.createdAt.toISOString(),
        updatedAt: lead.updatedAt.toISOString(),
      })),
      meta: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    };
  }

  public async getLeadById(id: string) {
    const lead = await this.leadRepository.findById(id);
    if (!lead) {
      throw new ApiError(404, 'Lead not found');
    }

    const [timeline, notes] = await Promise.all([
      this.timelineRepository.findByLeadId(id),
      this.notesRepository.findByLeadId(id),
    ]);

    return {
      id: String(lead._id),
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      source: lead.source,
      campaign: lead.campaign,
      project: lead.project,
      industry: lead.industry,
      budget: lead.budget,
      purchaseTimeline: lead.timeline,
      location: lead.location,
      status: lead.status,
      aiStatus: lead.aiStatus,
      humanStatus: lead.humanStatus,
      qualificationScore: lead.qualificationScore,
      assignedSalesUser: lead.assignedSalesUser,
      organizationId: lead.organizationId,
      timeline,
      notes,
      createdAt: lead.createdAt.toISOString(),
      updatedAt: lead.updatedAt.toISOString(),
    };
  }

  public async updateLeadStatus(id: string, status: LeadStatus, actorId?: string) {
    const lead = await this.leadRepository.updateStatus(id, status);
    if (!lead) {
      throw new ApiError(404, 'Lead not found');
    }

    await this.timelineRepository.logEvent(
      id,
      TimelineEventType.STATUS_UPDATED,
      'Status Updated',
      `Lead status transitioned to ${status}`,
      actorId ? 'AGENT' : 'SYSTEM',
      actorId
    );

    return {
      id: String(lead._id),
      status: lead.status,
    };
  }

  public async assignLead(id: string, salesUserId: string, assignedBy: string, reason?: string) {
    const lead = await this.leadRepository.assignUser(id, salesUserId);
    if (!lead) {
      throw new ApiError(404, 'Lead not found');
    }

    await this.timelineRepository.logEvent(
      id,
      TimelineEventType.LEAD_ASSIGNED,
      'Lead Assigned',
      `Lead assigned to sales executive`,
      'AGENT',
      assignedBy,
      { salesUserId, reason }
    );

    return lead;
  }

  public async addLeadNote(id: string, authorId: string, noteText: string) {
    const note = await this.notesRepository.addNote(id, authorId, noteText);

    await this.timelineRepository.logEvent(
      id,
      TimelineEventType.NOTE_ADDED,
      'Note Added',
      noteText.substring(0, 50) + '...',
      'AGENT',
      authorId
    );

    return note;
  }

  public async softDeleteLead(id: string, deletedBy?: string) {
    const success = await this.leadRepository.softDelete(id);
    if (!success) {
      throw new ApiError(404, 'Lead not found');
    }

    await this.timelineRepository.logEvent(
      id,
      TimelineEventType.STATUS_UPDATED,
      'Lead Soft Deleted',
      'Lead marked as soft-deleted',
      'AGENT',
      deletedBy
    );

    return { success: true };
  }

  public async getLeadTimeline(id: string) {
    return this.timelineRepository.findByLeadId(id);
  }

  public async getLeadNotes(id: string) {
    return this.notesRepository.findByLeadId(id);
  }

  public async getLeadConversation(id: string) {
    const messages = await MessageModel.find({ leadId: id }).sort({ createdAt: 1 }).lean();
    return messages;
  }

  public async updateLead(id: string, payload: Partial<CreateLeadPayload>) {
    const lead = await this.leadRepository.findById(id);
    if (!lead) {
      throw new ApiError(404, 'Lead not found');
    }
    Object.assign(lead, payload);
    await lead.save();
    return lead;
  }

  public async bulkAssignLeads(leadIds: string[], salesUserId: string, assignedBy: string) {
    const results = await Promise.all(
      leadIds.map((id) => this.assignLead(id, salesUserId, assignedBy, 'Bulk assign action'))
    );
    return results;
  }

  public async bulkUpdateStatus(leadIds: string[], status: LeadStatus, actorId?: string) {
    const results = await Promise.all(
      leadIds.map((id) => this.updateLeadStatus(id, status, actorId))
    );
    return results;
  }

  public async importLeads(leadsData: any[], organizationId: string, createdBy?: string) {
    const createdLeads = [];
    for (const item of leadsData) {
      const lead = await this.createLead({
        name: item.name || 'Unnamed Lead',
        phone: item.phone || '',
        email: item.email || '',
        source: item.source || LeadSource.MANUAL_ENTRY,
        project: item.project || '',
        campaign: item.campaign || '',
        industry: item.industry || '',
        budget: item.budget || '',
        timeline: item.timeline || '',
        location: item.location || '',
        notes: item.notes || '',
        organizationId,
        createdBy,
      });
      createdLeads.push(lead);
    }
    return createdLeads;
  }

  public async exportLeads(organizationId: string, options: LeadFilterOptions) {
    const result = await this.leadRepository.findAllWithFilters(organizationId, { ...options, limit: 1000, page: 1 });
    return result.leads;
  }

  public async getDashboardOverview(organizationId: string, period?: string) {
    let startDate: Date | undefined;
    const now = new Date();

    if (period === 'today') {
      startDate = new Date(now.setHours(0, 0, 0, 0));
    } else if (period === '7d') {
      startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    } else if (period === '30d') {
      startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }

    const [metrics, sourceDistribution, recentLeads] = await Promise.all([
      this.leadRepository.getDashboardMetrics(organizationId, startDate),
      this.leadRepository.getSourceDistribution(organizationId),
      this.leadRepository.findAllByOrganization(organizationId, 5),
    ]);

    return {
      metrics,
      sourceDistribution,
      recentLeads: recentLeads.map((lead) => ({
        id: String(lead._id),
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        source: lead.source,
        status: lead.status,
        qualificationScore: lead.qualificationScore,
        createdAt: lead.createdAt.toISOString(),
      })),
    };
  }
}

