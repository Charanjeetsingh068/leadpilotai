import { Schema, model, Document, Types } from 'mongoose';

export interface ILeadAssignmentDocument extends Document {
  leadId: Types.ObjectId;
  assignedFrom?: Types.ObjectId;
  assignedTo: Types.ObjectId;
  assignedBy: Types.ObjectId;
  reason?: string;
  createdAt: Date;
}

const LeadAssignmentSchema = new Schema<ILeadAssignmentDocument>(
  {
    leadId: { type: Schema.Types.ObjectId, ref: 'Lead', required: true, index: true },
    assignedFrom: { type: Schema.Types.ObjectId, ref: 'User' },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assignedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const LeadAssignmentModel = model<ILeadAssignmentDocument>('LeadAssignment', LeadAssignmentSchema);
