import { MetaGraphApiService, logMetaEvent } from './meta-graph-api.service';
import { TokenManagementService, MultiTenantScope } from './token-management.service';
import { MetaDiscoveryService } from './meta-discovery.service';
import { MetaAccountModel } from '../models/MetaAccount.model';
import { BusinessPortfolioModel } from '../models/BusinessPortfolio.model';
import { FacebookPageModel } from '../models/FacebookPage.model';
import { InstagramAccountModel } from '../models/InstagramAccount.model';
import { WhatsAppBusinessModel } from '../models/WhatsAppBusiness.model';
import { LeadFormModel } from '../models/LeadForm.model';
import { BusinessAssetModel } from '../models/BusinessAsset.model';
import { WebhookSubscriptionModel } from '../models/WebhookSubscription.model';
import { SyncLogModel } from '../models/SyncLog.model';
import { ActivityLogModel } from '../models/ActivityLog.model';
import { LeadWebhookModel } from '../models/LeadWebhook.model';

const REQUIRED_PERMISSIONS = [
  'business_management',
  'pages_show_list',
  'pages_manage_metadata',
  'pages_read_engagement',
  'pages_manage_posts',
  'leads_retrieval',
  'instagram_basic',
  'instagram_manage_messages',
  'whatsapp_business_management',
  'whatsapp_business_messaging',
];

export class FacebookIntegrationService {
  private metaGraphService: MetaGraphApiService;
  private tokenService: TokenManagementService;
  private discoveryService: MetaDiscoveryService;

  constructor() {
    this.metaGraphService = new MetaGraphApiService();
    this.tokenService = new TokenManagementService();
    this.discoveryService = new MetaDiscoveryService();
  }

  async startOAuth(scope: MultiTenantScope, redirectUriOverride?: string) {
    const appId = process.env.FACEBOOK_APP_ID || '1712255293083461';
    const configId = process.env.FACEBOOK_CONFIG_ID || '937320012719440';
    const redirectUri = redirectUriOverride || process.env.FACEBOOK_REDIRECT_URI || 'https://leadpilotai-2kar.onrender.com/api/integrations/facebook/callback';

    const statePayload = { scope, timestamp: Date.now() };
    const state = Buffer.from(JSON.stringify(statePayload)).toString('base64url');
    const oauthUrl = `https://www.facebook.com/v23.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&config_id=${configId}&response_type=code&state=${state}&auth_type=rerequest&scope=${REQUIRED_PERMISSIONS.join(',')}`;

    return { oauthUrl, configId, appId, redirectUri, state };
  }

  async getDiagnostics(scope: MultiTenantScope) {
    const dashboard = await this.getDashboard(scope);
    return {
      connection: dashboard.connection,
      metrics: dashboard.metrics,
      webhookHealth: dashboard.webhookHealth,
      permissions: dashboard.permissions,
    };
  }

  async handleOAuthCallback(scope: MultiTenantScope, code: string, redirectUri: string) {
    logMetaEvent('Processing Meta Authorization Code Exchange Flow', { scope, codeSnippet: code.substring(0, 10) });

    const shortTokenData = await this.metaGraphService.exchangeCodeForToken(code, redirectUri);
    const shortToken = shortTokenData.access_token;

    const longTokenData = await this.metaGraphService.getLongLivedToken(shortToken);
    const longToken = longTokenData.access_token || shortToken;
    const expiresIn = longTokenData.expires_in || 5184000;

    const profile = await this.metaGraphService.getUserProfile(longToken);

    const rawPerms = await this.metaGraphService.getPermissions(longToken);
    const grantedPermissions = rawPerms.filter((p: any) => p.status === 'granted').map((p: any) => p.permission);
    const missingPermissions = REQUIRED_PERMISSIONS.filter((req) => !grantedPermissions.includes(req));

    const tokenStatus = missingPermissions.length > 0 ? 'PERMISSIONS_MISSING' : 'VALID';

    await this.tokenService.storeEncryptedToken(
      scope,
      profile.id,
      longToken,
      'USER_LONG',
      expiresIn,
      grantedPermissions
    );

    const metaAccount = await MetaAccountModel.findOneAndUpdate(
      { workspaceId: scope.workspaceId, fbUserId: profile.id },
      {
        companyId: scope.companyId,
        userId: scope.userId,
        fbUserName: profile.name,
        fbUserEmail: profile.email || '',
        fbPictureUrl: profile.picture?.data?.url || '',
        tokenStatus,
        grantedPermissions,
        missingPermissions,
        configId: process.env.FACEBOOK_CONFIG_ID || '937320012719440',
        lastSyncedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    await ActivityLogModel.create({
      workspaceId: scope.workspaceId,
      companyId: scope.companyId,
      userId: scope.userId,
      action: 'META_OAUTH_CONNECTED',
      actorType: 'USER',
      description: `Meta account '${profile.name}' connected via Facebook Login for Business.`,
      metadata: { fbUserId: profile.id, tokenStatus, grantedPermissionsCount: grantedPermissions.length },
    });

    try {
      await this.discoveryService.runAutomaticDiscovery(scope, longToken);
    } catch (discErr: any) {
      logMetaEvent('Automatic Asset Discovery Warning during OAuth Callback', { error: discErr.message });
    }

    return {
      success: true,
      metaAccount,
      tokenStatus,
      missingPermissions,
    };
  }

  async getDashboard(scope: MultiTenantScope, businessId?: string) {
    const query: any = { workspaceId: scope.workspaceId };
    const pageQuery: any = { workspaceId: scope.workspaceId };
    if (businessId) pageQuery.businessId = businessId;

    const [
      accounts,
      businesses,
      pages,
      instagramAccounts,
      whatsAppAccounts,
      forms,
      businessAssets,
      webhookSubs,
      recentLogs,
      failedWebhooks,
    ] = await Promise.all([
      MetaAccountModel.find(query).sort({ updatedAt: -1 }),
      BusinessPortfolioModel.find(query).sort({ name: 1 }),
      FacebookPageModel.find(pageQuery).sort({ name: 1 }),
      InstagramAccountModel.find(query).sort({ username: 1 }),
      WhatsAppBusinessModel.find(query).sort({ name: 1 }),
      LeadFormModel.find(pageQuery).sort({ name: 1 }),
      BusinessAssetModel.find(query).sort({ name: 1 }),
      WebhookSubscriptionModel.find(query),
      ActivityLogModel.find(query).sort({ createdAt: -1 }).limit(15),
      LeadWebhookModel.countDocuments({ ...query, status: 'FAILED' }),
    ]);

    const primaryAccount = accounts[0] || null;
    const isConnected = Boolean(primaryAccount && primaryAccount.tokenStatus !== 'REVOKED');

    const grantedList = primaryAccount?.grantedPermissions || [];
    const missingList = primaryAccount?.missingPermissions || [];
    const permissionsSummary = REQUIRED_PERMISSIONS.map((perm) => ({
      name: perm,
      status: grantedList.includes(perm) ? 'GRANTED' : 'MISSING',
    }));

    const totalLeads = forms.reduce((acc, f) => acc + (f.leadsCount || 0), 0);

    return {
      connection: {
        isConnected,
        status: primaryAccount?.tokenStatus || 'NOT_CONNECTED',
        user: primaryAccount
          ? {
              id: primaryAccount.fbUserId,
              name: primaryAccount.fbUserName,
              email: primaryAccount.fbUserEmail,
              picture: primaryAccount.fbPictureUrl,
            }
          : null,
        lastSyncedAt: primaryAccount?.lastSyncedAt || null,
        missingPermissions: missingList,
      },
      accounts: accounts.map((a) => ({
        id: a._id.toString(),
        fbUserId: a.fbUserId,
        name: a.fbUserName,
        email: a.fbUserEmail,
        status: a.tokenStatus,
        grantedPermissionsCount: a.grantedPermissions.length,
        missingPermissionsCount: a.missingPermissions.length,
        lastSyncedAt: a.lastSyncedAt,
      })),
      businesses: businesses.map((b) => ({
        id: b.businessId,
        name: b.name,
        verificationStatus: b.verificationStatus,
        primaryPageId: b.primaryPageId,
      })),
      pages: pages.map((p) => ({
        id: p.pageId,
        name: p.name,
        category: p.category,
        fanCount: p.fanCount,
        pictureUrl: p.pictureUrl,
        isConnected: p.isConnected,
        webhookStatus: p.webhookStatus,
        instagramId: p.instagramBusinessAccountId,
      })),
      instagramAccounts: instagramAccounts.map((ig) => ({
        id: ig.instagramId,
        username: ig.username,
        name: ig.name,
        followersCount: ig.followersCount,
        mediaCount: ig.mediaCount,
        profilePictureUrl: ig.profilePictureUrl,
      })),
      whatsAppAccounts: whatsAppAccounts.map((wa) => ({
        id: wa.wabaId,
        name: wa.name,
        currency: wa.currency,
        phoneNumbers: wa.phoneNumbers,
      })),
      forms: forms.map((f) => ({
        id: f.formId,
        name: f.name,
        pageId: f.pageId,
        status: f.status,
        leadsCount: f.leadsCount,
        questionsCount: f.questions?.length || 0,
        questions: f.questions,
        isActive: f.isActive,
        assignedAiAgentId: f.assignedAiAgentId || '',
      })),
      businessAssets: businessAssets.map((asset) => ({
        id: asset.assetId,
        type: asset.assetType,
        name: asset.name,
        details: asset.details,
      })),
      permissions: permissionsSummary,
      webhookHealth: {
        status: failedWebhooks > 0 ? 'WARNING' : 'HEALTHY',
        activeSubscriptionsCount: webhookSubs.filter((s) => s.status === 'ACTIVE').length,
        failedCount: failedWebhooks,
      },
      recentEvents: recentLogs.map((log) => ({
        id: log._id.toString(),
        eventType: log.action,
        title: log.action.replace(/_/g, ' '),
        description: log.description,
        timestamp: log.createdAt,
      })),
      metrics: {
        totalAccounts: accounts.length,
        totalBusinesses: businesses.length,
        totalPages: pages.length,
        totalInstagram: instagramAccounts.length,
        totalWhatsApp: whatsAppAccounts.length,
        totalForms: forms.length,
        totalLeads,
      },
    };
  }

  async triggerManualSync(scope: MultiTenantScope) {
    const metaAccount = await MetaAccountModel.findOne({ workspaceId: scope.workspaceId });
    const fbUserId = metaAccount?.fbUserId || '';
    const decryptedToken = await this.tokenService.getValidAccessToken(scope, fbUserId);
    if (!decryptedToken) {
      throw new Error('No valid encrypted Meta token found for workspace.');
    }

    logMetaEvent('Manual Full Sync Triggered', { scope });
    return this.discoveryService.runAutomaticDiscovery(scope, decryptedToken);
  }

  async toggleFormActive(scope: MultiTenantScope, formId: string, isActive: boolean) {
    const updated = await LeadFormModel.findOneAndUpdate(
      { workspaceId: scope.workspaceId, formId },
      { isActive },
      { new: true }
    );
    return updated;
  }

  async assignAiAgent(scope: MultiTenantScope, formId: string, aiAgentId: string) {
    const updated = await LeadFormModel.findOneAndUpdate(
      { workspaceId: scope.workspaceId, formId },
      { assignedAiAgentId: aiAgentId },
      { new: true }
    );
    return updated;
  }

  async disconnectAccount(scope: MultiTenantScope, fbUserId?: string) {
    const query: any = { workspaceId: scope.workspaceId };
    if (fbUserId) query.fbUserId = fbUserId;

    await MetaAccountModel.updateMany(query, { tokenStatus: 'REVOKED' });
    await FacebookPageModel.updateMany(query, { isConnected: false, webhookStatus: 'UNSUBSCRIBED' });

    await ActivityLogModel.create({
      workspaceId: scope.workspaceId,
      companyId: scope.companyId,
      userId: scope.userId,
      action: 'META_ACCOUNT_DISCONNECTED',
      actorType: 'USER',
      description: 'Meta Integration account disconnected by user.',
    });

    return { success: true };
  }
}
