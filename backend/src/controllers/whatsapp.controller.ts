import { Request, Response, NextFunction } from 'express';
import { WhatsAppService } from '../services/whatsapp.service';
import { sendResponse } from '../utils/apiResponse';

export class WhatsAppController {
  private service = new WhatsAppService();

  public getConnection = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const agentId = req.query.agentId as string | undefined;
      const conn = await this.service.getConnection(agentId);
      sendResponse(res, 200, 'WhatsApp Business connection fetched', conn);
    } catch (error) {
      next(error);
    }
  };

  public connect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const agentId = req.query.agentId as string | undefined;
      const conn = await this.service.connect(req.body, agentId);
      sendResponse(res, 200, 'WhatsApp Business API connected', conn);
    } catch (error) {
      next(error);
    }
  };

  public disconnect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const agentId = req.query.agentId as string | undefined;
      const conn = await this.service.disconnect(agentId);
      sendResponse(res, 200, 'WhatsApp Business API disconnected', conn);
    } catch (error) {
      next(error);
    }
  };

  public testConnection = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const agentId = req.query.agentId as string | undefined;
      const result = await this.service.testConnection(agentId);
      sendResponse(res, 200, 'WhatsApp API test connection executed successfully', result);
    } catch (error) {
      next(error);
    }
  };

  public getTemplates = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const agentId = req.query.agentId as string | undefined;
      const templates = await this.service.getTemplates(agentId);
      sendResponse(res, 200, 'WhatsApp message templates fetched', templates);
    } catch (error) {
      next(error);
    }
  };

  public createTemplate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const template = await this.service.createTemplate(req.body);
      sendResponse(res, 201, 'WhatsApp template created', template);
    } catch (error) {
      next(error);
    }
  };

  public updateTemplate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      const template = await this.service.updateTemplate(id, req.body);
      sendResponse(res, 200, 'WhatsApp template updated', template);
    } catch (error) {
      next(error);
    }
  };

  public deleteTemplate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      await this.service.deleteTemplate(id);
      sendResponse(res, 200, 'WhatsApp template deleted', { id });
    } catch (error) {
      next(error);
    }
  };

  public getWelcomeMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const agentId = req.query.agentId as string | undefined;
      const welcome = await this.service.getWelcomeMessage(agentId);
      sendResponse(res, 200, 'WhatsApp welcome message fetched', welcome);
    } catch (error) {
      next(error);
    }
  };

  public saveWelcomeMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const agentId = req.query.agentId as string | undefined;
      const welcomeText = req.body.welcomeMessage || req.body.message || '';
      const result = await this.service.saveWelcomeMessage(welcomeText, agentId);
      sendResponse(res, 200, 'WhatsApp welcome message saved', result);
    } catch (error) {
      next(error);
    }
  };

  public getFollowupSequence = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const agentId = req.query.agentId as string | undefined;
      const seq = await this.service.getFollowupSequence(agentId);
      sendResponse(res, 200, 'WhatsApp follow-up sequence fetched', seq);
    } catch (error) {
      next(error);
    }
  };

  public saveFollowupSequence = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const agentId = req.query.agentId as string | undefined;
      const seq = await this.service.saveFollowupSequence(req.body, agentId);
      sendResponse(res, 200, 'WhatsApp follow-up sequence saved', seq);
    } catch (error) {
      next(error);
    }
  };

  public getAutomationRules = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const agentId = req.query.agentId as string | undefined;
      const rules = await this.service.getAutomationRules(agentId);
      sendResponse(res, 200, 'WhatsApp automation rules fetched', rules);
    } catch (error) {
      next(error);
    }
  };

  public createAutomationRule = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const rule = await this.service.createAutomationRule(req.body);
      sendResponse(res, 201, 'WhatsApp automation rule created', rule);
    } catch (error) {
      next(error);
    }
  };

  public updateAutomationRule = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      const rule = await this.service.updateAutomationRule(id, req.body);
      sendResponse(res, 200, 'WhatsApp automation rule updated', rule);
    } catch (error) {
      next(error);
    }
  };

  public deleteAutomationRule = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      await this.service.deleteAutomationRule(id);
      sendResponse(res, 200, 'WhatsApp automation rule deleted', { id });
    } catch (error) {
      next(error);
    }
  };

  public getBusinessHours = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const agentId = req.query.agentId as string | undefined;
      const hours = await this.service.getBusinessHours(agentId);
      sendResponse(res, 200, 'WhatsApp business hours fetched', hours);
    } catch (error) {
      next(error);
    }
  };

  public saveBusinessHours = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const agentId = req.query.agentId as string | undefined;
      const hours = await this.service.saveBusinessHours(req.body, agentId);
      sendResponse(res, 200, 'WhatsApp business hours saved', hours);
    } catch (error) {
      next(error);
    }
  };

  public getHumanTakeover = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const agentId = req.query.agentId as string | undefined;
      const takeover = await this.service.getHumanTakeover(agentId);
      sendResponse(res, 200, 'WhatsApp human takeover settings fetched', takeover);
    } catch (error) {
      next(error);
    }
  };

  public saveHumanTakeover = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const agentId = req.query.agentId as string | undefined;
      const takeover = await this.service.saveHumanTakeover(req.body, agentId);
      sendResponse(res, 200, 'WhatsApp human takeover settings saved', takeover);
    } catch (error) {
      next(error);
    }
  };

  public getMedia = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const agentId = req.query.agentId as string | undefined;
      const media = await this.service.getMedia(agentId);
      sendResponse(res, 200, 'WhatsApp media files fetched', media);
    } catch (error) {
      next(error);
    }
  };

  public createMedia = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const media = await this.service.createMedia(req.body);
      sendResponse(res, 201, 'WhatsApp media created', media);
    } catch (error) {
      next(error);
    }
  };

  public deleteMedia = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      await this.service.deleteMedia(id);
      sendResponse(res, 200, 'WhatsApp media deleted', { id });
    } catch (error) {
      next(error);
    }
  };

  public getUsageMetrics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const agentId = req.query.agentId as string | undefined;
      const usage = await this.service.getUsageMetrics(agentId);
      sendResponse(res, 200, 'WhatsApp usage metrics fetched', usage);
    } catch (error) {
      next(error);
    }
  };

  public getLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const agentId = req.query.agentId as string | undefined;
      const logs = await this.service.getLogs(agentId);
      sendResponse(res, 200, 'WhatsApp API logs fetched', logs);
    } catch (error) {
      next(error);
    }
  };

  public handleWebhook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const wabaId = req.params.wabaId as string | undefined;
      const result = await this.service.processIncomingWebhook(req.body, wabaId);
      sendResponse(res, 200, 'WhatsApp webhook processed', result);
    } catch (error) {
      next(error);
    }
  };
}
