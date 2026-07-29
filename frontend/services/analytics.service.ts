import { apiClient } from './api.client';

export class AnalyticsClientService {
  static async getOverview(agentId?: string) {
    const res = await apiClient.get('/analytics/overview', { params: { agentId } });
    return res.data;
  }

  static async getConversations(period: string = 'Daily') {
    const res = await apiClient.get('/analytics/conversations', { params: { period } });
    return res.data;
  }

  static async getLeadsAnalytics() {
    const res = await apiClient.get('/analytics/leads');
    return res.data;
  }

  static async getKnowledgeAnalytics() {
    const res = await apiClient.get('/analytics/knowledge');
    return res.data;
  }

  static async getAutomationAnalytics() {
    const res = await apiClient.get('/analytics/automation');
    return res.data;
  }

  static async getHandover() {
    const res = await apiClient.get('/analytics/handover');
    return res.data;
  }

  static async getPerformance() {
    const res = await apiClient.get('/analytics/performance');
    return res.data;
  }

  static async getAgentsLeaderboard() {
    const res = await apiClient.get('/analytics/agents');
    return res.data;
  }

  static async getRevenueAnalytics() {
    const res = await apiClient.get('/analytics/revenue');
    return res.data;
  }

  static async getChannels() {
    const res = await apiClient.get('/analytics/channels');
    return res.data;
  }

  static async getFunnel() {
    const res = await apiClient.get('/analytics/funnel');
    return res.data;
  }

  static async getIntents() {
    const res = await apiClient.get('/analytics/intents');
    return res.data;
  }

  static async getHeatmap() {
    const res = await apiClient.get('/analytics/heatmap');
    return res.data;
  }

  static async exportReport(format: string = 'csv') {
    const res = await apiClient.get('/analytics/export', { params: { format } });
    return res.data;
  }
}
