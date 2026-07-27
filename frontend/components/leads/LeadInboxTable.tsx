import React from 'react';
import { Table, Column } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { TableSkeletonRow } from '@/components/ui/Skeleton';
import { LeadSourceIcon } from './LeadSourceIcon';
import { Lead, LeadStatus } from '@/types/lead.types';
import { Select } from '@/components/ui/Select';
import { MessageSquare, ExternalLink, UserPlus, PauseCircle, PlayCircle, Archive, Trash2 } from 'lucide-react';
import Link from 'next/link';

export interface LeadInboxTableProps {
  leads: Lead[];
  selectedLeadId?: string | null;
  isLoading?: boolean;
  onSelectLead: (lead: Lead) => void;
  onStatusChange: (leadId: string, status: LeadStatus) => void;
  onAssign: (leadId: string) => void;
  onToggleAi: (leadId: string, currentStatus: boolean) => void;
  onDelete: (leadId: string) => void;
}

const STATUS_BADGE: Record<LeadStatus, { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' }> = {
  NEW: { label: 'New Ingested', variant: 'info' },
  AI_STARTED: { label: 'AI Started', variant: 'info' },
  AI_IN_PROGRESS: { label: 'AI In Progress', variant: 'info' },
  QUALIFIED: { label: 'AI Qualified', variant: 'success' },
  HUMAN_APPROVAL_REQUIRED: { label: 'Approval Required', variant: 'warning' },
  SITE_VISIT_SCHEDULED: { label: 'Site Visit Booked', variant: 'warning' },
  CONVERTED: { label: 'Converted', variant: 'success' },
  LOST: { label: 'Lost', variant: 'danger' },
  ARCHIVED: { label: 'Archived', variant: 'neutral' },
};

export const LeadInboxTable: React.FC<LeadInboxTableProps> = ({
  leads,
  selectedLeadId,
  isLoading,
  onSelectLead,
  onStatusChange,
  onAssign,
  onToggleAi,
  onDelete,
}) => {
  const columns: Column<Lead>[] = [
    {
      header: 'Lead Name',
      accessor: (row) => (
        <span style={{ fontWeight: 600, color: 'var(--color-primary-700)' }}>{row.name}</span>
      ),
    },
    {
      header: 'Phone',
      accessor: (row) => <span style={{ fontFamily: 'var(--font-family-mono)', fontSize: '0.85rem' }}>{row.phone}</span>,
    },
    {
      header: 'Project',
      accessor: (row) => <span style={{ fontSize: '0.875rem' }}>{row.project || 'General'}</span>,
    },
    {
      header: 'Source',
      accessor: (row) => <LeadSourceIcon source={row.source} />,
    },
    {
      header: 'AI Status',
      accessor: (row) => <Badge variant="neutral" label={row.aiStatus || 'IDLE'} />,
    },
    {
      header: 'Score',
      accessor: (row) => (
        <span style={{ fontWeight: 700, color: row.qualificationScore >= 70 ? 'var(--color-success-main)' : 'var(--color-text-main)' }}>
          {row.qualificationScore}
        </span>
      ),
    },
    {
      header: 'Assigned To',
      accessor: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Avatar name={row.assignedSalesUser?.name || 'Unassigned'} size="xs" />
          <span style={{ fontSize: '0.85rem' }}>{row.assignedSalesUser?.name || 'Unassigned'}</span>
        </div>
      ),
    },
    {
      header: 'Created Time',
      accessor: (row) => (
        <span className="text-muted" style={{ fontSize: '0.75rem' }}>
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Next Action',
      accessor: (row) => (
        <span className="text-muted" style={{ fontSize: '0.75rem' }}>
          {row.status === 'SITE_VISIT_SCHEDULED' ? 'Confirm Slot' : row.status === 'QUALIFIED' ? 'Book Visit' : 'AI Polling'}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: (row) => (
        <div style={{ width: '160px' }} onClick={(e) => e.stopPropagation()}>
          <Select
            value={row.status}
            onChange={(e) => onStatusChange(row.id, e.target.value as LeadStatus)}
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
      ),
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <div style={{ display: 'flex', gap: '0.25rem' }} onClick={(e) => e.stopPropagation()}>
          <Link href={`/conversation/${row.id}`} className="btn btn-ghost btn-sm" title="Chat">
            <MessageSquare size={14} />
          </Link>
          <Button variant="ghost" size="sm" title="Assign User" onClick={() => onAssign(row.id)}>
            <UserPlus size={14} />
          </Button>
          <Button variant="ghost" size="sm" title="Archive" onClick={() => onStatusChange(row.id, 'ARCHIVED')}>
            <Archive size={14} />
          </Button>
          <Button variant="ghost" size="sm" title="Delete" onClick={() => onDelete(row.id)}>
            <Trash2 size={14} style={{ color: 'var(--color-danger-main)' }} />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Lead Name</th>
              <th>Phone</th>
              <th>Project</th>
              <th>Source</th>
              <th>AI Status</th>
              <th>Score</th>
              <th>Assigned To</th>
              <th>Created Time</th>
              <th>Next Action</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 8 }).map((_, idx) => (
              <TableSkeletonRow key={idx} columnsCount={11} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <Table
      columns={columns}
      data={leads}
      isLoading={false}
      onRowClick={(row) => onSelectLead(row)}
    />
  );
};
