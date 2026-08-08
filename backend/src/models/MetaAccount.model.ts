import { Schema, model, Document } from 'mongoose';

export interface IMetaAccountDocument extends Document {
  workspaceId: string;
  companyId: string;
  userId: string;
  businessId?: string;
  pageId?: string;
  fbUserId: string;
  fbUserName: string;
  fbUserEmail?: string;
  fbPictureUrl?: string;
  tokenStatus: 'VALID' | 'EXPIRING_SOON' | 'EXPIRED' | 'PERMISSIONS_MISSING' | 'REVOKED' | 'RECONNECT_REQUIRED';
  status?: string;
  grantedPermissions: string[];
  missingPermissions: string[];
  configId?: string;
  lastSyncedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MetaAccountSchema = new Schema<IMetaAccountDocument>(
  {
    workspaceId: { type: String, required: true, index: true },
    companyId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    businessId: { type: String, default: '', index: true },
    pageId: { type: String, default: '', index: true },
    fbUserId: { type: String, required: true, index: true },
    fbUserName: { type: String, required: true, trim: true },
    fbUserEmail: { type: String, lowercase: true, trim: true, default: '' },
    fbPictureUrl: { type: String, default: '' },
    tokenStatus: {
      type: String,
      enum: ['VALID', 'EXPIRING_SOON', 'EXPIRED', 'PERMISSIONS_MISSING', 'REVOKED', 'RECONNECT_REQUIRED'],
      default: 'VALID',
      index: true,
    },
    status: { type: String, default: 'CONNECTED' },
    grantedPermissions: { type: [String], default: [] },
    missingPermissions: { type: [String], default: [] },
    configId: { type: String, default: '' },
    lastSyncedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

MetaAccountSchema.index({ workspaceId: 1, fbUserId: 1 }, { unique: true });

export const MetaAccountModel = model<IMetaAccountDocument>('MetaAccount', MetaAccountSchema);
