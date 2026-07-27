export type MessageSender = 'LEAD' | 'AI' | 'AGENT' | 'SYSTEM';
export type MessageStatus = 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';

export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: MessageSender;
  senderName?: string;
  content: string;
  mediaUrl?: string;
  status?: MessageStatus;
  timestamp: string;
  aiMetadata?: {
    intent?: string;
    confidenceScore?: number;
    ragDocumentUsed?: string;
  };
}

export type WhatsAppMessage = ChatMessage;

export interface ConversationSummary {
  id: string;
  leadId: string;
  leadName: string;
  leadPhone: string;
  leadProject?: string;
  leadScore?: number;
  isAiAutomated: boolean;
  unreadCount: number;
  lastMessageContent: string;
  lastMessageAt: string;
}

export type Conversation = ConversationSummary;

export interface ConversationDetail {
  id: string;
  leadId: string;
  leadName: string;
  leadPhone: string;
  isAiAutomated: boolean;
  unreadCount: number;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}
