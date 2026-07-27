import { apiClient } from './api.client';
import { ApiResponse } from '@/types/api.types';
import { ConversationSummary, ChatMessage } from '@/types/conversation.types';

export const ConversationService = {
  getConversations: async (): Promise<ApiResponse<ConversationSummary[]>> => {
    const res = await apiClient.get<ApiResponse<ConversationSummary[]>>('/conversations');
    return res.data;
  },

  getMessages: async (conversationId: string): Promise<ApiResponse<ChatMessage[]>> => {
    const res = await apiClient.get<ApiResponse<ChatMessage[]>>(`/conversations/${conversationId}/messages`);
    return res.data;
  },

  sendMessage: async (conversationId: string, content: string): Promise<ApiResponse<ChatMessage>> => {
    const res = await apiClient.post<ApiResponse<ChatMessage>>(`/conversations/${conversationId}/messages`, { content });
    return res.data;
  },

  toggleAiAutomation: async (conversationId: string, isAiAutomated: boolean): Promise<ApiResponse<{ id: string; isAiAutomated: boolean }>> => {
    const res = await apiClient.patch<ApiResponse<{ id: string; isAiAutomated: boolean }>>(`/conversations/${conversationId}/ai-toggle`, { isAiAutomated });
    return res.data;
  },
};
