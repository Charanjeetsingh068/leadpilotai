import { apiClient } from './api.client';
import { ApiResponse } from '@/types/api.types';

export interface AIAgentItem {
  id: string;
  name: string;
  industry: string;
  department?: string;
  description?: string;
  avatar?: string;
  agentCode?: string;
  defaultLanguage?: string;
  supportedLanguages?: string[];
  businessHours?: string;
  workingDays?: string[];
  timeZone?: string;
  model: string;
  temperature: number;
  maxTokens: number;
  responseTone?: string;
  responseStyle?: string;
  responseLength?: string;
  typingSpeed?: string;
  status: 'Active' | 'Paused';
  connectedWhatsapp?: string;
  knowledgeVersion?: string;
  activeLeadsCount: number;
  conversationsToday: number;
  qualificationRate: number;
  avgResponseTime: string;
  humanTakeoverRate: number;
  systemPrompt?: string;
  welcomeMessage?: string;
  autoApproval: boolean;
  confidenceThreshold: number;
  createdAt: string;
  updatedAt: string;
}

export interface AgentMetricsSummary {
  totalAgents: number;
  activeAgents: number;
  pausedAgents: number;
  conversationsToday: number;
  activeLeads: number;
  automationRunning: number;
  whatsappConnected: number;
}

export interface RecentActivityItem {
  id: string;
  agentName: string;
  iconType: string;
  action: string;
  timeAgo: string;
}

export const AgentClientService = {
  getAgents: async (params?: any): Promise<ApiResponse<AIAgentItem[]>> => {
    const res = await apiClient.get<ApiResponse<AIAgentItem[]>>('/ai-agents', { params });
    return res.data;
  },

  getAgentById: async (id: string): Promise<ApiResponse<AIAgentItem>> => {
    const res = await apiClient.get<ApiResponse<AIAgentItem>>(`/ai-agents/${id}`);
    return res.data;
  },

  getMetricsSummary: async (): Promise<ApiResponse<AgentMetricsSummary>> => {
    const res = await apiClient.get<ApiResponse<AgentMetricsSummary>>('/ai-agents/metrics');
    return res.data;
  },

  getRecentActivity: async (): Promise<ApiResponse<RecentActivityItem[]>> => {
    const res = await apiClient.get<ApiResponse<RecentActivityItem[]>>('/ai-agents/activity');
    return res.data;
  },

  createAgent: async (payload: any): Promise<ApiResponse<AIAgentItem>> => {
    const res = await apiClient.post<ApiResponse<AIAgentItem>>('/ai-agents', payload);
    return res.data;
  },

  updateAgent: async (id: string, payload: any): Promise<ApiResponse<AIAgentItem>> => {
    const res = await apiClient.put<ApiResponse<AIAgentItem>>(`/ai-agents/${id}`, payload);
    return res.data;
  },

  toggleStatus: async (id: string): Promise<ApiResponse<AIAgentItem>> => {
    const res = await apiClient.patch<ApiResponse<AIAgentItem>>(`/ai-agents/${id}/toggle`);
    return res.data;
  },

  deleteAgent: async (id: string): Promise<ApiResponse<any>> => {
    const res = await apiClient.delete<ApiResponse<any>>(`/ai-agents/${id}`);
    return res.data;
  },
};
