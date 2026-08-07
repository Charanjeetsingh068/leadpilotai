'use client';

import React from 'react';
import { BookOpen, RefreshCw, Unplug, ShieldCheck, Activity } from 'lucide-react';
import { useFacebookIntegration } from '@/hooks/useFacebookIntegration';
import { FacebookConnectionWizard } from '@/components/facebook/FacebookConnectionWizard';
import { FacebookConnectionCard } from '@/components/facebook/FacebookConnectionCard';
import { ConnectedAccountsTable } from '@/components/facebook/ConnectedAccountsTable';
import { BusinessManagerCard } from '@/components/facebook/BusinessManagerCard';
import { ConnectedPagesTable } from '@/components/facebook/ConnectedPagesTable';
import { InstagramAccountsCard } from '@/components/facebook/InstagramAccountsCard';
import { WhatsAppBusinessCard } from '@/components/facebook/WhatsAppBusinessCard';
import { AdAccountsCard } from '@/components/facebook/AdAccountsCard';
import { LeadFormsTable } from '@/components/facebook/LeadFormsTable';
import { PermissionsCard } from '@/components/facebook/PermissionsCard';
import { WebhookHealthCard } from '@/components/facebook/WebhookHealthCard';
import { LiveSyncActivityStream } from '@/components/facebook/LiveSyncActivityStream';
import { SyncOverviewChart } from '@/components/facebook/SyncOverviewChart';
import { BottomAnalyticsCards } from '@/components/facebook/BottomAnalyticsCards';
import { AddAccountModal } from '@/components/facebook/AddAccountModal';
import { FormPreviewModal } from '@/components/facebook/FormPreviewModal';

export default function FacebookIntegrationPage() {
  const {
    data,
    integrationStatus,
    selectedBusinessId,
    handleBusinessChange,
    accountsSearch,
    setAccountsSearch,
    isAddAccountOpen,
    setIsAddAccountOpen,
    previewForm,
    setPreviewForm,
    isConnecting,
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

  const activeAccounts = data?.accounts?.filter((a: any) => a.tokenStatus !== 'Disconnected' && a.status !== 'Disconnected' && a.tokenStatus !== 'REVOKED') || [];
  const hasAccounts = Boolean(activeAccounts.length > 0);
  const isConnected = integrationStatus === 'CONNECTED' || hasAccounts || data?.connection?.isConnected === true;

  return (
    <div className="fb-page-container">
      {/* Top Header / Breadcrumb Bar */}
      <div className="fb-header-bar">
        <div className="fb-header-left">
          <div className="fb-breadcrumb">
            Integrations &gt; <span className="fb-breadcrumb-active">Meta Business Integration Center</span>
          </div>
          <h1 className="fb-page-title">Meta Business Integration Center</h1>
          <p className="fb-page-subtitle">
            Enterprise Management for Meta Business Manager (ID: <code>312449849278509</code>), Facebook Pages, Instagram Accounts, WhatsApp Business, Ad Accounts &amp; Realtime Lead Forms.
          </p>
        </div>

        <div className="fb-header-right">
          {isConnected && (
            <>
              <button
                type="button"
                className="fb-btn-sync"
                onClick={() => manualSync()}
                disabled={isManualSyncing}
              >
                <RefreshCw size={16} className={isManualSyncing ? 'fb-spin' : ''} />
                <span>{isManualSyncing ? 'Syncing...' : 'Sync Now'}</span>
              </button>

              <button
                type="button"
                className="fb-btn-disconnect"
                onClick={() => disconnectAccount('primary')}
              >
                <Unplug size={16} />
                <span>Disconnect</span>
              </button>
            </>
          )}

          <button type="button" className="fb-btn-guide">
            <BookOpen size={16} />
            <span>Integration Guide</span>
          </button>
        </div>
      </div>

      {/* Realtime Status Banner Bar */}
      <div className="fb-realtime-status-bar">
        <div className="status-indicator-box">
          <Activity size={18} className="text-emerald" />
          <span className="status-title">Realtime System Status:</span>
          <span className={`status-badge ${isConnected ? 'status-badge-active' : 'status-badge-offline'}`}>
            {isConnected ? 'LIVE & SUBSCRIBED' : 'NOT CONNECTED'}
          </span>
        </div>
        <div className="status-meta-info">
          <ShieldCheck size={16} className="text-emerald" />
          <span>Graph API v23.0 &bull; Facebook Login for Business &bull; AES-256 Encrypted</span>
        </div>
      </div>


      {/* Full dynamic dashboard populated from backend */}
      <>
        {/* Main Grid Section Row 1: Connection & Accounts + Live Stream */}
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

        {/* Main Grid Section Row 2: Portfolio, Pages, Instagram, WhatsApp, Ad Accounts & Lead Forms */}
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
                totalPages={data?.totalPages || 0}
                onRefreshPages={() => syncPages(undefined)}
                isRefreshing={isSyncingPages}
              />
            </div>

            <div className="fb-grid-three-col">
              <InstagramAccountsCard accounts={data?.instagramAccounts || []} />
              <WhatsAppBusinessCard accounts={data?.whatsAppAccounts || []} />
              <AdAccountsCard accounts={data?.adAccounts || []} />
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

        {/* Main Grid Section Row 3: Permissions, Webhook Health, Chart */}
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
      </>

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
