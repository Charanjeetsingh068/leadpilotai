import { apiClient } from './api.client';
import { Lead, LeadFilterParams, LeadNote } from '@/types/lead.types';
import { ApiResponse } from '@/types/api.types';
import { CreateLeadFormData } from '@/utils/validators/lead.schemas';

export const LeadService = {
  getLeads: async (params?: LeadFilterParams): Promise<ApiResponse<Lead[]>> => {
    try {
      const res = await apiClient.get('/facebook/leads', { params });
      if (res.data?.data?.leads && Array.isArray(res.data.data.leads) && res.data.data.leads.length > 0) {
        const rawLeads = res.data.data.leads;
        const mappedLeads: Lead[] = rawLeads.map((l: any) => {
          let src: any = 'FACEBOOK_ADS';
          const sName = (l.source || l.sourceName || '').toUpperCase();
          if (sName.includes('INSTAGRAM')) src = 'INSTAGRAM_ADS';
          else if (sName.includes('GOOGLE')) src = 'GOOGLE_ADS';
          else if (sName.includes('WEBSITE')) src = 'WEBSITE_FORM';
          else if (sName.includes('MANUAL')) src = 'MANUAL_ENTRY';
          else if (sName.includes('CSV')) src = 'CSV_IMPORT';
          else src = 'FACEBOOK_ADS';

          let st: any = 'NEW';
          const statusUpper = (l.status || '').toUpperCase();
          if (statusUpper.includes('QUALIF')) st = 'QUALIFIED';
          else if (statusUpper.includes('CONTACT')) st = 'CONTACTED';
          else if (statusUpper.includes('CONVERT')) st = 'CONVERTED';
          else if (statusUpper.includes('HUMAN')) st = 'HUMAN_APPROVAL_REQUIRED';
          else st = 'NEW';

          return {
            id: l.id || l.leadId,
            name: l.name || 'Meta Lead',
            phone: l.phone || '',
            email: l.email || '',
            source: src,
            campaign: l.campaign || l.campaignName || '',
            project: l.project || l.formName || '',
            industry: l.industry || '',
            budget: l.budget || '',
            location: l.location || l.city || '',
            status: st,
            qualificationScore: typeof l.qualificationScore === 'number' ? l.qualificationScore : 0,
            assignedSalesUser: l.assignedSalesUser || null,
            organizationId: l.organizationId || l.workspaceId || '',
            createdAt: l.createdAt || l.createdTime || new Date().toISOString(),
            updatedAt: l.updatedAt || new Date().toISOString(),
          };
        });

        return {
          success: true,
          message: 'Dynamic leads retrieved successfully',
          data: mappedLeads,
          meta: {
            total: res.data.data.total || mappedLeads.length,
            page: res.data.data.page || 1,
            limit: res.data.data.limit || 50,
            totalPages: res.data.data.totalPages || 1,
          },
        };
      }
    } catch (e) {}

    try {
      const res = await apiClient.get<ApiResponse<Lead[]>>('/leads', { params });
      if (res.data?.data) return res.data;
    } catch (e) {}

    return {
      success: true,
      message: 'No leads found',
      data: [],
      meta: { total: 0, page: 1, limit: 10, totalPages: 1 },
    };
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

