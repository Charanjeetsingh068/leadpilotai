import React from 'react';
import { Button } from '@/components/ui/Button';
import { Plus, Upload, Download, RefreshCw } from 'lucide-react';

export interface LeadInboxHeaderActionsProps {
  onAddLead: () => void;
  onImportCSV: () => void;
  onExport: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const LeadInboxHeaderActions: React.FC<LeadInboxHeaderActionsProps> = ({
  onAddLead,
  onImportCSV,
  onExport,
  onRefresh,
  isRefreshing = false,
}) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
      <Button variant="primary" size="sm" leftIcon={<Plus size={14} />} onClick={onAddLead}>
        Add Lead
      </Button>
      <Button variant="outline" size="sm" leftIcon={<Upload size={14} />} onClick={onImportCSV}>
        Import CSV
      </Button>
      <Button variant="outline" size="sm" leftIcon={<Download size={14} />} onClick={onExport}>
        Export
      </Button>
      <Button
        variant="ghost"
        size="sm"
        leftIcon={<RefreshCw size={14} className={isRefreshing ? 'spin-icon' : ''} />}
        onClick={onRefresh}
      >
        Refresh
      </Button>
    </div>
  );
};
