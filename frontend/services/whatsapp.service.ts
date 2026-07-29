import { apiClient } from './api.client';
import { ApiResponse } from '@/types/api.types';

export interface WhatsAppConnectionData {
  id: string;
  phoneNumber: string;
  phoneNumberId?: string;
  businessAccount: string;
  wabaId: string;
  status: string;
  qualityRating: string;
  rateLimit?: string;
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
  header?: string;
  footer?: string;
  status: string;
  qualityRating: string;
  lastApprovedAt?: string;
}

export interface WhatsAppAutomationRuleItem {
  id: string;
  ruleName: string;
  priority: number;
  triggerCondition: string;
  action: string;
  channel?: string;
  retries?: number;
  status: string;
}

export interface WhatsAppBusinessHoursData {
  id: string;
  workingDays: string[];
  workingHours: string;
  lunchHours?: string;
  holidayCalendar?: string;
  timeZone: string;
  weekendRules?: string;
  afterHoursBehaviour?: string;
}

export interface WhatsAppHumanTakeoverData {
  id: string;
  assignTeam: string;
  assignUser?: string;
  department: string;
  escalationTime: string;
  timeoutMinutes: number;
  manualOverride: boolean;
  isAiPaused: boolean;
  internalNotes?: string;
}

export interface WhatsAppMediaItem {
  id: string;
  name: string;
  fileUrl: string;
  type: string;
  category: string;
  fileSize: string;
  version: string;
}

export const WhatsAppClientService = {
  // Connection
  getConnection: async (params?: { agentId?: string }): Promise<ApiResponse<WhatsAppConnectionData>> => {
    const res = await apiClient.get<ApiResponse<WhatsAppConnectionData>>('/whatsapp/connection', { params });
    return res.data;
  },

  connect: async (payload: any, params?: { agentId?: string }): Promise<ApiResponse<WhatsAppConnectionData>> => {
    const res = await apiClient.post<ApiResponse<WhatsAppConnectionData>>('/whatsapp/connect', payload, { params });
    return res.data;
  },

  disconnect: async (params?: { agentId?: string }): Promise<ApiResponse<WhatsAppConnectionData>> => {
    const res = await apiClient.post<ApiResponse<WhatsAppConnectionData>>('/whatsapp/disconnect', {}, { params });
    return res.data;
  },

  testConnection: async (params?: { agentId?: string }): Promise<ApiResponse<any>> => {
    const res = await apiClient.post<ApiResponse<any>>('/whatsapp/test', {}, { params });
    return res.data;
  },

  // Templates
  getTemplates: async (params?: { agentId?: string }): Promise<ApiResponse<WhatsAppTemplateItem[]>> => {
    const res = await apiClient.get<ApiResponse<WhatsAppTemplateItem[]>>('/whatsapp/templates', { params });
    return res.data;
  },

  createTemplate: async (payload: any): Promise<ApiResponse<WhatsAppTemplateItem>> => {
    const res = await apiClient.post<ApiResponse<WhatsAppTemplateItem>>('/whatsapp/templates', payload);
    return res.data;
  },

  updateTemplate: async (id: string, payload: any): Promise<ApiResponse<WhatsAppTemplateItem>> => {
    const res = await apiClient.patch<ApiResponse<WhatsAppTemplateItem>>(`/whatsapp/templates/${id}`, payload);
    return res.data;
  },

  deleteTemplate: async (id: string): Promise<ApiResponse<any>> => {
    const res = await apiClient.delete<ApiResponse<any>>(`/whatsapp/templates/${id}`);
    return res.data;
  },

  // Welcome Message
  getWelcomeMessage: async (params?: { agentId?: string }): Promise<ApiResponse<{ welcomeMessage: string }>> => {
    const res = await apiClient.get<ApiResponse<{ welcomeMessage: string }>>('/whatsapp/welcome', { params });
    return res.data;
  },

  saveWelcomeMessage: async (welcomeMessage: string, params?: { agentId?: string }): Promise<ApiResponse<any>> => {
    const res = await apiClient.post<ApiResponse<any>>('/whatsapp/welcome', { welcomeMessage }, { params });
    return res.data;
  },

  // Follow-up Sequence
  getFollowupSequence: async (params?: { agentId?: string }): Promise<ApiResponse<any>> => {
    const res = await apiClient.get<ApiResponse<any>>('/whatsapp/followups', { params });
    return res.data;
  },

  saveFollowupSequence: async (payload: any, params?: { agentId?: string }): Promise<ApiResponse<any>> => {
    const res = await apiClient.post<ApiResponse<any>>('/whatsapp/followups', payload, { params });
    return res.data;
  },

  // Automation Rules
  getAutomationRules: async (params?: { agentId?: string }): Promise<ApiResponse<WhatsAppAutomationRuleItem[]>> => {
    const res = await apiClient.get<ApiResponse<WhatsAppAutomationRuleItem[]>>('/whatsapp/rules', { params });
    return res.data;
  },

  createAutomationRule: async (payload: any): Promise<ApiResponse<WhatsAppAutomationRuleItem>> => {
    const res = await apiClient.post<ApiResponse<WhatsAppAutomationRuleItem>>('/whatsapp/rules', payload);
    return res.data;
  },

  updateAutomationRule: async (id: string, payload: any): Promise<ApiResponse<WhatsAppAutomationRuleItem>> => {
    const res = await apiClient.patch<ApiResponse<WhatsAppAutomationRuleItem>>(`/whatsapp/rules/${id}`, payload);
    return res.data;
  },

  deleteAutomationRule: async (id: string): Promise<ApiResponse<any>> => {
    const res = await apiClient.delete<ApiResponse<any>>(`/whatsapp/rules/${id}`);
    return res.data;
  },

  // Business Hours
  getBusinessHours: async (params?: { agentId?: string }): Promise<ApiResponse<WhatsAppBusinessHoursData>> => {
    const res = await apiClient.get<ApiResponse<WhatsAppBusinessHoursData>>('/whatsapp/business-hours', { params });
    return res.data;
  },

  saveBusinessHours: async (payload: any, params?: { agentId?: string }): Promise<ApiResponse<WhatsAppBusinessHoursData>> => {
    const res = await apiClient.post<ApiResponse<WhatsAppBusinessHoursData>>('/whatsapp/business-hours', payload, { params });
    return res.data;
  },

  // Human Takeover
  getHumanTakeover: async (params?: { agentId?: string }): Promise<ApiResponse<WhatsAppHumanTakeoverData>> => {
    const res = await apiClient.get<ApiResponse<WhatsAppHumanTakeoverData>>('/whatsapp/takeover', { params });
    return res.data;
  },

  saveHumanTakeover: async (payload: any, params?: { agentId?: string }): Promise<ApiResponse<WhatsAppHumanTakeoverData>> => {
    const res = await apiClient.post<ApiResponse<WhatsAppHumanTakeoverData>>('/whatsapp/takeover', payload, { params });
    return res.data;
  },

  // Media
  getMedia: async (params?: { agentId?: string }): Promise<ApiResponse<WhatsAppMediaItem[]>> => {
    const res = await apiClient.get<ApiResponse<WhatsAppMediaItem[]>>('/whatsapp/media', { params });
    return res.data;
  },

  createMedia: async (payload: any): Promise<ApiResponse<WhatsAppMediaItem>> => {
    const res = await apiClient.post<ApiResponse<WhatsAppMediaItem>>('/whatsapp/media', payload);
    return res.data;
  },

  deleteMedia: async (id: string): Promise<ApiResponse<any>> => {
    const res = await apiClient.delete<ApiResponse<any>>(`/whatsapp/media/${id}`);
    return res.data;
  },

  // Usage Metrics & Logs
  getUsageMetrics: async (params?: { agentId?: string }): Promise<ApiResponse<any>> => {
    const res = await apiClient.get<ApiResponse<any>>('/whatsapp/usage', { params });
    return res.data;
  },

  getLogs: async (params?: { agentId?: string }): Promise<ApiResponse<any[]>> => {
    const res = await apiClient.get<ApiResponse<any[]>>('/whatsapp/logs', { params });
    return res.data;
  },
};
