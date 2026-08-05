import { Schema, model, Document } from 'mongoose';

export interface ICompanyDocument extends Document {
  name: string;
  domain?: string;
  plan?: string;
  metaBusinessManagerId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema = new Schema<ICompanyDocument>(
  {
    name: { type: String, required: true, trim: true },
    domain: { type: String, lowercase: true, trim: true, default: '' },
    plan: { type: String, default: 'ENTERPRISE' },
    metaBusinessManagerId: { type: String, default: '312449849278509', index: true },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const CompanyModel = model<ICompanyDocument>('Company', CompanySchema);
