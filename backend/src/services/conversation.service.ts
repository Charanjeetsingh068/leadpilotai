import { Types } from 'mongoose';
import { ConversationModel } from '../models/Conversation.model';
import { MessageModel, MessageSender } from '../models/Message.model';
import { ApiError } from '../utils/apiError';

export class ConversationService {
  public async getConversations(organizationId: string, filter?: { search?: string; source?: string; status?: string }) {
    const query: Record<string, unknown> = { organizationId };

    if (filter?.source && filter.source !== 'All') {
      query.leadSource = filter.source;
    }
    if (filter?.status && filter.status !== 'All') {
      query.status = filter.status;
    }

    const conversations = await ConversationModel.find(query)
      .populate('leadId', 'name phone source status qualificationScore project')
      .sort({ lastMessageAt: -1 });

    let mapped = conversations.map((conv) => {
      const lead = conv.leadId as unknown as { _id: string; name: string; phone: string; source: string; status: string; qualificationScore: number; project?: string } | null;
      return {
        id: String(conv._id),
        leadId: lead ? String(lead._id) : String(conv.leadId),
        leadName: lead ? lead.name : 'Unknown Lead',
        leadPhone: lead ? lead.phone : '',
        leadProject: lead?.project || conv.aiSummary?.project || 'General Project',
        leadScore: lead?.qualificationScore || conv.aiSummary?.leadScore || 85,
        leadSource: conv.leadSource || (lead?.source as any) || 'Facebook Lead',
        status: conv.status || 'Active',
        isAiAutomated: conv.isAiAutomated,
        unreadCount: conv.unreadCount,
        lastMessageContent: conv.lastMessageContent || '',
        lastMessageAt: conv.lastMessageAt ? conv.lastMessageAt.toISOString() : conv.createdAt.toISOString(),
        assignedSalesperson: conv.assignedSalesperson || { name: 'Neha Singh', role: 'Salesperson' },
        pinned: conv.pinned || false,
        archived: conv.archived || false,
        aiSummary: conv.aiSummary || {
          intent: 'Buy a 2BHK Apartment',
          budget: '₹50 - ₹70 Lakhs',
          project: 'Sunshine Villas',
          timeline: 'Ready to buy in 1 - 3 months',
          loan: 'Yes, Home Loan Required',
          sentiment: 'Positive',
          leadScore: 85,
          recommendedAction: 'Share matching properties and schedule site visit',
          buyingProbability: '88%',
          confidenceScore: 0.95,
        },
        aiAgent: conv.aiAgent || {
          name: 'Property Advisor Agent',
          industry: 'Real Estate',
          model: 'GPT-4o',
          status: conv.isAiAutomated ? 'Running' : 'Paused',
        },
        recentAiActions: conv.recentAiActions || [
          { id: '1', action: 'Asked about preferred location', timestamp: '10:26 AM', iconType: 'question' },
          { id: '2', action: 'Shared price range', timestamp: '10:27 AM', iconType: 'document' },
          { id: '3', action: 'Checking availability', timestamp: '10:27 AM', iconType: 'check' },
        ],
        pendingAiReply: conv.pendingAiReply,
      };
    });

    if (filter?.search) {
      const term = filter.search.toLowerCase();
      mapped = mapped.filter((c) => c.leadName.toLowerCase().includes(term) || c.leadPhone.includes(term) || c.lastMessageContent.toLowerCase().includes(term));
    }

    return mapped;
  }

  public async getConversationById(conversationId: string) {
    if (!Types.ObjectId.isValid(conversationId)) {
      throw new ApiError(404, 'Conversation not found');
    }
    const conv = await ConversationModel.findById(conversationId).populate('leadId', 'name phone source status qualificationScore project');
    if (!conv) {
      throw new ApiError(404, 'Conversation not found');
    }
    const lead = conv.leadId as unknown as { _id: string; name: string; phone: string; source: string; status: string; qualificationScore: number; project?: string } | null;

    return {
      id: String(conv._id),
      leadId: lead ? String(lead._id) : String(conv.leadId),
      leadName: lead ? lead.name : 'Unknown Lead',
      leadPhone: lead ? lead.phone : '',
      leadProject: lead?.project || conv.aiSummary?.project || 'Sunshine Villas',
      leadScore: lead?.qualificationScore || conv.aiSummary?.leadScore || 85,
      leadSource: conv.leadSource || (lead?.source as any) || 'Facebook Lead',
      status: conv.status || 'Active',
      isAiAutomated: conv.isAiAutomated,
      unreadCount: conv.unreadCount,
      lastMessageContent: conv.lastMessageContent || '',
      lastMessageAt: conv.lastMessageAt ? conv.lastMessageAt.toISOString() : conv.createdAt.toISOString(),
      assignedSalesperson: conv.assignedSalesperson || { name: 'Neha Singh', role: 'Salesperson' },
      aiSummary: conv.aiSummary || {
        intent: 'Buy a 2BHK Apartment',
        budget: '₹50 - ₹70 Lakhs',
        project: 'Sunshine Villas',
        timeline: 'Ready to buy in 1 - 3 months',
        loan: 'Yes, Home Loan Required',
        sentiment: 'Positive',
        leadScore: 85,
        recommendedAction: 'Share matching properties and schedule site visit',
      },
      aiAgent: conv.aiAgent || {
        name: 'Property Advisor Agent',
        industry: 'Real Estate',
        model: 'GPT-4o',
        status: conv.isAiAutomated ? 'Running' : 'Paused',
      },
      recentAiActions: conv.recentAiActions || [],
      pendingAiReply: conv.pendingAiReply,
    };
  }

  public async getMessages(conversationId: string) {
    if (!Types.ObjectId.isValid(conversationId)) {
      return [];
    }
    const messages = await MessageModel.find({ conversationId }).sort({ createdAt: 1 });
    return messages.map((msg) => ({
      id: String(msg._id),
      conversationId: String(msg.conversationId),
      sender: msg.sender,
      senderName: msg.senderName,
      content: msg.content,
      mediaUrl: msg.mediaUrl,
      attachmentType: msg.attachmentType,
      fileName: msg.fileName,
      fileSize: msg.fileSize,
      status: msg.status || 'SEEN',
      aiMetadata: msg.aiMetadata,
      timestamp: msg.createdAt.toISOString(),
    }));
  }

  public async sendMessage(
    conversationId: string,
    content: string,
    sender: MessageSender = 'AGENT',
    senderName = 'Agent',
    mediaUrl?: string,
    attachmentType?: any
  ) {
    if (!Types.ObjectId.isValid(conversationId)) {
      throw new ApiError(404, 'Conversation not found');
    }
    const conversation = await ConversationModel.findById(conversationId);
    if (!conversation) {
      throw new ApiError(404, 'Conversation not found');
    }

    const message = await MessageModel.create({
      conversationId,
      leadId: conversation.leadId,
      organizationId: conversation.organizationId,
      sender,
      senderName,
      content,
      mediaUrl,
      attachmentType,
      status: 'SEEN',
    });

    await ConversationModel.findByIdAndUpdate(conversationId, {
      $set: {
        lastMessageContent: content,
        lastMessageAt: new Date(),
        unreadCount: 0,
      },
    });

    return {
      id: String(message._id),
      conversationId: String(message.conversationId),
      sender: message.sender,
      senderName: message.senderName,
      content: message.content,
      mediaUrl: message.mediaUrl,
      attachmentType: message.attachmentType,
      status: message.status,
      timestamp: message.createdAt.toISOString(),
    };
  }

  public async takeover(conversationId: string, agentName: string) {
    if (!Types.ObjectId.isValid(conversationId)) {
      throw new ApiError(404, 'Conversation not found');
    }
    const conversation = await ConversationModel.findByIdAndUpdate(
      conversationId,
      {
        $set: {
          isAiAutomated: false,
          'aiAgent.status': 'Paused',
        },
        $push: {
          recentAiActions: {
            id: String(Date.now()),
            action: `Human Takeover by ${agentName}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            iconType: 'takeover',
          },
        },
      },
      { new: true }
    );

    if (!conversation) {
      throw new ApiError(404, 'Conversation not found');
    }

    await MessageModel.create({
      conversationId,
      leadId: conversation.leadId,
      organizationId: conversation.organizationId,
      sender: 'SYSTEM',
      content: `Salesperson (${agentName}) took over the conversation. AI auto-pilot paused.`,
      status: 'SEEN',
    });

    return { id: String(conversation._id), isAiAutomated: false };
  }

  public async pauseAi(conversationId: string) {
    if (!Types.ObjectId.isValid(conversationId)) {
      throw new ApiError(404, 'Conversation not found');
    }
    const conversation = await ConversationModel.findByIdAndUpdate(
      conversationId,
      {
        $set: {
          isAiAutomated: false,
          'aiAgent.status': 'Paused',
        },
        $push: {
          recentAiActions: {
            id: String(Date.now()),
            action: 'AI Auto-reply paused by Admin',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            iconType: 'pause',
          },
        },
      },
      { new: true }
    );

    if (!conversation) {
      throw new ApiError(404, 'Conversation not found');
    }

    return { id: String(conversation._id), isAiAutomated: false };
  }

  public async resumeAi(conversationId: string) {
    if (!Types.ObjectId.isValid(conversationId)) {
      throw new ApiError(404, 'Conversation not found');
    }
    const conversation = await ConversationModel.findByIdAndUpdate(
      conversationId,
      {
        $set: {
          isAiAutomated: true,
          'aiAgent.status': 'Running',
        },
        $push: {
          recentAiActions: {
            id: String(Date.now()),
            action: 'AI Auto-pilot resumed',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            iconType: 'play',
          },
        },
      },
      { new: true }
    );

    if (!conversation) {
      throw new ApiError(404, 'Conversation not found');
    }

    return { id: String(conversation._id), isAiAutomated: true };
  }

  public async approveAiReply(conversationId: string, replyText: string) {
    return this.sendMessage(conversationId, replyText, 'AI', 'Property Advisor Agent');
  }

  public async bookSiteVisit(conversationId: string, date: string, time: string, notes?: string) {
    if (!Types.ObjectId.isValid(conversationId)) {
      throw new ApiError(404, 'Conversation not found');
    }
    const conversation = await ConversationModel.findById(conversationId);
    if (!conversation) {
      throw new ApiError(404, 'Conversation not found');
    }

    const systemMsg = `📅 Site Visit scheduled for ${date} at ${time}. ${notes ? `Notes: ${notes}` : ''}`;

    await MessageModel.create({
      conversationId,
      leadId: conversation.leadId,
      organizationId: conversation.organizationId,
      sender: 'SYSTEM',
      content: systemMsg,
      status: 'SEEN',
    });

    await ConversationModel.findByIdAndUpdate(conversationId, {
      $push: {
        recentAiActions: {
          id: String(Date.now()),
          action: `Site Visit Booked (${date} ${time})`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          iconType: 'calendar',
        },
      },
    });

    return { success: true, message: systemMsg };
  }

  public async exportConversation(conversationId: string, format: 'pdf' | 'excel' | 'csv' | 'json') {
    const messages = await this.getMessages(conversationId);
    const conv = await this.getConversationById(conversationId);

    return {
      format,
      filename: `WhatsApp_Conversation_${conv.leadName.replace(/\s+/g, '_')}_${Date.now()}.${format}`,
      conversation: conv,
      messagesCount: messages.length,
      downloadUrl: `/downloads/exports/conversation_${conversationId}.${format}`,
    };
  }
}
