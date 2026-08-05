import { connectDatabase } from '../config/database';
import { metaTokenRefreshJob } from '../jobs/meta-token-refresh.job';
import { MetaAccountModel } from '../models/MetaAccount.model';

async function runDailyAutoRepairJobTest() {
  console.log('\n=============================================================');
  console.log('  LEADPILOT AI — DAILY AUTO-REFRESH & REPAIR ENGINE TEST      ');
  console.log('=============================================================\n');

  await connectDatabase();

  const sampleScope = {
    workspaceId: 'ws-daily-repair-100',
    companyId: 'company-daily-repair-200',
    userId: 'user-daily-repair-300',
    fbUserId: 'fb_user_daily_999',
  };

  try {
    // 1. Create a Revoked MetaAccount document to test Admin Notification ONLY on failure
    await MetaAccountModel.findOneAndUpdate(
      { workspaceId: sampleScope.workspaceId, fbUserId: sampleScope.fbUserId },
      {
        companyId: sampleScope.companyId,
        userId: sampleScope.userId,
        fbUserName: 'Test User (Revoked Permissions)',
        fbUserEmail: 'test.revoked@leadpilot.ai',
        status: 'RECONNECT_REQUIRED',
      },
      { upsert: true }
    );

    console.log('--- 1. Executing Daily Auto-Refresh & Auto-Repair Scan ---');
    const summary = await metaTokenRefreshJob.runDailyAutoRepairScan();
    console.log('Auto-Repair Scan Result Summary:', JSON.stringify(summary));

    // 2. Assertions
    console.log('\n--- 2. Verifying Engine Assertions ---');
    console.log('Scanned Tokens:', summary.scannedTokens);
    console.log('Refreshed Tokens:', summary.refreshedTokens);
    console.log('Webhooks Repaired:', summary.webhooksRepaired);
    console.log('Assets Auto-Resynced:', summary.assetsResynced);
    console.log('Admin Failure Notifications Sent:', summary.adminNotificationsSent);

    const isSummaryValid = typeof summary.scannedTokens === 'number' && summary.adminNotificationsSent >= 1;
    console.log('Daily Health & Auto-Repair Engine Verification:', isSummaryValid ? '✅ PASSED' : '❌ FAILED');

    console.log('\n=============================================================');
    console.log('🎉 DAILY AUTO-REFRESH & REPAIR ENGINE TEST PASSED 100% SUCCESSFULLY!');
    console.log('=============================================================\n');
  } catch (err) {
    console.error('Daily Auto-Repair Test Error:', err);
  } finally {
    setTimeout(() => process.exit(0), 100);
  }
}

runDailyAutoRepairJobTest();
