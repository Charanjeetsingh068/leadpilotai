import { Request, Response, NextFunction } from 'express';
import { FacebookIntegrationService } from '../services/facebook-integration.service';

export class FacebookOAuthController {
  private service: FacebookIntegrationService;

  constructor() {
    this.service = new FacebookIntegrationService();
  }

  private getScope(req: Request) {
    return {
      companyId: (req as any).user?.companyId || (req.headers['x-company-id'] as string) || 'company-uuid-001',
      workspaceId: (req as any).user?.workspaceId || (req.headers['x-workspace-id'] as string) || 'workspace-uuid-001',
      userId: (req as any).user?.id || 'user-uuid-001',
      userRole: (req as any).user?.role || 'Super Admin',
    };
  }

  startOAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = this.getScope(req);
      const clientOrigin = req.body?.redirectUri || (req.headers.origin as string) || (req.headers.referer as string);
      const result = await this.service.startOAuth(scope, clientOrigin);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  handleCallback = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code, state, error, error_reason, error_description } = req.query;

      // Handle OAuth error or user cancellation from Meta dialog
      if (error) {
        const errorMsg = (error_description as string) || (error_reason as string) || (error as string) || 'Meta OAuth process was cancelled or denied.';
        if (req.accepts('html')) {
          return res.status(400).send(`
            <!DOCTYPE html>
            <html>
            <head><title>Meta OAuth Cancelled</title></head>
            <body>
              <script>
                if (window.opener) {
                  window.opener.postMessage({ type: 'FB_OAUTH_ERROR', error: ${JSON.stringify(errorMsg)} }, '*');
                  window.close();
                } else {
                  window.location.href = '/integrations/facebook?error=' + encodeURIComponent(${JSON.stringify(errorMsg)});
                }
              </script>
            </body>
            </html>
          `);
        }
        return res.status(400).json({ success: false, error: errorMsg });
      }

      if (!code) {
        return res.status(400).json({ success: false, error: 'invalid_code: Missing authorization code parameter.' });
      }

      const redirectUri = process.env.FACEBOOK_REDIRECT_URI || 'https://leadpilotai-2kar.onrender.com/api/integrations/facebook/callback';
      const scope = this.getScope(req);

      const result = await this.service.handleOAuthCallback(scope, code as string, redirectUri, state as string);

      // Support both window popup postMessage integration and direct REST JSON
      if (req.headers.accept?.includes('text/html') || req.accepts('html')) {
        return res.send(`
          <!DOCTYPE html>
          <html>
          <head><title>Meta Connection Success</title></head>
          <body style="font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #0f172a; color: white;">
            <div style="text-align: center;">
              <h2>Facebook Connected Successfully!</h2>
              <p>Closing window and returning to LeadPilot AI...</p>
            </div>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'FB_OAUTH_SUCCESS', data: ${JSON.stringify(result)} }, '*');
                setTimeout(() => window.close(), 800);
              } else {
                window.location.href = '/integrations/facebook';
              }
            </script>
          </body>
          </html>
        `);
      }

      res.json({ success: true, data: result });
    } catch (err: any) {
      const errMsg = err.message || 'OAuth callback failed';
      if (req.accepts('html')) {
        return res.status(500).send(`
          <!DOCTYPE html>
          <html>
          <head><title>Meta OAuth Failed</title></head>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'FB_OAUTH_ERROR', error: ${JSON.stringify(errMsg)} }, '*');
                window.close();
              } else {
                window.location.href = '/integrations/facebook?error=' + encodeURIComponent(${JSON.stringify(errMsg)});
              }
            </script>
          </body>
          </html>
        `);
      }
      next(err);
    }
  };

  disconnect = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { accountId } = req.body;
      const scope = this.getScope(req);
      const result = await this.service.disconnectAccount(scope, accountId);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };
}
