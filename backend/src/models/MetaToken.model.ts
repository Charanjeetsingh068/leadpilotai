import { Schema, model, Document } from 'mongoose';

export interface IMetaTokenDocument extends Document {
  workspaceId: string;
  companyId: string;
  userId: string;
  businessId?: string;
  pageId?: string;
  fbUserId: string;
  tokenType: 'USER_SHORT' | 'USER_LONG' | 'PAGE';
  encryptedToken: string;
  iv?: string;
  authTag?: string;
  expiresAt?: Date;
  scopes: string[];
  status: 'ACTIVE' | 'REVOKED' | 'EXPIRED';
  isHealthy: boolean;
  lastRefreshedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MetaTokenSchema = new Schema<IMetaTokenDocument>(
  {
    workspaceId: { type: String, required: true, index: true },
    companyId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    businessId: { type: String, default: '', index: true },
    pageId: { type: String, default: '', index: true },
    fbUserId: { type: String, required: true, index: true },
    tokenType: {
      type: String,
      enum: ['USER_SHORT', 'USER_LONG', 'PAGE'],
      default: 'USER_LONG',
      index: true,
    },
    encryptedToken: { type: String, required: true },
    iv: { type: String, default: '' },
    authTag: { type: String, default: '' },
    expiresAt: { type: Date, index: true },
    scopes: [{ type: String }],
    status: {
      type: String,
      enum: ['ACTIVE', 'REVOKED', 'EXPIRED'],
      default: 'ACTIVE',
      index: true,
    },
    isHealthy: { type: Boolean, default: true, index: true },
    lastRefreshedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

MetaTokenSchema.index({ workspaceId: 1, fbUserId: 1, tokenType: 1 });

export const MetaTokenModel = model<IMetaTokenDocument>('MetaToken', MetaTokenSchema);
