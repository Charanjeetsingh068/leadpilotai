import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { ENV } from '../config/env';

/**
 * Base64URL Encoding Helper (RFC 4648)
 */
function base64UrlEncode(buffer: Buffer): string {
  return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Generates a PKCE Code Verifier (random string)
 */
function generateCodeVerifier(): string {
  return base64UrlEncode(crypto.randomBytes(32));
}

/**
 * Generates SHA-256 PKCE Code Challenge (S256)
 */
function generateCodeChallenge(verifier: string): string {
  const hash = crypto.createHash('sha256').update(verifier).digest();
  return base64UrlEncode(hash);
}

export class MetaLoginController {
  /**
   * GET /api/meta/login
   * Facebook Login for Business auth URL generator using Config ID Flow & PKCE (Zero legacy scope parameter).
   */
  getLoginUrl = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const appId = ENV.FACEBOOK_APP_ID;
      const configId = ENV.META_LOGIN_CONFIG_ID || ENV.FACEBOOK_CONFIG_ID || 'META_LOGIN_CONFIG_ID';
      const graphVersion = ENV.META_GRAPH_API_VERSION;

      // Dynamic redirect URI support for Production and Development
      const isProd = ENV.NODE_ENV === 'production' || process.env.NODE_ENV === 'production';
      const host = req.get('host') || 'localhost:5000';
      const protocol = req.protocol === 'https' || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';

      let redirectUri = ENV.FACEBOOK_REDIRECT_URI;
      if (!isProd && req.query.env === 'dev') {
        redirectUri = `${protocol}://${host}/api/integrations/facebook/callback`;
      } else if (req.query.redirect_uri && typeof req.query.redirect_uri === 'string') {
        redirectUri = req.query.redirect_uri;
      }

      // PKCE Code Verifier & Challenge (S256)
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = generateCodeChallenge(codeVerifier);

      // Workspace & Tenant Scoping
      const workspaceId = (req as any).user?.workspaceId || (req.headers['x-workspace-id'] as string) || (req.query.workspaceId as string) || 'default-workspace';
      const companyId = (req as any).user?.companyId || (req.headers['x-company-id'] as string) || (req.query.companyId as string) || 'default-company';
      const userId = (req as any).user?.id || (req.headers['x-user-id'] as string) || (req.query.userId as string) || 'default-user';

      // CSRF State Protection
      const nonce = crypto.randomBytes(16).toString('hex');
      const statePayload = {
        workspaceId,
        companyId,
        userId,
        nonce,
        timestamp: Date.now(),
      };
      const state = base64UrlEncode(Buffer.from(JSON.stringify(statePayload)));

      // Construct Facebook Login for Business Auth URL using Config ID Flow & Graph API v23.0
      // CRITICAL: NEVER include 'scope' parameter per Facebook Login for Business Config ID specification!
      const loginUrlParams = new URLSearchParams({
        client_id: appId,
        redirect_uri: redirectUri,
        config_id: configId,
        response_type: 'code',
        state,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
      });

      const loginUrl = `https://www.facebook.com/${graphVersion}/dialog/oauth?${loginUrlParams.toString()}`;

      res.json({
        success: true,
        data: {
          loginUrl,
          state,
          codeVerifier,
          codeChallenge,
          configId,
          appId,
          graphVersion,
          redirectUri,
          workspaceId,
        },
      });
    } catch (err) {
      next(err);
    }
  };
}
