'use client';

import React from 'react';
import { FacebookAccountTopMetrics } from './FacebookAccountTopMetrics';
import { FacebookLeadInboxTable, LeadRowData } from './FacebookLeadInboxTable';
import { PageItem } from './FacebookPagesList';

interface OverviewTabProps {
  metrics?: any;
  leads: LeadRowData[];
  selectedPage: PageItem | null;
  onSelectLead: (lead: LeadRowData) => void;
}

export const FacebookOverviewTab: React.FC<OverviewTabProps> = ({
  metrics,
  leads,
  selectedPage,
  onSelectLead,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <FacebookAccountTopMetrics
        totalPages={metrics?.totalPages}
        totalLeads={metrics?.totalLeads || leads.length}
        totalBusinesses={metrics?.totalBusinesses}
        totalAccounts={metrics?.totalAccounts}
        totalCampaigns={metrics?.totalCampaigns}
      />

      <FacebookLeadInboxTable
        pageName={selectedPage?.name || 'All Connected Pages'}
        leads={leads}
        totalLeadsCount={leads.length}
        onSelectLead={onSelectLead}
      />
    </div>
  );
};
