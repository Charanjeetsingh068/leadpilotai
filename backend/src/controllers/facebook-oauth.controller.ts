import { Request, Response, NextFunction } from 'express';
import { FacebookIntegrationService } from '../services/facebook-integration.service';
import { ENV } from '../config/env';

const REQUIRED_SCOPES = [
  'business_management',
  'pages_show_list',
  'pages_manage_metadata',
  'pages_read_engagement',
  'pages_manage_posts',
  'leads_retrieval',
  'instagram_basic',
  'instagram_manage_messages',
  'whatsapp_business_management',
  'whatsapp_business_messaging',
];

export class FacebookOAuthController {
  private service: FacebookIntegrationService;

  constructor() {
    this.service = new FacebookIntegrationService();
  }

  private getScope(req: Request) {
    return {
      companyId: (req as any).user?.companyId || (req.headers['x-company-id'] as string) || 'default-company',
      workspaceId: (req as any).user?.workspaceId || (req.headers['x-workspace-id'] as string) || 'default-workspace',
      userId: (req as any).user?.id || (req.headers['x-user-id'] as string) || 'default-user',
    };
  }

  startOAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const appId = ENV.FACEBOOK_APP_ID;
      const configId = ENV.FACEBOOK_CONFIG_ID;
      const redirectUri = ENV.FACEBOOK_REDIRECT_URI;
      const graphVersion = ENV.META_GRAPH_API_VERSION;

      const statePayload = {
        scope: this.getScope(req),
        timestamp: Date.now(),
      };
      const state = Buffer.from(JSON.stringify(statePayload)).toString('base64url');

      const VALID_META_SCOPES = [
        'public_profile',
        'email',
        'business_management',
        'pages_show_list',
        'pages_manage_metadata',
        'pages_read_engagement',
        'pages_manage_posts',
        'leads_retrieval',
        'instagram_basic',
        'instagram_manage_messages',
        'whatsapp_business_management',
        'whatsapp_business_messaging',
      ];

      // Facebook Login for Business Auth URL using Config ID Flow & Graph API v23.0 with rerequest prompt
      const oauthUrl = `https://www.facebook.com/${graphVersion}/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&config_id=${configId}&response_type=code&state=${state}&auth_type=rerequest&scope=${VALID_META_SCOPES.join(',')}`;

      res.json({
        success: true,
        data: {
          oauthUrl,
          configId,
          appId,
          businessId: ENV.FACEBOOK_BUSINESS_ID,
          graphVersion,
          redirectUri,
        },
      });
    } catch (err) {
      next(err);
    }
  };

  handleCallback = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code, state, error, error_reason, error_description } = req.query;

      if (error) {
        const errorMsg = (error_description as string) || (error_reason as string) || (error as string) || 'Meta Login for Business was cancelled or denied.';
        if (req.accepts('html')) {
          return res.status(400).send(`
            <!DOCTYPE html>
            <html>
            <head><title>Meta OAuth Denied</title></head>
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
        return res.status(400).json({ success: false, error: 'Missing authorization code parameter.' });
      }

      let scope = this.getScope(req);
      if (state) {
        try {
          const parsed = JSON.parse(Buffer.from(state as string, 'base64url').toString('utf8'));
          if (parsed.scope) scope = { ...scope, ...parsed.scope };
        } catch (e) {}
      }

      const redirectUri = ENV.FACEBOOK_REDIRECT_URI;
      const result = await this.service.handleOAuthCallback(scope, code as string, redirectUri);

      const liveAppUrl = 'https://leadpilotai-rust.vercel.app';
      const frontendTarget = `${liveAppUrl}/integrations/facebook`;

      if (req.headers.accept?.includes('text/html') || req.accepts('html')) {
        return res.send(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Meta Business Integration Connected</title>
          </head>
          <body style="font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #0f172a; color: white; margin: 0;">
            <div style="text-align: center; max-width: 480px; padding: 32px; background: #1e293b; border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5);">
              <div style="width: 64px; height: 64px; background: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto;">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <h2 style="font-size: 24px; font-weight: 700; margin: 0 0 12px 0;">Meta Integration Authorized!</h2>
              <p style="color: #94a3b8; font-size: 15px; margin-bottom: 24px;">Automatically discovering Business Portfolios, Pages, Instagram, WhatsApp, & Lead Forms...</p>
              <a href="${frontendTarget}" style="display: inline-block; padding: 10px 20px; background: #3b82f6; color: white; border-radius: 8px; text-decoration: none; font-weight: 600;">Return to LeadPilot Dashboard</a>
            </div>
            <script>
              const targetUrl = ${JSON.stringify(frontendTarget)};
              if (window.opener) {
                try {
                  window.opener.postMessage({ type: 'FB_OAUTH_SUCCESS', data: ${JSON.stringify(result)} }, '*');
                } catch (e) {}
                setTimeout(function() {
                  try { window.close(); } catch(e) {}
                }, 800);
              } else {
                setTimeout(function() {
                  window.location.href = targetUrl;
                }, 1000);
              }
            </script>
          </body>
          </html>
        `);
      }

      res.json({ success: true, data: result });
    } catch (err: any) {
      next(err);
    }
  };

  disconnect = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const scope = this.getScope(req);
      const { fbUserId } = req.body;
      const result = await this.service.disconnectAccount(scope, fbUserId);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };
}
