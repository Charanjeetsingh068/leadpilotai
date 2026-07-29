import { prisma } from '../config/database';
import { TimelineEventType, LeadStatus } from '../enums/lead.enums';

export class ApprovalService {
  public async ensureSeedApprovals(organizationId: string): Promise<void> {
    // Seeding is handled dynamically by seedInitialData() in PostgreSQL
  }

  public async getApprovals(organizationId: string, query: any) {
    const { status, priority, reason, search, sort = 'newest', page = 1, limit = 10 } = query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};

    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (reason && reason !== 'All Reasons') where.reason = reason;

    if (search) {
      where.OR = [
        { lead: { name: { contains: search, mode: 'insensitive' } } },
        { lead: { phone: { contains: search, mode: 'insensitive' } } },
        { reason: { contains: search, mode: 'insensitive' } },
      ];
    }

    const sortOrder = sort === 'oldest' ? 'asc' : 'desc';

    const [items, total] = await Promise.all([
      prisma.humanApproval.findMany({
        where,
        include: {
          lead: {
            include: {
              assignedSalesUser: true,
            },
          },
          conversation: {
            include: {
              aiAgent: true,
            },
          },
        },
        orderBy: { createdAt: sortOrder },
        skip,
        take: Number(limit),
      }),
      prisma.humanApproval.count({ where }),
    ]);

    const mappedItems = items.map((item) => ({
      _id: item.id,
      id: item.id,
      leadId: {
        _id: item.lead.id,
        name: item.lead.name,
        phone: item.lead.phone,
        email: item.lead.email,
        source: item.lead.sourceName || 'MANUAL_ENTRY',
        project: item.lead.project,
        industry: item.lead.industry,
        budget: item.lead.budget,
        location: item.lead.location,
        qualificationScore: item.lead.qualificationScore,
      },
      conversationId: {
        _id: item.conversation.id,
        isAiAutomated: item.conversation.isAiAutomated,
        assignedSalesperson: item.lead.assignedSalesUser ? {
          name: item.lead.assignedSalesUser.name,
          avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
        } : null,
        aiSummary: {
          intent: 'Interested in properties.',
          recommendedAction: item.reason,
          leadScore: item.lead.qualificationScore,
        },
      },
      pendingReplyText: item.pendingReplyText,
      reason: item.reason,
      priority: item.priority,
      status: item.status,
      confidenceScore: item.confidenceScore,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));

    return {
      items: mappedItems,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  public async getApprovalById(organizationId: string, id: string) {
    if (!id || id.length !== 36) return null;
    const item = await prisma.humanApproval.findFirst({
      where: { id },
      include: {
        lead: {
          include: {
            assignedSalesUser: true,
          },
        },
        conversation: true,
      },
    });

    if (!item) return null;
    return {
      _id: item.id,
      id: item.id,
      leadId: {
        _id: item.lead.id,
        name: item.lead.name,
        phone: item.lead.phone,
        email: item.lead.email,
        source: item.lead.sourceName || 'MANUAL_ENTRY',
        project: item.lead.project,
        industry: item.lead.industry,
        budget: item.lead.budget,
        location: item.lead.location,
        qualificationScore: item.lead.qualificationScore,
      },
      conversationId: {
        _id: item.conversation.id,
        isAiAutomated: item.conversation.isAiAutomated,
        assignedSalesperson: item.lead.assignedSalesUser ? {
          name: item.lead.assignedSalesUser.name,
          avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
        } : null,
        aiSummary: {
          intent: 'Interested in properties.',
          recommendedAction: item.reason,
          leadScore: item.lead.qualificationScore,
        },
      },
      pendingReplyText: item.pendingReplyText,
      reason: item.reason,
      priority: item.priority,
      status: item.status,
      confidenceScore: item.confidenceScore,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }

  public async approve(organizationId: string, id: string, actorId?: any) {
    if (!id || id.length !== 36) return false;
    const approval = await prisma.humanApproval.findFirst({ where: { id } });
    if (!approval || approval.status !== 'Pending') return false;

    await prisma.humanApproval.update({
      where: { id },
      data: { status: 'Approved' },
    });

    await prisma.message.create({
      data: {
        conversationId: approval.conversationId,
        sender: 'AI',
        senderName: 'LeadPilot AI',
        content: approval.pendingReplyText,
        status: 'SENT',
      },
    });

    await prisma.conversation.update({
      where: { id: approval.conversationId },
      data: {
        lastMessageContent: approval.pendingReplyText,
        lastMessageAt: new Date(),
        pendingAiReply: null,
      },
    });

    await prisma.lead.update({
      where: { id: approval.leadId },
      data: { status: 'AI_IN_PROGRESS' },
    });

    await prisma.activityLog.create({
      data: {
        leadId: approval.leadId,
        userId: actorId && actorId.length === 36 ? actorId : undefined,
        eventType: 'STATUS_UPDATED',
        title: 'AI Reply Approved',
        description: 'AI recommendation approved and dispatched via WhatsApp.',
        actorType: 'AGENT',
      },
    });

    return true;
  }

  public async reject(organizationId: string, id: string, reason: string, actorId?: any) {
    if (!id || id.length !== 36) return false;
    const approval = await prisma.humanApproval.findFirst({ where: { id } });
    if (!approval || approval.status !== 'Pending') return false;

    await prisma.humanApproval.update({
      where: { id },
      data: { status: 'Rejected', rejectionReason: reason },
    });

    const conv = await prisma.conversation.findUnique({ where: { id: approval.conversationId } });
    if (conv) {
      await prisma.conversation.update({
        where: { id: conv.id },
        data: {
          isAiAutomated: false,
          pendingAiReply: null,
        },
      });

      if (conv.aiAgentId) {
        await prisma.aIAgent.update({
          where: { id: conv.aiAgentId },
          data: { status: 'Paused' },
        });
      }
    }

    await prisma.activityLog.create({
      data: {
        leadId: approval.leadId,
        userId: actorId && actorId.length === 36 ? actorId : undefined,
        eventType: 'HUMAN_ESCALATION',
        title: 'AI Reply Rejected',
        description: `AI reply rejected. Reason: ${reason}. AI Autopilot paused.`,
        actorType: 'AGENT',
      },
    });

    return true;
  }

  public async editAndSend(organizationId: string, id: string, newText: string, actorId?: any) {
    if (!id || id.length !== 36) return false;
    const approval = await prisma.humanApproval.findFirst({ where: { id } });
    if (!approval || approval.status !== 'Pending') return false;

    await prisma.humanApproval.update({
      where: { id },
      data: { pendingReplyText: newText, status: 'Approved' },
    });

    await prisma.message.create({
      data: {
        conversationId: approval.conversationId,
        sender: 'AGENT',
        senderName: 'Sales Agent',
        content: newText,
        status: 'SENT',
      },
    });

    await prisma.conversation.update({
      where: { id: approval.conversationId },
      data: {
        lastMessageContent: newText,
        lastMessageAt: new Date(),
        pendingAiReply: null,
      },
    });

    await prisma.activityLog.create({
      data: {
        leadId: approval.leadId,
        userId: actorId && actorId.length === 36 ? actorId : undefined,
        eventType: 'STATUS_UPDATED',
        title: 'AI Reply Edited & Sent',
        description: `Custom reply sent: "${newText.substring(0, 40)}..."`,
        actorType: 'AGENT',
      },
    });

    return true;
  }

  public async assignToSales(
    organizationId: string,
    id: string,
    salesUserId: string,
    salesUserName: string,
    actorId?: any
  ) {
    if (!id || id.length !== 36) return false;
    const approval = await prisma.humanApproval.findFirst({ where: { id } });
    if (!approval) return false;

    const parsedSalesUserId = salesUserId && salesUserId.length === 36 ? salesUserId : null;
    await prisma.humanApproval.update({
      where: { id },
      data: { assignedSalespersonId: parsedSalesUserId },
    });

    if (parsedSalesUserId) {
      await prisma.lead.update({
        where: { id: approval.leadId },
        data: { assignedSalesUserId: parsedSalesUserId },
      });
    }

    await prisma.activityLog.create({
      data: {
        leadId: approval.leadId,
        userId: actorId && actorId.length === 36 ? actorId : undefined,
        eventType: 'LEAD_ASSIGNED',
        title: 'Lead Re-assigned',
        description: `Conversation assigned to ${salesUserName}.`,
        actorType: 'AGENT',
      },
    });

    return true;
  }

  public async pauseAi(organizationId: string, id: string, actorId?: any) {
    if (!id || id.length !== 36) return false;
    const approval = await prisma.humanApproval.findFirst({ where: { id } });
    if (!approval) return false;

    const conv = await prisma.conversation.findUnique({ where: { id: approval.conversationId } });
    if (conv) {
      await prisma.conversation.update({
        where: { id: conv.id },
        data: { isAiAutomated: false },
      });

      if (conv.aiAgentId) {
        await prisma.aIAgent.update({
          where: { id: conv.aiAgentId },
          data: { status: 'Paused' },
        });
      }
    }

    await prisma.activityLog.create({
      data: {
        leadId: approval.leadId,
        userId: actorId && actorId.length === 36 ? actorId : undefined,
        eventType: 'STATUS_UPDATED',
        title: 'AI Autopilot Paused',
        description: 'AI autopilot paused by agent.',
        actorType: 'AGENT',
      },
    });

    return true;
  }
}
