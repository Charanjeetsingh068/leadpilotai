import { Schema, model, Document } from 'mongoose';

export interface IActivityLogDocument extends Document {
  workspaceId: string;
  companyId: string;
  userId: string;
  businessId?: string;
  pageId?: string;
  action: string;
  actorType: 'USER' | 'SYSTEM' | 'WEBHOOK';
  description: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const ActivityLogSchema = new Schema<IActivityLogDocument>(
  {
    workspaceId: { type: String, required: true, index: true },
    companyId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    businessId: { type: String, default: '', index: true },
    pageId: { type: String, default: '', index: true },
    action: { type: String, required: true, index: true },
    actorType: {
      type: String,
      enum: ['USER', 'SYSTEM', 'WEBHOOK'],
      default: 'SYSTEM',
    },
    description: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const ActivityLogModel = model<IActivityLogDocument>('ActivityLog', ActivityLogSchema);
