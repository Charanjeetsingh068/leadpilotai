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

const ALL_MOCK_LEADS: Record<string, Lead> = {
  lead_1: {
    id: 'lead_1',
    name: 'Rohit Sharma',
    phone: '+91 98765 43210',
    email: 'rohit.sharma@example.com',
    project: 'Sunshine Villas - 2 BHK',
    source: 'FACEBOOK_ADS',
    qualificationScore: 85,
    status: 'NEW',
    organizationId: 'org_1',
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    budget: '₹50 - ₹70 Lakhs',
    location: 'Indore, MP',
    assignedSalesUser: { id: 'usr_1', name: 'Neha Singh', email: 'neha@leadpilot.ai' },
  },
  lead_2: {
    id: 'lead_2',
    name: 'Priya Verma',
    phone: '+91 91234 56789',
    email: 'priya.v@example.com',
    project: 'Green Heights - 3 BHK',
    source: 'INSTAGRAM_ADS',
    qualificationScore: 72,
    status: 'CONTACTED',
    organizationId: 'org_1',
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    budget: '₹80 - ₹1 Cr',
    location: 'Bhopal, MP',
    assignedSalesUser: { id: 'usr_2', name: 'Amit Kumar', email: 'amit@leadpilot.ai' },
  },
  lead_3: {
    id: 'lead_3',
    name: 'Amit Kumar',
    phone: '+91 99887 76655',
    email: 'amit.k@example.com',
    project: 'Royal Residency',
    source: 'GOOGLE_ADS',
    qualificationScore: 68,
    status: 'AI_IN_PROGRESS',
    organizationId: 'org_1',
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    budget: '₹40 - ₹60 Lakhs',
    location: 'Ujjain, MP',
    assignedSalesUser: { id: 'usr_3', name: 'Raj Mehta', email: 'raj@leadpilot.ai' },
  },
  lead_4: {
    id: 'lead_4',
    name: 'Sneha Iyer',
    phone: '+91 87654 32109',
    email: 'sneha.iyer@example.com',
    project: 'Lake View Homes',
    source: 'WEBSITE_FORM',
    qualificationScore: 90,
    status: 'QUALIFIED',
    organizationId: 'org_1',
    createdAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    budget: '₹1.2 Cr+',
    location: 'Indore, MP',
    assignedSalesUser: { id: 'usr_1', name: 'Neha Singh', email: 'neha@leadpilot.ai' },
  },
  lead_5: {
    id: 'lead_5',
    name: 'Vikram Singh',
    phone: '+91 76543 21098',
    email: 'vikram.singh@example.com',
    project: 'Park Avenue',
    source: 'MANUAL_ENTRY',
    qualificationScore: 55,
    status: 'NEW',
    organizationId: 'org_1',
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    budget: '₹35 - ₹50 Lakhs',
    location: 'Dewas, MP',
    assignedSalesUser: { id: 'usr_4', name: 'Rohit Tiwari', email: 'rohit.t@leadpilot.ai' },
  },
};

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

    // 3. Try checking ALL_MOCK_LEADS lookup table
    if (!found && ALL_MOCK_LEADS[leadId]) {
      found = ALL_MOCK_LEADS[leadId];
    }

    // 4. Fallback default lead
    if (!found) {
      found = ALL_MOCK_LEADS.lead_3;
    }

    if (found) {
      setLead(found);
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
