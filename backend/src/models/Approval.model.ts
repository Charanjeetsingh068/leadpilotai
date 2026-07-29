import { Schema, model, Document, Types } from 'mongoose';

export interface IApprovalDocument extends Document {
  leadId: Types.ObjectId;
  conversationId: Types.ObjectId;
  pendingReplyText: string;
  reason: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Approved' | 'Rejected';
  rejectionReason?: string;
  confidenceScore: number;
  assignedSalespersonId?: Types.ObjectId;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

const ApprovalSchema = new Schema<IApprovalDocument>(
  {
    leadId: { type: Schema.Types.ObjectId, ref: 'Lead', required: true, index: true },
    conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
    pendingReplyText: { type: String, required: true },
    reason: { type: String, required: true },
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
      index: true,
    },
    rejectionReason: { type: String },
    confidenceScore: { type: Number, default: 80 },
    assignedSalespersonId: { type: Schema.Types.ObjectId, ref: 'User' },
    organizationId: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

export const ApprovalModel = model<IApprovalDocument>('Approval', ApprovalSchema);
