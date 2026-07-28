export type MessageSender = 'LEAD' | 'AI' | 'AGENT' | 'SYSTEM';
export type MessageStatus = 'SENT' | 'DELIVERED' | 'READ' | 'SEEN' | 'FAILED';
export type AttachmentType = 'IMAGE' | 'PDF' | 'VIDEO' | 'VOICE' | 'LOCATION' | 'CONTACT';

export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: MessageSender;
  senderName?: string;
  content: string;
  mediaUrl?: string;
  attachmentType?: AttachmentType;
  fileName?: string;
  fileSize?: string;
  status?: MessageStatus;
  timestamp: string;
  replyToMessageId?: string;
  aiMetadata?: {
    intent?: string;
    confidenceScore?: number;
    ragDocumentUsed?: string;
  };
}

export type WhatsAppMessage = ChatMessage;

export interface AISummary {
  intent: string;
  budget: string;
  project: string;
  timeline: string;
  loan: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative' | string;
  leadScore: number;
  recommendedAction: string;
  buyingProbability?: string;
  confidenceScore?: number;
}

export interface AIAgentInfo {
  name: string;
  industry: string;
  model: string;
  status: 'Running' | 'Paused';
}

export interface RecentAIAction {
  id: string;
  action: string;
  timestamp: string;
  iconType?: string;
}

export type LeadSource =
  | 'Facebook Lead'
  | 'Instagram Lead'
  | 'Google Ads'
  | 'Website Lead'
  | 'Manual Lead';

export type ConversationStatus = 'Active' | 'Waiting' | 'Closed';

export interface ConversationSummary {
  id: string;
  leadId: string;
  leadName: string;
  leadPhone: string;
  leadProject?: string;
  leadScore?: number;
  leadSource?: LeadSource;
  status?: ConversationStatus;
  isAiAutomated: boolean;
  unreadCount: number;
  lastMessageContent: string;
  lastMessageAt: string;
  assignedSalesperson?: {
    name: string;
    avatarUrl?: string;
    role?: string;
  };
  pinned?: boolean;
  archived?: boolean;
  aiSummary?: AISummary;
  aiAgent?: AIAgentInfo;
  recentAiActions?: RecentAIAction[];
  pendingAiReply?: string;
}

export type Conversation = ConversationSummary;

export interface ConversationDetail extends ConversationSummary {
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}
