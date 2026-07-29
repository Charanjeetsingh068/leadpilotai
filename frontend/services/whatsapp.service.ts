import { apiClient } from './api.client';
import { ApiResponse } from '@/types/api.types';

export interface WhatsAppConnectionData {
  id: string;
  phoneNumber: string;
  businessAccount: string;
  wabaId: string;
  status: string;
  qualityRating: string;
  webhookUrl: string;
  verifyToken: string;
  webhookStatus: string;
  lastReceivedAt?: string;
  aiAgentId?: string;
}

export interface WhatsAppTemplateItem {
  id: string;
  name: string;
  category: string;
  language: string;
  bodyText?: string;
  status: string;
  qualityRating: string;
  lastApprovedAt?: string;
}

export const WhatsAppClientService = {
  getConnection: async (params?: { agentId?: string }): Promise<ApiResponse<WhatsAppConnectionData>> => {
    const res = await apiClient.get<ApiResponse<WhatsAppConnectionData>>('/whatsapp/connection', { params });
    return res.data;
  },

  getTemplates: async (params?: { agentId?: string }): Promise<ApiResponse<WhatsAppTemplateItem[]>> => {
    const res = await apiClient.get<ApiResponse<WhatsAppTemplateItem[]>>('/whatsapp/templates', { params });
    return res.data;
  },

  createTemplate: async (payload: any): Promise<ApiResponse<WhatsAppTemplateItem>> => {
    const res = await apiClient.post<ApiResponse<WhatsAppTemplateItem>>('/whatsapp/templates', payload);
    return res.data;
  },

  deleteTemplate: async (id: string): Promise<ApiResponse<any>> => {
    const res = await apiClient.delete<ApiResponse<any>>(`/whatsapp/templates/${id}`);
    return res.data;
  },

  getFollowupSequence: async (params?: { agentId?: string }): Promise<ApiResponse<any>> => {
    const res = await apiClient.get<ApiResponse<any>>('/whatsapp/followups', { params });
    return res.data;
  },

  getAutomationRules: async (params?: { agentId?: string }): Promise<ApiResponse<any[]>> => {
    const res = await apiClient.get<ApiResponse<any[]>>('/whatsapp/automations', { params });
    return res.data;
  },

  getUsageMetrics: async (params?: { agentId?: string }): Promise<ApiResponse<any>> => {
    const res = await apiClient.get<ApiResponse<any>>('/whatsapp/usage', { params });
    return res.data;
  },

  getLogs: async (params?: { agentId?: string }): Promise<ApiResponse<any[]>> => {
    const res = await apiClient.get<ApiResponse<any[]>>('/whatsapp/logs', { params });
    return res.data;
  },

  testConnection: async (params?: { agentId?: string }): Promise<ApiResponse<any>> => {
    const res = await apiClient.post<ApiResponse<any>>('/whatsapp/test', {}, { params });
    return res.data;
  },
};
