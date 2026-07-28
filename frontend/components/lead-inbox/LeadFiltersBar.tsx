import React, { useState } from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';
import { LeadInboxHeaderActions } from './LeadInboxHeaderActions';

export interface LeadFiltersBarProps {
  search: string;
  source: string;
  status: string;
  project?: string;
  salesUser?: string;
  onSearchChange: (value: string) => void;
  onSourceChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onProjectChange?: (value: string) => void;
  onSalesUserChange?: (value: string) => void;
  onReset: () => void;
  onAddLead: () => void;
  onImportCSV: () => void;
  onExport: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const LeadFiltersBar: React.FC<LeadFiltersBarProps> = ({
  search,
  source,
  status,
  project = '',
  salesUser = '',
  onSearchChange,
  onSourceChange,
  onStatusChange,
  onProjectChange,
  onSalesUserChange,
  onReset,
  onAddLead,
  onImportCSV,
  onExport,
  onRefresh,
  isRefreshing,
}) => {
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState<boolean>(false);

  const hasActiveFilters = Boolean(source || status || project || salesUser);

  return (
    <div className="lead-filters-wrapper">
      {/* Primary Top Action Bar matching reference screenshot */}
      <div className="lead-top-actions-bar">
        <div className="lead-actions-left">
          <div className="lead-search-box">
            <Search size={16} className="lead-search-icon" />
            <input
              type="text"
              className="lead-search-input"
              placeholder="Search leads..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <button
            type="button"
            className={`lead-filter-btn ${isFilterPanelOpen || hasActiveFilters ? 'active' : ''}`}
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
          >
            <Filter size={14} /> Filter
          </button>

          {hasActiveFilters && (
            <button type="button" className="lead-btn-secondary" onClick={onReset}>
              <RotateCcw size={14} /> Reset
            </button>
          )}
        </div>

        <LeadInboxHeaderActions
          onAddLead={onAddLead}
          onImportCSV={onImportCSV}
          onExport={onExport}
          onRefresh={onRefresh}
          isRefreshing={isRefreshing}
        />
      </div>

      {/* Expandable Filter Controls Panel */}
      {isFilterPanelOpen && (
        <div className="lead-filter-panel-card">
          <div className="lead-actions-left filter-panel-wrap">
            <select
              className="lead-pagination-select"
              value={source}
              onChange={(e) => onSourceChange(e.target.value)}
            >
              <option value="">All Sources</option>
              <option value="FACEBOOK_ADS">Facebook</option>
              <option value="INSTAGRAM_ADS">Instagram</option>
              <option value="GOOGLE_ADS">Google Ads</option>
              <option value="WEBSITE_FORM">Website</option>
              <option value="MANUAL_ENTRY">Manual</option>
              <option value="CSV_IMPORT">CSV</option>
            </select>

            <select
              className="lead-pagination-select"
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="NEW">New</option>
              <option value="CONTACTED">Contacted</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="QUALIFIED">Qualified</option>
              <option value="HUMAN_APPROVAL_REQUIRED">Human Approval</option>
              <option value="SITE_VISIT_SCHEDULED">Site Visit</option>
              <option value="CONVERTED">Converted</option>
              <option value="LOST">Lost</option>
              <option value="ARCHIVED">Archived</option>
            </select>

            <select
              className="lead-pagination-select"
              value={project}
              onChange={(e) => onProjectChange?.(e.target.value)}
            >
              <option value="">All Projects</option>
              <option value="Sunshine Villas">Sunshine Villas</option>
              <option value="Green Heights">Green Heights</option>
              <option value="Royal Residency">Royal Residency</option>
              <option value="Lake View Homes">Lake View Homes</option>
              <option value="Park Avenue">Park Avenue</option>
            </select>

            <select
              className="lead-pagination-select"
              value={salesUser}
              onChange={(e) => onSalesUserChange?.(e.target.value)}
            >
              <option value="">All Representatives</option>
              <option value="Neha Singh">Neha Singh</option>
              <option value="Amit Kumar">Amit Kumar</option>
              <option value="Raj Mehta">Raj Mehta</option>
              <option value="Rohit Tiwari">Rohit Tiwari</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
