import { Schema, model, Document, Types } from 'mongoose';
import { LeadSource, LeadStatus } from '../enums/lead.enums';

export interface ILeadDocument extends Document {
  name: string;
  phone: string;
  email?: string;
  source: LeadSource;
  campaign?: string;
  project?: string;
  industry?: string;
  budget?: string;
  timeline?: string;
  location?: string;
  status: LeadStatus;
  aiStatus?: string;
  humanStatus?: string;
  qualificationScore: number;
  currentAiAgent?: string;
  assignedSalesUser?: Types.ObjectId;
  organizationId: string;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILeadDocument>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true, index: true },
    email: { type: String, lowercase: true, trim: true, index: true },
    source: {
      type: String,
      enum: Object.values(LeadSource),
      default: LeadSource.MANUAL_ENTRY,
      required: true,
      index: true,
    },
    campaign: { type: String, trim: true },
    project: { type: String, trim: true, index: true },
    industry: { type: String, trim: true, index: true },
    budget: { type: String, trim: true },
    timeline: { type: String, trim: true },
    location: { type: String, trim: true },
    status: {
      type: String,
      enum: Object.values(LeadStatus),
      default: LeadStatus.NEW,
      required: true,
      index: true,
    },
    aiStatus: { type: String, default: 'IDLE' },
    humanStatus: { type: String, default: 'UNASSIGNED' },
    qualificationScore: { type: Number, default: 0, min: 0, max: 100 },
    currentAiAgent: { type: String, default: 'LeadPilot-Bot-v1' },
    assignedSalesUser: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    organizationId: { type: String, required: true, index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

export const LeadModel = model<ILeadDocument>('Lead', LeadSchema);
