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

  public deleteTemplate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      await this.service.deleteTemplate(id);
      sendResponse(res, 200, 'WhatsApp template deleted', { id });
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

  public getAutomationRules = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const agentId = req.query.agentId as string | undefined;
      const rules = await this.service.getAutomationRules(agentId);
      sendResponse(res, 200, 'WhatsApp automation rules fetched', rules);
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

  public testConnection = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const agentId = req.query.agentId as string | undefined;
      const result = await this.service.testConnection(agentId);
      sendResponse(res, 200, 'WhatsApp API test connection executed successfully', result);
    } catch (error) {
      next(error);
    }
  };
}
