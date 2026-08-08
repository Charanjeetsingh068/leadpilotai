import { Schema, model, Document } from 'mongoose';

export interface IAdAccountDocument extends Document {
  workspaceId: string;
  companyId: string;
  userId: string;
  businessId: string;
  adAccountId: string;
  name: string;
  currency?: string;
  timezoneName?: string;
  accountStatus?: number;
  amountSpent?: number;
  campaignsCount?: number;
  adSetsCount?: number;
  adsCount?: number;
  totalLeads?: number;
  campaigns?: Array<{
    id: string;
    name: string;
    status: string;
    objective?: string;
    spend?: number;
    leads?: number;
  }>;
  adSets?: Array<{
    id: string;
    name: string;
    status: string;
    dailyBudget?: number;
    lifetimeBudget?: number;
  }>;
  ads?: Array<{
    id: string;
    name: string;
    status: string;
    creativeName?: string;
  }>;
  insights?: Record<string, any>;
  lastSyncedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AdAccountSchema = new Schema<IAdAccountDocument>(
  {
    workspaceId: { type: String, required: true, index: true },
    companyId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    businessId: { type: String, default: '', index: true },
    adAccountId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    currency: { type: String, default: 'USD' },
    timezoneName: { type: String, default: 'UTC' },
    accountStatus: { type: Number, default: 1 },
    amountSpent: { type: Number, default: 0 },
    campaignsCount: { type: Number, default: 0 },
    adSetsCount: { type: Number, default: 0 },
    adsCount: { type: Number, default: 0 },
    totalLeads: { type: Number, default: 0 },
    campaigns: [{ type: Schema.Types.Mixed }],
    adSets: [{ type: Schema.Types.Mixed }],
    ads: [{ type: Schema.Types.Mixed }],
    insights: { type: Schema.Types.Mixed, default: {} },
    lastSyncedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

AdAccountSchema.index({ workspaceId: 1, adAccountId: 1 }, { unique: true });

export const AdAccountModel = model<IAdAccountDocument>('AdAccount', AdAccountSchema);
