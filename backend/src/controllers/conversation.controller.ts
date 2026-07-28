import { Response, NextFunction } from 'express';
import { ConversationService } from '../services/conversation.service';
import { sendResponse } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export class ConversationController {
  private conversationService: ConversationService;

  constructor() {
    this.conversationService = new ConversationService();
  }

  public getConversations = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const organizationId = req.user?.organizationId || 'org_demo_default';
      const search = req.query.search ? String(req.query.search) : undefined;
      const source = req.query.source ? String(req.query.source) : undefined;
      const status = req.query.status ? String(req.query.status) : undefined;

      const conversations = await this.conversationService.getConversations(organizationId, { search, source, status });
      sendResponse(res, 200, 'Conversations retrieved', conversations);
    } catch (error) {
      next(error);
    }
  };

  public getConversationById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const conversation = await this.conversationService.getConversationById(String(id));
      sendResponse(res, 200, 'Conversation detail retrieved', conversation);
    } catch (error) {
      next(error);
    }
  };

  public getMessages = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const messages = await this.conversationService.getMessages(String(id));
      sendResponse(res, 200, 'Messages retrieved', messages);
    } catch (error) {
      next(error);
    }
  };

  public sendMessage = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { content, mediaUrl, attachmentType, conversationId } = req.body;
      const targetId = id || conversationId;
      const senderName = req.user?.role === 'CLIENT_ADMIN' ? 'Client Admin' : 'Neha Singh';

      const message = await this.conversationService.sendMessage(
        String(targetId),
        content,
        'AGENT',
        senderName,
        mediaUrl,
        attachmentType
      );
      sendResponse(res, 201, 'Message sent successfully', message);
    } catch (error) {
      next(error);
    }
  };

  public takeover = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { conversationId } = req.body;
      const targetId = id || conversationId;
      const agentName = req.user?.role === 'CLIENT_ADMIN' ? 'Client Admin' : 'Neha Singh';

      const result = await this.conversationService.takeover(String(targetId), agentName);
      sendResponse(res, 200, 'Human takeover activated successfully', result);
    } catch (error) {
      next(error);
    }
  };

  public pauseAi = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { conversationId } = req.body;
      const targetId = id || conversationId;

      const result = await this.conversationService.pauseAi(String(targetId));
      sendResponse(res, 200, 'AI automation paused successfully', result);
    } catch (error) {
      next(error);
    }
  };

  public resumeAi = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { conversationId } = req.body;
      const targetId = id || conversationId;

      const result = await this.conversationService.resumeAi(String(targetId));
      sendResponse(res, 200, 'AI automation resumed successfully', result);
    } catch (error) {
      next(error);
    }
  };

  public approveAiReply = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { replyText, conversationId } = req.body;
      const targetId = id || conversationId;

      const result = await this.conversationService.approveAiReply(
        String(targetId),
        replyText || 'Sure! We have great options in Vijay Nagar and Scheme 78. Would you like me to share the price range for 2BHK in these areas?'
      );
      sendResponse(res, 200, 'AI reply approved and sent', result);
    } catch (error) {
      next(error);
    }
  };

  public bookSiteVisit = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { date, time, notes, conversationId } = req.body;
      const targetId = id || conversationId;

      const result = await this.conversationService.bookSiteVisit(
        String(targetId),
        date || 'Tomorrow',
        time || '3:00 PM',
        notes
      );
      sendResponse(res, 200, 'Site visit booked', result);
    } catch (error) {
      next(error);
    }
  };

  public exportConversation = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { format, conversationId } = req.body;
      const targetId = id || conversationId;

      const result = await this.conversationService.exportConversation(String(targetId), format || 'pdf');
      sendResponse(res, 200, 'Conversation export generated', result);
    } catch (error) {
      next(error);
    }
  };
}
