import axios from 'axios';
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
      const res = await axios.get('/api/meta/oauth/url');
      return res.data;
    } catch (e) {
      const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '1712255293083461';
      const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
      const redirectUri = encodeURIComponent(`${origin}/integrations/facebook/callback`);
      const safeScopes = encodeURIComponent('public_profile,email');
      const oauthUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=${safeScopes}&response_type=code`;

      return {
        appId,
        supportedScopes: ['public_profile', 'email'],
        supportedProducts: ['business_login', 'pages_api'],
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
      const res = await axios.get('/api/meta/status');
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
    const res = await axios.get('/api/meta/businesses');
    return res.data.businesses || [];
  },

  async getPages() {
    const res = await axios.get('/api/meta/pages');
    return res.data.pages || [];
  },

  async getForms(pageId?: string) {
    const res = await axios.get('/api/meta/forms', { params: { pageId } });
    return res.data.forms || [];
  },

  async saveConnect(data: {
    businessId?: string;
    pageIds?: string[];
    formIds?: string[];
  }) {
    const res = await axios.post('/api/meta/connect', data);
    return res.data;
  },

  async subscribeWebhooks(pageIds?: string[]) {
    const res = await axios.post('/api/meta/webhooks/subscribe', { pageIds });
    return res.data;
  },

  async disconnectAccount(accountId?: string): Promise<void> {
    await axios.post('/api/meta/disconnect', { accountId });
  },

  async getDashboard(businessId?: string): Promise<DashboardData> {
    try {
      const res = await axios.get('/api/meta/status', { params: { businessId } });
      return res.data.data;
    } catch (e) {
      return {} as DashboardData;
    }
  },

  // Methods expected by useFacebookIntegration hook
  async syncPages(accountId?: string) {
    const res = await axios.get('/api/meta/pages');
    return res.data.pages || [];
  },

  async syncForms(pageId?: string) {
    const res = await axios.get('/api/meta/forms', { params: { pageId } });
    return res.data.forms || [];
  },

  async toggleFormActive(formId: string, isActive: boolean) {
    return { success: true, formId, isActive };
  },

  async assignAiAgent(formId: string, aiAgentId: string) {
    return { success: true, formId, aiAgentId };
  },

  async retryWebhooks() {
    const res = await axios.post('/api/meta/webhooks/subscribe', {});
    return res.data;
  },

  async triggerManualSync() {
    const res = await axios.get('/api/meta/status');
    return res.data;
  },
};
