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
      const conversations = await this.conversationService.getConversations(organizationId);
      sendResponse(res, 200, 'Conversations retrieved', conversations);
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
      const { content, mediaUrl } = req.body;
      const senderName = req.user?.role === 'CLIENT_ADMIN' ? 'Client Admin' : 'Sales Executive';

      const message = await this.conversationService.sendMessage(
        String(id),
        content,
        'AGENT',
        senderName,
        mediaUrl
      );
      sendResponse(res, 201, 'Message sent successfully', message);
    } catch (error) {
      next(error);
    }
  };

  public toggleAi = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { isAiAutomated } = req.body;
      const result = await this.conversationService.toggleAiAutomation(String(id), isAiAutomated);
      sendResponse(res, 200, 'AI automation toggled successfully', result);
    } catch (error) {
      next(error);
    }
  };
}
