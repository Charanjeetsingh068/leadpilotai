import React from 'react';
import { LeadStatus } from '@/types/lead.types';

interface StatusBadgeProps {
  status: LeadStatus | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusConfig = (st: string) => {
    const formatted = st.toUpperCase().replace(/\s+/g, '_');
    switch (formatted) {
      case 'NEW':
        return { label: 'New', className: 'status-new' };
      case 'CONTACTED':
      case 'AI_STARTED':
        return { label: st === 'AI_STARTED' ? 'AI Started' : 'Contacted', className: 'status-contacted' };
      case 'IN_PROGRESS':
      case 'AI_IN_PROGRESS':
        return { label: 'In Progress', className: 'status-in-progress' };
      case 'QUALIFIED':
        return { label: 'Qualified', className: 'status-qualified' };
      case 'HUMAN_APPROVAL_REQUIRED':
      case 'HUMAN_APPROVAL':
        return { label: 'Human Approval', className: 'status-human-approval' };
      case 'SITE_VISIT_SCHEDULED':
      case 'SITE_VISIT':
        return { label: 'Site Visit', className: 'status-site-visit' };
      case 'CONVERTED':
        return { label: 'Converted', className: 'status-converted' };
      case 'LOST':
        return { label: 'Lost', className: 'status-lost' };
      case 'ARCHIVED':
        return { label: 'Archived', className: 'status-archived' };
      default:
        return { label: st, className: 'status-new' };
    }
  };

  const config = getStatusConfig(status);

  return <span className={`lead-status-badge ${config.className}`}>{config.label}</span>;
};
