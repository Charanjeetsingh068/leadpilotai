import { Schema, model, Document, Types } from 'mongoose';
import { SystemRoleName } from './Role.model';

export interface IUserDocument extends Document {
  email: string;
  passwordHash: string;
  name: string;
  role: SystemRoleName;
  roleId?: Types.ObjectId;
  organizationId: string;
  isActive: boolean;
  lastLoginAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    role: {
      type: String,
      enum: ['PLATFORM_OWNER', 'CLIENT_ADMIN', 'SALES_EXECUTIVE'],
      default: 'CLIENT_ADMIN',
    },
    roleId: { type: Schema.Types.ObjectId, ref: 'Role' },
    organizationId: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
  },
  { timestamps: true }
);

export const UserModel = model<IUserDocument>('User', UserSchema);
