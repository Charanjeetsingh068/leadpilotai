import { Schema, model, Document, Types } from 'mongoose';

export interface ILeadActivityDocument extends Document {
  leadId: Types.ObjectId;
  activityType: 'CALL' | 'WHATSAPP_MESSAGE' | 'EMAIL' | 'NOTE' | 'STATUS_CHANGE';
  summary: string;
  details?: string;
  performedBy?: Types.ObjectId;
  createdAt: Date;
}

const LeadActivitySchema = new Schema<ILeadActivityDocument>(
  {
    leadId: { type: Schema.Types.ObjectId, ref: 'Lead', required: true, index: true },
    activityType: {
      type: String,
      enum: ['CALL', 'WHATSAPP_MESSAGE', 'EMAIL', 'NOTE', 'STATUS_CHANGE'],
      required: true,
    },
    summary: { type: String, required: true },
    details: { type: String },
    performedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const LeadActivityModel = model<ILeadActivityDocument>('LeadActivity', LeadActivitySchema);
