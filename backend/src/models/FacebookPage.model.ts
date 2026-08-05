import { Schema, model, Document } from 'mongoose';

export interface IFacebookPageDocument extends Document {
  workspaceId: string;
  companyId: string;
  userId: string;
  businessId: string;
  pageId: string;
  name: string;
  category?: string;
  fanCount?: number;
  pictureUrl?: string;
  tasks?: string[];
  pageAccessToken?: string;
  isConnected: boolean;
  webhookStatus: 'SUBSCRIBED' | 'UNSUBSCRIBED' | 'ERROR';
  instagramBusinessAccountId?: string;
  lastSyncedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const FacebookPageSchema = new Schema<IFacebookPageDocument>(
  {
    workspaceId: { type: String, required: true, index: true },
    companyId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    businessId: { type: String, default: '', index: true },
    pageId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, default: '' },
    fanCount: { type: Number, default: 0 },
    pictureUrl: { type: String, default: '' },
    tasks: [{ type: String }],
    pageAccessToken: { type: String, default: '' },
    isConnected: { type: Boolean, default: true, index: true },
    webhookStatus: {
      type: String,
      enum: ['SUBSCRIBED', 'UNSUBSCRIBED', 'ERROR'],
      default: 'SUBSCRIBED',
    },
    instagramBusinessAccountId: { type: String, default: '' },
    lastSyncedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

FacebookPageSchema.index({ workspaceId: 1, pageId: 1 }, { unique: true });

export const FacebookPageModel = model<IFacebookPageDocument>('FacebookPage', FacebookPageSchema);
