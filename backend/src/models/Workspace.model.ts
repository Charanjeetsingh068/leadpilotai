import { Schema, model, Document } from 'mongoose';

export interface IWorkspaceDocument extends Document {
  companyId: string;
  name: string;
  slug?: string;
  description?: string;
  isActive: boolean;
  settings?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const WorkspaceSchema = new Schema<IWorkspaceDocument>(
  {
    companyId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, lowercase: true, trim: true, default: '' },
    description: { type: String, default: '' },
    isActive: { type: Boolean, default: true, index: true },
    settings: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const WorkspaceModel = model<IWorkspaceDocument>('Workspace', WorkspaceSchema);
