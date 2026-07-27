import { Schema, model, Document, Types } from 'mongoose';

export type SystemRoleName = 'PLATFORM_OWNER' | 'CLIENT_ADMIN' | 'SALES_EXECUTIVE';

export interface IRoleDocument extends Document {
  name: SystemRoleName;
  description: string;
  permissions: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const RoleSchema = new Schema<IRoleDocument>(
  {
    name: {
      type: String,
      enum: ['PLATFORM_OWNER', 'CLIENT_ADMIN', 'SALES_EXECUTIVE'],
      required: true,
      unique: true,
    },
    description: { type: String, required: true },
    permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission' }],
  },
  { timestamps: true }
);

export const RoleModel = model<IRoleDocument>('Role', RoleSchema);
