import crypto from 'crypto';
import { ENV } from '../config/env';
import { MetaTokenModel, IMetaTokenDocument } from '../models/MetaToken.model';
import { TokenHistoryModel } from '../models/TokenHistory.model';
import { MetaAccountModel } from '../models/MetaAccount.model';
import { RedisTokenCacheService } from './redis-token-cache.service';
import { MetaGraphApiService, logMetaEvent } from './meta-graph-api.service';

export interface MultiTenantScope {
  companyId: string;
  workspaceId: string;
  userId: string;
}

export class TokenManagementService {
  private encryptionKey: Buffer;
  private cacheService: RedisTokenCacheService;
  private metaGraphService: MetaGraphApiService;

  constructor() {
    const rawKey = process.env.ENCRYPTION_KEY || ENV.ENCRYPTION_KEY || 'leadpilot_super_secret_encryption_key_32bytes!!';
    this.encryptionKey = crypto.createHash('sha256').update(rawKey).digest();
    this.cacheService = new RedisTokenCacheService();
    this.metaGraphService = new MetaGraphApiService();
  }

  encrypt(plainText: string): { cipherText: string; iv: string; authTag: string } {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', this.encryptionKey, iv);
    let encrypted = cipher.update(plainText, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    return {
      cipherText: encrypted,
      iv: iv.toString('hex'),
      authTag,
    };
  }

  decrypt(cipherText: string, ivHex?: string, authTagHex?: string): string {
    if (!ivHex || !authTagHex) {
      if (cipherText.includes(':')) {
        const parts = cipherText.split(':');
        ivHex = parts[0];
        cipherText = parts[1];
        authTagHex = parts[2];
      } else {
        return cipherText;
      }
    }

    try {
      const iv = Buffer.from(ivHex, 'hex');
      const authTag = Buffer.from(authTagHex, 'hex');
      const decipher = crypto.createDecipheriv('aes-256-gcm', this.encryptionKey, iv);
      decipher.setAuthTag(authTag);
      let decrypted = decipher.update(cipherText, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (e) {
      logMetaEvent('Token Decryption Warning', { error: (e as Error).message });
      return cipherText;
    }
  }

  async storeEncryptedToken(
    scope: MultiTenantScope,
    fbUserId: string,
    rawAccessToken: string,
    tokenType: 'USER_LONG' | 'PAGE' | 'SYSTEM' = 'USER_LONG',
    expiresInSeconds: number = 5184000, // 60 days default
    scopesGranted: string[] = [],
    pageId?: string
  ): Promise<IMetaTokenDocument> {
    const { cipherText, iv, authTag } = this.encrypt(rawAccessToken);
    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);

    const filter: any = {
      workspaceId: scope.workspaceId,
      fbUserId,
      tokenType,
      ...(pageId ? { pageId } : {}),
    };

    const tokenDoc = (await MetaTokenModel.findOneAndUpdate(
      filter,
      {
        companyId: scope.companyId,
        userId: scope.userId,
        encryptedToken: cipherText,
        iv,
        authTag,
        expiresAt,
        tokenType,
        isHealthy: true,
        scopes: scopesGranted,
        lastRefreshedAt: new Date(),
      },
      { upsert: true, returnDocument: 'after' }
    )) as unknown as IMetaTokenDocument;

    // Update Redis Cache for ultra-fast zero-latency retrieval
    await this.cacheService.setCachedToken(scope.workspaceId, fbUserId, rawAccessToken, Math.min(expiresInSeconds, 86400), tokenType);

    // Log Token Lifecycle Event to TokenHistory
    await TokenHistoryModel.create({
      workspaceId: scope.workspaceId,
      companyId: scope.companyId,
      userId: scope.userId,
      fbUserId,
      eventType: 'EXCHANGE_SHORT_TO_LONG',
      status: 'SUCCESS',
      expiresAt,
    });

    logMetaEvent('Token Encrypted & Stored in MongoDB', {
      workspaceId: scope.workspaceId,
      fbUserId,
      tokenType,
      expiresAt: expiresAt.toISOString(),
    });

    return tokenDoc;
  }

  async getValidAccessToken(scope: MultiTenantScope, fbUserId: string, tokenType: 'USER_LONG' | 'PAGE' = 'USER_LONG'): Promise<string | null> {
    // 1. Check Redis Cache
    const cachedToken = await this.cacheService.getCachedToken(scope.workspaceId, fbUserId, tokenType);
    if (cachedToken) {
      return cachedToken;
    }

    // 2. Query Mongo Storage
    let tokenDoc = await MetaTokenModel.findOne({
      workspaceId: scope.workspaceId,
      fbUserId,
      tokenType,
      status: 'ACTIVE',
    });

    if (!tokenDoc) {
      tokenDoc = await MetaTokenModel.findOne({ status: 'ACTIVE' }).sort({ createdAt: -1 });
    }

    if (!tokenDoc) {
      if (process.env.FACEBOOK_USER_ACCESS_TOKEN || process.env.FACEBOOK_ACCESS_TOKEN) {
        return process.env.FACEBOOK_USER_ACCESS_TOKEN || process.env.FACEBOOK_ACCESS_TOKEN || null;
      }

      logMetaEvent('Active Token Not Found in Storage', { workspaceId: scope.workspaceId, fbUserId });
      return null;
    }

    const decrypted = this.decrypt(tokenDoc.encryptedToken, tokenDoc.iv, tokenDoc.authTag);
    if (!decrypted || decrypted.includes('_audit_token_')) {
      if (process.env.FACEBOOK_USER_ACCESS_TOKEN || process.env.FACEBOOK_ACCESS_TOKEN) {
        return process.env.FACEBOOK_USER_ACCESS_TOKEN || process.env.FACEBOOK_ACCESS_TOKEN || null;
      }
    }

    // 3. Auto Refresh Check: If token expires within 7 days, trigger auto refresh automatically
    const expiresAtMs = tokenDoc.expiresAt ? tokenDoc.expiresAt.getTime() : Date.now() + 5184000 * 1000;
    const daysUntilExpiry = (expiresAtMs - Date.now()) / (1000 * 3600 * 24);
    if (daysUntilExpiry < 7) {
      logMetaEvent('Token Nearing Expiry (<7 Days). Triggering Auto Refresh...', {
        workspaceId: scope.workspaceId,
        fbUserId,
        daysUntilExpiry: daysUntilExpiry.toFixed(1),
      });
      try {
        const refreshedToken = await this.refreshLongLivedToken(scope, fbUserId, decrypted);
        if (refreshedToken) return refreshedToken;
      } catch (err: any) {
        logMetaEvent('Auto Token Refresh Warning', { fbUserId, error: err.message });
      }
    }

    // Cache decrypted token in Redis
    const remainingSeconds = Math.max(300, Math.floor((expiresAtMs - Date.now()) / 1000));
    await this.cacheService.setCachedToken(scope.workspaceId, fbUserId, decrypted, Math.min(remainingSeconds, 86400), tokenType);

    return decrypted;
  }

  async refreshLongLivedToken(scope: MultiTenantScope, fbUserId: string, currentAccessToken?: string): Promise<string | null> {
    try {
      let tokenToRefresh = currentAccessToken;
      if (!tokenToRefresh) {
        const tokenDoc = await MetaTokenModel.findOne({ workspaceId: scope.workspaceId, fbUserId, tokenType: 'USER_LONG' });
        if (tokenDoc) {
          tokenToRefresh = this.decrypt(tokenDoc.encryptedToken, tokenDoc.iv, tokenDoc.authTag);
        }
      }

      if (!tokenToRefresh) {
        throw new Error('No current access token available to refresh');
      }

      const refreshedData = await this.metaGraphService.getLongLivedToken(tokenToRefresh);
      const newAccessToken = refreshedData.access_token;
      const expiresIn = refreshedData.expires_in || 5184000; // 60 days

      if (!newAccessToken) {
        throw new Error('Meta Graph API returned empty refreshed access token');
      }

      const updatedDoc = await this.storeEncryptedToken(
        scope,
        fbUserId,
        newAccessToken,
        'USER_LONG',
        expiresIn
      );

      await TokenHistoryModel.create({
        workspaceId: scope.workspaceId,
        companyId: scope.companyId,
        userId: scope.userId,
        fbUserId,
        eventType: 'AUTO_REFRESH',
        status: 'SUCCESS',
        expiresAt: updatedDoc.expiresAt,
      });

      await MetaAccountModel.updateOne(
        { workspaceId: scope.workspaceId, fbUserId },
        { tokenStatus: 'VALID', lastSyncedAt: new Date() }
      );

      logMetaEvent('Long-Lived Token Auto-Refreshed Successfully', {
        workspaceId: scope.workspaceId,
        fbUserId,
        newExpiresAt: updatedDoc.expiresAt ? updatedDoc.expiresAt.toISOString() : '',
      });

      return newAccessToken;
    } catch (err: any) {
      logMetaEvent('Refresh Long Lived Token Error', { fbUserId, error: err.message });
      if (err.message?.includes('invalid') || err.message?.includes('revoked') || err.message?.includes('190')) {
        await this.handleTokenRevocation(scope, fbUserId, err.message);
      }
      return null;
    }
  }

  async handleTokenRevocation(scope: MultiTenantScope, fbUserId: string, reason: string): Promise<void> {
    await MetaTokenModel.updateMany(
      { workspaceId: scope.workspaceId, fbUserId },
      { status: 'REVOKED', isHealthy: false }
    );

    await MetaAccountModel.updateOne(
      { workspaceId: scope.workspaceId, fbUserId },
      { tokenStatus: 'RECONNECT_REQUIRED' }
    );

    await this.cacheService.invalidateCachedToken(scope.workspaceId, fbUserId);

    await TokenHistoryModel.create({
      workspaceId: scope.workspaceId,
      companyId: scope.companyId,
      userId: scope.userId,
      fbUserId,
      eventType: 'REVOKED',
      status: 'FAILED',
      details: reason,
    });

    logMetaEvent('Token Revoked & Marked as RECONNECT_REQUIRED', { workspaceId: scope.workspaceId, fbUserId, reason });
  }

  async scanAndAutoRefreshTokens(): Promise<{ scanned: number; refreshed: number; revoked: number }> {
    const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 3600 * 1000);
    const expiringTokens = await MetaTokenModel.find({
      status: 'ACTIVE',
      expiresAt: { $lte: sevenDaysFromNow },
    });

    let refreshed = 0;
    let revoked = 0;

    for (const tokenDoc of expiringTokens) {
      const scope: MultiTenantScope = {
        workspaceId: tokenDoc.workspaceId,
        companyId: tokenDoc.companyId,
        userId: tokenDoc.userId,
      };

      try {
        const result = await this.refreshLongLivedToken(scope, tokenDoc.fbUserId);
        if (result) refreshed++;
        else revoked++;
      } catch (e) {
        revoked++;
      }
    }

    logMetaEvent('Background Token Auto-Refresh Job Completed', {
      scanned: expiringTokens.length,
      refreshed,
      revoked,
    });

    return { scanned: expiringTokens.length, refreshed, revoked };
  }
}
