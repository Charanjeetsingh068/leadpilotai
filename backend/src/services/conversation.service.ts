import { ConversationModel } from '../models/Conversation.model';
import { MessageModel, MessageSender } from '../models/Message.model';
import { LeadModel } from '../models/Lead.model';
import { ApiError } from '../utils/apiError';

export class ConversationService {
  public async getConversations(organizationId: string) {
    const conversations = await ConversationModel.find({ organizationId })
      .populate('leadId', 'name phone source status qualificationScore project')
      .sort({ lastMessageAt: -1 });

    return conversations.map((conv) => {
      const lead = conv.leadId as unknown as { _id: string; name: string; phone: string; source: string; status: string; qualificationScore: number; project?: string } | null;
      return {
        id: String(conv._id),
        leadId: lead ? String(lead._id) : String(conv.leadId),
        leadName: lead ? lead.name : 'Unknown Lead',
        leadPhone: lead ? lead.phone : '',
        leadProject: lead?.project || 'General',
        leadScore: lead?.qualificationScore || 0,
        isAiAutomated: conv.isAiAutomated,
        unreadCount: conv.unreadCount,
        lastMessageContent: conv.lastMessageContent || '',
        lastMessageAt: conv.lastMessageAt ? conv.lastMessageAt.toISOString() : conv.createdAt.toISOString(),
      };
    });
  }

  public async getMessages(conversationId: string) {
    const messages = await MessageModel.find({ conversationId }).sort({ createdAt: 1 });
    return messages.map((msg) => ({
      id: String(msg._id),
      conversationId: String(msg.conversationId),
      sender: msg.sender,
      senderName: msg.senderName,
      content: msg.content,
      mediaUrl: msg.mediaUrl,
      status: msg.status,
      aiMetadata: msg.aiMetadata,
      timestamp: msg.createdAt.toISOString(),
    }));
  }

  public async sendMessage(
    conversationId: string,
    content: string,
    sender: MessageSender = 'AGENT',
    senderName = 'Agent',
    mediaUrl?: string
  ) {
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
      status: 'SENT',
    });

    await ConversationModel.findByIdAndUpdate(conversationId, {
      $set: {
        lastMessageContent: content,
        lastMessageAt: new Date(),
      },
    });

    return {
      id: String(message._id),
      conversationId: String(message.conversationId),
      sender: message.sender,
      senderName: message.senderName,
      content: message.content,
      mediaUrl: message.mediaUrl,
      status: message.status,
      timestamp: message.createdAt.toISOString(),
    };
  }

  public async toggleAiAutomation(conversationId: string, isAiAutomated: boolean) {
    const conversation = await ConversationModel.findByIdAndUpdate(
      conversationId,
      { $set: { isAiAutomated } },
      { new: true }
    );

    if (!conversation) {
      throw new ApiError(404, 'Conversation not found');
    }

    return {
      id: String(conversation._id),
      isAiAutomated: conversation.isAiAutomated,
    };
  }
}
