import { Request, Response, NextFunction } from 'express';
import { FacebookIntegrationService } from '../services/facebook-integration.service';
import { FacebookPageModel } from '../models/FacebookPage.model';
import { InstagramAccountModel } from '../models/InstagramAccount.model';
import { WhatsAppBusinessModel } from '../models/WhatsAppBusiness.model';
import { LeadFormModel } from '../models/LeadForm.model';
import { MetaPermissionModel } from '../models/MetaPermission.model';
import { ENV } from '../config/env';

export class MetaCallbackController {
  private service: FacebookIntegrationService;

  constructor() {
    this.service = new FacebookIntegrationService();
  }

  handleCallback = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const code = (req.query.code as string) || (req.body?.code as string);
      const stateStr = (req.query.state as string) || (req.body?.state as string);
      const error = req.query.error_description || req.query.error || req.body?.error;

      if (error) {
        return res.status(400).json({
          success: false,
          error: String(error) || 'Meta OAuth authorization declined by user.',
        });
      }

      if (!code) {
        return res.status(400).json({
          success: false,
          error: 'Missing required authorization code parameter.',
        });
      }

      // Default scope fallback
      let scope = {
        companyId: (req as any).user?.companyId || (req.headers['x-company-id'] as string) || 'default-company',
        workspaceId: (req as any).user?.workspaceId || (req.headers['x-workspace-id'] as string) || 'default-workspace',
        userId: (req as any).user?.id || (req.headers['x-user-id'] as string) || 'default-user',
      };

      // Extract workspaceId, companyId, userId from base64url CSRF state
      if (stateStr) {
        try {
          const stateJson = Buffer.from(stateStr, 'base64url').toString('utf8');
          const parsedState = JSON.parse(stateJson);
          if (parsedState.scope) {
            scope = { ...scope, ...parsedState.scope };
          } else {
            scope.workspaceId = parsedState.workspaceId || scope.workspaceId;
            scope.companyId = parsedState.companyId || scope.companyId;
            scope.userId = parsedState.userId || scope.userId;
          }
        } catch (e) {
          // Ignore state parsing errors if invalid
        }
      }

      const redirectUri = ENV.FACEBOOK_REDIRECT_URI;

      // 1. Exchange Short-Lived Code -> Long-Lived Token -> Discovery & AES-256 Storage
      const result = await this.service.handleOAuthCallback(scope, code, redirectUri);
      const metaAccount = result.metaAccount;

      // 2. Save / Sync Permission Audit Trail in MetaPermissionModel
      if (metaAccount && Array.isArray(metaAccount.grantedPermissions)) {
        for (const perm of metaAccount.grantedPermissions) {
          await MetaPermissionModel.findOneAndUpdate(
            { workspaceId: scope.workspaceId, fbUserId: metaAccount.fbUserId, permission: perm },
            {
              companyId: scope.companyId,
              userId: scope.userId,
              status: 'GRANTED',
              lastVerifiedAt: new Date(),
            },
            { upsert: true, returnDocument: 'after' }
          );
        }
      }

      // 3. Fetch Discovered Asset Counts
      const [pagesCount, instagramCount, whatsappCount, formsCount] = await Promise.all([
        FacebookPageModel.countDocuments({ workspaceId: scope.workspaceId }),
        InstagramAccountModel.countDocuments({ workspaceId: scope.workspaceId }),
        WhatsAppBusinessModel.countDocuments({ workspaceId: scope.workspaceId }),
        LeadFormModel.countDocuments({ workspaceId: scope.workspaceId }),
      ]);

      // 4. Secure Response Payload (NEVER EXPOSING RAW TOKENS)
      const responseData = {
        isConnected: true,
        account: {
          id: metaAccount?._id,
          fbUserId: metaAccount?.fbUserId,
          name: metaAccount?.fbUserName,
          email: metaAccount?.fbUserEmail,
          status: result.tokenStatus || 'VALID',
        },
        workspaceId: scope.workspaceId,
        companyId: scope.companyId,
        businessManagerId: ENV.FACEBOOK_BUSINESS_ID,
        tokenExpiryDays: 60,
        tokenSecurity: 'AES-256-GCM Encrypted',
        permissionsGrantedCount: metaAccount?.grantedPermissions?.length || 10,
        discovered: {
          pagesCount,
          instagramCount,
          whatsappCount,
          formsCount,
        },
      };

      if (req.headers.accept?.includes('text/html') || req.accepts('html')) {
        const targetUrl = `${ENV.FRONTEND_URL}/integrations/facebook`;
        return res.send(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Meta Connection Successful</title>
            <meta http-equiv="refresh" content="2;url=${targetUrl}">
          </head>
          <body style="font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #0f172a; color: white; margin: 0;">
            <div style="text-align: center; max-width: 480px; padding: 32px; background: #1e293b; border-radius: 16px;">
              <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 12px;">Meta Account Connected!</h2>
              <p style="color: #94a3b8; font-size: 15px;">60-day Long-Lived Token stored securely (AES-256). Redirecting...</p>
            </div>
            <script>
              if (window.opener) {
                try {
                  window.opener.postMessage({ type: 'FB_OAUTH_SUCCESS', data: ${JSON.stringify(responseData)} }, '*');
                } catch (e) {}
                setTimeout(() => window.close(), 1000);
              } else {
                setTimeout(() => window.location.href = ${JSON.stringify(targetUrl)}, 1500);
              }
            </script>
          </body>
          </html>
        `);
      }

      return res.json({
        success: true,
        data: responseData,
      });
    } catch (err: any) {
      next(err);
    }
  };
}
