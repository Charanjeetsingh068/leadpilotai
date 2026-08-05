import { Schema, model, Document } from 'mongoose';

export interface IWhatsAppPhoneNumber {
  id: string;
  displayPhoneNumber: string;
  verifiedName?: string;
  qualityRating?: string;
}

export interface IWhatsAppTemplate {
  id: string;
  name: string;
  language: string;
  status: string;
  category: string;
}

export interface IWhatsAppBusinessDocument extends Document {
  workspaceId: string;
  companyId: string;
  userId: string;
  businessId: string;
  pageId?: string;
  wabaId: string;
  name: string;
  currency?: string;
  timezoneId?: string;
  phoneNumbers: IWhatsAppPhoneNumber[];
  templates?: IWhatsAppTemplate[];
  webhookStatus?: 'ACTIVE' | 'INACTIVE' | 'ERROR';
  messagingEnabled?: boolean;
  qualityRating?: string;
  lastSyncedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const WhatsAppBusinessSchema = new Schema<IWhatsAppBusinessDocument>(
  {
    workspaceId: { type: String, required: true, index: true },
    companyId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    businessId: { type: String, default: '', index: true },
    pageId: { type: String, default: '', index: true },
    wabaId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    currency: { type: String, default: 'USD' },
    timezoneId: { type: String, default: 'UTC' },
    phoneNumbers: [
      {
        id: { type: String, required: true },
        displayPhoneNumber: { type: String, required: true },
        verifiedName: { type: String, default: '' },
        qualityRating: { type: String, default: 'GREEN' },
      },
    ],
    templates: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        language: { type: String, default: 'en_US' },
        status: { type: String, default: 'APPROVED' },
        category: { type: String, default: 'MARKETING' },
      },
    ],
    webhookStatus: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'ERROR'],
      default: 'ACTIVE',
    },
    messagingEnabled: { type: Boolean, default: true },
    qualityRating: { type: String, default: 'GREEN' },
    lastSyncedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

WhatsAppBusinessSchema.index({ workspaceId: 1, wabaId: 1 }, { unique: true });

export const WhatsAppBusinessModel = model<IWhatsAppBusinessDocument>('WhatsAppBusiness', WhatsAppBusinessSchema);
