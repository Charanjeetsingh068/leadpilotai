import { Schema, model, Document } from 'mongoose';

export interface IWebhookSubscriptionDocument extends Document {
  workspaceId: string;
  companyId: string;
  userId: string;
  businessId?: string;
  pageId?: string;
  targetId: string;
  targetType: 'PAGE' | 'WABA' | 'INSTAGRAM' | 'APP';
  subscribedFields: string[];
  status: 'ACTIVE' | 'FAILED' | 'INACTIVE';
  verifyToken?: string;
  retryCount?: number;
  lastRetryAt?: Date;
  callbackUrl?: string;
  subscribedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const WebhookSubscriptionSchema = new Schema<IWebhookSubscriptionDocument>(
  {
    workspaceId: { type: String, required: true, index: true },
    companyId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    businessId: { type: String, default: '', index: true },
    pageId: { type: String, default: '', index: true },
    targetId: { type: String, required: true, index: true },
    targetType: {
      type: String,
      enum: ['PAGE', 'WABA', 'INSTAGRAM', 'APP'],
      default: 'PAGE',
    },
    subscribedFields: [{ type: String }],
    status: {
      type: String,
      enum: ['ACTIVE', 'FAILED', 'INACTIVE'],
      default: 'ACTIVE',
      index: true,
    },
    verifyToken: { type: String, default: '' },
    retryCount: { type: Number, default: 0 },
    lastRetryAt: { type: Date },
    callbackUrl: { type: String, default: '' },
    subscribedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

WebhookSubscriptionSchema.index({ workspaceId: 1, targetId: 1 }, { unique: true });

export const WebhookSubscriptionModel = model<IWebhookSubscriptionDocument>('WebhookSubscription', WebhookSubscriptionSchema);
