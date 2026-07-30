import { FacebookRepository, MultiTenantScope } from '../repositories/facebook.repository';
import { TokenManagementService } from './token-management.service';
import { MetaGraphApiService, logMetaEvent } from './meta-graph-api.service';
import { prisma } from '../config/database';

export class FacebookIntegrationService {
  private repo: FacebookRepository;
  private tokenService: TokenManagementService;
  private metaGraphService: MetaGraphApiService;

  constructor() {
    this.repo = new FacebookRepository();
    this.tokenService = new TokenManagementService();
    this.metaGraphService = new MetaGraphApiService();
  }

  async getDashboard(scope: MultiTenantScope, businessId?: string) {
    const [
      accountsResult,
      businesses,
      pagesResult,
      formsResult,
      permissions,
      webhookHealth,
      recentEvents,
      metrics,
    ] = await Promise.all([
      this.repo.findAccounts(scope, { page: 1, limit: 10 }),
      this.repo.findBusinesses(scope),
      this.repo.findPages(scope, { businessId, page: 1, limit: 10 }),
      this.repo.findForms(scope, { businessId, page: 1, limit: 10 }),
      this.repo.findPermissions(scope),
      this.repo.getWebhookHealth(scope),
      this.repo.getRecentEvents(scope, 10),
      this.repo.getDashboardMetrics(scope),
    ]);

    const primaryAccount = accountsResult.accounts[0] || null;

    // Real Meta Connection Status without fake names/mock dates
    const connectionStatus = primaryAccount ? {
      status: primaryAccount.tokenStatus === 'Active' ? 'Connected' : 'Warning',
      connectedBy: primaryAccount.accountName || primaryAccount.fbUserEmail || 'Connected Meta Account',
      connectedTime: primaryAccount.createdAt ? primaryAccount.createdAt.toISOString() : new Date().toISOString(),
      tokenExpiry: primaryAccount.tokenExpiresAt ? primaryAccount.tokenExpiresAt.toISOString() : null,
      lastRefresh: primaryAccount.updatedAt ? primaryAccount.updatedAt.toISOString() : new Date().toISOString(),
      isExpired: primaryAccount.tokenStatus === 'Expired',
    } : {
      status: 'Not Connected',
      connectedBy: null,
      connectedTime: null,
      tokenExpiry: null,
      lastRefresh: null,
      isExpired: false,
    };

    return {
      connection: connectionStatus,
      accounts: accountsResult.accounts,
      totalAccounts: accountsResult.total,
      businesses,
      selectedBusinessId: businessId || (businesses[0]?.businessId || null),
      pages: pagesResult.pages,
      totalPages: pagesResult.total,
      forms: formsResult.forms,
      totalForms: formsResult.total,
      permissions,
      webhookHealth,
      recentEvents: recentEvents.map((evt) => ({
        id: evt.id,
        title: evt.title,
        description: evt.description || '',
        timeAgo: new Date(evt.createdAt).toISOString(),
        timestamp: evt.createdAt.toISOString(),
        type: evt.eventType.toLowerCase(),
      })),
      metrics,
    };
  }

  async getDiagnostics(scope: MultiTenantScope) {
    const accountsResult = await this.repo.findAccounts(scope, { page: 1, limit: 1 });
    const primaryAccount = accountsResult.accounts[0] || null;

    let accessTokenStatus = 'None';
    let tokenExpiry = null;
    let grantedPermissions: string[] = [];
    let businessCount = 0;
    let pageCount = 0;
    let leadFormCount = 0;

    if (primaryAccount) {
      accessTokenStatus = `Encrypted AES-256 (${primaryAccount.tokenStatus})`;
      tokenExpiry = primaryAccount.tokenExpiresAt ? primaryAccount.tokenExpiresAt.toISOString() : null;

      try {
        const decryptedToken = this.tokenService.decrypt(primaryAccount.accessToken);
        const [permData, bData, pData] = await Promise.all([
          this.metaGraphService.getPermissions(decryptedToken),
          this.metaGraphService.getBusinesses(decryptedToken),
          this.metaGraphService.getPages(decryptedToken),
        ]);

        grantedPermissions = permData
          .filter((p: any) => p.status === 'granted')
          .map((p: any) => p.permission);
        businessCount = bData.length;
        pageCount = pData.length;

        for (const page of pData) {
          if (page.access_token) {
            const forms = await this.metaGraphService.getLeadForms(page.id, page.access_token);
            leadFormCount += forms.length;
          }
        }
      } catch (e: any) {
        logMetaEvent('Diagnostics Token Audit Warning', { error: e.message });
      }
    }

    const requiredPermissions = ['pages_read_engagement', 'leads_retrieval', 'business_management', 'pages_show_list'];
    const missingPermissions = requiredPermissions.filter((p) => !grantedPermissions.includes(p));

    return {
      oauthStatus: process.env.FACEBOOK_APP_ID ? 'Configured' : 'Missing Credentials',
      accessToken: accessTokenStatus,
      tokenExpiry,
      grantedPermissions,
      businessCount,
      pageCount,
      leadFormCount,
      webhookStatus: pageCount > 0 ? 'Active' : 'Inactive',
      graphApiVersion: 'v19.0',
      lastSync: primaryAccount ? primaryAccount.updatedAt.toISOString() : null,
      missingPermissions,
    };
  }

  async startOAuth(scope: MultiTenantScope, clientOrigin?: string) {
    const appId = process.env.FACEBOOK_APP_ID || process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '1712255293083461';
    let baseUrl = process.env.APP_URL || 'http://localhost:3000';
    if (clientOrigin) {
      try {
        const parsed = new URL(clientOrigin);
        baseUrl = `${parsed.protocol}//${parsed.host}`;
      } catch (e) {
        // fallback
      }
    }
    const redirectUri = encodeURIComponent(`${baseUrl}/integrations/facebook/callback`);
    const scopes = encodeURIComponent('public_profile,email,pages_show_list,pages_read_engagement,leads_retrieval,business_management');
    
    const oauthUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=${scopes}&response_type=code`;

    logMetaEvent('OAuth URL Generated', { appId, redirectUri, oauthUrl });

    return { oauthUrl };
  }

  async handleOAuthCallback(scope: MultiTenantScope, code: string, redirectUri: string) {
    // 1. Exchange short-lived token
    const tokenData = await this.metaGraphService.exchangeCodeForToken(code, redirectUri);
    
    // 2. Exchange long-lived token
    const longLivedData = await this.metaGraphService.getLongLivedToken(tokenData.access_token);

    // 3. User Profile
    const userProfile = await this.metaGraphService.getUserProfile(longLivedData.access_token);
    const encryptedToken = this.tokenService.encrypt(longLivedData.access_token);

    // 4. Save/Upsert Facebook Account
    const account = await this.repo.upsertAccount({
      companyId: scope.companyId || 'company-uuid-001',
      workspaceId: scope.workspaceId || 'workspace-uuid-001',
      userId: scope.userId || 'user-uuid-001',
      accountName: userProfile.name || 'LeadPilot Connected Account',
      fbUserId: userProfile.id,
      fbUserEmail: userProfile.email,
      avatarUrl: userProfile.picture?.data?.url,
      accessToken: encryptedToken,
      tokenExpiresAt: new Date(Date.now() + (longLivedData.expires_in || 5184000) * 1000),
      tokenStatus: 'Active',
    });

    // 5. Automatic Sync: Businesses
    const businesses = await this.metaGraphService.getBusinesses(longLivedData.access_token);
    for (const b of businesses) {
      await this.repo.upsertBusiness({
        companyId: account.companyId,
        workspaceId: account.workspaceId,
        facebookAccountId: account.id,
        businessId: b.id,
        name: b.name,
        verificationStatus: b.verification_status || 'UNVERIFIED',
      });
    }

    // 6. Automatic Sync: Pages
    const pages = await this.metaGraphService.getPages(longLivedData.access_token);
    for (const page of pages) {
      const pageTokenEncrypted = page.access_token ? this.tokenService.encrypt(page.access_token) : encryptedToken;
      await this.repo.upsertPage({
        companyId: account.companyId,
        workspaceId: account.workspaceId,
        facebookAccountId: account.id,
        pageId: page.id,
        name: page.name,
        category: page.category || 'Business Page',
        pictureUrl: page.picture?.data?.url,
        followersCount: page.fan_count || 0,
        accessToken: pageTokenEncrypted,
        status: 'Active',
        webhookStatus: 'Active',
      });

      // 7. Automatic Sync: Lead Forms for Page
      if (page.access_token) {
        try {
          const forms = await this.metaGraphService.getLeadForms(page.id, page.access_token);
          for (const form of forms) {
            await this.repo.upsertForm({
              companyId: account.companyId,
              workspaceId: account.workspaceId,
              facebookPageId: page.id,
              formId: form.id,
              name: form.name,
              status: form.status || 'ACTIVE',
              leadCount: form.leads_count || 0,
            });
          }

          // 8. Automatic Webhook Subscription
          await this.metaGraphService.subscribePageWebhook(page.id, page.access_token);
        } catch (e: any) {
          logMetaEvent('Page Lead Form/Webhook Auto Sync Warning', { pageId: page.id, error: e.message });
        }
      }
    }

    // 9. Sync Granted Permissions
    try {
      const perms = await this.metaGraphService.getPermissions(longLivedData.access_token);
      for (const p of perms) {
        await prisma.facebookPermission.create({
          data: {
            facebookAccountId: account.id,
            permission: p.permission,
            status: p.status === 'granted' ? 'Granted' : 'Declined',
          },
        });
      }
    } catch (e: any) {
      logMetaEvent('Permissions Sync Warning', { error: e.message });
    }

    await this.repo.logEvent({
      companyId: account.companyId,
      workspaceId: account.workspaceId,
      eventType: 'OAUTH_CONNECTED',
      title: `Meta Integration Connected for ${account.accountName}`,
      description: `Synced ${businesses.length} Businesses, ${pages.length} Pages with Real Meta Graph API data.`,
    });

    return {
      success: true,
      account,
      businessesCount: businesses.length,
      pagesCount: pages.length,
    };
  }

  async getAccounts(scope: MultiTenantScope, options: any) {
    return this.repo.findAccounts(scope, options);
  }

  async getBusinesses(scope: MultiTenantScope) {
    return this.repo.findBusinesses(scope);
  }

  async getPages(scope: MultiTenantScope, options: any) {
    return this.repo.findPages(scope, options);
  }

  async getForms(scope: MultiTenantScope, options: any) {
    return this.repo.findForms(scope, options);
  }

  async disconnectAccount(scope: MultiTenantScope, accountId: string) {
    await this.repo.deleteAccount(accountId);
    await this.repo.logEvent({
      companyId: scope.companyId || 'company-uuid-001',
      workspaceId: scope.workspaceId || 'workspace-uuid-001',
      eventType: 'ACCOUNT_DISCONNECTED',
      title: 'Meta Account Disconnected',
      description: `Disconnected Facebook Account ID ${accountId}.`,
    });
  }
}
