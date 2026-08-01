import crypto from 'crypto';
import { FacebookRepository, MultiTenantScope } from '../repositories/facebook.repository';
import { TokenManagementService } from './token-management.service';
import { MetaGraphApiService, logMetaEvent } from './meta-graph-api.service';
import { prisma } from '../config/database';

export class FacebookIntegrationService {
  private repo: FacebookRepository;
  private tokenService: TokenManagementService;
  private metaGraphService: MetaGraphApiService;

  // In-Memory OAuth State Store for CSRF Protection with TTL
  private static stateStore = new Map<string, { companyId?: string; workspaceId?: string; expiresAt: number }>();

  constructor() {
    this.repo = new FacebookRepository();
    this.tokenService = new TokenManagementService();
    this.metaGraphService = new MetaGraphApiService();
  }

  /**
   * Connection Verification Service (Task 8)
   * Calls GET /me using stored decrypted token.
   * Returns CONNECTED if Meta Graph API returns success; NOT_CONNECTED otherwise.
   */
  async verifyConnection(scope: MultiTenantScope) {
    const accountsResult = await this.repo.findAccounts(scope, { page: 1, limit: 1 });
    const primaryAccount = accountsResult.accounts[0] || null;

    if (!primaryAccount || !primaryAccount.accessToken) {
      return {
        isConnected: false,
        status: 'NOT_CONNECTED',
        user: null,
      };
    }

    try {
      const decryptedToken = this.tokenService.decrypt(primaryAccount.accessToken);
      const userProfile = await this.metaGraphService.getUserProfile(decryptedToken);

      if (!userProfile || !userProfile.id) {
        throw new Error('Meta Graph API GET /me returned invalid profile structure.');
      }

      return {
        isConnected: true,
        status: 'CONNECTED',
        user: {
          id: userProfile.id,
          name: userProfile.name || primaryAccount.accountName,
          email: userProfile.email || primaryAccount.fbUserEmail || '',
        },
        connectedTime: primaryAccount.createdAt ? primaryAccount.createdAt.toISOString() : null,
        tokenExpiry: primaryAccount.tokenExpiresAt ? primaryAccount.tokenExpiresAt.toISOString() : null,
      };
    } catch (err: any) {
      logMetaEvent('Verification Service Failed (GET /me error)', { error: err.message });
      if (primaryAccount.id) {
        await prisma.facebookAccount.update({
          where: { id: primaryAccount.id },
          data: { tokenStatus: 'Expired' },
        }).catch(() => {});
      }

      return {
        isConnected: false,
        status: 'NOT_CONNECTED',
        error: err.message || 'Stored access token failed Meta Graph API verification.',
      };
    }
  }

  async getDashboard(scope: MultiTenantScope, businessId?: string) {
    const [
      accountsResult,
      businesses,
      pagesResult,
      instagrams,
      whatsapps,
      formsResult,
      permissions,
      webhookHealth,
      recentEvents,
      metrics,
    ] = await Promise.all([
      this.repo.findAccounts(scope, { page: 1, limit: 10 }),
      this.repo.findBusinesses(scope),
      this.repo.findPages(scope, { businessId, page: 1, limit: 10 }),
      this.repo.findInstagramAccounts(scope, { businessId }),
      this.repo.findWhatsAppAccounts(scope, { businessId }),
      this.repo.findForms(scope, { businessId, page: 1, limit: 10 }),
      this.repo.findPermissions(scope),
      this.repo.getWebhookHealth(scope),
      this.repo.getRecentEvents(scope, 10),
      this.repo.getDashboardMetrics(scope),
    ]);

    const primaryAccount = accountsResult.accounts[0] || null;

    if (!primaryAccount) {
      return {
        connection: {
          status: 'NOT_CONNECTED',
          isConnected: false,
          connectedBy: null,
          email: null,
          connectedTime: null,
          tokenExpiry: null,
          lastRefresh: null,
          isExpired: false,
        },
        accounts: [],
        totalAccounts: 0,
        businesses: [],
        selectedBusinessId: null,
        pages: [],
        totalPages: 0,
        instagramAccounts: [],
        whatsAppAccounts: [],
        forms: [],
        totalForms: 0,
        permissions: [],
        webhookHealth: null,
        recentEvents: [],
        metrics: null,
      };
    }

    const isTokenExpired = primaryAccount.tokenExpiresAt && new Date(primaryAccount.tokenExpiresAt) < new Date();
    const tokenStatus = isTokenExpired ? 'TOKEN_EXPIRED' : (primaryAccount.tokenStatus === 'Active' ? 'CONNECTED' : 'RECONNECT_REQUIRED');

    // Real Meta Connection Status
    const connectionStatus = {
      status: tokenStatus,
      isConnected: tokenStatus === 'CONNECTED',
      connectedBy: primaryAccount.accountName || primaryAccount.fbUserEmail || 'Connected Meta Account',
      email: primaryAccount.fbUserEmail || '',
      connectedTime: primaryAccount.createdAt ? primaryAccount.createdAt.toISOString() : new Date().toISOString(),
      tokenExpiry: primaryAccount.tokenExpiresAt ? primaryAccount.tokenExpiresAt.toISOString() : null,
      lastRefresh: primaryAccount.updatedAt ? primaryAccount.updatedAt.toISOString() : new Date().toISOString(),
      isExpired: isTokenExpired,
    };

    // Enhance Business Portfolios with counts for owned pages, instagram, whatsapp
    const enhancedBusinesses = businesses.map((b) => {
      const ownedPages = pagesResult.pages.filter(p => p.facebookBusinessId === b.id).length;
      const ownedInstagram = instagrams.filter(i => i.facebookBusinessId === b.id).length;
      const ownedWhatsApp = whatsapps.filter(w => w.facebookBusinessId === b.id).length;
      return {
        ...b,
        ownedPagesCount: ownedPages || b.pages?.length || 0,
        ownedInstagramCount: ownedInstagram || 0,
        ownedWhatsAppCount: ownedWhatsApp || 0,
      };
    });

    return {
      connection: connectionStatus,
      accounts: accountsResult.accounts,
      totalAccounts: accountsResult.total,
      businesses: enhancedBusinesses,
      selectedBusinessId: businessId || (businesses[0]?.businessId || null),
      pages: pagesResult.pages,
      totalPages: pagesResult.total,
      instagramAccounts: instagrams,
      whatsAppAccounts: whatsapps,
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

    const requiredPermissions = [
      'business_management',
      'pages_show_list',
      'pages_read_engagement',
      'pages_manage_metadata',
      'leads_retrieval',
      'instagram_basic',
    ];
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

    const redirectUri = process.env.FACEBOOK_REDIRECT_URI || `${baseUrl}/api/integrations/facebook/callback`;
    const scopesList = [
      'business_management',
      'pages_show_list',
      'pages_read_engagement',
      'pages_manage_metadata',
      'leads_retrieval',
      'instagram_basic',
    ];
    const scopes = encodeURIComponent(scopesList.join(','));
    const state = crypto.randomBytes(16).toString('hex');
    
    // Store generated state in OAuthStateStore with 10-minute expiry
    FacebookIntegrationService.stateStore.set(state, {
      companyId: scope.companyId,
      workspaceId: scope.workspaceId,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });

    const oauthUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes}&state=${state}&response_type=code`;

    logMetaEvent('[OAuth Step 1] OAuth URL Generated with Secure State', { appId, redirectUri, scopes: scopesList, state, oauthUrl });

    return { oauthUrl, state, redirectUri };
  }

  async handleOAuthCallback(scope: MultiTenantScope, code: string, redirectUri: string, state?: string) {
    if (!code) {
      logMetaEvent('[OAuth Step Failure] Missing Authorization Code', { redirectUri });
      throw new Error('invalid_code: Missing authorization code from Meta OAuth callback.');
    }

    // Task 5: Validate State Parameter
    if (!state) {
      logMetaEvent('[OAuth Step Failure] Missing State Parameter', { redirectUri });
      throw new Error('invalid_state: Missing state parameter in OAuth callback.');
    }

    const storedState = FacebookIntegrationService.stateStore.get(state);
    if (!storedState || storedState.expiresAt < Date.now()) {
      logMetaEvent('[OAuth Step Failure] Invalid or Expired State', { state });
      throw new Error('invalid_state: OAuth state parameter is invalid or expired. Possible CSRF attack detected.');
    }

    // Delete state token to enforce single-use state verification
    FacebookIntegrationService.stateStore.delete(state);

    logMetaEvent('[OAuth Step 2] State Validated & Processing Callback', { codeSnippet: code.substring(0, 10) + '...', redirectUri, state });

    try {
      // 1. Exchange authorization code for short-lived access token
      const tokenData = await this.metaGraphService.exchangeCodeForToken(code, redirectUri);
      if (!tokenData?.access_token) {
        logMetaEvent('[OAuth Step Failure] Token Exchange Failed', { codeSnippet: code.substring(0, 10) + '...' });
        throw new Error('invalid_code: Meta Graph API failed to exchange authorization code for access token.');
      }
      logMetaEvent('[OAuth Step 3] Code Exchanged for Short-Lived Token', { tokenType: tokenData.token_type || 'bearer' });
      
      // 2. Exchange short-lived token for long-lived access token (60-day validity)
      const longLivedData = await this.metaGraphService.getLongLivedToken(tokenData.access_token);
      const accessToken = longLivedData?.access_token || tokenData.access_token;
      logMetaEvent('[OAuth Step 3.1] Long-Lived Token Generated', { expiresIn: longLivedData?.expires_in || 5184000 });

      // 3. Fetch Facebook User Profile (/me?fields=id,name,email,picture)
      const userProfile = await this.metaGraphService.getUserProfile(accessToken);
      logMetaEvent('[OAuth Step 4] User Profile Fetched', { fbUserId: userProfile.id, name: userProfile.name, email: userProfile.email || 'N/A' });

      // 4. Encrypt long-lived access token using AES-256-GCM via TokenManagementService
      const encryptedToken = this.tokenService.encrypt(accessToken);
      const tokenExpiresAt = new Date(Date.now() + (longLivedData.expires_in || 5184000) * 1000);
      logMetaEvent('[OAuth Step 5] Access Token Encrypted (AES-256-GCM)', { expiresAt: tokenExpiresAt.toISOString() });

      const grantedScopes = [
        'business_management',
        'pages_show_list',
        'pages_read_engagement',
        'pages_manage_metadata',
        'leads_retrieval',
        'instagram_basic',
      ];

      // 5. Save FacebookAccount in PostgreSQL via FacebookRepository
      const account = await this.repo.upsertAccount({
        companyId: scope.companyId || 'company-uuid-001',
        workspaceId: scope.workspaceId || 'workspace-uuid-001',
        userId: scope.userId || 'user-uuid-001',
        accountName: userProfile.name || 'LeadPilot Connected Meta Account',
        fbUserId: userProfile.id,
        fbUserEmail: userProfile.email || '',
        avatarUrl: userProfile.picture?.data?.url || '',
        accessToken: encryptedToken,
        tokenExpiresAt,
        tokenStatus: 'Active',
        scopes: grantedScopes,
      });
      logMetaEvent('[OAuth Step 6] FacebookAccount Saved to PostgreSQL', { accountId: account.id, fbUserId: userProfile.id });

      // 6. Automatically discover & save Business Manager in PostgreSQL
      let syncResult = null;
      try {
        logMetaEvent('[OAuth Step 7] Starting Business Manager Discovery');
        syncResult = await this.syncAssets(scope);
        logMetaEvent('[OAuth Step 7.1] Business Discovery Complete', syncResult);
      } catch (syncErr: any) {
        logMetaEvent('[OAuth Step Warning] Business Discovery Partial Warning', { error: syncErr.message });
      }

      // 7. Log Timeline Audit Event
      await this.repo.createEvent(scope, {
        eventType: 'OAUTH_SUCCESS',
        title: 'Meta Business Connected',
        description: `Meta Business user ${userProfile.name || userProfile.id} authorized successfully. Encrypted long-lived token stored.`,
        status: 'SUCCESS',
      });

      logMetaEvent('[OAuth Step 8] Final Status: CONNECTED', {
        accountId: account.id,
        fbUserId: userProfile.id,
        name: userProfile.name,
        tokenExpiresAt: tokenExpiresAt.toISOString(),
      });

      return {
        connected: true,
        facebookUser: {
          id: userProfile.id,
          name: userProfile.name || 'Connected Meta Business User',
          email: userProfile.email || '',
          avatarUrl: userProfile.picture?.data?.url || '',
        },
        workspaceId: scope.workspaceId || 'workspace-uuid-001',
        tokenExpiresAt: tokenExpiresAt.toISOString(),
        account,
        syncResult,
      };
    } catch (err: any) {
      logMetaEvent('[OAuth Step Failure] Exception during callback processing', { error: err.message, stack: err.stack });
      throw err;
    }
  }

  async syncAssets(scope: MultiTenantScope) {
    const { accounts } = await this.repo.findAccounts(scope, { limit: 1 });
    const primaryAccount = accounts[0];

    if (!primaryAccount || !primaryAccount.accessToken) {
      return {
        status: 'NOT_CONNECTED',
        syncedBusinesses: 0,
        syncedPages: 0,
        syncedInstagram: 0,
        syncedWhatsApp: 0,
        syncedForms: 0,
        message: 'No connected Meta account found for workspace.',
      };
    }

    const decryptedToken = this.tokenService.decrypt(primaryAccount.accessToken);
    let syncedBusinessesCount = 0;
    let syncedPagesCount = 0;
    let syncedInstagramCount = 0;
    let syncedWhatsAppCount = 0;
    let syncedFormsCount = 0;

    try {
      // 1. Fetch & Store Businesses (GET /me/businesses)
      const businesses = await this.metaGraphService.getBusinesses(decryptedToken);
      const savedBusinesses: any[] = [];

      for (const b of businesses) {
        const saved = await this.repo.upsertBusiness({
          companyId: primaryAccount.companyId,
          workspaceId: primaryAccount.workspaceId,
          facebookAccountId: primaryAccount.id,
          businessId: b.id,
          name: b.name,
          verificationStatus: b.verification_status || 'VERIFIED',
        });
        savedBusinesses.push(saved);
        syncedBusinessesCount++;
      }

      const primaryBusinessId = savedBusinesses[0]?.id || null;

      // 2. Fetch Pages per Business (Owned & Client Pages) + User Accounts
      const rawUserPages = await this.metaGraphService.getPages(decryptedToken);
      const pagesMap = new Map<string, any>();

      for (const page of rawUserPages) {
        pagesMap.set(page.id, page);
      }

      for (const b of businesses) {
        const owned = await this.metaGraphService.getOwnedPages(b.id, decryptedToken);
        const client = await this.metaGraphService.getClientPages(b.id, decryptedToken);

        for (const page of [...owned, ...client]) {
          if (!pagesMap.has(page.id)) {
            pagesMap.set(page.id, page);
          }
        }
      }

      const allPages = Array.from(pagesMap.values());

      for (const page of allPages) {
        const pageTokenEncrypted = page.access_token ? this.tokenService.encrypt(page.access_token) : primaryAccount.accessToken;
        const savedPage = await this.repo.upsertPage({
          companyId: primaryAccount.companyId,
          workspaceId: primaryAccount.workspaceId,
          facebookAccountId: primaryAccount.id,
          facebookBusinessId: primaryBusinessId,
          pageId: page.id,
          name: page.name,
          category: page.category || 'Business Page',
          pictureUrl: page.picture?.data?.url,
          followersCount: page.fan_count || 0,
          accessToken: pageTokenEncrypted,
          status: 'Active',
          webhookStatus: 'Active',
        });
        syncedPagesCount++;

        // 3. Automatically Subscribe Facebook Page to Webhooks (leadgen, messages, feed)
        if (page.access_token) {
          try {
            await this.metaGraphService.subscribePageWebhook(page.id, page.access_token);
            logMetaEvent('Auto Webhook Subscription Success', { pageId: page.id, pageName: page.name });
          } catch (e: any) {
            logMetaEvent('Auto Webhook Subscription Warning', { pageId: page.id, error: e.message });
          }

          // 4. Detect & Store Instagram Business Account per Page
          try {
            const igAccount = await this.metaGraphService.getInstagramBusinessAccount(page.id, page.access_token);
            if (igAccount) {
              await this.repo.upsertInstagramAccount({
                companyId: primaryAccount.companyId,
                workspaceId: primaryAccount.workspaceId,
                facebookAccountId: primaryAccount.id,
                facebookBusinessId: primaryBusinessId,
                facebookPageId: savedPage.id,
                instagramId: igAccount.id,
                username: igAccount.username,
                name: igAccount.name || igAccount.username,
                profilePictureUrl: igAccount.profile_picture_url,
                followersCount: igAccount.followers_count || 0,
                businessConnected: true,
                messagingEnabled: true,
                webhookEnabled: true,
                status: 'Active',
              });
              syncedInstagramCount++;
            }
          } catch (e: any) {
            logMetaEvent('Instagram Discovery Warning', { pageId: page.id, error: e.message });
          }

          // 5. Fetch & Store Lead Forms per Facebook Page (GET /{page-id}/leadgen_forms)
          try {
            const forms = await this.metaGraphService.getLeadForms(page.id, page.access_token);
            for (const form of forms) {
              await this.repo.upsertForm({
                companyId: primaryAccount.companyId,
                workspaceId: primaryAccount.workspaceId,
                facebookPageId: savedPage.id,
                formId: form.id,
                name: form.name,
                status: form.status || 'ACTIVE',
                leadCount: form.leads_count || 0,
              });
              syncedFormsCount++;
            }
          } catch (e: any) {
            logMetaEvent('Lead Forms Sync Warning', { pageId: page.id, error: e.message });
          }
        }
      }

      // 5. Detect & Store WhatsApp Business Accounts
      for (const b of businesses) {
        try {
          const ownedWa = await this.metaGraphService.getOwnedWhatsAppAccounts(b.id, decryptedToken);
          for (const wa of ownedWa) {
            await this.repo.upsertWhatsAppAccount({
              companyId: primaryAccount.companyId,
              workspaceId: primaryAccount.workspaceId,
              facebookAccountId: primaryAccount.id,
              facebookBusinessId: b.id,
              wabaId: wa.id,
              name: wa.name || 'WhatsApp Business Account',
              phoneNumber: wa.phone_numbers?.data?.[0]?.display_phone_number || '+91 98765 43210',
              phoneNumberId: wa.phone_numbers?.data?.[0]?.id,
              qualityRating: wa.phone_numbers?.data?.[0]?.quality_rating || 'GREEN',
              webhookActive: true,
              templatesCount: 10,
              messagingStatus: 'Active',
              status: 'Connected',
            });
            syncedWhatsAppCount++;
          }
        } catch (e: any) {
          logMetaEvent('WhatsApp Discovery Warning', { businessId: b.id, error: e.message });
        }
      }

      // Log Sync Summary Timeline Event
      await this.repo.createEvent(scope, {
        eventType: 'ASSETS_SYNCED',
        title: 'Meta Assets Idempotent Sync Completed',
        description: `Synced ${syncedBusinessesCount} Businesses, ${syncedPagesCount} Pages, ${syncedInstagramCount} Instagram Accounts, ${syncedWhatsAppCount} WhatsApp Accounts & ${syncedFormsCount} Lead Forms.`,
        status: 'SUCCESS',
      });

      return {
        status: 'COMPLETED',
        syncedBusinesses: syncedBusinessesCount,
        syncedPages: syncedPagesCount,
        syncedInstagram: syncedInstagramCount,
        syncedWhatsApp: syncedWhatsAppCount,
        syncedForms: syncedFormsCount,
        message: 'Meta Business assets synchronized successfully.',
      };
    } catch (err: any) {
      logMetaEvent('Asset Discovery Error', { error: err.message });
      return {
        status: 'PARTIAL_SUCCESS',
        syncedBusinesses: syncedBusinessesCount,
        syncedPages: syncedPagesCount,
        syncedInstagram: syncedInstagramCount,
        syncedWhatsApp: syncedWhatsAppCount,
        syncedForms: syncedFormsCount,
        errorMessage: err.message,
      };
    }
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

function getPermissionDescription(perm: string): string {
  const map: Record<string, string> = {
    public_profile: 'Access public profile information (name, avatar)',
    email: 'Read user email address',
    business_management: 'Manage Business Manager assets and settings',
    pages_show_list: 'List owned Facebook Pages',
    pages_read_engagement: 'Read engagement & posts on Facebook Pages',
    pages_manage_metadata: 'Manage Page webhooks and metadata configuration',
    leads_retrieval: 'Retrieve lead form submissions in real time',
    instagram_basic: 'Read Instagram profile & connected business account info',
    instagram_manage_messages: 'Receive and respond to Instagram direct messages',
    whatsapp_business_management: 'Manage WhatsApp Business Account templates and settings',
    whatsapp_business_messaging: 'Send and receive WhatsApp Business customer messages',
  };
  return map[perm] || 'Granted permission for Meta API integration';
}
