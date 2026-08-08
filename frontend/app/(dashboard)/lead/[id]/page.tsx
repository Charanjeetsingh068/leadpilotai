'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { LeadDetailsHeader } from '@/components/lead-details/LeadDetailsHeader';
import { CustomerProfilePanel } from '@/components/lead-details/CustomerProfilePanel';
import { LeadDetailsTabs } from '@/components/lead-details/LeadDetailsTabs';
import { TimelineTab } from '@/components/lead-details/TimelineTab';
import { ConversationTab } from '@/components/lead-details/ConversationTab';
import { AISummaryTab } from '@/components/lead-details/AISummaryTab';
import { NotesTab } from '@/components/lead-details/NotesTab';
import { DocumentsTab } from '@/components/lead-details/DocumentsTab';
import { RightWidgetsPanel } from '@/components/lead-details/RightWidgetsPanel';
import { StickyActionBar } from '@/components/lead-details/StickyActionBar';

import { AssignLeadModal } from '@/components/lead-details/AssignLeadModal';
import { BookSiteVisitModal } from '@/components/lead-details/BookSiteVisitModal';
import { MarkQualifiedModal } from '@/components/lead-details/MarkQualifiedModal';
import { RejectLeadModal } from '@/components/lead-details/RejectLeadModal';

import { useLeadDetailsStore } from '@/store/useLeadDetailsStore';
import { useLeadStore } from '@/store/useLeadStore';
import { Lead } from '@/types/lead.types';
import { LeadService } from '@/services/lead.service';

export default function LeadDetailPage() {
  const params = useParams();
  const leadId = String(params?.id || '');

  const { activeTab, setLead } = useLeadDetailsStore();
  const activeLeadInStore = useLeadStore((s) => s.activeLead);
  const leadsInStore = useLeadStore((s) => s.leads);

  useEffect(() => {
    if (!leadId) return;

    // 1. Try finding in useLeadStore.leads
    let found = leadsInStore.find((l) => l.id === leadId);

    // 2. Try checking activeLead in store
    if (!found && activeLeadInStore?.id === leadId) {
      found = activeLeadInStore;
    }

    if (found) {
      setLead(found);
    } else {
      LeadService.getLeadById(leadId).then((res) => {
        if (res.success && res.data) {
          setLead(res.data);
        }
      }).catch(() => {});
    }
  }, [leadId, leadsInStore, activeLeadInStore, setLead]);

  return (
    <div className="lead-detail-page-container">
      {/* Top Header Section with Back Navigation & Metrics */}
      <LeadDetailsHeader />

      {/* Main 3-Column Grid Layout */}
      <div className="lead-detail-main-grid">
        {/* Left Column: Customer Profile */}
        <div className="grid-col-profile">
          <CustomerProfilePanel />
        </div>

        {/* Center Column: Tabs & Active Tab Feed */}
        <div className="grid-col-center">
          <div className="lead-detail-card center-workspace-card">
            <LeadDetailsTabs />
            <div className="tab-content-area">
              {activeTab === 'timeline' && <TimelineTab />}
              {activeTab === 'conversation' && <ConversationTab />}
              {activeTab === 'ai-summary' && <AISummaryTab />}
              {activeTab === 'notes' && <NotesTab />}
              {activeTab === 'documents' && <DocumentsTab />}
            </div>
          </div>
        </div>

        {/* Right Column: Lead Info & Stacked Widgets */}
        <div className="grid-col-widgets">
          <RightWidgetsPanel />
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <StickyActionBar />

      {/* Modal Dialogs */}
      <AssignLeadModal />
      <BookSiteVisitModal />
      <MarkQualifiedModal />
      <RejectLeadModal />
    </div>
  );
}
