import React from 'react';
import { LeadSourceIcon } from '../lead-inbox/LeadSourceIcon';
import { LeadSource } from '@/types/lead.types';

interface SourceBadgeProps {
  source: LeadSource | string;
  showLabel?: boolean;
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({ source, showLabel = true }) => {
  return <LeadSourceIcon source={source} showLabel={showLabel} />;
};
