import { prisma } from '../config/database';
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
  ): Promise<any> {
    // Check if actorId is a valid UUID before assigning to userId relation
    const userId = actorId && actorId.length === 36 ? actorId : undefined;

    return prisma.activityLog.create({
      data: {
        leadId,
        eventType,
        title,
        description,
        actorType,
        userId,
      },
    });
  }

  async findByLeadId(leadId: string, limit = 50): Promise<any[]> {
    // Check if leadId is a valid UUID
    if (!leadId || leadId.length !== 36) return [];

    return prisma.activityLog.findMany({
      where: { leadId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
