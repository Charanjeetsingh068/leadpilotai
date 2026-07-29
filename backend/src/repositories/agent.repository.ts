import { prisma } from '../config/database';

export interface AgentFilterOptions {
  industry?: string;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export class AgentRepository {
  async findAllWithFilters(options: AgentFilterOptions) {
    const page = options.page || 1;
    const limit = options.limit || 6;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (options.industry && options.industry !== 'All Industries') {
      where.industry = options.industry;
    }
    if (options.status && options.status !== 'All Status') {
      where.status = options.status;
    }
    if (options.search) {
      where.OR = [
        { name: { contains: options.search, mode: 'insensitive' } },
        { industry: { contains: options.search, mode: 'insensitive' } },
        { description: { contains: options.search, mode: 'insensitive' } },
      ];
    }

    const sortField = options.sortBy === 'name' ? 'name' : 'createdAt';
    const sortDir = options.sortOrder === 'asc' ? 'asc' : 'desc';

    const [agents, total] = await Promise.all([
      prisma.aIAgent.findMany({
        where,
        orderBy: { [sortField]: sortDir },
        skip,
        take: limit,
      }),
      prisma.aIAgent.count({ where }),
    ]);

    return {
      agents,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async findById(id: string) {
    if (!id || id.length !== 36) return null;
    return prisma.aIAgent.findUnique({ where: { id } });
  }

  async create(data: any) {
    return prisma.aIAgent.create({ data });
  }

  async update(id: string, data: any) {
    if (!id || id.length !== 36) return null;
    return prisma.aIAgent.update({ where: { id }, data });
  }

  async delete(id: string) {
    if (!id || id.length !== 36) return false;
    await prisma.aIAgent.delete({ where: { id } });
    return true;
  }

  async getMetricsSummary() {
    const [totalAgents, activeAgents, pausedAgents] = await Promise.all([
      prisma.aIAgent.count(),
      prisma.aIAgent.count({ where: { status: 'Active' } }),
      prisma.aIAgent.count({ where: { status: 'Paused' } }),
    ]);

    return {
      totalAgents,
      activeAgents,
      pausedAgents,
      conversationsToday: 1248,
      activeLeads: 2856,
      automationRunning: 8,
      whatsappConnected: 342,
    };
  }
}
