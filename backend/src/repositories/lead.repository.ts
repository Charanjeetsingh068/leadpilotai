import { LeadModel, ILeadDocument } from '../models/Lead.model';

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
  async findById(id: string): Promise<ILeadDocument | null> {
    return LeadModel.findOne({ _id: id, isDeleted: false });
  }

  async findAllByOrganization(organizationId: string, limit = 10): Promise<ILeadDocument[]> {
    return LeadModel.find({ organizationId, isDeleted: false }).sort({ createdAt: -1 }).limit(limit);
  }

  async findAllWithFilters(organizationId: string, options: LeadFilterOptions) {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = { organizationId, isDeleted: false };

    if (options.source) query.source = options.source;
    if (options.status) query.status = options.status;
    if (options.industry) query.industry = options.industry;
    if (options.project) query.project = options.project;
    if (options.assignedSalesUser) query.assignedSalesUser = options.assignedSalesUser;

    if (options.startDate || options.endDate) {
      const dateQuery: Record<string, unknown> = {};
      if (options.startDate) dateQuery.$gte = options.startDate;
      if (options.endDate) dateQuery.$lte = options.endDate;
      query.createdAt = dateQuery;
    }

    if (options.search) {
      const searchRegex = new RegExp(options.search, 'i');
      query.$or = [
        { name: searchRegex },
        { phone: searchRegex },
        { email: searchRegex },
        { project: searchRegex },
      ];
    }

    const sortField = options.sortBy || 'createdAt';
    const sortDir = options.sortOrder === 'asc' ? 1 : -1;
    const sortConfig: Record<string, 1 | -1> = { [sortField]: sortDir };

    const [leads, total] = await Promise.all([
      LeadModel.find(query).populate('assignedSalesUser', 'name email').sort(sortConfig).skip(skip).limit(limit),
      LeadModel.countDocuments(query),
    ]);

    return {
      leads,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async create(leadData: Partial<ILeadDocument>): Promise<ILeadDocument> {
    return LeadModel.create(leadData);
  }

  async updateLead(id: string, updateData: Partial<ILeadDocument>): Promise<ILeadDocument | null> {
    return LeadModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: updateData },
      { new: true }
    );
  }

  async updateStatus(id: string, status: string): Promise<ILeadDocument | null> {
    return LeadModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: { status } },
      { new: true }
    );
  }

  async assignUser(id: string, salesUserId: string): Promise<ILeadDocument | null> {
    return LeadModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: { assignedSalesUser: salesUserId } },
      { new: true }
    );
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await LeadModel.updateOne(
      { _id: id, isDeleted: false },
      { $set: { isDeleted: true, deletedAt: new Date() } }
    );
    return result.modifiedCount > 0;
  }

  async getDashboardMetrics(organizationId: string, startDate?: Date): Promise<DashboardMetricsSummary> {
    const baseQuery: Record<string, unknown> = { organizationId, isDeleted: false };
    if (startDate) {
      baseQuery.createdAt = { $gte: startDate };
    }

    const qualifiedQuery: Record<string, unknown> = { ...baseQuery, status: { $in: ['QUALIFIED', 'SITE_VISIT_SCHEDULED', 'CONVERTED'] } };
    const siteVisitQuery: Record<string, unknown> = { ...baseQuery, status: { $in: ['SITE_VISIT_SCHEDULED', 'CONVERTED'] } };
    const convertedQuery: Record<string, unknown> = { ...baseQuery, status: 'CONVERTED' };

    const [totalLeads, qualifiedLeads, siteVisitsBooked, convertedLeads] = await Promise.all([
      LeadModel.countDocuments(baseQuery),
      LeadModel.countDocuments(qualifiedQuery),
      LeadModel.countDocuments(siteVisitQuery),
      LeadModel.countDocuments(convertedQuery),
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
    const total = await LeadModel.countDocuments({ organizationId, isDeleted: false });
    if (total === 0) {
      return [
        { source: 'FACEBOOK_ADS', count: 0, percentage: 0 },
        { source: 'INSTAGRAM_ADS', count: 0, percentage: 0 },
        { source: 'GOOGLE_ADS', count: 0, percentage: 0 },
        { source: 'WEBSITE_FORM', count: 0, percentage: 0 },
        { source: 'MANUAL_ENTRY', count: 0, percentage: 0 },
      ];
    }

    const results = await LeadModel.aggregate([
      { $match: { organizationId, isDeleted: false } },
      { $group: { _id: '$source', count: { $sum: 1 } } },
    ]);

    return {
      results: results.map((item) => ({
        source: item._id,
        count: item.count,
        percentage: Math.round((item.count / total) * 100),
      })),
    }.results;
  }
}
