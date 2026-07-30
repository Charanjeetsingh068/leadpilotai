import { Request, Response, NextFunction } from 'express';
import { FacebookIntegrationService } from '../services/facebook-integration.service';

export class FacebookOAuthController {
  private service: FacebookIntegrationService;

  constructor() {
    this.service = new FacebookIntegrationService();
  }

  startOAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = {
        companyId: (req as any).user?.companyId || 'company-uuid-001',
        workspaceId: (req as any).user?.workspaceId || 'workspace-uuid-001',
        userId: (req as any).user?.id || 'user-uuid-001',
        userRole: (req as any).user?.role || 'Super Admin',
      };
      const clientOrigin = req.body?.redirectUri || (req.headers.origin as string) || (req.headers.referer as string);
      const result = await this.service.startOAuth(scope, clientOrigin);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  handleCallback = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const code = req.query.code as string;
      const redirectUri = req.query.redirect_uri as string || `${process.env.APP_URL || 'http://localhost:3000'}/api/integrations/facebook/callback`;
      
      const scope = {
        companyId: (req as any).user?.companyId || 'company-uuid-001',
        workspaceId: (req as any).user?.workspaceId || 'workspace-uuid-001',
        userId: (req as any).user?.id || 'user-uuid-001',
        userRole: (req as any).user?.role || 'Super Admin',
      };

      const account = await this.service.handleOAuthCallback(scope, code || 'mock_code', redirectUri);
      res.json({ success: true, data: account });
    } catch (err) {
      next(err);
    }
  };

  disconnect = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { accountId } = req.body;
      const scope = {
        companyId: (req as any).user?.companyId || 'company-uuid-001',
        workspaceId: (req as any).user?.workspaceId || 'workspace-uuid-001',
        userId: (req as any).user?.id || 'user-uuid-001',
        userRole: (req as any).user?.role || 'Super Admin',
      };
      const result = await this.service.disconnectAccount(scope, accountId);
      res.json(result);
    } catch (err) {
      next(err);
    }
  };
}
