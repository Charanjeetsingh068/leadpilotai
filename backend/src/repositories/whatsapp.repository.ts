import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class WhatsAppRepository {
  async getConnection(agentId?: string) {
    const where: any = {};
    if (agentId && agentId.length === 36) {
      where.aiAgentId = agentId;
    }

    let conn = await prisma.whatsAppConnection.findFirst({ where });

    if (!conn) {
      const defaultAgent = agentId && agentId.length === 36
        ? await prisma.aIAgent.findUnique({ where: { id: agentId } })
        : await prisma.aIAgent.findFirst();

      conn = await prisma.whatsAppConnection.create({
        data: {
          phoneNumber: defaultAgent?.connectedWhatsapp || '+91 98765 43210',
          businessAccount: `${defaultAgent?.name || 'Acme Real Estate'} Business`,
          wabaId: '1029384756',
          status: 'Connected and Active',
          qualityRating: 'High',
          webhookUrl: 'https://app.leadpilotai.com/api/whatsapp/webhook/1029384756',
          verifyToken: 'leadpilot_verify_secret_102938',
          webhookStatus: 'Active',
          lastReceivedAt: new Date(),
          aiAgentId: defaultAgent?.id || null,
        },
      });
    }

    return conn;
  }

  async getTemplates(agentId?: string) {
    const where: any = {};
    if (agentId && agentId.length === 36) {
      const agent = await prisma.aIAgent.findUnique({ where: { id: agentId } });
      if (agent) where.aiAgentId = agent.id;
    }

    const count = await prisma.whatsAppTemplate.count({ where });
    if (count === 0) {
      const defaultAgent = await prisma.aIAgent.findFirst();
      const initialTemplates = [
        { name: 'lead_welcome', category: 'Marketing', language: 'English', bodyText: 'Welcome new lead! Hello {{1}}, thanks for reaching out.', status: 'Approved', qualityRating: 'High', aiAgentId: defaultAgent?.id },
        { name: 'property_list', category: 'Marketing', language: 'English', bodyText: 'Here is the property list matching your budget {{1}}.', status: 'Approved', qualityRating: 'High', aiAgentId: defaultAgent?.id },
        { name: 'site_visit_reminder', category: 'Utility', language: 'English', bodyText: 'Reminder: Site visit scheduled for {{1}} at {{2}}.', status: 'Approved', qualityRating: 'Medium', aiAgentId: defaultAgent?.id },
        { name: 'payment_plan', category: 'Marketing', language: 'English', bodyText: 'Detailed payment plan and schedule attached.', status: 'Approved', qualityRating: 'High', aiAgentId: defaultAgent?.id },
        { name: 'followup_message', category: 'Utility', language: 'English', bodyText: 'Hi {{1}}, checking in regarding your property inquiry.', status: 'Approved', qualityRating: 'High', aiAgentId: defaultAgent?.id },
      ];
      for (const t of initialTemplates) {
        await prisma.whatsAppTemplate.create({ data: t });
      }
    }

    return prisma.whatsAppTemplate.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  async createTemplate(data: any) {
    let agentId = data.aiAgentId;
    if (!agentId) {
      const defaultAgent = await prisma.aIAgent.findFirst();
      agentId = defaultAgent?.id;
    }

    return prisma.whatsAppTemplate.create({
      data: {
        name: data.name || `template_${Date.now()}`,
        category: data.category || 'Marketing',
        language: data.language || 'English',
        bodyText: data.bodyText || data.body || '',
        header: data.header || '',
        footer: data.footer || '',
        status: 'Approved',
        qualityRating: 'High',
        lastApprovedAt: new Date(),
        aiAgentId: agentId || null,
      },
    });
  }

  async deleteTemplate(id: string) {
    if (!id || id.length !== 36) return false;
    await prisma.whatsAppTemplate.delete({ where: { id } });
    return true;
  }

  async getFollowupSequence(agentId?: string) {
    const where: any = {};
    if (agentId && agentId.length === 36) {
      where.aiAgentId = agentId;
    }

    let seq = await prisma.whatsAppFollowupSequence.findFirst({ where });
    if (!seq) {
      const defaultAgent = await prisma.aIAgent.findFirst();
      seq = await prisma.whatsAppFollowupSequence.create({
        data: {
          title: 'Real Estate Follow-up Flow',
          totalSteps: 6,
          durationDays: 3,
          activeLeadsCount: 1248,
          stepsJson: JSON.stringify([
            { step: 1, title: 'Welcome Message', timing: 'Immediately', type: 'whatsapp' },
            { step: 2, title: 'Ask Requirement', timing: 'After 10 minutes', type: 'chat' },
            { step: 3, title: 'Send Property Options', timing: 'After 2 hours', type: 'document' },
            { step: 4, title: 'Site Visit Invite', timing: 'After 1 day', type: 'calendar' },
            { step: 5, title: 'Follow-up Message', timing: 'After 2 days', type: 'whatsapp' },
            { step: 6, title: 'Human Takeover', timing: 'If no reply 3 days', type: 'user' },
          ]),
          aiAgentId: defaultAgent?.id || null,
        },
      });
    }

    return seq;
  }

  async getAutomationRules(agentId?: string) {
    const where: any = {};
    if (agentId && agentId.length === 36) {
      where.aiAgentId = agentId;
    }

    const count = await prisma.whatsAppAutomationRule.count({ where });
    if (count === 0) {
      const defaultAgent = await prisma.aIAgent.findFirst();
      const initialRules = [
        { ruleName: 'No reply 10 min', triggerCondition: 'No response after 10 min', action: 'Send Reminder', channel: 'WhatsApp', status: 'Active', aiAgentId: defaultAgent?.id },
        { ruleName: 'High Budget Lead', triggerCondition: 'Budget > ₹1 Crore', action: 'Assign Sales Specialist', channel: 'CRM', status: 'Active', aiAgentId: defaultAgent?.id },
        { ruleName: 'Negative Sentiment', triggerCondition: 'Lead expresses frustration', action: 'Human Takeover Notification', channel: 'Escalation', status: 'Active', aiAgentId: defaultAgent?.id },
        { ruleName: 'Site Visit Booking', triggerCondition: 'Site Visit Requested', action: 'Send Location & Booking Confirmation', channel: 'WhatsApp', status: 'Active', aiAgentId: defaultAgent?.id },
      ];
      for (const r of initialRules) {
        await prisma.whatsAppAutomationRule.create({ data: r });
      }
    }

    return prisma.whatsAppAutomationRule.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  async getUsageMetrics(agentId?: string) {
    return {
      dailyUsed: 3210,
      dailyLimit: 10000,
      remaining: 6790,
      usedPercentage: 32,
      rateLimitAvailablePercentage: 95,
      activeWorkflowsCount: 4,
      templatesCount: 12,
      messagesSentToday: 3210,
      messagesDeliveredPercentage: 98.7,
      autoResponsesCount: 2856,
      humanTakeoversCount: 128,
      blockedMessagesCount: 12,
    };
  }

  async getLogs(agentId?: string) {
    const where: any = {};
    if (agentId && agentId.length === 36) {
      where.aiAgentId = agentId;
    }

    const count = await prisma.whatsAppLog.count({ where });
    if (count === 0) {
      const defaultAgent = await prisma.aIAgent.findFirst();
      const initialLogs = [
        { direction: 'Incoming', senderNumber: '+91 98765 43210', messageContent: 'Hello, looking for 2BHK in Vijay Nagar', deliveryStatus: 'Delivered', readStatus: 'Read', wabaId: '1029384756', aiAgentId: defaultAgent?.id },
        { direction: 'Outgoing', senderNumber: 'System AI', messageContent: 'Welcome! Here are top 2BHK listings.', deliveryStatus: 'Delivered', readStatus: 'Read', wabaId: '1029384756', aiAgentId: defaultAgent?.id },
        { direction: 'Incoming', senderNumber: '+91 98220 11223', messageContent: 'Can you share price brochure?', deliveryStatus: 'Delivered', readStatus: 'Read', wabaId: '1029384756', aiAgentId: defaultAgent?.id },
        { direction: 'Outgoing', senderNumber: 'System AI', messageContent: 'PDF Brochure sent successfully via WhatsApp Webhook.', deliveryStatus: 'Delivered', readStatus: 'Read', wabaId: '1029384756', aiAgentId: defaultAgent?.id },
      ];
      for (const l of initialLogs) {
        await prisma.whatsAppLog.create({ data: l });
      }
    }

    return prisma.whatsAppLog.findMany({ where, orderBy: { createdAt: 'desc' }, take: 20 });
  }
}
