import { apiClient } from './api.client';
import { Lead, LeadFilterParams, LeadNote, TimelineEvent } from '@/types/lead.types';
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
};
