import React from 'react';
import { Search } from '@/components/ui/Search';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { RotateCcw } from 'lucide-react';

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
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.75rem',
        alignItems: 'center',
        marginBottom: '1.5rem',
        backgroundColor: 'var(--color-bg-surface)',
        padding: '1rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
      }}
    >
      <div style={{ flex: '1', minWidth: '220px' }}>
        <Search placeholder="Search name, phone, email, project..." onSearch={onSearchChange} />
      </div>

      <div style={{ width: '160px' }}>
        <Select
          value={source}
          onChange={(e) => onSourceChange(e.target.value)}
          placeholder="All Channels"
          options={[
            { label: 'Facebook Ads', value: 'FACEBOOK_ADS' },
            { label: 'Instagram Ads', value: 'INSTAGRAM_ADS' },
            { label: 'Google Ads', value: 'GOOGLE_ADS' },
            { label: 'Website Form', value: 'WEBSITE_FORM' },
            { label: 'Manual Entry', value: 'MANUAL_ENTRY' },
            { label: 'CSV Import', value: 'CSV_IMPORT' },
          ]}
        />
      </div>

      <div style={{ width: '160px' }}>
        <Select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          placeholder="All Statuses"
          options={[
            { label: 'New Ingested', value: 'NEW' },
            { label: 'AI Started', value: 'AI_STARTED' },
            { label: 'AI In Progress', value: 'AI_IN_PROGRESS' },
            { label: 'AI Qualified', value: 'QUALIFIED' },
            { label: 'Approval Required', value: 'HUMAN_APPROVAL_REQUIRED' },
            { label: 'Site Visit Booked', value: 'SITE_VISIT_SCHEDULED' },
            { label: 'Converted', value: 'CONVERTED' },
            { label: 'Lost', value: 'LOST' },
            { label: 'Archived', value: 'ARCHIVED' },
          ]}
        />
      </div>

      <div style={{ width: '150px' }}>
        <Select
          value={project}
          onChange={(e) => onProjectChange?.(e.target.value)}
          placeholder="All Projects"
          options={[
            { label: 'Grand Residency', value: 'Grand Residency' },
            { label: 'Skyline Towers', value: 'Skyline Towers' },
            { label: 'Urban Heights', value: 'Urban Heights' },
          ]}
        />
      </div>

      <div style={{ width: '150px' }}>
        <Select
          value={salesUser}
          onChange={(e) => onSalesUserChange?.(e.target.value)}
          placeholder="All Sales Reps"
          options={[
            { label: 'Unassigned', value: 'unassigned' },
            { label: 'Priya Sharma', value: 'priya_sharma' },
            { label: 'Amit Patel', value: 'amit_patel' },
          ]}
        />
      </div>

      {(source || status || search || project || salesUser) ? (
        <Button variant="ghost" size="sm" onClick={onReset} leftIcon={<RotateCcw size={14} />}>
          Reset
        </Button>
      ) : null}
    </div>
  );
};
