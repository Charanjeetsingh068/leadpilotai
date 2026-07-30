'use client';

import React from 'react';
import { BookOpen, RefreshCw } from 'lucide-react';
import { useFacebookIntegration } from '@/hooks/useFacebookIntegration';
import { FacebookConnectionCard } from '@/components/facebook/FacebookConnectionCard';
import { ConnectedAccountsTable } from '@/components/facebook/ConnectedAccountsTable';
import { BusinessManagerCard } from '@/components/facebook/BusinessManagerCard';
import { ConnectedPagesTable } from '@/components/facebook/ConnectedPagesTable';
import { LeadFormsTable } from '@/components/facebook/LeadFormsTable';
import { PermissionsCard } from '@/components/facebook/PermissionsCard';
import { WebhookHealthCard } from '@/components/facebook/WebhookHealthCard';
import { LiveSyncActivityStream } from '@/components/facebook/LiveSyncActivityStream';
import { SyncOverviewChart } from '@/components/facebook/SyncOverviewChart';
import { BottomAnalyticsCards } from '@/components/facebook/BottomAnalyticsCards';
import { AddAccountModal } from '@/components/facebook/AddAccountModal';
import { FormPreviewModal } from '@/components/facebook/FormPreviewModal';
import { facebookIntegrationService } from '@/services/facebook-integration.service';

export default function FacebookIntegrationPage() {
  const {
    data,
    isLoading,
    selectedBusinessId,
    handleBusinessChange,
    accountsSearch,
    setAccountsSearch,
    isAddAccountOpen,
    setIsAddAccountOpen,
    previewForm,
    setPreviewForm,
    isConnecting,
    connectionSuccessMsg,
    connectionErrorMsg,
    handleConnectFacebook,
    disconnectAccount,
    syncPages,
    isSyncingPages,
    syncForms,
    isSyncingForms,
    toggleFormActive,
    assignAiAgent,
    retryWebhooks,
    isRetryingWebhooks,
    manualSync,
    isManualSyncing,
  } = useFacebookIntegration();

  return (
    <div className="fb-page-container">
      {/* Top Header / Breadcrumb Bar */}
      <div className="fb-header-bar">
        <div className="fb-header-left">
          <div className="fb-breadcrumb font-sans text-xs text-muted">
            Integrations &gt; <span className="text-main font-medium">Facebook Integration</span>
          </div>
          <h1 className="fb-page-title text-2xl font-bold">Facebook Integration</h1>
          <p className="fb-page-subtitle text-sm text-subtle">
            Connect and manage your Facebook accounts, pages and lead forms.
          </p>
        </div>

        <div className="fb-header-right">
          <button type="button" className="fb-btn-guide">
            <BookOpen size={16} />
            <span>Integration Guide</span>
          </button>
        </div>
      </div>

      {/* Success Banner */}
      {connectionSuccessMsg && (
        <div className="fb-business-access-status">
          <div className="fb-access-message">
            <span>✔ {connectionSuccessMsg}</span>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {connectionErrorMsg && (
        <div className="fb-status-badge expired">
          <span>⚠️ {connectionErrorMsg}</span>
        </div>
      )}

      {/* Main Grid Section Row 1 */}
      <div className="fb-grid-row-top">
        <div className="fb-col-left">
          <FacebookConnectionCard
            connection={data?.connection}
            onReconnect={handleConnectFacebook}
            isConnecting={isConnecting}
          />
          <ConnectedAccountsTable
            accounts={data?.accounts || []}
            onAddAccount={() => setIsAddAccountOpen(true)}
            onDisconnectAccount={disconnectAccount}
            search={accountsSearch}
            onSearchChange={setAccountsSearch}
          />
        </div>

        <div className="fb-col-right">
          <LiveSyncActivityStream events={data?.recentEvents || []} />
        </div>
      </div>

      {/* Main Grid Section Row 2 */}
      <div className="fb-grid-row-middle">
        <div className="fb-col-left">
          <div className="fb-grid-two-col">
            <BusinessManagerCard
              businesses={data?.businesses || []}
              selectedBusinessId={selectedBusinessId}
              onBusinessChange={handleBusinessChange}
            />
            <ConnectedPagesTable
              pages={data?.pages || []}
              totalPages={data?.totalPages || 4}
              onRefreshPages={() => syncPages('acc_1')}
              isRefreshing={isSyncingPages}
            />
          </div>

          <LeadFormsTable
            forms={data?.forms || []}
            onAssignAiAgent={(formId, agentId) => assignAiAgent({ formId, aiAgentId: agentId })}
            onToggleActive={toggleFormActive}
            onSyncForms={() => syncForms(undefined)}
            onPreviewForm={(form) => setPreviewForm(form)}
            isSyncing={isSyncingForms}
          />
        </div>
      </div>

      {/* Main Grid Section Row 3 */}
      <div className="fb-grid-row-bottom">
        <div className="fb-grid-three-col">
          <PermissionsCard permissions={data?.permissions || []} />
          <WebhookHealthCard
            webhookHealth={data?.webhookHealth}
            onRetryWebhooks={() => retryWebhooks()}
            isRetrying={isRetryingWebhooks}
          />
          <SyncOverviewChart />
        </div>
      </div>

      {/* Bottom Summary Analytics Cards */}
      <BottomAnalyticsCards metrics={data?.metrics} />

      {/* Modals */}
      <AddAccountModal
        isOpen={isAddAccountOpen}
        onClose={() => setIsAddAccountOpen(false)}
        onConnect={handleConnectFacebook}
        isConnecting={isConnecting}
      />
      <FormPreviewModal
        form={previewForm}
        onClose={() => setPreviewForm(null)}
      />
    </div>
  );
}
