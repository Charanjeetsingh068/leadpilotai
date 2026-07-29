import { apiClient } from './api.client';
import { ApiResponse } from '@/types/api.types';

export interface KnowledgeDocumentItem {
  id: string;
  name: string;
  fileUrl?: string;
  type: string;
  category: string;
  pagesCount?: number | null;
  chunksCount?: number | null;
  status: 'Indexed' | 'Indexing' | 'Pending' | 'Processing' | 'Failed' | 'Archived';
  uploadedBy?: string;
  fileSize?: string;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeOverviewMetrics {
  totalDocuments: number;
  totalPages: number;
  indexedChunks: number;
  storageUsed: string;
  lastTrained: string;
  status: string;
  trainingStatus: {
    totalDocuments: number;
    indexedDocuments: number;
    pendingDocuments: number;
    failedDocuments: number;
    indexedPercentage: number;
    lastTrainedCompleted: string;
  };
}

export interface KnowledgeCategoryItem {
  name: string;
  percentage: number;
  count: number;
}

export interface KnowledgeTopUsageItem {
  id: string;
  name: string;
  convCount: number;
  usagePct: number;
}

export interface KnowledgeHealthMetrics {
  freshnessScore: number;
  accuracyScore: number;
  completenessScore: number;
  consistencyScore: number;
}

export const KnowledgeClientService = {
  getDocuments: async (params?: any): Promise<ApiResponse<KnowledgeDocumentItem[]>> => {
    const res = await apiClient.get<ApiResponse<KnowledgeDocumentItem[]>>('/knowledge/documents', { params });
    return res.data;
  },

  getOverviewMetrics: async (params?: any): Promise<ApiResponse<KnowledgeOverviewMetrics>> => {
    const res = await apiClient.get<ApiResponse<KnowledgeOverviewMetrics>>('/knowledge/overview', { params });
    return res.data;
  },

  reindexAll: async (): Promise<ApiResponse<any>> => {
    const res = await apiClient.post<ApiResponse<any>>('/knowledge/reindex-all');
    return res.data;
  },

  uploadDocument: async (payload: any): Promise<ApiResponse<KnowledgeDocumentItem>> => {
    const res = await apiClient.post<ApiResponse<KnowledgeDocumentItem>>('/knowledge/upload', payload);
    return res.data;
  },

  deleteDocument: async (id: string): Promise<ApiResponse<any>> => {
    const res = await apiClient.delete<ApiResponse<any>>(`/knowledge/documents/${id}`);
    return res.data;
  },

  updateDocument: async (id: string, payload: any): Promise<ApiResponse<KnowledgeDocumentItem>> => {
    const res = await apiClient.patch<ApiResponse<KnowledgeDocumentItem>>(`/knowledge/documents/${id}`, payload);
    return res.data;
  },

  archiveDocument: async (id: string): Promise<ApiResponse<any>> => {
    const res = await apiClient.post<ApiResponse<any>>(`/knowledge/documents/${id}/archive`);
    return res.data;
  },

  restoreDocument: async (id: string): Promise<ApiResponse<any>> => {
    const res = await apiClient.post<ApiResponse<any>>(`/knowledge/documents/${id}/restore`);
    return res.data;
  },

  reindexDocument: async (id: string): Promise<ApiResponse<any>> => {
    const res = await apiClient.post<ApiResponse<any>>(`/knowledge/documents/${id}/reindex`);
    return res.data;
  },

  getCategories: async (): Promise<ApiResponse<KnowledgeCategoryItem[]>> => {
    const res = await apiClient.get<ApiResponse<KnowledgeCategoryItem[]>>('/knowledge/categories');
    return res.data;
  },

  getTopUsage: async (): Promise<ApiResponse<KnowledgeTopUsageItem[]>> => {
    const res = await apiClient.get<ApiResponse<KnowledgeTopUsageItem[]>>('/knowledge/top-usage');
    return res.data;
  },

  getHealthMetrics: async (): Promise<ApiResponse<KnowledgeHealthMetrics>> => {
    const res = await apiClient.get<ApiResponse<KnowledgeHealthMetrics>>('/knowledge/health');
    return res.data;
  },

  getFaqs: async (params?: any): Promise<ApiResponse<any[]>> => {
    const res = await apiClient.get<ApiResponse<any[]>>('/knowledge/faqs', { params });
    return res.data;
  },

  createFaq: async (payload: any): Promise<ApiResponse<any>> => {
    const res = await apiClient.post<ApiResponse<any>>('/knowledge/faqs', payload);
    return res.data;
  },

  deleteFaq: async (id: string): Promise<ApiResponse<any>> => {
    const res = await apiClient.delete<ApiResponse<any>>(`/knowledge/faqs/${id}`);
    return res.data;
  },

  getWebsites: async (params?: any): Promise<ApiResponse<any[]>> => {
    const res = await apiClient.get<ApiResponse<any[]>>('/knowledge/websites', { params });
    return res.data;
  },

  addWebsite: async (payload: any): Promise<ApiResponse<any>> => {
    const res = await apiClient.post<ApiResponse<any>>('/knowledge/websites', payload);
    return res.data;
  },

  getMedia: async (params?: any): Promise<ApiResponse<any[]>> => {
    const res = await apiClient.get<ApiResponse<any[]>>('/knowledge/media', { params });
    return res.data;
  },

  getDataSources: async (params?: any): Promise<ApiResponse<any[]>> => {
    const res = await apiClient.get<ApiResponse<any[]>>('/knowledge/datasources', { params });
    return res.data;
  },

  getTrainingJobs: async (params?: any): Promise<ApiResponse<any[]>> => {
    const res = await apiClient.get<ApiResponse<any[]>>('/knowledge/training-jobs', { params });
    return res.data;
  },

  getVersions: async (params?: any): Promise<ApiResponse<any[]>> => {
    const res = await apiClient.get<ApiResponse<any[]>>('/knowledge/versions', { params });
    return res.data;
  },
};
