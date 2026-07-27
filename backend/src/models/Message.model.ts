import { Schema, model, Document, Types } from 'mongoose';

export type MessageSender = 'LEAD' | 'AI' | 'AGENT' | 'SYSTEM';
export type MessageStatus = 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';

export interface IMessageDocument extends Document {
  conversationId: Types.ObjectId;
  leadId: Types.ObjectId;
  organizationId: string;
  sender: MessageSender;
  senderName?: string;
  content: string;
  mediaUrl?: string;
  status: MessageStatus;
  aiMetadata?: {
    intent?: string;
    confidenceScore?: number;
    ragDocumentUsed?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessageDocument>(
  {
    conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
    leadId: { type: Schema.Types.ObjectId, ref: 'Lead', required: true, index: true },
    organizationId: { type: String, required: true, index: true },
    sender: {
      type: String,
      enum: ['LEAD', 'AI', 'AGENT', 'SYSTEM'],
      required: true,
    },
    senderName: { type: String },
    content: { type: String, required: true },
    mediaUrl: { type: String },
    status: {
      type: String,
      enum: ['SENT', 'DELIVERED', 'READ', 'FAILED'],
      default: 'SENT',
    },
    aiMetadata: {
      intent: { type: String },
      confidenceScore: { type: Number },
      ragDocumentUsed: { type: String },
    },
  },
  { timestamps: true }
);

export const MessageModel = model<IMessageDocument>('Message', MessageSchema);
