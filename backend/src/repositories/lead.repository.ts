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

    const count = await prisma.lead.count({ where: { isDeleted: false } });
    if (count < 10) {
      const initialLeads = [
        {
          name: 'Rohit Sharma',
          phone: '+91 98765 43210',
          email: 'rohit.sharma@example.com',
          project: 'Sunshine Villas',
          sourceName: 'FACEBOOK_ADS',
          qualificationScore: 85,
          status: 'NEW',
          budget: '₹50 - ₹70 Lakhs',
          location: 'Wakad, Pune',
          timeline: '1-3 Months',
        },
        {
          name: 'Priya Verma',
          phone: '+91 91234 56789',
          email: 'priya.v@example.com',
          project: 'Green Heights',
          sourceName: 'INSTAGRAM_ADS',
          qualificationScore: 92,
          status: 'QUALIFIED',
          budget: '₹80 Lakhs - ₹1 Cr',
          location: 'Baner, Pune',
          timeline: 'Immediate',
        },
        {
          name: 'Amit Kumar',
          phone: '+91 99887 76655',
          email: 'amit.k@example.com',
          project: 'Royal Residency',
          sourceName: 'GOOGLE_ADS',
          qualificationScore: 68,
          status: 'HUMAN_APPROVAL_REQUIRED',
          budget: '₹40 - ₹60 Lakhs',
          location: 'Hinjewadi, Pune',
          timeline: '3-6 Months',
        },
        {
          name: 'Sneha Iyer',
          phone: '+91 87654 32109',
          email: 'sneha.iyer@example.com',
          project: 'Lake View Homes',
          sourceName: 'WEBSITE_FORM',
          qualificationScore: 90,
          status: 'QUALIFIED',
          budget: '₹1.2 Cr+',
          location: 'Koregaon Park, Pune',
          timeline: 'Immediate',
        },
        {
          name: 'Vikram Singh',
          phone: '+91 76543 21098',
          email: 'vikram.singh@example.com',
          project: 'Park Avenue',
          sourceName: 'MANUAL_ENTRY',
          qualificationScore: 55,
          status: 'NEW',
          budget: '₹35 - ₹50 Lakhs',
          location: 'Kharadi, Pune',
          timeline: '6+ Months',
        },
        {
          name: 'Deepak Sharma',
          phone: '+91 88991 12233',
          email: 'deepak.s@example.com',
          project: 'Sunshine Villas',
          sourceName: 'WHATSAPP',
          qualificationScore: 88,
          status: 'QUALIFIED',
          budget: '₹60 - ₹75 Lakhs',
          location: 'Wakad, Pune',
          timeline: '1-3 Months',
        },
        {
          name: 'Anjali Nair',
          phone: '+91 93456 77889',
          email: 'anjali.nair@example.com',
          project: 'Green Heights',
          sourceName: 'INSTAGRAM_ADS',
          qualificationScore: 78,
          status: 'AI_IN_PROGRESS',
          budget: '₹75 - ₹90 Lakhs',
          location: 'Baner, Pune',
          timeline: '1 Month',
        },
        {
          name: 'Manish Gupta',
          phone: '+91 90011 22334',
          email: 'manish.g@example.com',
          project: 'Royal Residency',
          sourceName: 'GOOGLE_ADS',
          qualificationScore: 80,
          status: 'QUALIFIED',
          budget: '₹90 Lakhs - ₹1.1 Cr',
          location: 'Hinjewadi, Pune',
          timeline: 'Immediate',
        },
        {
          name: 'Pooja Bansal',
          phone: '+91 91222 33445',
          email: 'pooja.b@example.com',
          project: 'Lake View Homes',
          sourceName: 'WEBSITE_FORM',
          qualificationScore: 61,
          status: 'NEW',
          budget: '₹50 - ₹65 Lakhs',
          location: 'Kothrud, Pune',
          timeline: '3 Months',
        },
        {
          name: 'Sandeep Kumar',
          phone: '+91 98880 11223',
          email: 'sandeep.k@example.com',
          project: 'Park Avenue',
          sourceName: 'MANUAL_ENTRY',
          qualificationScore: 70,
          status: 'CONTACTED',
          budget: '₹70 - ₹85 Lakhs',
          location: 'Aundh, Pune',
          timeline: '1-3 Months',
        },
      ];

      for (const item of initialLeads) {
        await prisma.lead.create({ data: item });
      }
    }

    const where: any = { isDeleted: false };

    if (options.source && options.source !== 'ALL' && options.source !== 'ALL_SOURCES') {
      where.sourceName = options.source;
    }
    if (options.status && options.status !== 'ALL' && options.status !== 'ALL_STATUS') {
      where.status = options.status;
    }
    if (options.industry && options.industry !== 'ALL' && options.industry !== 'ALL_INDUSTRIES') {
      where.industry = options.industry;
    }
    if (options.project && options.project !== 'ALL' && options.project !== 'ALL_PROJECTS') {
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
