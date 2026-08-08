import { Schema, model, Document } from 'mongoose';

export interface IBusinessAssetDocument extends Document {
  workspaceId: string;
  companyId: string;
  userId: string;
  businessId: string;
  pageId?: string;
  assetId: string;
  assetType: 'AD_ACCOUNT' | 'PIXEL' | 'DATASET' | 'CATALOG' | 'SYSTEM_USER';
  name: string;
  details: Record<string, any>;
  lastSyncedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BusinessAssetSchema = new Schema<IBusinessAssetDocument>(
  {
    workspaceId: { type: String, required: true, index: true },
    companyId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    businessId: { type: String, required: true, index: true },
    pageId: { type: String, default: '', index: true },
    assetId: { type: String, required: true, index: true },
    assetType: {
      type: String,
      enum: ['AD_ACCOUNT', 'PIXEL', 'DATASET', 'CATALOG', 'SYSTEM_USER'],
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    details: { type: Schema.Types.Mixed, default: {} },
    lastSyncedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

BusinessAssetSchema.index({ workspaceId: 1, assetId: 1, assetType: 1 }, { unique: true });

export const BusinessAssetModel = model<IBusinessAssetDocument>('BusinessAsset', BusinessAssetSchema);
