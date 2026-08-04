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
        activePages={metrics?.activePages}
        totalLeads30Days={metrics?.totalLeads30Days}
        unreadLeads={metrics?.unreadLeads}
        totalLeadForms={metrics?.totalLeadForms}
      />

      <FacebookLeadInboxTable
        pageName={selectedPage?.name || 'All Connected Pages'}
        leads={leads}
        totalLeadsCount={324}
        onSelectLead={onSelectLead}
      />
    </div>
  );
};
