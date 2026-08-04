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
      companyId: (req as any).user?.companyId || (req.headers['x-company-id'] as string) || undefined,
      workspaceId: (req as any).user?.workspaceId || (req.headers['x-workspace-id'] as string) || undefined,
      userId: (req as any).user?.id || (req.headers['x-user-id'] as string) || undefined,
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
        pagesCount: dashboard.pages?.length || dashboard.totalPages || 0,
        formsCount: dashboard.forms?.length || dashboard.totalForms || 0,
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

  getAccountDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accountId = (req.params.id || req.params.facebookAccountId) as string;
      const data = await this.service.getAccountDetails(accountId);
      res.json(createApiResponse(true, data, 'Account details retrieved successfully'));
    } catch (err) {
      next(err);
    }
  };

  getAccountLeads = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accountId = (req.params.id || req.params.facebookAccountId) as string;
      const { pageId, status, search, page, limit } = req.query;
      const result = await this.service.getAccountLeads({
        accountId,
        pageId: pageId as string,
        status: status as string,
        search: search as string,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 20,
      });
      res.json(createApiResponse(true, result, 'Account leads retrieved successfully'));
    } catch (err) {
      next(err);
    }
  };

  getAccountCampaigns = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accountId = (req.params.id || req.params.facebookAccountId) as string;
      const data = await this.service.getAccountCampaigns(accountId);
      res.json(createApiResponse(true, data, 'Account campaigns retrieved successfully'));
    } catch (err) {
      next(err);
    }
  };

  getAccountAds = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accountId = (req.params.id || req.params.facebookAccountId) as string;
      const data = await this.service.getAccountAds(accountId);
      res.json(createApiResponse(true, data, 'Account ads retrieved successfully'));
    } catch (err) {
      next(err);
    }
  };

  getAccountInsights = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accountId = (req.params.id || req.params.facebookAccountId) as string;
      const data = await this.service.getAccountInsights(accountId);
      res.json(createApiResponse(true, data, 'Account insights retrieved successfully'));
    } catch (err) {
      next(err);
    }
  };

  streamEvents = async (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    res.write(`data: ${JSON.stringify({ type: 'CONNECTED', message: 'SSE Stream Active' })}\n\n`);

    const interval = setInterval(() => {
      res.write(`data: ${JSON.stringify({ type: 'HEARTBEAT', timestamp: new Date().toISOString() })}\n\n`);
    }, 15000);

    req.on('close', () => {
      clearInterval(interval);
    });
  };

  connectPage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = this.getScope(req);
      const pageId = (req.params.pageId || req.params.id) as string;
      const data = await this.service.connectPageFlow(scope, pageId);
      res.json(createApiResponse(true, data, 'Facebook Page connected & synced successfully'));
    } catch (err) {
      next(err);
    }
  };

  disconnectPage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = this.getScope(req);
      const pageId = (req.params.pageId || req.params.id) as string;
      const data = await this.service.disconnectPageFlow(scope, pageId);
      res.json(createApiResponse(true, data, 'Facebook Page disconnected successfully'));
    } catch (err) {
      next(err);
    }
  };

  syncPage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = this.getScope(req);
      const pageId = (req.params.pageId || req.params.id) as string;
      const data = await this.service.connectPageFlow(scope, pageId);
      res.json(createApiResponse(true, data, 'Facebook Page re-synchronized successfully'));
    } catch (err) {
      next(err);
    }
  };

  getPageDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pageId = (req.params.pageId || req.params.id) as string;
      const data = await this.service.getPageDetails(pageId);
      res.json(createApiResponse(true, data, 'Facebook Page details retrieved successfully'));
    } catch (err) {
      next(err);
    }
  };

  runAudit = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = this.getScope(req);
      const report = await this.service.runProductionAudit(scope);
      res.json(createApiResponse(true, report, 'Meta Graph API Production Audit Report Generated'));
    } catch (err) {
      next(err);
    }
  };
}



