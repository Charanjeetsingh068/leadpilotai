import { Schema, model, Document } from 'mongoose';

export interface IInstagramAccountDocument extends Document {
  workspaceId: string;
  companyId: string;
  userId: string;
  businessId: string;
  pageId: string;
  instagramId: string;
  username: string;
  name?: string;
  profilePictureUrl?: string;
  followersCount?: number;
  mediaCount?: number;
  insights?: Record<string, any>;
  messagingEnabled?: boolean;
  permissions?: string[];
  lastSyncedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const InstagramAccountSchema = new Schema<IInstagramAccountDocument>(
  {
    workspaceId: { type: String, required: true, index: true },
    companyId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    businessId: { type: String, default: '', index: true },
    pageId: { type: String, default: '', index: true },
    instagramId: { type: String, required: true, index: true },
    username: { type: String, required: true, trim: true },
    name: { type: String, default: '' },
    profilePictureUrl: { type: String, default: '' },
    followersCount: { type: Number, default: 0 },
    mediaCount: { type: Number, default: 0 },
    insights: { type: Schema.Types.Mixed, default: {} },
    messagingEnabled: { type: Boolean, default: true },
    permissions: [{ type: String }],
    lastSyncedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

InstagramAccountSchema.index({ workspaceId: 1, instagramId: 1 }, { unique: true });

export const InstagramAccountModel = model<IInstagramAccountDocument>('InstagramAccount', InstagramAccountSchema);
