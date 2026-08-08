'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { facebookIntegrationService } from '@/services/facebook-integration.service';
import { ThumbsUp, Users, Target, FileText, CheckCircle2, RotateCw, LogOut, ExternalLink, ArrowLeft } from 'lucide-react';
import { FacebookAccountTabs, FacebookTabType } from '@/components/facebook/FacebookAccountTabs';
import { FacebookLeadInboxTable, LeadRowData } from '@/components/facebook/FacebookLeadInboxTable';
import { FacebookLeadDetailsDrawer } from '@/components/facebook/FacebookLeadDetailsDrawer';
import { FacebookCampaignsTab } from '@/components/facebook/FacebookCampaignsTab';
import { FacebookAdsTab } from '@/components/facebook/FacebookAdsTab';
import { FacebookInsightsTab } from '@/components/facebook/FacebookInsightsTab';
import { FacebookLeadFormsTab } from '@/components/facebook/FacebookLeadFormsTab';
import { FacebookSettingsTab } from '@/components/facebook/FacebookSettingsTab';

interface PageProps {
  params: Promise<{ facebookAccountId: string; pageId: string }>;
}

export default function FacebookSinglePageDetailPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { facebookAccountId, pageId } = resolvedParams;

  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pageDetails, setPageDetails] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<FacebookTabType>('lead_inbox');
  const [leads, setLeads] = useState<LeadRowData[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [ads, setAds] = useState<any[]>([]);
  const [selectedLeadForDrawer, setSelectedLeadForDrawer] = useState<LeadRowData | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const details = await facebookIntegrationService.getPageDetails(pageId);
        if (details) {
          setPageDetails(details);
        }

        const leadsRes = await facebookIntegrationService.getAccountLeads(facebookAccountId, { pageId });
        if (leadsRes && leadsRes.leads && leadsRes.leads.length > 0) {
          setLeads(
            leadsRes.leads.map((l: any) => ({
              id: l.id,
              name: l.name,
              phone: l.phone,
              email: l.email,
              formName: l.facebookForm?.name || 'Book Site Visit',
              formId: l.facebookForm?.formId || '123456789',
              pageName: details?.name || 'Meta Page',
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
            }))
          );
        } else {
          setLeads([]);
        }

        const [cmps, adList] = await Promise.all([
          facebookIntegrationService.getAccountCampaigns(facebookAccountId),
          facebookIntegrationService.getAccountAds(facebookAccountId),
        ]);
        setCampaigns(cmps || []);
        setAds(adList || []);
      } catch (err) {
        console.error('Failed to load page details:', err);
        setLeads([]);
        setCampaigns([]);
        setAds([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [facebookAccountId, pageId]);

  const handleSyncPage = async () => {
    setIsSyncing(true);
    try {
      await facebookIntegrationService.syncPage(pageId);
      const updated = await facebookIntegrationService.getPageDetails(pageId);
      if (updated) setPageDetails(updated);
    } catch (err) {
      console.error('Failed to sync page:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDisconnectPage = async () => {
    if (confirm(`Disconnect page ${pageDetails?.name || ''}? Webhooks will be unsubscribed. Historical lead data will be preserved.`)) {
      await facebookIntegrationService.disconnectPage(pageId);
      router.push(`/integrations/facebook/account/${facebookAccountId}`);
    }
  };

  if (isLoading && !pageDetails) {
    return (
      <div className="fb-account-page-container">
        <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
          Loading Page Details...
        </div>
      </div>
    );
  }

  const pName = pageDetails?.name || 'Meta Page';
  const handleName = pageDetails?.handle || `@${pName.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

  return (
    <div className="fb-account-page-container">
      {/* NAVIGATION HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button
          type="button"
          onClick={() => router.push(`/integrations/facebook/account/${facebookAccountId}`)}
          className="fb-btn-outline"
        >
          <ArrowLeft width={16} height={16} />
          <span>Back to Account</span>
        </button>

        <div className="fb-account-breadcrumb">
          <span>Integrations</span>
          <span>&gt;</span>
          <span>Facebook Account</span>
          <span>&gt;</span>
          <span className="active">{pName}</span>
        </div>
      </div>

      {/* SELECTED PAGE HEADER CARD */}
      <div className="fb-selected-page-card">
        <div className="fb-page-detail-main">
          <div className="fb-big-page-avatar">
            <img
              src={pageDetails?.pictureUrl || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=150&auto=format&fit=crop&q=80'}
              alt={pName}
            />
            <span className="fb-page-fb-badge">f</span>
          </div>

          <div className="fb-page-detail-text">
            <div className="fb-page-detail-title-row">
              <h2>{pName}</h2>
              <span className="fb-active-badge">Active & Connected</span>
            </div>

            <p className="fb-page-detail-sub">
              <span>{handleName}</span>
              <span>•</span>
              <span>{pageDetails?.category || 'Real Estate Company'}</span>
            </p>

            <div className="fb-page-detail-metrics-row">
              <div className="fb-metric-item">
                <ThumbsUp width={14} height={14} />
                <span>12.5K Likes</span>
              </div>

              <div className="fb-metric-item">
                <Users width={14} height={14} />
                <span>{(pageDetails?.followersCount || 13200).toLocaleString()} Followers</span>
              </div>

              <div className="fb-metric-item">
                <Target width={14} height={14} />
                <span>324 Leads (30 Days)</span>
              </div>

              <div className="fb-metric-item">
                <FileText width={14} height={14} />
                <span>{pageDetails?.forms?.length || 24} Lead Forms</span>
              </div>

              <div className="fb-metric-item">
                <CheckCircle2 width={14} height={14} color="#10b981" />
                <span>Webhook Active</span>
              </div>
            </div>
          </div>
        </div>

        <div className="fb-page-actions">
          <button
            type="button"
            onClick={handleSyncPage}
            disabled={isSyncing}
            className="fb-btn-outline"
          >
            <RotateCw width={15} height={15} className={isSyncing ? 'animate-spin' : ''} />
            <span>Full Sync</span>
          </button>

          <button
            type="button"
            onClick={handleDisconnectPage}
            className="fb-btn-danger"
          >
            <LogOut width={15} height={15} />
            <span>Disconnect Page</span>
          </button>

          <a
            href={`https://facebook.com/${pageDetails?.pageId || pageId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="fb-btn-outline"
          >
            <ExternalLink width={14} height={14} />
          </a>
        </div>
      </div>

      {/* TABS BAR */}
      <FacebookAccountTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* TAB CONTENT VIEWS */}
      {activeTab === 'lead_inbox' && (
        <FacebookLeadInboxTable
          pageName={pName}
          leads={leads}
          totalLeadsCount={324}
          onSelectLead={(l) => {
            setSelectedLeadForDrawer(l);
            setIsDrawerOpen(true);
          }}
          onExportCsv={() => alert('Exporting page leads...')}
        />
      )}

      {activeTab === 'lead_forms' && <FacebookLeadFormsTab />}
      {activeTab === 'campaigns' && <FacebookCampaignsTab campaigns={campaigns} />}
      {activeTab === 'ads' && <FacebookAdsTab ads={ads} />}
      {activeTab === 'insights' && <FacebookInsightsTab />}
      {activeTab === 'settings' && <FacebookSettingsTab onRefresh={handleSyncPage} onDisconnect={handleDisconnectPage} />}

      {/* LEAD DETAILS DRAWER */}
      <FacebookLeadDetailsDrawer
        lead={selectedLeadForDrawer}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}
