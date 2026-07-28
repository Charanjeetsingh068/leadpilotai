import React, { useState } from 'react';
import { Plus, Upload, Download, ChevronDown } from 'lucide-react';

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
}) => {
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);

  return (
    <div className="lead-actions-right">
      <button type="button" className="lead-btn-secondary" onClick={onExport}>
        <Download size={14} /> Export
      </button>

      <button type="button" className="lead-btn-secondary" onClick={onImportCSV}>
        <Upload size={14} /> Import
      </button>

      <div className="pos-relative">
        <button
          type="button"
          className="lead-btn-primary-dropdown"
          onClick={() => setIsAddOpen(!isAddOpen)}
        >
          <Plus size={16} /> Add Lead <ChevronDown size={14} />
        </button>

        {isAddOpen && (
          <div className="dropdown-menu shadow-dropdown text-left" onClick={() => setIsAddOpen(false)}>
            <button type="button" className="dropdown-item" onClick={onAddLead}>
              Add Single Lead
            </button>
            <button type="button" className="dropdown-item" onClick={onImportCSV}>
              Import CSV File
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
