import { LeadRepository, LeadFilterOptions } from '../repositories/lead.repository';
import { LeadTimelineRepository } from '../repositories/leadTimeline.repository';
import { LeadNotesRepository } from '../repositories/leadNotes.repository';
import { TimelineEventType, LeadSource, LeadStatus } from '../enums/lead.enums';
import { ApiError } from '../utils/apiError';
import { prisma } from '../config/database';

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
    const lead = await this.leadRepository.create(payload);

    await this.timelineRepository.logEvent(
      lead.id,
      TimelineEventType.LEAD_CREATED,
      'Lead Ingested',
      `Lead ingested via ${payload.source}`,
      'SYSTEM',
      payload.createdBy
    );

    if (payload.notes && payload.createdBy && payload.createdBy.length === 36) {
      await this.notesRepository.addNote(lead.id, payload.createdBy, payload.notes);
    }

    return lead;
  }

  public async getLeadsWithFilters(organizationId: string, options: LeadFilterOptions) {
    return this.leadRepository.findAllWithFilters(organizationId, options);
  }

  public async getLeadById(id: string) {
    if (!id) {
      throw new ApiError(404, 'Lead not found');
    }
    const lead = await this.leadRepository.findById(id);
    if (!lead) {
      throw new ApiError(404, 'Lead not found');
    }

    const [timeline, notes] = await Promise.all([
      this.timelineRepository.findByLeadId(lead.id),
      this.notesRepository.findByLeadId(lead.id),
    ]);

    return {
      ...lead,
      timeline,
      notes,
    };
  }

  public async updateLeadStatus(id: string, status: LeadStatus, actorId?: string) {
    if (!id) {
      throw new ApiError(404, 'Lead not found');
    }
    const lead = await this.leadRepository.updateStatus(id, status);
    if (!lead) {
      throw new ApiError(404, 'Lead not found');
    }

    await this.timelineRepository.logEvent(
      lead.id,
      TimelineEventType.STATUS_UPDATED,
      'Status Updated',
      `Lead status transitioned to ${status}`,
      actorId ? 'AGENT' : 'SYSTEM',
      actorId
    );

    return {
      id: lead.id,
      status: lead.status,
    };
  }

  public async assignLead(id: string, salesUserId: string, assignedBy: string, reason?: string) {
    if (!id) {
      throw new ApiError(404, 'Lead not found');
    }
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
      assignedBy
    );

    return lead;
  }

  public async addLeadNote(id: string, authorId: string, noteText: string) {
    if (!id || id.length !== 36) {
      throw new ApiError(404, 'Lead not found');
    }
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
    if (!id || id.length !== 36) {
      throw new ApiError(404, 'Lead not found');
    }
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
    if (!id || id.length !== 36) {
      return [];
    }
    return this.timelineRepository.findByLeadId(id);
  }

  public async getLeadNotes(id: string) {
    if (!id || id.length !== 36) {
      return [];
    }
    return this.notesRepository.findByLeadId(id);
  }

  public async getLeadConversation(id: string) {
    if (!id || id.length !== 36) {
      return [];
    }
    const messages = await prisma.message.findMany({
      where: {
        conversation: {
          leadId: id,
        },
      },
      orderBy: { createdAt: 'asc' },
    });
    return messages.map((m) => ({
      _id: m.id,
      id: m.id,
      sender: m.sender,
      senderName: m.senderName,
      content: m.content,
      status: m.status,
      createdAt: m.createdAt,
    }));
  }

  public async updateLead(id: string, payload: Partial<CreateLeadPayload>) {
    if (!id || id.length !== 36) {
      throw new ApiError(404, 'Lead not found');
    }
    return this.leadRepository.updateLead(id, payload);
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
        id: lead.id,
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

  public async duplicateCheck(organizationId: string, phone: string, email?: string) {
    const where: any = { isDeleted: false };
    const conditions = [];
    if (phone) conditions.push({ phone });
    if (email) conditions.push({ email });

    if (conditions.length === 0) return { duplicate: false };
    where.OR = conditions;

    const existingLead = await prisma.lead.findFirst({ where });
    if (existingLead) {
      return {
        duplicate: true,
        lead: {
          id: existingLead.id,
          name: existingLead.name,
          phone: existingLead.phone,
          email: existingLead.email,
        },
      };
    }
    return { duplicate: false };
  }

  public async startAi(payload: any, organizationId: string, createdBy?: string) {
    const lead = await this.createLead({
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      source: payload.source || LeadSource.MANUAL_ENTRY,
      campaign: payload.campaign,
      project: payload.project,
      industry: payload.industry,
      budget: payload.budget,
      timeline: payload.timeline,
      location: payload.location,
      notes: payload.notes,
      organizationId,
      createdBy,
    });

    await prisma.lead.update({
      where: { id: lead.id },
      data: { status: 'HUMAN_APPROVAL_REQUIRED' },
    });
    lead.status = 'HUMAN_APPROVAL_REQUIRED';

    const firstMessageText = `Hi ${payload.name || 'there'}, 👋\nThank you for your interest in ${payload.project || 'our project'}.\nI can help you with pricing, availability, site visit and more.\nTo get started, could you please share your preferred location or budget range?`;

    let aiAgent = await prisma.aIAgent.findFirst({ where: { name: 'Property Advisor Agent' } });
    if (!aiAgent) {
      aiAgent = await prisma.aIAgent.create({
        data: {
          name: 'Property Advisor Agent',
          industry: 'Real Estate',
          status: 'Running',
        },
      });
    }

    const conv = await prisma.conversation.create({
      data: {
        leadId: lead.id,
        organizationId,
        isAiAutomated: true,
        unreadCount: 0,
        lastMessageContent: firstMessageText,
        lastMessageAt: new Date(),
        status: 'Active',
        pendingAiReply: firstMessageText,
        aiAgentId: aiAgent.id,
      },
    });

    await prisma.humanApproval.create({
      data: {
        leadId: lead.id,
        conversationId: conv.id,
        pendingReplyText: firstMessageText,
        reason: 'Pricing shared by AI',
        priority: 'High',
        status: 'Pending',
        confidenceScore: 85,
        organizationId,
      },
    });

    await this.timelineRepository.logEvent(
      lead.id,
      TimelineEventType.WHATSAPP_STARTED,
      'WhatsApp Automation Triggered',
      'First AI message held in approval queue.',
      'SYSTEM',
      createdBy
    );

    return {
      lead: {
        ...lead,
        status: 'HUMAN_APPROVAL_REQUIRED',
      },
      conversation: {
        id: conv.id,
        leadId: conv.leadId,
        organizationId: conv.organizationId,
        isAiAutomated: conv.isAiAutomated,
        unreadCount: conv.unreadCount,
        lastMessageContent: conv.lastMessageContent,
        lastMessageAt: conv.lastMessageAt,
        assignedSalesperson: {
          name: 'Neha Singh',
          avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
          role: 'Sales Executive',
        },
        aiSummary: {
          intent: 'Interested in project pricing and info.',
          budget: payload.budget || 'Not specified',
          project: payload.project || 'Sunshine Villas',
          timeline: payload.timeline || '1-3 months',
          loan: 'Required',
          sentiment: 'Positive',
          leadScore: 80,
          recommendedAction: 'Verify pricing & schedule site visit',
          confidenceScore: 85,
        },
        pendingAiReply: conv.pendingAiReply,
      },
    };
  }
}
