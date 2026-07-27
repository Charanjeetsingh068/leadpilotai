import { LeadTimelineModel, ILeadTimelineDocument } from '../models/LeadTimeline.model';
import { TimelineEventType } from '../enums/lead.enums';

export class LeadTimelineRepository {
  async logEvent(
    leadId: string,
    eventType: TimelineEventType,
    title: string,
    description: string,
    actorType: 'AI' | 'AGENT' | 'SYSTEM' | 'CUSTOMER' = 'SYSTEM',
    actorId?: string,
    metadata?: Record<string, unknown>
  ): Promise<ILeadTimelineDocument> {
    return LeadTimelineModel.create({
      leadId,
      eventType,
      title,
      description,
      actorType,
      actorId,
      metadata,
    });
  }

  async findByLeadId(leadId: string, limit = 50): Promise<ILeadTimelineDocument[]> {
    return LeadTimelineModel.find({ leadId }).sort({ createdAt: -1 }).limit(limit);
  }
}
