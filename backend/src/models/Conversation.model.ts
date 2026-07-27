import { Schema, model, Document, Types } from 'mongoose';

export interface IConversationDocument extends Document {
  leadId: Types.ObjectId;
  organizationId: string;
  isAiAutomated: boolean;
  unreadCount: number;
  lastMessageContent?: string;
  lastMessageAt?: Date;
  assignedAgentId?: Types.ObjectId;
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
  },
  { timestamps: true }
);

export const ConversationModel = model<IConversationDocument>('Conversation', ConversationSchema);
