import { Schema, model, Document } from 'mongoose';

export interface IPermissionDocument extends Document {
  name: string;        // e.g. 'leads:read', 'leads:write', 'conversations:manage'
  module: string;      // e.g. 'leads', 'conversations', 'knowledge', 'settings'
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const PermissionSchema = new Schema<IPermissionDocument>(
  {
    name: { type: String, required: true, unique: true },
    module: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

export const PermissionModel = model<IPermissionDocument>('Permission', PermissionSchema);
