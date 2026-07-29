import { apiClient } from './api.client';
import { Lead, LeadFilterParams, LeadNote } from '@/types/lead.types';
import { ApiResponse } from '@/types/api.types';
import { CreateLeadFormData } from '@/utils/validators/lead.schemas';

export const LeadService = {
  getLeads: async (params?: LeadFilterParams): Promise<ApiResponse<Lead[]>> => {
    const res = await apiClient.get<ApiResponse<Lead[]>>('/leads', { params });
    return res.data;
  },

  getLeadById: async (id: string): Promise<ApiResponse<Lead>> => {
    const res = await apiClient.get<ApiResponse<Lead>>(`/leads/${id}`);
    return res.data;
  },

  createLead: async (payload: CreateLeadFormData): Promise<ApiResponse<Lead>> => {
    const res = await apiClient.post<ApiResponse<Lead>>('/leads', payload);
    return res.data;
  },

  updateLeadStatus: async (id: string, status: Lead['status']): Promise<ApiResponse<Lead>> => {
    const res = await apiClient.patch<ApiResponse<Lead>>(`/leads/${id}/status`, { status });
    return res.data;
  },

  assignLead: async (id: string, salesUserId: string, reason?: string): Promise<ApiResponse<Lead>> => {
    const res = await apiClient.post<ApiResponse<Lead>>(`/leads/${id}/assign`, { salesUserId, reason });
    return res.data;
  },

  addNote: async (id: string, noteText: string): Promise<ApiResponse<LeadNote>> => {
    const res = await apiClient.post<ApiResponse<LeadNote>>(`/leads/${id}/notes`, { noteText });
    return res.data;
  },

  softDeleteLead: async (id: string): Promise<ApiResponse<null>> => {
    const res = await apiClient.delete<ApiResponse<null>>(`/leads/${id}`);
    return res.data;
  },

  getLeadConversation: async (id: string): Promise<ApiResponse<any[]>> => {
    const res = await apiClient.get<ApiResponse<any[]>>(`/leads/${id}/conversation`);
    return res.data;
  },

  getLeadTimeline: async (id: string): Promise<ApiResponse<any[]>> => {
    const res = await apiClient.get<ApiResponse<any[]>>(`/leads/${id}/timeline`);
    return res.data;
  },

  getLeadNotes: async (id: string): Promise<ApiResponse<LeadNote[]>> => {
    const res = await apiClient.get<ApiResponse<LeadNote[]>>(`/leads/${id}/notes`);
    return res.data;
  },

  updateLead: async (id: string, payload: Partial<Lead>): Promise<ApiResponse<Lead>> => {
    const res = await apiClient.put<ApiResponse<Lead>>(`/leads/${id}`, payload);
    return res.data;
  },

  bulkAssign: async (leadIds: string[], salesUserId: string): Promise<ApiResponse<Lead[]>> => {
    const res = await apiClient.post<ApiResponse<Lead[]>>('/leads/assign', { leadIds, salesUserId });
    return res.data;
  },

  bulkStatus: async (leadIds: string[], status: Lead['status']): Promise<ApiResponse<Lead[]>> => {
    const res = await apiClient.post<ApiResponse<Lead[]>>('/leads/status', { leadIds, status });
    return res.data;
  },

  importLeads: async (leads: Partial<Lead>[]): Promise<ApiResponse<Lead[]>> => {
    const res = await apiClient.post<ApiResponse<Lead[]>>('/leads/import', { leads });
    return res.data;
  },

  exportLeads: async (params?: LeadFilterParams): Promise<ApiResponse<Lead[]>> => {
    const res = await apiClient.get<ApiResponse<Lead[]>>('/leads/export', { params });
    return res.data;
  },

  duplicateCheck: async (phone: string, email?: string): Promise<ApiResponse<{ duplicate: boolean; lead?: any }>> => {
    const res = await apiClient.get<ApiResponse<{ duplicate: boolean; lead?: any }>>('/leads/duplicate-check', {
      params: { phone, email },
    });
    return res.data;
  },

  startAi: async (payload: any): Promise<ApiResponse<{ lead: Lead; conversation: any }>> => {
    const res = await apiClient.post<ApiResponse<{ lead: Lead; conversation: any }>>('/leads/start-ai', payload);
    return res.data;
  },
};

