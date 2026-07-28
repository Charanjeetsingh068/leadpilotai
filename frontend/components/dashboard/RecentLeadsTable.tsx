import React from 'react';
import { Card } from '@/components/ui/Card';
import { Table, Column } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Lead, LeadStatus } from '@/types/lead.types';
import Link from 'next/link';

export interface RecentLeadsTableProps {
  leads: Lead[];
  isLoading?: boolean;
}

const STATUS_BADGE: Record<LeadStatus, { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' }> = {
  NEW: { label: 'New Ingested', variant: 'info' },
  CONTACTED: { label: 'Contacted', variant: 'info' },
  AI_STARTED: { label: 'AI Started', variant: 'info' },
  AI_IN_PROGRESS: { label: 'AI In Progress', variant: 'info' },
  QUALIFIED: { label: 'AI Qualified', variant: 'success' },
  HUMAN_APPROVAL_REQUIRED: { label: 'Approval Required', variant: 'warning' },
  SITE_VISIT_SCHEDULED: { label: 'Site Visit Booked', variant: 'warning' },
  CONVERTED: { label: 'Converted', variant: 'success' },
  LOST: { label: 'Lost', variant: 'danger' },
  ARCHIVED: { label: 'Archived', variant: 'neutral' },
};

export const RecentLeadsTable: React.FC<RecentLeadsTableProps> = ({ leads, isLoading }) => {
  const columns: Column<Lead>[] = [
    {
      header: 'Lead Name',
      accessor: (row) => (
        <div>
          <span style={{ fontWeight: 600, display: 'block' }}>{row.name}</span>
          <span className="text-muted" style={{ fontSize: '0.75rem' }}>{row.phone}</span>
        </div>
      ),
    },
    {
      header: 'Source',
      accessor: (row) => (
        <span className="text-muted" style={{ fontSize: '0.875rem' }}>
          {row.source.replace('_', ' ')}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: (row) => {
        const badge = STATUS_BADGE[row.status] || { label: row.status, variant: 'neutral' };
        return <Badge variant={badge.variant} label={badge.label} />;
      },
    },
    {
      header: 'AI Score',
      accessor: (row) => (
        <span style={{ fontWeight: 600, color: row.qualificationScore >= 70 ? 'var(--color-success-main)' : 'var(--color-text-main)' }}>
          {row.qualificationScore} / 100
        </span>
      ),
    },
    {
      header: 'Action',
      accessor: (row) => (
        <Link href={`/lead/${row.id}`} className="btn btn-outline btn-sm">
          View Profile
        </Link>
      ),
    },
  ];

  return (
    <Card
      title="Recent Ingested Leads"
      subtitle="Latest leads processed by LeadPilot AI"
      action={
        <Link href="/lead-inbox" className="btn btn-outline btn-sm">
          View All Inbox
        </Link>
      }
    >
      <Table columns={columns} data={leads} isLoading={isLoading} />
    </Card>
  );
};
