import { Schema, model, Document } from 'mongoose';

export interface ILeadWebhookDocument extends Document {
  workspaceId: string;
  companyId: string;
  userId: string;
  businessId?: string;
  pageId?: string;
  formId?: string;
  leadgenId: string;
  rawPayload: Record<string, any>;
  processed: boolean;
  status: 'RECEIVED' | 'PROCESSING' | 'PROCESSED' | 'FAILED';
  leadData?: Record<string, any>;
  errorDetails?: string;
  retryCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const LeadWebhookSchema = new Schema<ILeadWebhookDocument>(
  {
    workspaceId: { type: String, default: '', index: true },
    companyId: { type: String, default: '', index: true },
    userId: { type: String, default: '', index: true },
    businessId: { type: String, default: '', index: true },
    pageId: { type: String, default: '', index: true },
    formId: { type: String, default: '', index: true },
    leadgenId: { type: String, required: true, index: true },
    rawPayload: { type: Schema.Types.Mixed, required: true },
    processed: { type: Boolean, default: false, index: true },
    status: {
      type: String,
      enum: ['RECEIVED', 'PROCESSING', 'PROCESSED', 'FAILED'],
      default: 'RECEIVED',
      index: true,
    },
    leadData: { type: Schema.Types.Mixed, default: {} },
    errorDetails: { type: String, default: '' },
    retryCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const LeadWebhookModel = model<ILeadWebhookDocument>('LeadWebhook', LeadWebhookSchema);
