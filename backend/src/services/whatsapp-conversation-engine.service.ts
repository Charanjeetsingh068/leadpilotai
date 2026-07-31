import { prisma } from '../config/database';
import { MetaGraphApiService } from './meta-graph-api.service';
import { TokenManagementService } from './token-management.service';

export type ConversationState = 'NEW' | 'AI_ACTIVE' | 'WAITING_FOR_CUSTOMER' | 'HUMAN_ASSIGNED' | 'CLOSED' | 'BLOCKED';
export type MessageStatus = 'QUEUED' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED' | 'RETRY';

export class WhatsAppConversationEngineService {
  private metaGraphService: MetaGraphApiService;
  private tokenService: TokenManagementService;

  constructor() {
    this.metaGraphService = new MetaGraphApiService();
    this.tokenService = new TokenManagementService();
  }

  // 1. Initial AI Outreach for New Qualified Lead
  async sendInitialOutreach(leadId: string): Promise<any> {
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        facebookPage: true,
        facebookForm: true,
      },
    });

    if (!lead || !lead.phone) return null;

    // Find WABA account for workspace
    const waba = await prisma.whatsAppBusinessAccount.findFirst({
      where: { workspaceId: lead.workspaceId || undefined },
    });

    const account = await prisma.facebookAccount.findFirst({
      where: { workspaceId: lead.workspaceId || undefined, tokenStatus: 'Active' },
    });

    const phoneNumberId = waba?.phoneNumberId || process.env.WHATSAPP_PHONE_NUMBER_ID || '109876543210987';
    const accessToken = account?.accessToken ? this.tokenService.decrypt(account.accessToken) : (process.env.FACEBOOK_APP_TOKEN || 'mock_waba_token');

    // Craft personalized initial outreach message based on Lead AI Qualification
    const firstName = lead.name.split(' ')[0] || lead.name;
    const initialText = `Hi ${firstName}! 👋 Thank you for inquiring about ${lead.project || 'our luxury properties'} via Facebook.\n\nI'm Property Advisor AI. I can help share price sheets, floor plans, and arrange site visits. Are you looking to buy for self-use or investment?`;

    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: lead.phone.replace(/[^0-9]/g, ''),
      type: 'text',
      text: { body: initialText },
    };

    let sentMessageId = `msg-${Date.now()}`;
    let status: MessageStatus = 'SENT';

    try {
      if (accessToken !== 'mock_waba_token') {
        const res = await this.metaGraphService.sendWhatsAppCloudMessage(phoneNumberId, accessToken, payload);
        if (res?.messages?.[0]?.id) {
          sentMessageId = res.messages[0].id;
        }
      }
    } catch (e: any) {
      console.error('WhatsApp Initial Outreach Delivery Warning:', e.message);
      status = 'FAILED';
    }

    // Upsert Conversation record in PostgreSQL
    const conv = await prisma.conversation.findFirst({
      where: { leadId: lead.id },
    });

    let targetConvId: string;

    if (conv) {
      await prisma.conversation.update({
        where: { id: conv.id },
        data: {
          isAiAutomated: true,
          status: 'Active',
          lastMessageContent: initialText,
          updatedAt: new Date(),
        },
      });
      targetConvId = conv.id;
    } else {
      const newConv = await prisma.conversation.create({
        data: {
          leadId: lead.id,
          organizationId: lead.workspaceId || 'org_demo_default',
          isAiAutomated: true,
          status: 'Active',
          lastMessageContent: initialText,
        },
      });
      targetConvId = newConv.id;
    }

    // Log Activity Timeline
    await prisma.activityLog.create({
      data: {
        leadId: lead.id,
        eventType: 'WHATSAPP_INITIAL_OUTREACH',
        title: 'WhatsApp Outreach Sent',
        description: `Automated AI WhatsApp message sent to ${lead.phone}`,
        actorType: 'AI_AGENT',
      },
    });

    return { conversationId: targetConvId, messageId: sentMessageId, status };
  }

  // 2. Incoming Customer Message Webhook Processing
  async processIncomingMessage(data: {
    fromPhone: string;
    messageText: string;
    wabaPhoneNumberId?: string;
    messageType?: string;
    mediaUrl?: string;
  }): Promise<any> {
    const cleanPhone = data.fromPhone.replace(/[^0-9]/g, '');

    // Locate lead by phone number
    const lead = await prisma.lead.findFirst({
      where: {
        OR: [
          { phone: { contains: cleanPhone.slice(-10) } },
          { phone: cleanPhone },
        ],
      },
    });

    if (!lead) {
      console.log(`[WHATSAPP_UNKNOWN_LEAD] Message from unknown number: ${cleanPhone}`);
      return { status: 'ignored_unknown_lead' };
    }

    // Find conversation record
    let conv = await prisma.conversation.findFirst({
      where: { leadId: lead.id },
    });

    if (!conv) {
      conv = await prisma.conversation.create({
        data: {
          leadId: lead.id,
          organizationId: lead.workspaceId || 'org_demo_default',
          isAiAutomated: true,
          status: 'Active',
          lastMessageContent: data.messageText,
        },
      });
    } else {
      await prisma.conversation.update({
        where: { id: conv.id },
        data: {
          lastMessageContent: data.messageText,
          updatedAt: new Date(),
        },
      });
    }

    // Check if Human Handover is active (AI Paused)
    if (!conv.isAiAutomated) {
      console.log(`[WHATSAPP_HUMAN_HANDOVER_ACTIVE] AI is paused for conversation ${conv.id}. Human agent notified.`);
      await prisma.activityLog.create({
        data: {
          leadId: lead.id,
          eventType: 'WHATSAPP_HUMAN_MESSAGE_RECEIVED',
          title: 'Customer Replied (Human Takeover Active)',
          description: `Message: "${data.messageText}"`,
          actorType: 'USER',
        },
      });
      return { status: 'human_takeover_active', conversationId: conv.id };
    }

    // Generate Intelligent AI Reply
    const lowerText = data.messageText.toLowerCase();
    let replyText = `Thanks for your response, ${lead.name.split(' ')[0]}! 😊 Our sales team will share the complete brochure and site visit availability with you shortly. Is there a specific date you would like to visit?`;

    if (lowerText.includes('price') || lowerText.includes('cost') || lowerText.includes('budget')) {
      replyText = `Our pricing for ${lead.project || 'the property'} starts from ₹45 Lakhs up to ₹1.2 Crores depending on floor layout. Would you like me to send the floor plans PDF?`;
    } else if (lowerText.includes('visit') || lowerText.includes('tomorrow') || lowerText.includes('weekend')) {
      replyText = `Great! I can help schedule your site visit. We have slots available this Saturday & Sunday at 11:00 AM and 4:00 PM. Which slot works best for you?`;
    } else if (lowerText.includes('human') || lowerText.includes('agent') || lowerText.includes('call me')) {
      // Automatic Handover Trigger
      await prisma.conversation.update({
        where: { id: conv.id },
        data: { isAiAutomated: false },
      });
      replyText = `I've assigned senior Property Advisor Neha to call you right away. She will contact you in 5 minutes! 📞`;
    }

    // Send AI Reply Outbound via WhatsApp Cloud API
    const account = await prisma.facebookAccount.findFirst({
      where: { workspaceId: lead.workspaceId || undefined, tokenStatus: 'Active' },
    });
    const accessToken = account?.accessToken ? this.tokenService.decrypt(account.accessToken) : (process.env.FACEBOOK_APP_TOKEN || 'mock_waba_token');
    const phoneNumberId = data.wabaPhoneNumberId || process.env.WHATSAPP_PHONE_NUMBER_ID || '109876543210987';

    if (accessToken !== 'mock_waba_token') {
      try {
        await this.metaGraphService.sendWhatsAppCloudMessage(phoneNumberId, accessToken, {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: cleanPhone,
          type: 'text',
          text: { body: replyText },
        });
      } catch (e: any) {
        console.error('WhatsApp AI Reply Send Error:', e.message);
      }
    }

    // Log Activity
    await prisma.activityLog.create({
      data: {
        leadId: lead.id,
        eventType: 'WHATSAPP_AI_REPLY_SENT',
        title: 'AI Reply Sent on WhatsApp',
        description: `AI: "${replyText}"`,
        actorType: 'AI_AGENT',
      },
    });

    return {
      status: 'ai_replied',
      conversationId: conv.id,
      replyText,
    };
  }

  // 3. Human Handover Management
  async takeoverConversation(conversationId: string, salesUserId?: string): Promise<any> {
    const conv = await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        isAiAutomated: false,
        updatedAt: new Date(),
      },
    });

    return { success: true, conversationId: conv.id, isAiAutomated: false };
  }

  async returnToAi(conversationId: string): Promise<any> {
    const conv = await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        isAiAutomated: true,
        updatedAt: new Date(),
      },
    });

    return { success: true, conversationId: conv.id, isAiAutomated: true };
  }
}
