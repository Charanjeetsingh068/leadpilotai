import { Request, Response, NextFunction } from 'express';
import { FacebookIntegrationService } from '../services/facebook-integration.service';

export class FacebookOAuthController {
  private service: FacebookIntegrationService;

  constructor() {
    this.service = new FacebookIntegrationService();
  }

  private getScope(req: Request) {
    return {
      companyId: (req as any).user?.companyId || (req.headers['x-company-id'] as string) || undefined,
      workspaceId: (req as any).user?.workspaceId || (req.headers['x-workspace-id'] as string) || undefined,
      userId: (req as any).user?.id || (req.headers['x-user-id'] as string) || undefined,
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
      const appUrl = (process.env.APP_URL || 'https://leadpilotai-rust.vercel.app').replace(/\/$/, '');
      const frontendTarget = `${appUrl}/integrations/facebook`;

      // Support both window popup postMessage integration and direct REST JSON
      if (req.headers.accept?.includes('text/html') || req.accepts('html')) {
        return res.send(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Meta Connection Success</title>
            <meta http-equiv="refresh" content="3;url=${frontendTarget}">
          </head>
          <body style="font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #0f172a; color: white; margin: 0;">
            <div style="text-align: center; max-width: 480px; padding: 32px; background: #1e293b; border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);">
              <div style="width: 64px; height: 64px; background: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto;">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <h2 style="font-size: 24px; font-weight: 700; margin: 0 0 12px 0; color: #f8fafc;">Meta Account Connected!</h2>
              <p style="color: #94a3b8; margin: 0 0 24px 0; font-size: 15px;">Your Facebook Business account has been authorized. Redirecting to LeadPilot AI...</p>
              <a href="${frontendTarget}" style="display: inline-block; padding: 10px 20px; background: #3b82f6; color: white; border-radius: 8px; text-decoration: none; font-weight: 600;">Return to Dashboard</a>
            </div>
            <script>
              const targetUrl = ${JSON.stringify(frontendTarget)};
              if (window.opener) {
                try {
                  window.opener.postMessage({ type: 'FB_OAUTH_SUCCESS', data: ${JSON.stringify(result)} }, '*');
                  window.opener.location.href = targetUrl;
                } catch (e) {}
                setTimeout(() => {
                  try { window.close(); } catch(e){}
                }, 1000);
              } else {
                setTimeout(() => {
                  window.location.href = targetUrl;
                }, 1500);
              }
            </script>
          </body>
          </html>
        `);
      }

      res.json({ success: true, data: result });
    } catch (err: any) {
      const errMsg = err.message || 'OAuth callback failed';
      const appUrl = (process.env.APP_URL || 'https://leadpilotai-rust.vercel.app').replace(/\/$/, '');
      const frontendTarget = `${appUrl}/integrations/facebook?error=${encodeURIComponent(errMsg)}`;

      if (req.accepts('html')) {
        return res.status(500).send(`
          <!DOCTYPE html>
          <html>
          <head><title>Meta OAuth Failed</title></head>
          <body style="font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #0f172a; color: white;">
            <div style="text-align: center; max-width: 480px; padding: 32px; background: #1e293b; border-radius: 16px;">
              <h2 style="color: #ef4444;">Authorization Failed</h2>
              <p style="color: #94a3b8;">${errMsg}</p>
              <a href="${frontendTarget}" style="color: #3b82f6;">Return to Integrations</a>
            </div>
            <script>
              const targetUrl = ${JSON.stringify(frontendTarget)};
              if (window.opener) {
                try {
                  window.opener.postMessage({ type: 'FB_OAUTH_ERROR', error: ${JSON.stringify(errMsg)} }, '*');
                } catch (e) {}
                setTimeout(() => { window.close(); }, 1500);
              } else {
                setTimeout(() => { window.location.href = targetUrl; }, 2000);
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
