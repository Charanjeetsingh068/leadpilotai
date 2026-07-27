import { Schema, model, Document, Types } from 'mongoose';

export interface ILeadNotesDocument extends Document {
  leadId: Types.ObjectId;
  authorId: Types.ObjectId;
  noteText: string;
  createdAt: Date;
  updatedAt: Date;
}

const LeadNotesSchema = new Schema<ILeadNotesDocument>(
  {
    leadId: { type: Schema.Types.ObjectId, ref: 'Lead', required: true, index: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    noteText: { type: String, required: true },
  },
  { timestamps: true }
);

export const LeadNotesModel = model<ILeadNotesDocument>('LeadNotes', LeadNotesSchema);
