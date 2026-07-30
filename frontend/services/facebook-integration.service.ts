import axios from 'axios';
import { DashboardData, FacebookAccountItem, FacebookPageItem, FacebookFormItem } from '@/types/facebook.types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const facebookIntegrationService = {
  async getDashboard(businessId?: string): Promise<DashboardData> {
    const res = await axios.get(`${API_BASE}/facebook/dashboard`, {
      params: { businessId },
      withCredentials: true,
    });
    return res.data.data;
  },

  async startOAuth(): Promise<{ oauthUrl: string }> {
    try {
      const res = await axios.post(`${API_BASE}/integrations/facebook/oauth`, {}, { withCredentials: true });
      if (res.data?.data?.oauthUrl) {
        return res.data.data;
      }
    } catch (err) {
      console.warn('Backend OAuth endpoint unavailable, constructing client Meta OAuth URL');
    }

    const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '1712255293083461';
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    const redirectUri = encodeURIComponent(`${origin}/integrations/facebook/callback`);
    const scopes = encodeURIComponent('pages_show_list,pages_read_engagement,leads_retrieval,business_management');
    const oauthUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=${scopes}&response_type=code`;

    return { oauthUrl };
  },

  async disconnectAccount(accountId: string): Promise<void> {
    await axios.post(`${API_BASE}/integrations/facebook/disconnect`, { accountId }, { withCredentials: true });
  },

  async getAccounts(params?: { search?: string; status?: string; page?: number; limit?: number }) {
    const res = await axios.get(`${API_BASE}/facebook/accounts`, { params, withCredentials: true });
    return res.data.data;
  },

  async getBusinesses() {
    const res = await axios.get(`${API_BASE}/facebook/businesses`, { withCredentials: true });
    return res.data.data;
  },

  async getPages(params?: { search?: string; businessId?: string; page?: number; limit?: number }) {
    const res = await axios.get(`${API_BASE}/facebook/pages`, { params, withCredentials: true });
    return res.data.data;
  },

  async syncPages(accountId?: string) {
    const res = await axios.post(`${API_BASE}/facebook/pages/sync`, { accountId }, { withCredentials: true });
    return res.data.data;
  },

  async getForms(params?: { search?: string; pageId?: string; page?: number; limit?: number }) {
    const res = await axios.get(`${API_BASE}/facebook/forms`, { params, withCredentials: true });
    return res.data.data;
  },

  async assignAiAgent(formId: string, aiAgentId: string) {
    const res = await axios.put(`${API_BASE}/facebook/forms/assign-ai`, { formId, aiAgentId }, { withCredentials: true });
    return res.data.data;
  },

  async toggleFormActive(formId: string, isActive: boolean) {
    const res = await axios.put(`${API_BASE}/facebook/forms/assign-ai`, { formId, isActive }, { withCredentials: true });
    return res.data.data;
  },

  async syncForms(pageId?: string) {
    const res = await axios.post(`${API_BASE}/facebook/forms/sync`, { pageId }, { withCredentials: true });
    return res.data.data;
  },

  async getPermissions() {
    const res = await axios.get(`${API_BASE}/facebook/permissions`, { withCredentials: true });
    return res.data.data;
  },

  async retryWebhooks() {
    const res = await axios.post(`${API_BASE}/facebook/webhooks/retry`, {}, { withCredentials: true });
    return res.data.data;
  },

  async triggerManualSync() {
    const res = await axios.post(`${API_BASE}/facebook/sync`, {}, { withCredentials: true });
    return res.data.data;
  },
};
