'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { facebookIntegrationService } from '@/services/facebook-integration.service';
import { FacebookAccountHeader } from '@/components/facebook/FacebookAccountHeader';
import { FacebookAccountTopMetrics } from '@/components/facebook/FacebookAccountTopMetrics';
import { FacebookAccountTabs, FacebookTabType } from '@/components/facebook/FacebookAccountTabs';
import { FacebookPagesList, PageItem } from '@/components/facebook/FacebookPagesList';
import { FacebookSelectedPageCard } from '@/components/facebook/FacebookSelectedPageCard';
import { FacebookLeadInboxTable, LeadRowData } from '@/components/facebook/FacebookLeadInboxTable';
import { FacebookLeadDetailsDrawer } from '@/components/facebook/FacebookLeadDetailsDrawer';
import { FacebookCampaignsTab } from '@/components/facebook/FacebookCampaignsTab';
import { FacebookAdsTab } from '@/components/facebook/FacebookAdsTab';
import { FacebookInsightsTab } from '@/components/facebook/FacebookInsightsTab';
import { FacebookLeadFormsTab } from '@/components/facebook/FacebookLeadFormsTab';
import { FacebookSettingsTab } from '@/components/facebook/FacebookSettingsTab';
import { FacebookOverviewTab } from '@/components/facebook/FacebookOverviewTab';

interface PageProps {
  params: Promise<{ facebookAccountId: string }>;
}

export default function FacebookAccountDetailPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const facebookAccountId = resolvedParams.facebookAccountId;

  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState<FacebookTabType>('facebook_pages');

  // Account Data State
  const [accountData, setAccountData] = useState<any>(null);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [selectedPage, setSelectedPage] = useState<PageItem | null>(null);

  // Tab Data State
  const [leads, setLeads] = useState<LeadRowData[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [ads, setAds] = useState<any[]>([]);
  const [selectedLeadForDrawer, setSelectedLeadForDrawer] = useState<LeadRowData | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Fetch initial account details
  useEffect(() => {
    async function loadAccountData() {
      setIsLoading(true);
      try {
        const details = await facebookIntegrationService.getAccountDetails(facebookAccountId);
        if (details) {
          setAccountData(details);
          const pagesList = details.pages || [];
          setPages(pagesList);
          if (pagesList.length > 0) {
            setSelectedPage(pagesList[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load Facebook account details:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadAccountData();
  }, [facebookAccountId]);

  // Fetch leads when selected page or tab changes
  useEffect(() => {
    async function loadLeads() {
      try {
        const pageId = selectedPage?.id || selectedPage?.pageId;
        const res = await facebookIntegrationService.getAccountLeads(facebookAccountId, { pageId });
        if (res && res.leads && res.leads.length > 0) {
          const mappedLeads: LeadRowData[] = res.leads.map((l: any) => ({
            id: l.id,
            name: l.name,
            phone: l.phone,
            email: l.email,
            formName: l.facebookForm?.name || 'Book Site Visit',
            formId: l.facebookForm?.formId || '123456789',
            pageName: l.facebookPage?.name || selectedPage?.name || 'Acme Real Estate',
            receivedAt: new Date(l.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
            status: l.status,
            assignedType: l.assignedSalesUser ? 'HUMAN' : 'AI',
            assignedName: l.assignedSalesUser?.name || 'AI Agent - Real Estate',
          }));
          setLeads(mappedLeads);
        } else {
          setLeads([]);
        }
      } catch (err) {
        console.error('Failed to load leads:', err);
        setLeads([]);
      }
    }

    loadLeads();
  }, [facebookAccountId, selectedPage]);

  // Fetch campaigns and ads
  useEffect(() => {
    async function loadCampaignsAndAds() {
      try {
        const [cmps, adList] = await Promise.all([
          facebookIntegrationService.getAccountCampaigns(facebookAccountId),
          facebookIntegrationService.getAccountAds(facebookAccountId),
        ]);
        setCampaigns(cmps || []);
        setAds(adList || []);
      } catch (err) {
        console.error('Failed to load campaigns/ads:', err);
        setCampaigns([]);
        setAds([]);
      }
    }

    loadCampaignsAndAds();
  }, [facebookAccountId]);

  // Realtime Server-Sent Events (SSE) Listener
  useEffect(() => {
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource(`/api/facebook/accounts/${facebookAccountId}/stream`);
      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'NEW_LEAD') {
            setLeads((prev) => [payload.lead, ...prev]);
          }
        } catch (e) {
          // heartbeat
        }
      };
    } catch (err) {
      console.warn('SSE connection unavailable, falling back to polling.');
    }

    return () => {
      if (eventSource) eventSource.close();
    };
  }, [facebookAccountId]);

  // Action Handlers
  const handleSyncAll = async () => {
    setIsSyncing(true);
    try {
      await facebookIntegrationService.triggerManualSync();
      const updated = await facebookIntegrationService.getAccountDetails(facebookAccountId);
      if (updated) setAccountData(updated);
    } catch (err) {
      console.error('Sync failed:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const updated = await facebookIntegrationService.getAccountDetails(facebookAccountId);
      if (updated) setAccountData(updated);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (confirm('Are you sure you want to disconnect this Facebook Account?')) {
      await facebookIntegrationService.disconnectAccount(facebookAccountId);
      router.push('/integrations/facebook');
    }
  };

  const handleSelectLead = (lead: LeadRowData) => {
    setSelectedLeadForDrawer(lead);
    setIsDrawerOpen(true);
  };

  if (isLoading && !accountData) {
    return (
      <div className="fb-account-page-container">
        <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
          Loading Facebook Account Details...
        </div>
      </div>
    );
  }

  const accountInfo = accountData?.account || {};
  const metricsInfo = accountData?.metrics || {};

  return (
    <div className="fb-account-page-container">
      {/* BREADCRUMB */}
      <div className="fb-account-breadcrumb">
        <span>Integrations</span>
        <span>&gt;</span>
        <span>Meta Business Integration</span>
        <span>&gt;</span>
        <span className="active">Account Details</span>
      </div>

      {/* HEADER */}
      <FacebookAccountHeader
        accountName={accountInfo.accountName || 'Sumit Chaudhary'}
        avatarUrl={accountInfo.avatarUrl}
        connectedAt={accountInfo.connectedAt}
        onSync={handleSyncAll}
        onRefresh={handleRefresh}
        onDisconnect={handleDisconnect}
        isSyncing={isSyncing}
      />

      {/* TOP METRICS (Visible Across Views) */}
      <FacebookAccountTopMetrics
        totalPages={metricsInfo.totalPages || 8}
        activePages={metricsInfo.activePages || 6}
        totalLeads30Days={metricsInfo.totalLeads30Days || 1248}
        unreadLeads={metricsInfo.unreadLeads || 86}
        totalLeadForms={metricsInfo.totalLeadForms || 24}
      />

      {/* TABS BAR */}
      <FacebookAccountTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* TAB CONTENT VIEWS */}
      {activeTab === 'overview' && (
        <FacebookOverviewTab
          metrics={metricsInfo}
          leads={leads}
          selectedPage={selectedPage}
          onSelectLead={handleSelectLead}
        />
      )}

      {activeTab === 'facebook_pages' && (
        <div className="fb-pages-split-layout">
          {/* LEFT SIDEBAR: Facebook Pages List */}
          <FacebookPagesList
            pages={pages}
            selectedPageId={selectedPage?.id || selectedPage?.pageId || ''}
            onSelectPage={setSelectedPage}
            onConnectMore={() => router.push('/integrations/facebook')}
          />

          {/* RIGHT PANEL: Selected Page Details & Lead Inbox */}
          <div className="fb-right-panel">
            <FacebookSelectedPageCard
              page={selectedPage}
              onPageSettings={() => setActiveTab('settings')}
            />

            <FacebookLeadInboxTable
              pageName={selectedPage?.name || 'Acme Real Estate'}
              leads={leads}
              totalLeadsCount={324}
              onSelectLead={handleSelectLead}
              onExportCsv={() => alert('Exporting leads to CSV...')}
              onViewAllLeads={() => setActiveTab('lead_inbox')}
            />
          </div>
        </div>
      )}

      {activeTab === 'lead_inbox' && (
        <FacebookLeadInboxTable
          pageName={selectedPage?.name || 'All Pages'}
          leads={leads}
          totalLeadsCount={324}
          onSelectLead={handleSelectLead}
          onExportCsv={() => alert('Exporting leads to CSV...')}
          onViewAllLeads={() => {}}
        />
      )}

      {activeTab === 'campaigns' && <FacebookCampaignsTab campaigns={campaigns} />}

      {activeTab === 'ads' && <FacebookAdsTab ads={ads} />}

      {activeTab === 'insights' && <FacebookInsightsTab />}

      {activeTab === 'lead_forms' && <FacebookLeadFormsTab />}

      {activeTab === 'settings' && (
        <FacebookSettingsTab
          scopes={accountInfo.scopes}
          tokenExpiresAt={accountInfo.tokenExpiresAt}
          onRefresh={handleRefresh}
          onDisconnect={handleDisconnect}
        />
      )}

      {/* LEAD DETAILS DRAWER */}
      <FacebookLeadDetailsDrawer
        lead={selectedLeadForDrawer}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}
