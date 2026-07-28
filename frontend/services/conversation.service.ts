import { apiClient } from './api.client';
import { ApiResponse } from '@/types/api.types';
import { ConversationSummary, ChatMessage } from '@/types/conversation.types';

export const ConversationService = {
  getConversations: async (params?: { search?: string; source?: string; status?: string }): Promise<ApiResponse<ConversationSummary[]>> => {
    const res = await apiClient.get<ApiResponse<ConversationSummary[]>>('/conversations', { params });
    return res.data;
  },

  getConversationById: async (conversationId: string): Promise<ApiResponse<ConversationSummary>> => {
    const res = await apiClient.get<ApiResponse<ConversationSummary>>(`/conversations/${conversationId}`);
    return res.data;
  },

  getMessages: async (conversationId: string): Promise<ApiResponse<ChatMessage[]>> => {
    const res = await apiClient.get<ApiResponse<ChatMessage[]>>(`/conversations/${conversationId}/messages`);
    return res.data;
  },

  sendMessage: async (conversationId: string, content: string, mediaUrl?: string, attachmentType?: string): Promise<ApiResponse<ChatMessage>> => {
    const res = await apiClient.post<ApiResponse<ChatMessage>>(`/conversations/${conversationId}/messages`, { content, mediaUrl, attachmentType });
    return res.data;
  },

  toggleAiAutomation: async (conversationId: string, isAiAutomated: boolean): Promise<ApiResponse<{ id: string; isAiAutomated: boolean }>> => {
    const res = await apiClient.post<ApiResponse<{ id: string; isAiAutomated: boolean }>>(`/conversations/${conversationId}/${isAiAutomated ? 'resume' : 'pause'}`);
    return res.data;
  },

  takeover: async (conversationId: string): Promise<ApiResponse<{ id: string; isAiAutomated: boolean }>> => {
    const res = await apiClient.post<ApiResponse<{ id: string; isAiAutomated: boolean }>>(`/conversations/${conversationId}/takeover`);
    return res.data;
  },

  pauseAi: async (conversationId: string): Promise<ApiResponse<{ id: string; isAiAutomated: boolean }>> => {
    const res = await apiClient.post<ApiResponse<{ id: string; isAiAutomated: boolean }>>(`/conversations/${conversationId}/pause`);
    return res.data;
  },

  resumeAi: async (conversationId: string): Promise<ApiResponse<{ id: string; isAiAutomated: boolean }>> => {
    const res = await apiClient.post<ApiResponse<{ id: string; isAiAutomated: boolean }>>(`/conversations/${conversationId}/resume`);
    return res.data;
  },

  approveAiReply: async (conversationId: string, replyText?: string): Promise<ApiResponse<ChatMessage>> => {
    const res = await apiClient.post<ApiResponse<ChatMessage>>(`/conversations/${conversationId}/approve`, { replyText });
    return res.data;
  },

  bookSiteVisit: async (conversationId: string, date: string, time: string, notes?: string): Promise<ApiResponse<{ success: boolean; message: string }>> => {
    const res = await apiClient.post<ApiResponse<{ success: boolean; message: string }>>(`/conversations/${conversationId}/sitevisit`, { date, time, notes });
    return res.data;
  },

  exportConversation: async (conversationId: string, format: 'pdf' | 'excel' | 'csv' | 'json'): Promise<ApiResponse<any>> => {
    const res = await apiClient.post<ApiResponse<any>>(`/conversations/${conversationId}/export`, { format });
    return res.data;
  },
};
