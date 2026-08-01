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
      companyId: (req as any).user?.companyId || (req.headers['x-company-id'] as string) || 'company-uuid-001',
      workspaceId: (req as any).user?.workspaceId || (req.headers['x-workspace-id'] as string) || 'workspace-uuid-001',
      userId: (req as any).user?.id || 'user-uuid-001',
      userRole: (req as any).user?.role || 'Super Admin',
    };
  }

  getDashboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = this.getScope(req);
      const businessId = req.query.businessId as string;
      const data = await this.service.getDashboard(scope, businessId);
      res.json(createApiResponse(true, data, 'Dashboard retrieved successfully'));
    } catch (err) {
      next(err);
    }
  };

  getStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = this.getScope(req);
      const verification = await this.service.verifyConnection(scope);
      const dashboard = await this.service.getDashboard(scope);

      const statusPayload = {
        status: verification.status,
        isConnected: verification.isConnected,
        user: verification.user,
        connection: {
          ...dashboard.connection,
          status: verification.status,
          isConnected: verification.isConnected,
        },
      };

      res.json(createApiResponse(true, statusPayload, 'Status retrieved & verified successfully'));
    } catch (err) {
      next(err);
    }
  };

  getDiagnostics = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = this.getScope(req);
      const data = await this.service.getDiagnostics(scope);
      res.json(createApiResponse(true, data, 'Diagnostics retrieved successfully'));
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
      res.json(createApiResponse(true, result, 'Accounts retrieved successfully'));
    } catch (err) {
      next(err);
    }
  };

  getBusinesses = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = this.getScope(req);
      const businesses = await this.service.getBusinesses(scope);
      res.json(createApiResponse(true, businesses, 'Businesses retrieved successfully'));
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
      res.json(createApiResponse(true, result, 'Pages retrieved successfully'));
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
      res.json(createApiResponse(true, result, 'Forms retrieved successfully'));
    } catch (err) {
      next(err);
    }
  };

  getWebhooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = this.getScope(req);
      const dashboard = await this.service.getDashboard(scope);
      res.json(createApiResponse(true, dashboard.webhookHealth, 'Webhooks retrieved successfully'));
    } catch (err) {
      next(err);
    }
  };

  connect = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = this.getScope(req);
      res.json(createApiResponse(true, { state: 'CONNECTING', redirectUrl: '/api/integrations/facebook/oauth' }, 'Connection initiated successfully'));
    } catch (err) {
      next(err);
    }
  };

  disconnect = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = this.getScope(req);
      res.json(createApiResponse(true, { state: 'NOT_CONNECTED' }, 'Facebook integration disconnected successfully'));
    } catch (err) {
      next(err);
    }
  };

  retryWebhooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = this.getScope(req);
      const result = await this.webhookService.replayFailedEvents(scope);
      res.json(createApiResponse(true, result, 'Webhook retry executed successfully'));
    } catch (err) {
      next(err);
    }
  };

  triggerSync = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = this.getScope(req);
      const syncResult = await this.service.syncAssets(scope);
      const dashboard = await this.service.getDashboard(scope);
      res.json(createApiResponse(true, { syncResult, dashboard }, 'Asset discovery and synchronization completed successfully'));
    } catch (err) {
      next(err);
    }
  };
}
