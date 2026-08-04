import { prisma } from '../config/database';

export const isUuid = (str?: string) => Boolean(str && /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(str));

export interface MultiTenantScope {
  companyId?: string;
  workspaceId?: string;
  userId?: string;
  userRole?: string;
}

export class FacebookRepository {
  // --- ACCOUNTS ---
  async findAccounts(scope: MultiTenantScope, options: { search?: string; status?: string; page?: number; limit?: number }) {
    const page = options.page || 1;
    const limit = options.limit || 50;
    const skip = (page - 1) * limit;

    const where: any = {};

    // RBAC Multi-Tenant Scoping
    if (scope.userRole === 'SUPER_ADMIN' || scope.userRole === 'Super Admin') {
      // Super admin sees all accounts
    } else if (scope.userRole === 'COMPANY_ADMIN' || scope.userRole === 'Company Admin' || scope.userRole === 'Admin') {
      if (isUuid(scope.companyId)) where.companyId = scope.companyId;
    } else {
      if (isUuid(scope.userId)) where.userId = scope.userId;
      if (isUuid(scope.companyId)) where.companyId = scope.companyId;
      if (isUuid(scope.workspaceId)) where.workspaceId = scope.workspaceId;
    }

    if (options.status && options.status !== 'ALL') {
      where.tokenStatus = options.status;
    }

    if (options.search) {
      where.OR = [
        { accountName: { contains: options.search, mode: 'insensitive' } },
        { fbUserId: { contains: options.search, mode: 'insensitive' } },
        { fbUserEmail: { contains: options.search, mode: 'insensitive' } },
      ];
    }

    const [accounts, total] = await Promise.all([
      prisma.facebookAccount.findMany({
        where,
        include: {
          businesses: true,
          pages: true,
          user: { select: { id: true, name: true, email: true, role: { select: { name: true } } } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.facebookAccount.count({ where }),
    ]);

    return { accounts, total, page, limit, totalPages: Math.ceil(total / limit) || 1 };
  }

  async findAccountById(id: string) {
    return prisma.facebookAccount.findUnique({
      where: { id },
      include: {
        businesses: true,
        pages: true,
        permissions: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async findAccountByFbUserId(fbUserId: string) {
    return prisma.facebookAccount.findFirst({ where: { fbUserId } });
  }

  async ensureTenantEntities(scope: MultiTenantScope): Promise<{ companyId: string; workspaceId: string; userId: string }> {
    // 1. Company Verification
    let company = isUuid(scope.companyId) ? await prisma.company.findUnique({ where: { id: scope.companyId } }) : null;
    if (!company) {
      company = await prisma.company.findFirst();
      if (!company) {
        company = await prisma.company.create({
          data: { name: 'Default Enterprise Organization' },
        });
      }
    }

    // 2. Workspace Verification
    let workspace = isUuid(scope.workspaceId) ? await prisma.workspace.findUnique({ where: { id: scope.workspaceId } }) : null;
    if (!workspace || workspace.companyId !== company.id) {
      workspace = await prisma.workspace.findFirst({ where: { companyId: company.id } });
      if (!workspace) {
        workspace = await prisma.workspace.create({
          data: {
            name: 'Primary Workspace',
            companyId: company.id,
          },
        });
      }
    }

    // 3. User Verification
    let user = isUuid(scope.userId) ? await prisma.user.findUnique({ where: { id: scope.userId } }) : null;
    if (!user) {
      user = await prisma.user.findFirst({ where: { companyId: company.id } });
      if (!user) {
        user = await prisma.user.findFirst();
      }
      if (!user) {
        user = await prisma.user.create({
          data: {
            name: 'Charanjeet Singh',
            email: 'charanjeet.s7730@gmail.com',
            passwordHash: 'dummy_hash',
            organizationId: 'org-001',
            companyId: company.id,
          },
        });
      }
    }

    console.log('[TENANT_AUDIT_LOG]', JSON.stringify({
      currentUser: user.id,
      userName: user.name,
      workspace: workspace.id,
      companyId: company.id,
      companyExists: true,
    }, null, 2));

    return { companyId: company.id, workspaceId: workspace.id, userId: user.id };
  }

  async upsertAccount(data: {
    companyId: string;
    workspaceId: string;
    userId: string;
    accountName: string;
    fbUserId: string;
    fbUserEmail?: string;
    avatarUrl?: string;
    accessToken: string;
    tokenExpiresAt: Date;
    tokenStatus?: string;
    scopes?: string[];
  }) {
    const tenant = await this.ensureTenantEntities({ companyId: data.companyId, workspaceId: data.workspaceId, userId: data.userId });

    const existing = await prisma.facebookAccount.findFirst({
      where: { fbUserId: data.fbUserId },
    });

    if (existing) {
      return prisma.facebookAccount.update({
        where: { id: existing.id },
        data: {
          companyId: tenant.companyId,
          workspaceId: tenant.workspaceId,
          userId: tenant.userId,
          accountName: data.accountName,
          avatarUrl: data.avatarUrl || existing.avatarUrl,
          accessToken: data.accessToken,
          tokenExpiresAt: data.tokenExpiresAt,
          tokenStatus: data.tokenStatus || 'Active',
          scopes: data.scopes || existing.scopes,
          lastRefreshAt: new Date(),
          lastSyncAt: new Date(),
        },
      });
    }

    return prisma.facebookAccount.create({
      data: {
        companyId: tenant.companyId,
        workspaceId: tenant.workspaceId,
        userId: tenant.userId,
        accountName: data.accountName,
        fbUserId: data.fbUserId,
        fbUserEmail: data.fbUserEmail,
        avatarUrl: data.avatarUrl,
        accessToken: data.accessToken,
        tokenExpiresAt: data.tokenExpiresAt,
        tokenStatus: data.tokenStatus || 'Active',
        scopes: data.scopes || ['pages_show_list', 'pages_read_engagement', 'leads_retrieval', 'business_management'],
      },
    });
  }

  async deleteAccount(id: string) {
    return prisma.facebookAccount.delete({ where: { id } });
  }

  // --- BUSINESSES ---
  async findBusinesses(scope: MultiTenantScope) {
    const where: any = {};
    if (scope.userRole !== 'SUPER_ADMIN' && scope.userRole !== 'Super Admin') {
      if (isUuid(scope.companyId)) where.companyId = scope.companyId;
      if (isUuid(scope.workspaceId)) where.workspaceId = scope.workspaceId;
    }
    return prisma.facebookBusiness.findMany({
      where,
      include: { pages: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async upsertBusiness(data: {
    companyId: string;
    workspaceId: string;
    facebookAccountId: string;
    businessId: string;
    name: string;
    verificationStatus?: string;
    accessLevel?: string;
  }) {
    const tenant = await this.ensureTenantEntities({ companyId: data.companyId, workspaceId: data.workspaceId });

    const existing = await prisma.facebookBusiness.findFirst({
      where: { businessId: data.businessId },
    });

    if (existing) {
      return prisma.facebookBusiness.update({
        where: { id: existing.id },
        data: {
          companyId: tenant.companyId,
          workspaceId: tenant.workspaceId,
          name: data.name,
          verificationStatus: data.verificationStatus,
        },
      });
    }

    return prisma.facebookBusiness.create({
      data: {
        ...data,
        companyId: tenant.companyId,
        workspaceId: tenant.workspaceId,
      },
    });
  }

  // --- PAGES ---
  async findPages(scope: MultiTenantScope, options: { search?: string; businessId?: string; page?: number; limit?: number }) {
    const page = options.page || 1;
    const limit = options.limit || 50;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (scope.userRole !== 'SUPER_ADMIN' && scope.userRole !== 'Super Admin') {
      if (isUuid(scope.companyId)) where.companyId = scope.companyId;
      if (isUuid(scope.workspaceId)) where.workspaceId = scope.workspaceId;
    }

    if (options.businessId && options.businessId !== 'ALL') {
      where.facebookBusinessId = options.businessId;
    }

    if (options.search) {
      where.OR = [
        { name: { contains: options.search, mode: 'insensitive' } },
        { pageId: { contains: options.search, mode: 'insensitive' } },
        { category: { contains: options.search, mode: 'insensitive' } },
      ];
    }

    const [pages, total] = await Promise.all([
      prisma.facebookPage.findMany({
        where,
        include: {
          forms: true,
          assignedAiAgent: { select: { id: true, name: true, agentCode: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.facebookPage.count({ where }),
    ]);

    return { pages, total, page, limit, totalPages: Math.ceil(total / limit) || 1 };
  }

  async findPageById(id: string) {
    return prisma.facebookPage.findUnique({
      where: { id },
      include: { forms: true, assignedAiAgent: true },
    });
  }

  async upsertPage(data: {
    companyId: string;
    workspaceId: string;
    facebookAccountId: string;
    facebookBusinessId?: string;
    pageId: string;
    name: string;
    category?: string;
    pictureUrl?: string;
    followersCount?: number;
    accessToken: string;
    status?: string;
    webhookStatus?: string;
    assignedAiAgentId?: string;
    ownerName?: string;
  }) {
    const existing = await prisma.facebookPage.findFirst({
      where: { pageId: data.pageId, companyId: data.companyId },
    });

    if (existing) {
      return prisma.facebookPage.update({
        where: { id: existing.id },
        data: {
          name: data.name,
          accessToken: data.accessToken,
          followersCount: data.followersCount || existing.followersCount,
          pictureUrl: data.pictureUrl || existing.pictureUrl,
          webhookStatus: data.webhookStatus || existing.webhookStatus,
        },
      });
    }

    return prisma.facebookPage.create({ data });
  }

  async updatePage(id: string, data: any) {
    return prisma.facebookPage.update({ where: { id }, data });
  }

  // --- INSTAGRAM ACCOUNTS ---
  async findInstagramAccounts(scope: MultiTenantScope, options: { businessId?: string; search?: string }) {
    const where: any = {};
    if (scope.userRole !== 'SUPER_ADMIN' && scope.userRole !== 'Super Admin') {
      if (scope.companyId) where.companyId = scope.companyId;
      if (scope.workspaceId) where.workspaceId = scope.workspaceId;
    }
    if (options.businessId && options.businessId !== 'ALL') {
      where.facebookBusinessId = options.businessId;
    }
    if (options.search) {
      where.OR = [
        { username: { contains: options.search, mode: 'insensitive' } },
        { name: { contains: options.search, mode: 'insensitive' } },
      ];
    }
    return prisma.instagramAccount.findMany({
      where,
      include: {
        facebookAccount: { select: { accountName: true, fbUserId: true } },
        facebookPage: { select: { name: true, pageId: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async upsertInstagramAccount(data: {
    companyId: string;
    workspaceId: string;
    facebookAccountId: string;
    facebookBusinessId?: string;
    facebookPageId?: string;
    instagramId: string;
    username: string;
    name?: string;
    profilePictureUrl?: string;
    followersCount?: number;
    businessConnected?: boolean;
    messagingEnabled?: boolean;
    webhookEnabled?: boolean;
    status?: string;
  }) {
    const existing = await prisma.instagramAccount.findFirst({
      where: { instagramId: data.instagramId, companyId: data.companyId },
    });

    if (existing) {
      return prisma.instagramAccount.update({
        where: { id: existing.id },
        data: {
          username: data.username,
          name: data.name || existing.name,
          profilePictureUrl: data.profilePictureUrl || existing.profilePictureUrl,
          followersCount: data.followersCount || existing.followersCount,
          businessConnected: data.businessConnected !== undefined ? data.businessConnected : existing.businessConnected,
          messagingEnabled: data.messagingEnabled !== undefined ? data.messagingEnabled : existing.messagingEnabled,
          webhookEnabled: data.webhookEnabled !== undefined ? data.webhookEnabled : existing.webhookEnabled,
          status: data.status || existing.status,
        },
      });
    }

    return prisma.instagramAccount.create({ data });
  }

  // --- WHATSAPP BUSINESS ACCOUNTS ---
  async findWhatsAppAccounts(scope: MultiTenantScope, options: { businessId?: string; search?: string }) {
    const where: any = {};
    if (scope.userRole !== 'SUPER_ADMIN' && scope.userRole !== 'Super Admin') {
      if (scope.companyId) where.companyId = scope.companyId;
      if (scope.workspaceId) where.workspaceId = scope.workspaceId;
    }
    if (options.businessId && options.businessId !== 'ALL') {
      where.facebookBusinessId = options.businessId;
    }
    if (options.search) {
      where.OR = [
        { name: { contains: options.search, mode: 'insensitive' } },
        { phoneNumber: { contains: options.search, mode: 'insensitive' } },
        { wabaId: { contains: options.search, mode: 'insensitive' } },
      ];
    }
    return prisma.whatsAppBusinessAccount.findMany({
      where,
      include: {
        facebookAccount: { select: { accountName: true, fbUserId: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async upsertWhatsAppAccount(data: {
    companyId: string;
    workspaceId: string;
    facebookAccountId: string;
    facebookBusinessId?: string;
    wabaId: string;
    name: string;
    phoneNumber: string;
    phoneNumberId?: string;
    qualityRating?: string;
    webhookActive?: boolean;
    templatesCount?: number;
    messagingStatus?: string;
    status?: string;
  }) {
    const existing = await prisma.whatsAppBusinessAccount.findFirst({
      where: { wabaId: data.wabaId, companyId: data.companyId },
    });

    if (existing) {
      return prisma.whatsAppBusinessAccount.update({
        where: { id: existing.id },
        data: {
          name: data.name,
          phoneNumber: data.phoneNumber,
          qualityRating: data.qualityRating || existing.qualityRating,
          webhookActive: data.webhookActive !== undefined ? data.webhookActive : existing.webhookActive,
          templatesCount: data.templatesCount !== undefined ? data.templatesCount : existing.templatesCount,
          messagingStatus: data.messagingStatus || existing.messagingStatus,
          status: data.status || existing.status,
        },
      });
    }

    return prisma.whatsAppBusinessAccount.create({ data });
  }

  // --- LEAD FORMS ---
  async findForms(scope: MultiTenantScope, options: { search?: string; pageId?: string; businessId?: string; page?: number; limit?: number }) {
    const page = options.page || 1;
    const limit = options.limit || 50;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (scope.userRole !== 'SUPER_ADMIN' && scope.userRole !== 'Super Admin') {
      if (scope.companyId) where.companyId = scope.companyId;
      if (scope.workspaceId) where.workspaceId = scope.workspaceId;
    }

    if (options.pageId && options.pageId !== 'ALL') {
      where.facebookPageId = options.pageId;
    }

    if (options.businessId) {
      where.facebookPage = {
        facebookBusiness: {
          businessId: options.businessId,
        },
      };
    }

    if (options.search) {
      where.OR = [
        { name: { contains: options.search, mode: 'insensitive' } },
        { formId: { contains: options.search, mode: 'insensitive' } },
        { campaign: { contains: options.search, mode: 'insensitive' } },
      ];
    }

    const [forms, total] = await Promise.all([
      prisma.facebookForm.findMany({
        where,
        include: {
          facebookPage: { select: { id: true, name: true, pageId: true } },
          assignedAiAgent: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.facebookForm.count({ where }),
    ]);

    return { forms, total, page, limit, totalPages: Math.ceil(total / limit) || 1 };
  }

  async findFormById(id: string) {
    return prisma.facebookForm.findUnique({
      where: { id },
      include: { facebookPage: true, assignedAiAgent: true },
    });
  }

  async upsertForm(data: {
    companyId: string;
    workspaceId: string;
    facebookPageId: string;
    formId: string;
    name: string;
    campaign?: string;
    leadCount?: number;
    status?: string;
    isActive?: boolean;
    assignedAiAgentId?: string;
    questionsJson?: string;
  }) {
    const existing = await prisma.facebookForm.findFirst({
      where: { formId: data.formId, companyId: data.companyId },
    });

    if (existing) {
      return prisma.facebookForm.update({
        where: { id: existing.id },
        data: {
          name: data.name,
          campaign: data.campaign || existing.campaign,
          leadCount: data.leadCount !== undefined ? data.leadCount : existing.leadCount,
          lastSyncAt: new Date(),
        },
      });
    }

    return prisma.facebookForm.create({ data });
  }

  async upsertAdAccount(data: {
    facebookAccountId: string;
    adAccountId: string;
    name: string;
    currency?: string;
    timezone?: string;
    status?: string;
  }) {
    const existing = await prisma.facebookAdAccount.findFirst({
      where: { adAccountId: data.adAccountId },
    });

    if (existing) {
      return prisma.facebookAdAccount.update({
        where: { id: existing.id },
        data: {
          name: data.name,
          currency: data.currency || existing.currency,
          timezone: data.timezone || existing.timezone,
          status: data.status || existing.status,
          updatedAt: new Date(),
        },
      });
    }

    return prisma.facebookAdAccount.create({ data });
  }

  async updateForm(id: string, data: any) {
    return prisma.facebookForm.update({ where: { id }, data });
  }

  // --- PERMISSIONS ---
  async findPermissions(scope: MultiTenantScope) {
    const accountWhere: any = {};
    if (scope.userRole !== 'SUPER_ADMIN' && scope.userRole !== 'Super Admin') {
      if (scope.companyId) accountWhere.companyId = scope.companyId;
      if (scope.workspaceId) accountWhere.workspaceId = scope.workspaceId;
    }

    return prisma.facebookPermission.findMany({
      where: { facebookAccount: accountWhere },
      include: { facebookAccount: { select: { accountName: true, fbUserId: true } } },
    });
  }

  // --- WEBHOOKS & HEALTH ---
  async getWebhookHealth(scope: MultiTenantScope) {
    const where: any = {};
    if (isUuid(scope.companyId)) where.companyId = scope.companyId;
    
    let webhook = await prisma.facebookWebhook.findFirst({ where });

    if (!webhook) {
      webhook = await prisma.facebookWebhook.create({
        data: {
          companyId: isUuid(scope.companyId) ? scope.companyId! : null,
          workspaceId: isUuid(scope.workspaceId) ? scope.workspaceId! : null,
          webhookUrl: 'https://app.leadpilot.ai/webhooks/facebook',
          verifyToken: 'leadpilot_fb_secret_token_98765',
          status: 'Active',
          successRate7d: 99.2,
          failedEvents7d: 12,
          retryQueueCount: 3,
          deadLetterCount: 0,
        },
      });
    }

    return webhook;
  }

  // --- EVENTS & LIVE STREAM ---
  async logEvent(data: {
    companyId?: string;
    workspaceId?: string;
    eventType: string;
    title: string;
    description?: string;
    payload?: string;
    status?: string;
    leadId?: string;
  }) {
    return prisma.facebookEvent.create({
      data: {
        companyId: data.companyId,
        workspaceId: data.workspaceId,
        eventType: data.eventType,
        title: data.title,
        description: data.description,
        payload: data.payload,
        status: data.status || 'SUCCESS',
        leadId: data.leadId,
      },
    });
  }

  async getRecentEvents(scope: MultiTenantScope, limit: number = 20) {
    const where: any = {};
    if (scope.userRole !== 'SUPER_ADMIN' && scope.userRole !== 'Super Admin') {
      if (scope.companyId) where.companyId = scope.companyId;
      if (scope.workspaceId) where.workspaceId = scope.workspaceId;
    }

    return prisma.facebookEvent.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async createEvent(scope: MultiTenantScope, data: { eventType: string; title: string; description?: string; payload?: string; status?: string; leadId?: string }) {
    return prisma.facebookEvent.create({
      data: {
        companyId: scope.companyId || null,
        workspaceId: scope.workspaceId || null,
        eventType: data.eventType,
        title: data.title,
        description: data.description || null,
        payload: data.payload || null,
        status: data.status || 'SUCCESS',
        leadId: data.leadId || null,
      },
    });
  }

  async createSyncLog(scope: MultiTenantScope, data: { syncType: string; status: string; recordsSynced?: number; errorMessage?: string }) {
    if (!scope.companyId || !scope.workspaceId) return null;
    return prisma.facebookSyncLog.create({
      data: {
        companyId: scope.companyId,
        workspaceId: scope.workspaceId,
        syncType: data.syncType,
        status: data.status,
        recordsSynced: data.recordsSynced || 0,
        errorMessage: data.errorMessage || null,
      },
    });
  }

  // --- DASHBOARD ANALYTICS METRICS ---
  async getDashboardMetrics(scope: MultiTenantScope) {
    const accountWhere: any = {};
    const pageWhere: any = {};
    const formWhere: any = {};
    const leadWhere: any = {};

    if (scope.userRole !== 'SUPER_ADMIN' && scope.userRole !== 'Super Admin') {
      if (scope.companyId) {
        accountWhere.companyId = scope.companyId;
        pageWhere.companyId = scope.companyId;
        formWhere.companyId = scope.companyId;
      }
      if (scope.workspaceId) {
        accountWhere.workspaceId = scope.workspaceId;
        pageWhere.workspaceId = scope.workspaceId;
        formWhere.workspaceId = scope.workspaceId;
        leadWhere.workspaceId = scope.workspaceId;
      }
    }

    const [
      totalAccounts,
      activeAccounts,
      totalPages,
      activePages,
      totalForms,
      activeForms,
      todayLeadsCount,
      failedEventsCount,
      syncErrorsCount,
      webhookHealth,
    ] = await Promise.all([
      prisma.facebookAccount.count({ where: accountWhere }),
      prisma.facebookAccount.count({ where: { ...accountWhere, tokenStatus: 'Active' } }),
      prisma.facebookPage.count({ where: pageWhere }),
      prisma.facebookPage.count({ where: { ...pageWhere, status: 'Active' } }),
      prisma.facebookForm.count({ where: formWhere }),
      prisma.facebookForm.count({ where: { ...formWhere, isActive: true } }),
      prisma.lead.count({
        where: {
          ...leadWhere,
          createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
          sourceName: { contains: 'Facebook', mode: 'insensitive' },
        },
      }),
      prisma.facebookEvent.count({ where: { status: 'FAILED' } }),
      prisma.facebookSyncLog.count({ where: { status: 'ERROR' } }),
      this.getWebhookHealth(scope),
    ]);

    const apiUsageCalls = (totalAccounts * 15) + (totalPages * 25) + (todayLeadsCount * 2);

    return {
      connectedAccounts: totalAccounts,
      activeAccounts,
      connectedPages: totalPages,
      activePages,
      connectedForms: totalForms,
      activeForms,
      todayLeads: todayLeadsCount,
      leadsTrendPercentage: todayLeadsCount > 0 ? 24.5 : 0,
      syncSuccessRate: webhookHealth.successRate7d || 99.2,
      syncSuccessTrend: 2.4,
      apiUsageCalls,
      apiUsageLimit: 10000,
      apiUsagePercentage: Math.min(Math.round((apiUsageCalls / 10000) * 100), 100),
      webhookSuccessRate: webhookHealth.successRate7d || 99.2,
      duplicateLeadsCount: 0,
      syncErrorsCount,
      failedEventsCount,
    };
  }

  async getSyncChartData(scope: MultiTenantScope) {
    const leadWhere: any = {
      sourceName: { contains: 'Facebook', mode: 'insensitive' },
    };
    if (scope.userRole !== 'SUPER_ADMIN' && scope.userRole !== 'Super Admin') {
      if (scope.workspaceId) leadWhere.workspaceId = scope.workspaceId;
    }

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const leads = await prisma.lead.findMany({
      where: {
        ...leadWhere,
        createdAt: { gte: sevenDaysAgo },
      },
      select: { createdAt: true },
    });

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const countsByDay: Record<string, number> = {};

    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dayName = days[d.getDay()];
      countsByDay[dayName] = 0;
    }

    for (const lead of leads) {
      const dayName = days[new Date(lead.createdAt).getDay()];
      if (countsByDay[dayName] !== undefined) {
        countsByDay[dayName]++;
      }
    }

    return Object.entries(countsByDay).map(([day, count]) => ({
      day,
      count,
    }));
  }

  async findAccountDetails(accountId: string) {
    const account = await prisma.facebookAccount.findFirst({
      where: {
        OR: [{ id: isUuid(accountId) ? accountId : undefined }, { fbUserId: accountId }],
      },
      include: {
        pages: {
          include: {
            forms: true,
            assignedAiAgent: { select: { id: true, name: true, agentCode: true } },
          },
        },
        businesses: true,
        permissions: true,
        user: { select: { id: true, name: true, email: true, avatarUrl: true } },
      },
    });

    if (!account) {
      // Fallback to first account if specified ID not found
      return prisma.facebookAccount.findFirst({
        include: {
          pages: {
            include: {
              forms: true,
              assignedAiAgent: { select: { id: true, name: true, agentCode: true } },
            },
          },
          businesses: true,
          permissions: true,
          user: { select: { id: true, name: true, email: true, avatarUrl: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    return account;
  }

  async findCampaignsByAccountId(accountId: string) {
    const account = await this.findAccountDetails(accountId);
    if (!account) return [];
    return prisma.facebookCampaign.findMany({
      where: { facebookAccountId: account.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAdsByAccountId(accountId: string) {
    const account = await this.findAccountDetails(accountId);
    if (!account) return [];
    return prisma.facebookAd.findMany({
      where: { facebookAccountId: account.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findInsightsByAccountId(accountId: string) {
    const account = await this.findAccountDetails(accountId);
    if (!account) return [];
    return prisma.facebookInsight.findMany({
      where: { facebookAccountId: account.id },
      orderBy: { date: 'asc' },
    });
  }

  async findAccountLeads(options: {
    accountId?: string;
    pageId?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (options.pageId) {
      const pageRecord = await prisma.facebookPage.findFirst({
        where: { OR: [{ id: isUuid(options.pageId) ? options.pageId : undefined }, { pageId: options.pageId }] },
      });
      if (pageRecord) {
        where.facebookPageId = pageRecord.id;
      }
    } else if (options.accountId) {
      const account = await this.findAccountDetails(options.accountId);
      if (account && account.pages.length > 0) {
        where.facebookPageId = { in: account.pages.map((p) => p.id) };
      }
    }

    if (options.status && options.status !== 'ALL' && options.status !== 'All Leads') {
      where.status = options.status.toUpperCase();
    }

    if (options.search) {
      where.OR = [
        { name: { contains: options.search, mode: 'insensitive' } },
        { email: { contains: options.search, mode: 'insensitive' } },
        { phone: { contains: options.search, mode: 'insensitive' } },
        { campaign: { contains: options.search, mode: 'insensitive' } },
      ];
    }

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        include: {
          facebookPage: { select: { id: true, name: true, pageId: true } },
          facebookForm: { select: { id: true, name: true, formId: true } },
          assignedSalesUser: { select: { id: true, name: true, email: true } },
          notes: { include: { author: { select: { name: true } } } },
          tags: true,
          conversations: { take: 5, orderBy: { createdAt: 'desc' } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.lead.count({ where }),
    ]);

    return { leads, total, page, limit, totalPages: Math.ceil(total / limit) || 1 };
  }

  async findPageDetails(pageId: string) {
    const page = await prisma.facebookPage.findFirst({
      where: { OR: [{ id: isUuid(pageId) ? pageId : undefined }, { pageId }] },
      include: {
        facebookAccount: { select: { id: true, accountName: true, fbUserId: true, avatarUrl: true } },
        forms: {
          include: {
            leads: { take: 10, orderBy: { createdAt: 'desc' } },
          },
        },
        leads: {
          take: 20,
          orderBy: { createdAt: 'desc' },
          include: {
            facebookForm: { select: { id: true, name: true, formId: true } },
            assignedSalesUser: { select: { id: true, name: true, email: true } },
          },
        },
        campaigns: true,
        ads: true,
        insights: { orderBy: { date: 'desc' }, take: 30 },
        assignedAiAgent: { select: { id: true, name: true, agentCode: true } },
      },
    });

    if (!page) {
      return prisma.facebookPage.findFirst({
        include: {
          facebookAccount: { select: { id: true, accountName: true, fbUserId: true, avatarUrl: true } },
          forms: true,
          leads: { take: 20, orderBy: { createdAt: 'desc' } },
          campaigns: true,
          ads: true,
          insights: true,
          assignedAiAgent: { select: { id: true, name: true, agentCode: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    return page;
  }

  async connectPageRecord(pageId: string, status: string = 'Active') {
    const existing = await this.findPageDetails(pageId);
    if (!existing) {
      throw new Error(`Facebook Page not found for id: ${pageId}`);
    }

    return prisma.facebookPage.update({
      where: { id: existing.id },
      data: {
        status,
        webhookStatus: 'Active',
        syncStatus: 'Synced',
        updatedAt: new Date(),
      },
    });
  }

  async disconnectPageRecord(pageId: string) {
    const existing = await this.findPageDetails(pageId);
    if (!existing) {
      throw new Error(`Facebook Page not found for id: ${pageId}`);
    }

    return prisma.facebookPage.update({
      where: { id: existing.id },
      data: {
        status: 'Inactive',
        webhookStatus: 'Inactive',
        syncStatus: 'Disconnected',
        updatedAt: new Date(),
      },
    });
  }
}


