import { ENV } from '../config/env';

export class RedisTokenCacheService {
  private inMemoryCache: Map<string, { value: string; expiresAt: number }> = new Map();
  private redisClient: any = null;

  constructor() {
    this.initRedis();
  }

  private async initRedis() {
    try {
      const ioredis = require('ioredis');
      this.redisClient = new ioredis({
        host: ENV.REDIS_HOST,
        port: ENV.REDIS_PORT,
        maxRetriesPerRequest: 1,
        enableOfflineQueue: false,
        retryStrategy: () => null,
      });

      this.redisClient.on('error', () => {
        this.redisClient = null;
      });
    } catch (e) {
      this.redisClient = null;
    }
  }

  private getKey(workspaceId: string, fbUserId: string, tokenType: string = 'USER_LONG'): string {
    return `meta:token:${workspaceId}:${fbUserId}:${tokenType}`;
  }

  async getCachedToken(workspaceId: string, fbUserId: string, tokenType: string = 'USER_LONG'): Promise<string | null> {
    const key = this.getKey(workspaceId, fbUserId, tokenType);

    if (this.redisClient) {
      try {
        const cached = await this.redisClient.get(key);
        if (cached) return cached;
      } catch (e) {
        // Fallback to in-memory cache
      }
    }

    const memItem = this.inMemoryCache.get(key);
    if (memItem) {
      if (Date.now() < memItem.expiresAt) {
        return memItem.value;
      }
      this.inMemoryCache.delete(key);
    }

    return null;
  }

  async setCachedToken(workspaceId: string, fbUserId: string, token: string, ttlSeconds: number = 3600, tokenType: string = 'USER_LONG'): Promise<void> {
    const key = this.getKey(workspaceId, fbUserId, tokenType);

    if (this.redisClient) {
      try {
        await this.redisClient.setex(key, ttlSeconds, token);
      } catch (e) {
        // Fallback to in-memory cache
      }
    }

    this.inMemoryCache.set(key, {
      value: token,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  async invalidateCachedToken(workspaceId: string, fbUserId: string, tokenType: string = 'USER_LONG'): Promise<void> {
    const key = this.getKey(workspaceId, fbUserId, tokenType);

    if (this.redisClient) {
      try {
        await this.redisClient.del(key);
      } catch (e) {}
    }

    this.inMemoryCache.delete(key);
  }
}
