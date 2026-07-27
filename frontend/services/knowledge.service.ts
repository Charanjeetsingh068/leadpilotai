import { apiClient } from './api.client';
import { KnowledgeDocument } from '@/types/knowledge.types';
import { ApiResponse } from '@/types/api.types';

export const KnowledgeService = {
  getDocuments: async (): Promise<ApiResponse<KnowledgeDocument[]>> => {
    const res = await apiClient.get('/knowledge');
    return res.data;
  },

  uploadDocument: async (formData: FormData): Promise<ApiResponse<KnowledgeDocument>> => {
    const res = await apiClient.post('/knowledge/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  deleteDocument: async (id: string): Promise<ApiResponse<null>> => {
    const res = await apiClient.delete(`/knowledge/${id}`);
    return res.data;
  },
};
