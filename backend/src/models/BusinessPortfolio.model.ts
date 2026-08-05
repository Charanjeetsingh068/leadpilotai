import { Schema, model, Document } from 'mongoose';

export interface IBusinessPortfolioDocument extends Document {
  workspaceId: string;
  companyId: string;
  userId: string;
  businessId: string;
  pageId?: string;
  name: string;
  verificationStatus?: string;
  primaryPageId?: string;
  vertical?: string;
  createdTime?: Date;
  lastSyncedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BusinessPortfolioSchema = new Schema<IBusinessPortfolioDocument>(
  {
    workspaceId: { type: String, required: true, index: true },
    companyId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    businessId: { type: String, required: true, index: true },
    pageId: { type: String, default: '', index: true },
    name: { type: String, required: true, trim: true },
    verificationStatus: { type: String, default: 'not_verified' },
    primaryPageId: { type: String, default: '' },
    vertical: { type: String, default: '' },
    createdTime: { type: Date },
    lastSyncedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

BusinessPortfolioSchema.index({ workspaceId: 1, businessId: 1 }, { unique: true });

export const BusinessPortfolioModel = model<IBusinessPortfolioDocument>('BusinessPortfolio', BusinessPortfolioSchema);
