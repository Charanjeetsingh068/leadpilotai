import { Schema, model, Document, Types } from 'mongoose';
import { TimelineEventType } from '../enums/lead.enums';

export interface ILeadTimelineDocument extends Document {
  leadId: Types.ObjectId;
  eventType: TimelineEventType;
  title: string;
  description: string;
  actorType: 'AI' | 'AGENT' | 'SYSTEM' | 'CUSTOMER';
  actorId?: Types.ObjectId;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

const LeadTimelineSchema = new Schema<ILeadTimelineDocument>(
  {
    leadId: { type: Schema.Types.ObjectId, ref: 'Lead', required: true, index: true },
    eventType: { type: String, enum: Object.values(TimelineEventType), required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    actorType: { type: String, enum: ['AI', 'AGENT', 'SYSTEM', 'CUSTOMER'], default: 'SYSTEM' },
    actorId: { type: Schema.Types.ObjectId, ref: 'User' },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const LeadTimelineModel = model<ILeadTimelineDocument>('LeadTimeline', LeadTimelineSchema);
