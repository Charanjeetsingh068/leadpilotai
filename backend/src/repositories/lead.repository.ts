import { prisma } from '../config/database';

export interface DashboardMetricsSummary {
  totalLeads: number;
  qualifiedLeads: number;
  siteVisitsBooked: number;
  convertedLeads: number;
  qualificationRate: number;
}

export interface SourceDistributionItem {
  source: string;
  count: number;
  percentage: number;
}

export interface LeadFilterOptions {
  source?: string;
  status?: string;
  industry?: string;
  project?: string;
  assignedSalesUser?: string;
  startDate?: Date;
  endDate?: Date;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export class LeadRepository {
  async findById(id: string): Promise<any | null> {
    if (!id || id.length !== 36) return null;
    const lead = await prisma.lead.findFirst({
      where: { id, isDeleted: false },
      include: {
        assignedSalesUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!lead) return null;
    return {
      _id: lead.id,
      id: lead.id,
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      source: lead.sourceName || 'MANUAL_ENTRY',
      campaign: lead.campaign,
      project: lead.project,
      industry: lead.industry,
      budget: lead.budget,
      timeline: lead.timeline,
      location: lead.location,
      status: lead.status,
      qualificationScore: lead.qualificationScore,
      assignedSalesUser: lead.assignedSalesUser ? { id: lead.assignedSalesUser.id, name: lead.assignedSalesUser.name, email: lead.assignedSalesUser.email } : null,
      organizationId: lead.workspaceId || 'org_leadpilot_demo',
      createdAt: lead.createdAt,
      updatedAt: lead.updatedAt,
    };
  }

  async findAllByOrganization(organizationId: string, limit = 10): Promise<any[]> {
    const leads = await prisma.lead.findMany({
      where: { isDeleted: false },
      include: {
        assignedSalesUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return leads.map((lead) => ({
      _id: lead.id,
      id: lead.id,
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      source: lead.sourceName || 'MANUAL_ENTRY',
      campaign: lead.campaign,
      project: lead.project,
      industry: lead.industry,
      budget: lead.budget,
      timeline: lead.timeline,
      location: lead.location,
      status: lead.status,
      qualificationScore: lead.qualificationScore,
      assignedSalesUser: lead.assignedSalesUser ? { id: lead.assignedSalesUser.id, name: lead.assignedSalesUser.name, email: lead.assignedSalesUser.email } : null,
      organizationId: lead.workspaceId || 'org_leadpilot_demo',
      createdAt: lead.createdAt,
      updatedAt: lead.updatedAt,
    }));
  }

  async findAllWithFilters(organizationId: string, options: LeadFilterOptions) {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = { isDeleted: false };

    if (options.source) {
      where.sourceName = options.source;
    }
    if (options.status) {
      where.status = options.status;
    }
    if (options.industry) {
      where.industry = options.industry;
    }
    if (options.project) {
      where.project = options.project;
    }
    if (options.assignedSalesUser && options.assignedSalesUser.length === 36) {
      where.assignedSalesUserId = options.assignedSalesUser;
    }

    if (options.startDate || options.endDate) {
      where.createdAt = {};
      if (options.startDate) {
        where.createdAt.gte = options.startDate;
      }
      if (options.endDate) {
        where.createdAt.lte = options.endDate;
      }
    }

    if (options.search) {
      where.OR = [
        { name: { contains: options.search, mode: 'insensitive' } },
        { phone: { contains: options.search, mode: 'insensitive' } },
        { email: { contains: options.search, mode: 'insensitive' } },
        { project: { contains: options.search, mode: 'insensitive' } },
      ];
    }

    const sortField = options.sortBy === 'id' ? 'id' : (options.sortBy || 'createdAt');
    const sortDir = options.sortOrder === 'asc' ? 'asc' : 'desc';

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        include: {
          assignedSalesUser: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { [sortField]: sortDir },
        skip,
        take: limit,
      }),
      prisma.lead.count({ where }),
    ]);

    const formattedLeads = leads.map((lead) => ({
      _id: lead.id,
      id: lead.id,
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      source: lead.sourceName || 'MANUAL_ENTRY',
      campaign: lead.campaign,
      project: lead.project,
      industry: lead.industry,
      budget: lead.budget,
      timeline: lead.timeline,
      location: lead.location,
      status: lead.status,
      qualificationScore: lead.qualificationScore,
      assignedSalesUser: lead.assignedSalesUser ? { id: lead.assignedSalesUser.id, name: lead.assignedSalesUser.name, email: lead.assignedSalesUser.email } : null,
      organizationId: lead.workspaceId || 'org_leadpilot_demo',
      createdAt: lead.createdAt,
      updatedAt: lead.updatedAt,
    }));

    return {
      leads: formattedLeads,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async create(leadData: any): Promise<any> {
    const sourceName = leadData.source;
    
    let sourceId: string | undefined;
    if (sourceName) {
      const source = await prisma.leadSource.findFirst({ where: { name: sourceName } });
      if (source) sourceId = source.id;
    }

    // Lookup default workspace if not set
    let workspaceId = leadData.organizationId && leadData.organizationId.length === 36 ? leadData.organizationId : undefined;
    if (!workspaceId) {
      const ws = await prisma.workspace.findFirst();
      if (ws) workspaceId = ws.id;
    }

    const lead = await prisma.lead.create({
      data: {
        name: leadData.name,
        phone: leadData.phone,
        email: leadData.email || null,
        sourceId,
        sourceName: sourceName || 'MANUAL_ENTRY',
        campaign: leadData.campaign || null,
        project: leadData.project || null,
        industry: leadData.industry || null,
        budget: leadData.budget || null,
        timeline: leadData.timeline || null,
        location: leadData.location || null,
        status: leadData.status || 'NEW',
        qualificationScore: leadData.qualificationScore || 0,
        workspaceId,
        assignedSalesUserId: leadData.assignedSalesUserId && leadData.assignedSalesUserId.length === 36 ? leadData.assignedSalesUserId : null,
        createdByUserId: leadData.createdBy && leadData.createdBy.length === 36 ? leadData.createdBy : null,
      },
    });

    return {
      _id: lead.id,
      id: lead.id,
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      source: lead.sourceName || 'MANUAL_ENTRY',
      status: lead.status,
      qualificationScore: lead.qualificationScore,
      organizationId: lead.workspaceId || 'org_leadpilot_demo',
      createdAt: lead.createdAt,
      updatedAt: lead.updatedAt,
    };
  }

  async updateLead(id: string, updateData: any): Promise<any | null> {
    if (!id || id.length !== 36) return null;
    
    // Map status if present
    const data: any = { ...updateData };
    delete data.id;
    delete data._id;

    const lead = await prisma.lead.update({
      where: { id },
      data,
    });

    return {
      _id: lead.id,
      id: lead.id,
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      source: lead.sourceName || 'MANUAL_ENTRY',
      status: lead.status,
      createdAt: lead.createdAt,
      updatedAt: lead.updatedAt,
    };
  }

  async updateStatus(id: string, status: string): Promise<any | null> {
    if (!id || id.length !== 36) return null;
    return prisma.lead.update({
      where: { id },
      data: { status },
    });
  }

  async assignUser(id: string, salesUserId: string): Promise<any | null> {
    if (!id || id.length !== 36) return null;
    const userId = salesUserId && salesUserId.length === 36 ? salesUserId : null;
    return prisma.lead.update({
      where: { id },
      data: { assignedSalesUserId: userId },
    });
  }

  async softDelete(id: string): Promise<boolean> {
    if (!id || id.length !== 36) return false;
    await prisma.lead.update({
      where: { id },
      data: { isDeleted: true },
    });
    return true;
  }

  async getDashboardMetrics(organizationId: string, startDate?: Date): Promise<DashboardMetricsSummary> {
    const where: any = { isDeleted: false };
    if (startDate) {
      where.createdAt = { gte: startDate };
    }

    const [totalLeads, qualifiedLeads, siteVisitsBooked, convertedLeads] = await Promise.all([
      prisma.lead.count({ where }),
      prisma.lead.count({ where: { ...where, status: { in: ['QUALIFIED', 'SITE_VISIT_SCHEDULED', 'CONVERTED'] } } }),
      prisma.lead.count({ where: { ...where, status: { in: ['SITE_VISIT_SCHEDULED', 'CONVERTED'] } } }),
      prisma.lead.count({ where: { ...where, status: 'CONVERTED' } }),
    ]);

    const qualificationRate = totalLeads > 0 ? Math.round((qualifiedLeads / totalLeads) * 100) : 0;

    return {
      totalLeads,
      qualifiedLeads,
      siteVisitsBooked,
      convertedLeads,
      qualificationRate,
    };
  }

  async getSourceDistribution(organizationId: string): Promise<SourceDistributionItem[]> {
    const total = await prisma.lead.count({ where: { isDeleted: false } });
    if (total === 0) {
      return [
        { source: 'FACEBOOK_ADS', count: 0, percentage: 0 },
        { source: 'INSTAGRAM_ADS', count: 0, percentage: 0 },
        { source: 'GOOGLE_ADS', count: 0, percentage: 0 },
        { source: 'WEBSITE_FORM', count: 0, percentage: 0 },
        { source: 'MANUAL_ENTRY', count: 0, percentage: 0 },
      ];
    }

    const groups = await prisma.lead.groupBy({
      by: ['sourceName'],
      where: { isDeleted: false },
      _count: {
        id: true,
      },
    });

    return groups.map((g) => ({
      source: g.sourceName || 'MANUAL_ENTRY',
      count: g._count.id,
      percentage: Math.round((g._count.id / total) * 100),
    }));
  }
}
