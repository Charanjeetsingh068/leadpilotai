import { TokenManagementService } from '../services/token-management.service';
import { FacebookWebhookService } from '../services/facebook-webhook.service';
import { MetaDiscoveryService } from '../services/meta-discovery.service';
import { MetaAccountModel } from '../models/MetaAccount.model';
import { MetaTokenModel } from '../models/MetaToken.model';
import { logMetaEvent } from '../services/meta-graph-api.service';

export interface DailyAutoRepairSummary {
  scannedTokens: number;
  refreshedTokens: number;
  revokedTokens: number;
  webhooksRepaired: number;
  assetsResynced: number;
  adminNotificationsSent: number;
}

export class MetaTokenRefreshJob {
  private tokenService: TokenManagementService;
  private webhookService: FacebookWebhookService;
  private discoveryService: MetaDiscoveryService;
  private intervalTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.tokenService = new TokenManagementService();
    this.webhookService = new FacebookWebhookService();
    this.discoveryService = new MetaDiscoveryService();
  }

  startScheduler(checkIntervalMs: number = 86400000) { // Default Every 24 Hours (Every Day)
    logMetaEvent('Daily Meta Auto-Refresh & Repair Scheduler Started', { checkIntervalMs });
    
    // Initial run on boot
    this.runDailyAutoRepairScan();

    // Periodic scheduled interval (Every day)
    this.intervalTimer = setInterval(() => {
      this.runDailyAutoRepairScan();
    }, checkIntervalMs);
  }

  stopScheduler() {
    if (this.intervalTimer) {
      clearInterval(this.intervalTimer);
      this.intervalTimer = null;
      logMetaEvent('Daily Meta Auto-Refresh Scheduler Stopped');
    }
  }

  async runDailyAutoRepairScan(): Promise<DailyAutoRepairSummary> {
    const summary: DailyAutoRepairSummary = {
      scannedTokens: 0,
      refreshedTokens: 0,
      revokedTokens: 0,
      webhooksRepaired: 0,
      assetsResynced: 0,
      adminNotificationsSent: 0,
    };

    try {
      logMetaEvent('--- Starting Daily Meta Health & Auto-Repair Engine Scan ---');

      // 1. Token Check & Auto-Refresh (< 7d Expiration)
      const tokenSummary = await this.tokenService.scanAndAutoRefreshTokens();
      summary.scannedTokens = tokenSummary.scanned || 0;
      summary.refreshedTokens = tokenSummary.refreshed || 0;
      summary.revokedTokens = tokenSummary.revoked || 0;

      // 2. Webhook Auto-Repair & Resubscription
      const webhookSummary = await this.webhookService.retryFailedSubscriptions();
      summary.webhooksRepaired = webhookSummary.retriedCount || 0;

      // 3. Assets Auto-Resync Across Active Workspaces
      const activeAccounts = await MetaAccountModel.find({ status: 'CONNECTED' });
      for (const account of activeAccounts) {
        try {
          const tokenDoc = await MetaTokenModel.findOne({
            workspaceId: account.workspaceId,
            fbUserId: account.fbUserId,
            status: 'ACTIVE',
            isHealthy: true,
          });

          if (tokenDoc) {
            const scope = {
              workspaceId: account.workspaceId,
              companyId: account.companyId,
              userId: account.userId,
            };
            const decryptedToken = this.tokenService.decrypt(tokenDoc.encryptedToken, tokenDoc.iv, tokenDoc.authTag);
            await this.discoveryService.runAutomaticDiscovery(scope, decryptedToken);
            summary.assetsResynced++;
          }
        } catch (resyncErr: any) {
          logMetaEvent('Asset Auto-Resync Warning', { workspaceId: account.workspaceId, error: resyncErr.message });
        }
      }

      // 4. Permission & Revocation Check — Notify Admin ONLY if Repair Fails
      const failedAccounts = await MetaAccountModel.find({
        $or: [{ tokenStatus: 'REVOKED' }, { tokenStatus: 'RECONNECT_REQUIRED' }, { status: 'RECONNECT_REQUIRED' }],
      });
      for (const fa of failedAccounts) {
        await this.notifyAdminOnlyOnFailure({
          workspaceId: fa.workspaceId,
          userId: fa.userId,
          fbUserId: fa.fbUserId,
          title: '🚨 Meta Integration Requires Admin Reconnect',
          message: `Automatic token repair failed for user ${fa.fbUserName || fa.fbUserId}. Meta token permissions were revoked in Facebook Settings. Please reconnect.`,
        });
        summary.adminNotificationsSent++;
      }

      logMetaEvent('--- Daily Meta Health & Auto-Repair Engine Completed ---', summary);
      return summary;
    } catch (err: any) {
      logMetaEvent('Daily Meta Health & Auto-Repair Engine Error', { error: err.message });
      return summary;
    }
  }

  private async notifyAdminOnlyOnFailure(payload: { workspaceId: string; userId: string; fbUserId: string; title: string; message: string }) {
    logMetaEvent('Admin Notification Triggered (Repair Failed)', payload);
  }
}

export const metaTokenRefreshJob = new MetaTokenRefreshJob();
