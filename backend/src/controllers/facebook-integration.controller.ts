import { Request, Response, NextFunction } from 'express';
import { FacebookIntegrationService } from '../services/facebook-integration.service';
import { FacebookWebhookService } from '../services/facebook-webhook.service';

export class FacebookIntegrationController {
  private service: FacebookIntegrationService;
  private webhookService: FacebookWebhookService;

  constructor() {
    this.service = new FacebookIntegrationService();
    this.webhookService = new FacebookWebhookService();
  }

  private getScope(req: Request) {
    return {
      companyId: (req as any).user?.companyId || 'company-uuid-001',
      workspaceId: (req as any).user?.workspaceId || 'workspace-uuid-001',
      userId: (req as any).user?.id || 'user-uuid-001',
      userRole: (req as any).user?.role || 'Super Admin',
    };
  }

  getDashboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = this.getScope(req);
      const businessId = req.query.businessId as string;
      const data = await this.service.getDashboard(scope, businessId);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  getAccounts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = this.getScope(req);
      const { search, status, page, limit } = req.query;
      const result = await this.service.getAccounts(scope, {
        search: search as string,
        status: status as string,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
      });
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  getBusinesses = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = this.getScope(req);
      const businesses = await this.service.getBusinesses(scope);
      res.json({ success: true, data: businesses });
    } catch (err) {
      next(err);
    }
  };

  getPages = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = this.getScope(req);
      const { search, businessId, page, limit } = req.query;
      const result = await this.service.getPages(scope, {
        search: search as string,
        businessId: businessId as string,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
      });
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  syncPages = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = this.getScope(req);
      const { accountId } = req.body;
      const result = await this.service.syncPages(scope, accountId || 'acc_1');
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  getForms = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = this.getScope(req);
      const { search, pageId, page, limit } = req.query;
      const result = await this.service.getForms(scope, {
        search: search as string,
        pageId: pageId as string,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
      });
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  assignAiAgent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = this.getScope(req);
      const { formId, aiAgentId } = req.body;
      const updated = await this.service.assignAiAgentToForm(scope, formId, aiAgentId);
      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  };

  syncForms = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = this.getScope(req);
      const { pageId } = req.body;
      const result = await this.service.syncForms(scope, pageId || 'page_1');
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  getPermissions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = this.getScope(req);
      const permissions = await this.service.getPermissions(scope);
      res.json({ success: true, data: permissions });
    } catch (err) {
      next(err);
    }
  };

  getWebhooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = this.getScope(req);
      const dashboard = await this.service.getDashboard(scope);
      res.json({ success: true, data: dashboard.webhookHealth });
    } catch (err) {
      next(err);
    }
  };

  retryWebhooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = this.getScope(req);
      const result = await this.webhookService.replayFailedEvents(scope);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  triggerSync = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = this.getScope(req);
      const dashboard = await this.service.getDashboard(scope);
      res.json({ success: true, message: 'Sync completed successfully', data: dashboard });
    } catch (err) {
      next(err);
    }
  };
}
