import { Schema, model, Document } from 'mongoose';

export interface IMetaPermissionDocument extends Document {
  workspaceId: string;
  companyId: string;
  userId: string;
  fbUserId: string;
  permission: string;
  status: 'GRANTED' | 'MISSING' | 'REVOKED' | 'EXPIRED';
  description?: string;
  lastVerifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MetaPermissionSchema = new Schema<IMetaPermissionDocument>(
  {
    workspaceId: { type: String, required: true, index: true },
    companyId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    fbUserId: { type: String, required: true, index: true },
    permission: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: ['GRANTED', 'MISSING', 'REVOKED', 'EXPIRED'],
      default: 'GRANTED',
      index: true,
    },
    description: { type: String, default: '' },
    lastVerifiedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

MetaPermissionSchema.index({ workspaceId: 1, fbUserId: 1, permission: 1 }, { unique: true });

export const MetaPermissionModel = model<IMetaPermissionDocument>('MetaPermission', MetaPermissionSchema);
