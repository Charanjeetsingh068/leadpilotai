import { apiClient } from './api.client';


export interface AITestingSessionData {
  id: string;
  sessionId: string;
  scenario: string;
  language: string;
  mode: string;
  status: string;
  startedAt: string;
  createdBy: string;
  messages: AITestingMessageData[];
  metrics?: any[];
}

export interface AITestingMessageData {
  id: string;
  sessionId: string;
  sender: 'user' | 'agent';
  senderName: string;
  message: string;
  intent?: string;
  entities?: string;
  knowledgeUsed?: string;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  responseTimeMs?: number;
  confidenceScore?: number;
  knowledgeMatch?: number;
  leadScore?: number;
  recommendedNextAction?: string;
  conversationStage?: string;
  createdAt: string;
}

export class TestingClientService {
  static async getScenarios() {
    const res = await apiClient.get('/testing/scenarios');
    return res.data;
  }

  static async getLanguages() {
    const res = await apiClient.get('/languages');
    return res.data;
  }

  static async startSession(data?: { agentId?: string; scenario?: string; language?: string; mode?: string }) {
    const res = await apiClient.post('/testing/start', data || {});
    return res.data;
  }

  static async getSession(id?: string) {
    const res = await apiClient.get('/testing/session', { params: { id } });
    return res.data;
  }

  static async clearSession(sessionId?: string) {
    const res = await apiClient.post('/testing/clear', { sessionId });
    return res.data;
  }

  static async sendMessage(payload: { sessionId?: string; agentId?: string; message: string; language?: string }) {
    const res = await apiClient.post('/testing/message', payload);
    return res.data;
  }

  static async getMetrics(sessionId?: string, agentId?: string) {
    const res = await apiClient.get('/testing/metrics', { params: { sessionId, agentId } });
    return res.data;
  }

  static async getHistory(agentId?: string) {
    const res = await apiClient.get('/testing/history', { params: { agentId } });
    return res.data;
  }
}
