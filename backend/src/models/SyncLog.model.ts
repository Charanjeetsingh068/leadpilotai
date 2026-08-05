import { Schema, model, Document } from 'mongoose';

export interface ISyncLogDocument extends Document {
  workspaceId: string;
  companyId: string;
  userId: string;
  businessId?: string;
  pageId?: string;
  syncType: 'FULL' | 'PAGES' | 'FORMS' | 'TOKENS' | 'INSTAGRAM' | 'WHATSAPP' | 'ASSETS' | 'AD_ACCOUNTS';
  status: 'SUCCESS' | 'PARTIAL' | 'FAILED';
  itemsProcessed: number;
  errorDetails?: string;
  durationMs: number;
  createdAt: Date;
  updatedAt: Date;
}

const SyncLogSchema = new Schema<ISyncLogDocument>(
  {
    workspaceId: { type: String, required: true, index: true },
    companyId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    businessId: { type: String, default: '', index: true },
    pageId: { type: String, default: '', index: true },
    syncType: {
      type: String,
      enum: ['FULL', 'PAGES', 'FORMS', 'TOKENS', 'INSTAGRAM', 'WHATSAPP', 'ASSETS', 'AD_ACCOUNTS'],
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['SUCCESS', 'PARTIAL', 'FAILED'],
      required: true,
      index: true,
    },
    itemsProcessed: { type: Number, default: 0 },
    errorDetails: { type: String, default: '' },
    durationMs: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const SyncLogModel = model<ISyncLogDocument>('SyncLog', SyncLogSchema);
