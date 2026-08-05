import { Request, Response, NextFunction } from 'express';
import { FacebookIntegrationService } from '../services/facebook-integration.service';
import { FacebookWebhookService } from '../services/facebook-webhook.service';
import { createApiResponse } from '../interfaces/api-response.interface';

export class FacebookIntegrationController {
  private service: FacebookIntegrationService;
  private webhookService: FacebookWebhookService;

  constructor() {
    this.service = new FacebookIntegrationService();
    this.webhookService = new FacebookWebhookService();
  }

  private getScope(req: Request) {
    return {
      companyId: (req as any).user?.companyId || (req.headers['x-company-id'] as string) || 'default-company',
      workspaceId: (req as any).user?.workspaceId || (req.headers['x-workspace-id'] as string) || 'default-workspace',
      userId: (req as any).user?.id || (req.headers['x-user-id'] as string) || 'default-user',
    };
  }

  getDashboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = this.getScope(req);
      const businessId = req.query.businessId as string;
      const data = await this.service.getDashboard(scope, businessId);
      res.json(createApiResponse(true, data, 'Meta Enterprise Dashboard retrieved successfully'));
    } catch (err) {
      next(err);
    }
  };

  getStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = this.getScope(req);
      const dashboard = await this.service.getDashboard(scope);
      res.json(createApiResponse(true, dashboard.connection, 'Meta Integration status retrieved successfully'));
    } catch (err) {
      next(err);
    }
  };

  triggerSync = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = this.getScope(req);
      const result = await this.service.triggerManualSync(scope);
      const dashboard = await this.service.getDashboard(scope);
      res.json(createApiResponse(true, { result, dashboard }, 'Manual Meta Graph API Discovery completed successfully'));
    } catch (err) {
      next(err);
    }
  };

  toggleFormActive = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = this.getScope(req);
      const { formId, isActive } = req.body;
      const result = await this.service.toggleFormActive(scope, formId, isActive);
      res.json(createApiResponse(true, result, 'Lead Form status updated successfully'));
    } catch (err) {
      next(err);
    }
  };

  assignAiAgent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = this.getScope(req);
      const { formId, aiAgentId } = req.body;
      const result = await this.service.assignAiAgent(scope, formId, aiAgentId);
      res.json(createApiResponse(true, result, 'AI Agent assigned to Lead Form successfully'));
    } catch (err) {
      next(err);
    }
  };

  retryWebhooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.webhookService.retryWebhooks();
      res.json(createApiResponse(true, result, 'Webhook retry cycle executed successfully'));
    } catch (err) {
      next(err);
    }
  };

  disconnect = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = this.getScope(req);
      const { fbUserId } = req.body;
      const result = await this.service.disconnectAccount(scope, fbUserId);
      res.json(createApiResponse(true, result, 'Meta account disconnected successfully'));
    } catch (err) {
      next(err);
    }
  };
}
