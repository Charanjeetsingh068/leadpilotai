import { create } from 'zustand';
import { Conversation, WhatsAppMessage } from '@/types/conversation.types';

interface ConversationState {
  conversations: Conversation[];
  activeConversationId: string | null;
  activeMessages: WhatsAppMessage[];
  isLoading: boolean;

  setConversations: (conversations: Conversation[]) => void;
  setActiveConversationId: (id: string | null) => void;
  setActiveMessages: (messages: WhatsAppMessage[]) => void;
  appendMessage: (message: WhatsAppMessage) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useConversationStore = create<ConversationState>((set) => ({
  conversations: [],
  activeConversationId: null,
  activeMessages: [],
  isLoading: false,

  setConversations: (conversations) => set({ conversations }),
  setActiveConversationId: (activeConversationId) => set({ activeConversationId }),
  setActiveMessages: (activeMessages) => set({ activeMessages }),
  appendMessage: (message) =>
    set((state) => ({
      activeMessages: [...state.activeMessages, message],
    })),
  setLoading: (isLoading) => set({ isLoading }),
}));
