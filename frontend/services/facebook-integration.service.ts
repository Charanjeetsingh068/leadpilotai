import { apiClient } from './api.client';
import { DashboardData } from '@/types/facebook.types';

export interface MetaCapabilities {
  appId: string;
  supportedScopes: string[];
  supportedProducts: string[];
  businessLogin: boolean;
  marketingApi: boolean;
  pagesApi: boolean;
  leadAds: boolean;
  isConfigured: boolean;
  missingRequiredPermissions: string[];
  oauthUrl: string;
}

export interface MetaConnectionStatus {
  isConnected: boolean;
  accountId?: string;
  accountName?: string;
  fbUserId?: string;
  avatarUrl?: string;
  business?: {
    id: string;
    name: string;
    verificationStatus: string;
  };
  pagesCount: number;
  formsCount: number;
  webhookStatus: string;
  tokenStatus: string;
  tokenExpiresAt?: string;
  permissionsGranted: string[];
  lastSyncAt?: string;
}

export const facebookIntegrationService = {
  async getCapabilities(): Promise<MetaCapabilities> {
    try {
      const res = await apiClient.post('/integrations/facebook/oauth');
      return res.data.data;
    } catch (e) {
      const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '1712255293083461';
      const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
      const redirectUri = encodeURIComponent(`${origin}/integrations/facebook/callback`);
      const safeScopesList = [
        'public_profile',
        'pages_show_list',
        'pages_read_engagement',
        'pages_manage_metadata',
        'leads_retrieval',
        'business_management',
      ];
      const safeScopes = encodeURIComponent(safeScopesList.join(','));
      const oauthUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=${safeScopes}&response_type=code`;

      return {
        appId,
        supportedScopes: safeScopesList,
        supportedProducts: ['business_login', 'pages_api', 'lead_ads'],
        businessLogin: true,
        marketingApi: true,
        pagesApi: true,
        leadAds: true,
        isConfigured: true,
        missingRequiredPermissions: [],
        oauthUrl,
      };
    }
  },

  async startOAuth(): Promise<{ oauthUrl: string }> {
    const caps = await this.getCapabilities();
    return { oauthUrl: caps.oauthUrl };
  },

  async getStatus(): Promise<MetaConnectionStatus> {
    try {
      const res = await apiClient.get('/facebook/status');
      return res.data.data;
    } catch (e) {
      return {
        isConnected: false,
        pagesCount: 0,
        formsCount: 0,
        webhookStatus: 'Inactive',
        tokenStatus: 'Not Connected',
        permissionsGranted: [],
      };
    }
  },

  async getBusinesses() {
    const res = await apiClient.get('/facebook/businesses');
    return res.data.data || [];
  },

  async getPages() {
    const res = await apiClient.get('/facebook/pages');
    return res.data.data?.pages || [];
  },

  async getForms(pageId?: string) {
    const res = await apiClient.get('/facebook/forms', { params: { pageId } });
    return res.data.data?.forms || [];
  },

  async saveConnect(data: {
    businessId?: string;
    pageIds?: string[];
    formIds?: string[];
  }) {
    const res = await apiClient.post('/facebook/connect', data);
    return res.data.data;
  },

  async subscribeWebhooks(pageIds?: string[]) {
    const res = await apiClient.get('/facebook/webhooks');
    return res.data.data;
  },

  async disconnectAccount(accountId?: string): Promise<void> {
    await apiClient.post('/facebook/disconnect', { accountId });
  },

  async getDashboard(businessId?: string): Promise<DashboardData> {
    try {
      const res = await apiClient.get('/facebook/dashboard', { params: { businessId } });
      return res.data.data;
    } catch (e) {
      return {} as DashboardData;
    }
  },

  async syncPages(accountId?: string) {
    const res = await apiClient.get('/facebook/pages');
    return res.data.data?.pages || [];
  },

  async syncForms(pageId?: string) {
    const res = await apiClient.get('/facebook/forms', { params: { pageId } });
    return res.data.data?.forms || [];
  },

  async toggleFormActive(formId: string, isActive: boolean) {
    return { success: true, formId, isActive };
  },

  async assignAiAgent(formId: string, aiAgentId: string) {
    return { success: true, formId, aiAgentId };
  },

  async retryWebhooks() {
    const res = await apiClient.post('/facebook/webhooks/retry', {});
    return res.data.data;
  },

  async triggerManualSync() {
    const res = await apiClient.post('/facebook/sync', {});
    return res.data.data;
  },
};
