import { create } from 'zustand';
import { Conversation, WhatsAppMessage } from '@/types/conversation.types';

interface ConversationState {
  conversations: Conversation[];
  activeConversationId: string | null;
  activeMessages: WhatsAppMessage[];
  isLoading: boolean;
  searchQuery: string;
  activeFilterSource: string;
  activeTab: 'Conversation' | 'Activity Log';
  isAiTyping: boolean;

  setConversations: (conversations: Conversation[]) => void;
  setActiveConversationId: (id: string | null) => void;
  setActiveMessages: (messages: WhatsAppMessage[]) => void;
  appendMessage: (message: WhatsAppMessage) => void;
  setLoading: (isLoading: boolean) => void;
  setSearchQuery: (query: string) => void;
  setActiveFilterSource: (source: string) => void;
  setActiveTab: (tab: 'Conversation' | 'Activity Log') => void;
  setAiTyping: (isTyping: boolean) => void;
  toggleAiStatus: (conversationId: string, isAutomated: boolean) => void;
}

export const useConversationStore = create<ConversationState>((set) => ({
  conversations: [],
  activeConversationId: null,
  activeMessages: [],
  isLoading: false,
  searchQuery: '',
  activeFilterSource: 'All',
  activeTab: 'Conversation',
  isAiTyping: false,

  setConversations: (conversations) => set({ conversations }),
  setActiveConversationId: (activeConversationId) => set({ activeConversationId }),
  setActiveMessages: (activeMessages) => set({ activeMessages }),
  appendMessage: (message) =>
    set((state) => ({
      activeMessages: [...state.activeMessages, message],
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setActiveFilterSource: (activeFilterSource) => set({ activeFilterSource }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setAiTyping: (isAiTyping) => set({ isAiTyping }),
  toggleAiStatus: (conversationId, isAutomated) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId || c.leadId === conversationId
          ? {
              ...c,
              isAiAutomated: isAutomated,
              aiAgent: c.aiAgent ? { ...c.aiAgent, status: isAutomated ? 'Running' : 'Paused' } : undefined,
            }
          : c
      ),
    })),
}));
