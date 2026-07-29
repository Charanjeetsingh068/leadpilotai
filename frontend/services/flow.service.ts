import { apiClient } from './api.client';
import { ApiResponse } from '@/types/api.types';

export interface FlowNodeItem {
  id: string;
  nodeId: string;
  type: string;
  label: string;
  subtitle?: string;
  posX: number;
  posY: number;
  config?: any;
}

export interface FlowEdgeItem {
  id: string;
  edgeId: string;
  sourceNodeId: string;
  targetNodeId: string;
  label?: string;
}

export interface QualificationFlowData {
  id: string;
  name: string;
  description?: string;
  status: string;
  lastPublishedAt?: string;
  aiAgentId?: string;
  nodes: FlowNodeItem[];
  edges: FlowEdgeItem[];
  versions?: any[];
}

export const FlowClientService = {
  getFlow: async (params?: { agentId?: string }): Promise<ApiResponse<QualificationFlowData>> => {
    const res = await apiClient.get<ApiResponse<QualificationFlowData>>('/qualification-flows', { params });
    return res.data;
  },

  saveFlow: async (id: string, payload: { nodes: any[]; edges: any[] }): Promise<ApiResponse<QualificationFlowData>> => {
    const res = await apiClient.patch<ApiResponse<QualificationFlowData>>(`/qualification-flows/${id}`, payload);
    return res.data;
  },

  publishFlow: async (id: string): Promise<ApiResponse<QualificationFlowData>> => {
    const res = await apiClient.post<ApiResponse<QualificationFlowData>>('/qualification-flows/publish', { id });
    return res.data;
  },

  testFlow: async (payload: any): Promise<ApiResponse<any>> => {
    const res = await apiClient.post<ApiResponse<any>>('/qualification-flows/test', payload);
    return res.data;
  },

  getHistory: async (flowId?: string): Promise<ApiResponse<any[]>> => {
    const res = await apiClient.get<ApiResponse<any[]>>('/qualification-flows/history', { params: { flowId } });
    return res.data;
  },

  getQuestions: async (params?: any): Promise<ApiResponse<any[]>> => {
    const res = await apiClient.get<ApiResponse<any[]>>('/qualification-flows/questions', { params });
    return res.data;
  },

  createQuestion: async (payload: any): Promise<ApiResponse<any>> => {
    const res = await apiClient.post<ApiResponse<any>>('/qualification-flows/questions', payload);
    return res.data;
  },

  deleteQuestion: async (id: string): Promise<ApiResponse<any>> => {
    const res = await apiClient.delete<ApiResponse<any>>(`/qualification-flows/questions/${id}`);
    return res.data;
  },

  getScoreRules: async (params?: any): Promise<ApiResponse<any[]>> => {
    const res = await apiClient.get<ApiResponse<any[]>>('/qualification-flows/scoring', { params });
    return res.data;
  },

  getConditions: async (params?: any): Promise<ApiResponse<any[]>> => {
    const res = await apiClient.get<ApiResponse<any[]>>('/qualification-flows/conditions', { params });
    return res.data;
  },

  getAutomations: async (params?: any): Promise<ApiResponse<any[]>> => {
    const res = await apiClient.get<ApiResponse<any[]>>('/qualification-flows/automations', { params });
    return res.data;
  },

  getSettings: async (params?: any): Promise<ApiResponse<any>> => {
    const res = await apiClient.get<ApiResponse<any>>('/qualification-flows/settings', { params });
    return res.data;
  },
};
