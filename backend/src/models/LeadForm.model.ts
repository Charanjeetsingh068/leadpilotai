import { Schema, model, Document } from 'mongoose';

export interface ILeadFormQuestion {
  id: string;
  type: string;
  key?: string;
  label?: string;
  options?: string[];
}

export interface ILeadFormDocument extends Document {
  workspaceId: string;
  companyId: string;
  userId: string;
  businessId: string;
  pageId: string;
  formId: string;
  name: string;
  status: string;
  leadsCount: number;
  questions: ILeadFormQuestion[];
  campaignId?: string;
  campaignName?: string;
  isActive: boolean;
  assignedAiAgentId?: string;
  createdTime?: Date;
  lastSyncedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const LeadFormSchema = new Schema<ILeadFormDocument>(
  {
    workspaceId: { type: String, required: true, index: true },
    companyId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    businessId: { type: String, default: '', index: true },
    pageId: { type: String, required: true, index: true },
    formId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    status: { type: String, default: 'ACTIVE' },
    leadsCount: { type: Number, default: 0 },
    questions: [
      {
        id: { type: String },
        type: { type: String },
        key: { type: String },
        label: { type: String },
        options: [{ type: String }],
      },
    ],
    campaignId: { type: String, default: '', index: true },
    campaignName: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    assignedAiAgentId: { type: String, default: '' },
    createdTime: { type: Date },
    lastSyncedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

LeadFormSchema.index({ workspaceId: 1, formId: 1 }, { unique: true });

export const LeadFormModel = model<ILeadFormDocument>('LeadForm', LeadFormSchema);
