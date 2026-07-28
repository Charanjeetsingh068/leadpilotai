import { Schema, model, Document, Types } from 'mongoose';

export interface IAISummary {
  intent: string;
  budget: string;
  project: string;
  timeline: string;
  loan: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  leadScore: number;
  recommendedAction: string;
  buyingProbability?: string;
  confidenceScore?: number;
}

export interface IAIAgentInfo {
  name: string;
  industry: string;
  model: string;
  status: 'Running' | 'Paused';
}

export interface IRecentAIAction {
  id: string;
  action: string;
  timestamp: string;
  iconType?: string;
}

export interface IConversationDocument extends Document {
  leadId: Types.ObjectId;
  organizationId: string;
  isAiAutomated: boolean;
  unreadCount: number;
  lastMessageContent?: string;
  lastMessageAt?: Date;
  assignedAgentId?: Types.ObjectId;
  assignedSalesperson?: {
    name: string;
    avatarUrl?: string;
    role?: string;
  };
  leadSource?: 'Facebook Lead' | 'Instagram Lead' | 'Google Ads' | 'Website Lead' | 'Manual Lead';
  status?: 'Active' | 'Waiting' | 'Closed';
  pinned?: boolean;
  archived?: boolean;
  aiSummary?: IAISummary;
  aiAgent?: IAIAgentInfo;
  recentAiActions?: IRecentAIAction[];
  pendingAiReply?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversationDocument>(
  {
    leadId: { type: Schema.Types.ObjectId, ref: 'Lead', required: true, index: true },
    organizationId: { type: String, required: true, index: true },
    isAiAutomated: { type: Boolean, default: true },
    unreadCount: { type: Number, default: 0 },
    lastMessageContent: { type: String },
    lastMessageAt: { type: Date, default: Date.now },
    assignedAgentId: { type: Schema.Types.ObjectId, ref: 'User' },
    assignedSalesperson: {
      name: { type: String },
      avatarUrl: { type: String },
      role: { type: String },
    },
    leadSource: {
      type: String,
      enum: ['Facebook Lead', 'Instagram Lead', 'Google Ads', 'Website Lead', 'Manual Lead'],
      default: 'Facebook Lead',
    },
    status: {
      type: String,
      enum: ['Active', 'Waiting', 'Closed'],
      default: 'Active',
    },
    pinned: { type: Boolean, default: false },
    archived: { type: Boolean, default: false },
    aiSummary: {
      intent: { type: String },
      budget: { type: String },
      project: { type: String },
      timeline: { type: String },
      loan: { type: String },
      sentiment: { type: String, default: 'Positive' },
      leadScore: { type: Number, default: 85 },
      recommendedAction: { type: String },
      buyingProbability: { type: String },
      confidenceScore: { type: Number },
    },
    aiAgent: {
      name: { type: String, default: 'Property Advisor Agent' },
      industry: { type: String, default: 'Real Estate' },
      model: { type: String, default: 'GPT-4o' },
      status: { type: String, enum: ['Running', 'Paused'], default: 'Running' },
    },
    recentAiActions: [
      {
        id: { type: String },
        action: { type: String },
        timestamp: { type: String },
        iconType: { type: String },
      },
    ],
    pendingAiReply: { type: String },
  },
  { timestamps: true }
);

export const ConversationModel = model<IConversationDocument>('Conversation', ConversationSchema);

