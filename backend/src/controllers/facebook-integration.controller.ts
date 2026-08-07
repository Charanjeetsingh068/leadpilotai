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

  getBusinesses = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = this.getScope(req);
      const businesses = await this.service.getBusinesses(scope);
      res.json(createApiResponse(true, businesses, 'Meta Business Portfolios retrieved successfully'));
    } catch (err) {
      next(err);
    }
  };

  selectBusiness = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = this.getScope(req);
      const { businessId } = req.body;
      const result = await this.service.selectBusiness(scope, businessId);
      res.json(createApiResponse(true, result, 'Meta Business Portfolio selected successfully'));
    } catch (err) {
      next(err);
    }
  };

  getPages = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = this.getScope(req);
      const businessId = req.query.businessId as string;
      const pages = await this.service.getPages(scope, businessId);
      res.json(createApiResponse(true, pages, 'Facebook Pages retrieved successfully'));
    } catch (err) {
      next(err);
    }
  };

  selectPages = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = this.getScope(req);
      const pageIds: string[] = req.body.pageIds || req.body.selectedPageIds || [];
      const result = await this.service.selectPages(scope, pageIds);
      res.json(createApiResponse(true, result, 'Facebook Pages selection saved successfully'));
    } catch (err) {
      next(err);
    }
  };

  getInstagramAccounts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = this.getScope(req);
      const businessId = req.query.businessId as string;
      const search = req.query.search as string;
      const instagramAccounts = await this.service.getInstagramAccounts(scope, { businessId, search });
      res.json(createApiResponse(true, instagramAccounts, 'Instagram Business Accounts retrieved successfully'));
    } catch (err) {
      next(err);
    }
  };

  getWhatsAppAccounts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = this.getScope(req);
      const businessId = req.query.businessId as string;
      const search = req.query.search as string;
      const whatsappAccounts = await this.service.getWhatsAppAccounts(scope, { businessId, search });
      res.json(createApiResponse(true, whatsappAccounts, 'WhatsApp Business Accounts retrieved successfully'));
    } catch (err) {
      next(err);
    }
  };

  getForms = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = this.getScope(req);
      const pageId = req.query.pageId as string;
      const search = req.query.search as string;
      const forms = await this.service.getForms(scope, { pageId, search });
      res.json(createApiResponse(true, forms, 'Facebook Lead Forms retrieved successfully'));
    } catch (err) {
      next(err);
    }
  };

  selectForms = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = this.getScope(req);
      const formIds: string[] = req.body.formIds || req.body.selectedFormIds || [];
      const result = await this.service.selectForms(scope, formIds);
      res.json(createApiResponse(true, result, 'Facebook Lead Forms selection saved successfully'));
    } catch (err) {
      next(err);
    }
  };

  getWebhookHealth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = this.getScope(req);
      const health = await this.service.getWebhookHealth(scope);
      res.json(createApiResponse(true, health, 'Meta Webhook health metrics retrieved successfully'));
    } catch (err) {
      next(err);
    }
  };

  getLeads = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = this.getScope(req);
      const pageId = req.query.pageId as string;
      const formId = req.query.formId as string;
      const search = req.query.search as string;
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;

      const leadsResult = await this.service.getLeads(scope, { pageId, formId, search, page, limit });
      res.json(createApiResponse(true, leadsResult, 'Facebook Leads retrieved successfully'));
    } catch (err) {
      next(err);
    }
  };

  getCampaigns = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = this.getScope(req);
      const campaigns = await this.service.getCampaigns(scope);
      res.json(createApiResponse(true, campaigns, 'Facebook Campaigns retrieved successfully'));
    } catch (err) {
      next(err);
    }
  };

  getAds = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = this.getScope(req);
      const ads = await this.service.getAds(scope);
      res.json(createApiResponse(true, ads, 'Facebook Ads retrieved successfully'));
    } catch (err) {
      next(err);
    }
  };

  updateLeadStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = this.getScope(req);
      const { leadId, status } = req.body;
      const updated = await this.service.updateLeadStatus(scope, leadId, status);
      res.json(createApiResponse(true, updated, 'Lead status updated successfully'));
    } catch (err) {
      next(err);
    }
  };

  assignLeadUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = this.getScope(req);
      const { leadId, userId } = req.body;
      const updated = await this.service.assignLeadUser(scope, leadId, userId);
      res.json(createApiResponse(true, updated, 'Lead user assigned successfully'));
    } catch (err) {
      next(err);
    }
  };

  addLeadNote = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = this.getScope(req);
      const { leadId, content } = req.body;
      const note = await this.service.addLeadNote(scope, leadId, content);
      res.json(createApiResponse(true, note, 'Lead note added successfully'));
    } catch (err) {
      next(err);
    }
  };

  getDashboardOverview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = this.getScope(req);
      const overview = await this.service.getDashboardOverview(scope);
      res.json(createApiResponse(true, overview, 'Dashboard overview metrics retrieved successfully'));
    } catch (err) {
      next(err);
    }
  };

  disconnectAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = this.getScope(req);
      const accountId = req.params.id || req.body.accountId;
      const result = await this.service.disconnectAccount(scope, accountId);
      res.json(createApiResponse(true, result, 'Facebook Account disconnected successfully'));
    } catch (err) {
      next(err);
    }
  };

  reconnectAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = this.getScope(req);
      const accountId = req.params.id || req.body.accountId;
      const result = await this.service.reconnectAccount(scope, accountId);
      res.json(createApiResponse(true, result, 'Facebook Account reconnected successfully'));
    } catch (err) {
      next(err);
    }
  };

  deleteAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = this.getScope(req);
      const accountId = req.params.id || req.body.accountId;
      const result = await this.service.deleteAccount(scope, accountId);
      res.json(createApiResponse(true, result, 'Facebook Account deleted successfully'));
    } catch (err) {
      next(err);
    }
  };
}
