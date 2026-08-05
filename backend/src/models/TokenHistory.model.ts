import { Schema, model, Document } from 'mongoose';

export interface ITokenHistoryDocument extends Document {
  workspaceId: string;
  companyId: string;
  userId: string;
  businessId?: string;
  pageId?: string;
  fbUserId: string;
  eventType: 'EXCHANGE_SHORT_TO_LONG' | 'AUTO_REFRESH' | 'MANUAL_RECONNECT' | 'EXPIRATION_WARNING' | 'REVOKED';
  status: 'SUCCESS' | 'FAILED';
  expiresAt?: Date;
  details?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TokenHistorySchema = new Schema<ITokenHistoryDocument>(
  {
    workspaceId: { type: String, required: true, index: true },
    companyId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    businessId: { type: String, default: '', index: true },
    pageId: { type: String, default: '', index: true },
    fbUserId: { type: String, required: true, index: true },
    eventType: {
      type: String,
      enum: ['EXCHANGE_SHORT_TO_LONG', 'AUTO_REFRESH', 'MANUAL_RECONNECT', 'EXPIRATION_WARNING', 'REVOKED'],
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['SUCCESS', 'FAILED'],
      default: 'SUCCESS',
      index: true,
    },
    expiresAt: { type: Date },
    details: { type: String, default: '' },
  },
  { timestamps: true }
);

export const TokenHistoryModel = model<ITokenHistoryDocument>('TokenHistory', TokenHistorySchema);
