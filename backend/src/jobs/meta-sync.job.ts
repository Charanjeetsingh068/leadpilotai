import { MetaAccountModel } from '../models/MetaAccount.model';
import { TokenManagementService } from '../services/token-management.service';
import { MetaDiscoveryService } from '../services/meta-discovery.service';
import { logMetaEvent } from '../services/meta-graph-api.service';

export async function run15MinuteMetaSync() {
  logMetaEvent('Starting 15-Minute Automated Meta Synchronization Job');

  const tokenService = new TokenManagementService();
  const discoveryService = new MetaDiscoveryService();

  try {
    const activeAccounts = await MetaAccountModel.find({
      tokenStatus: { $ne: 'REVOKED' },
    });

    logMetaEvent('Active Accounts Selected for 15-Minute Sync', { count: activeAccounts.length });

    for (const acc of activeAccounts) {
      try {
        const scope = {
          workspaceId: acc.workspaceId,
          companyId: acc.companyId,
          userId: acc.userId,
        };

        // Check & Refresh token if expiring
        const validToken = await tokenService.getValidAccessToken(scope, acc.fbUserId);
        if (validToken) {
          await discoveryService.runAutomaticDiscovery(scope, validToken);
          logMetaEvent(`15-Min Sync Cycle Completed for User: ${acc.fbUserName}`, { fbUserId: acc.fbUserId });
        }
      } catch (accErr: any) {
        logMetaEvent(`15-Min Sync Cycle Account Warning: ${acc.fbUserName}`, { error: accErr.message });
      }
    }
  } catch (err: any) {
    logMetaEvent('15-Minute Meta Sync Job Global Failure', { error: err.message });
  }
}

export function startMetaSyncCron() {
  logMetaEvent('Initializing Meta 15-Minute Sync Background Cron Worker');

  // Run initial sync on boot after 10s delay
  setTimeout(() => {
    run15MinuteMetaSync();
  }, 10000);

  // Interval timer every 15 minutes
  setInterval(() => {
    run15MinuteMetaSync();
  }, 15 * 60 * 1000);
}
