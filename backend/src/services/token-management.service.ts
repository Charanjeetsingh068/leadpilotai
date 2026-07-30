import { encryptToken, decryptToken } from '../utils/crypto.util';
import { FacebookRepository } from '../repositories/facebook.repository';

export class TokenManagementService {
  private facebookRepo: FacebookRepository;

  constructor() {
    this.facebookRepo = new FacebookRepository();
  }

  encrypt(token: string): string {
    return encryptToken(token);
  }

  decrypt(encryptedToken: string): string {
    return decryptToken(encryptedToken);
  }

  async checkAndRefreshToken(accountId: string): Promise<string | null> {
    const account = await this.facebookRepo.findAccountById(accountId);
    if (!account) return null;

    const decryptedToken = this.decrypt(account.accessToken);
    const now = new Date();
    const expiry = new Date(account.tokenExpiresAt);

    const daysUntilExpiry = (expiry.getTime() - now.getTime()) / (1000 * 3600 * 24);

    if (daysUntilExpiry <= 7) {
      try {
        const appId = process.env.FACEBOOK_APP_ID || '123456789012345';
        const appSecret = process.env.FACEBOOK_APP_SECRET || 'secret_key_123456';
        
        const url = `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${encodeURIComponent(decryptedToken)}`;
        const res = await fetch(url);
        const data = await res.json();

        if (res.ok && data.access_token) {
          const newLongLivedToken = data.access_token;
          const expiresInSeconds = data.expires_in || 5184000;
          const newExpiry = new Date(Date.now() + expiresInSeconds * 1000);
          const encryptedNewToken = this.encrypt(newLongLivedToken);

          await this.facebookRepo.upsertAccount({
            companyId: account.companyId,
            workspaceId: account.workspaceId,
            userId: account.userId,
            accountName: account.accountName,
            fbUserId: account.fbUserId,
            accessToken: encryptedNewToken,
            tokenExpiresAt: newExpiry,
            tokenStatus: 'Active',
          });

          await this.facebookRepo.logEvent({
            companyId: account.companyId,
            workspaceId: account.workspaceId,
            eventType: 'TOKEN_REFRESHED',
            title: `Token Refreshed for ${account.accountName}`,
            description: `Meta token refreshed successfully. Next expiry: ${newExpiry.toISOString()}`,
          });

          return newLongLivedToken;
        }
      } catch (err: any) {
        console.error('Failed to refresh Meta token:', err.message);
        
        await this.facebookRepo.logEvent({
          companyId: account.companyId,
          workspaceId: account.workspaceId,
          eventType: 'TOKEN_REFRESH_FAILED',
          title: `Token Refresh Failed for ${account.accountName}`,
          description: err.message,
          status: 'FAILED',
        });
      }
    }

    return decryptedToken;
  }
}
