import { FacebookIntegrationService } from '../services/facebook-integration.service';
import { prisma } from '../config/database';
import { logMetaEvent } from '../services/meta-graph-api.service';

const integrationService = new FacebookIntegrationService();
const SYNC_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

export async function runMetaSyncCycle() {
  logMetaEvent('5-Minute Meta Sync Job Triggered', { timestamp: new Date().toISOString() });

  try {
    const activeAccounts = await prisma.facebookAccount.findMany({
      where: { tokenStatus: 'Active' },
      select: { id: true, companyId: true, workspaceId: true, userId: true, accountName: true },
    });

    logMetaEvent('Active Accounts for Scheduled Sync', { count: activeAccounts.length });

    for (const acc of activeAccounts) {
      try {
        const scope = {
          companyId: acc.companyId,
          workspaceId: acc.workspaceId,
          userId: acc.userId,
        };

        const result = await integrationService.syncAssets(scope);
        logMetaEvent(`Scheduled Sync Completed for Account: ${acc.accountName}`, { accountId: acc.id, result });
      } catch (accErr: any) {
        logMetaEvent(`Scheduled Sync Account Warning: ${acc.accountName}`, { accountId: acc.id, error: accErr.message });
      }
    }
  } catch (err: any) {
    logMetaEvent('15-Minute Meta Sync Job Global Failure', { error: err.message });
  }
}

export function startMetaSyncCron() {
  logMetaEvent('Initializing Meta 15-Minute Sync Background Worker');
  
  // Run initial sync after 10 seconds of server startup
  setTimeout(() => {
    runMetaSyncCycle();
  }, 10000);

  // Repeat every 15 minutes
  setInterval(() => {
    runMetaSyncCycle();
  }, SYNC_INTERVAL_MS);
}
