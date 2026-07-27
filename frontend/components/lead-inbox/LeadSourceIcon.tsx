import React from 'react';
import { LeadSource } from '@/types/lead.types';
import { Share2, Globe, Layout, UserPlus, FileSpreadsheet, MessageCircle } from 'lucide-react';

export interface LeadSourceIconProps {
  source: LeadSource;
  showLabel?: boolean;
}

export const LeadSourceIcon: React.FC<LeadSourceIconProps> = ({ source, showLabel = true }) => {
  let icon = <UserPlus size={14} />;
  let label = 'Manual';

  switch (source) {
    case 'FACEBOOK_ADS':
      icon = <Share2 size={14} style={{ color: '#1877f2' }} />;
      label = 'Facebook Ads';
      break;
    case 'INSTAGRAM_ADS':
      icon = <MessageCircle size={14} style={{ color: '#e1306c' }} />;
      label = 'Instagram Ads';
      break;
    case 'GOOGLE_ADS':
      icon = <Globe size={14} style={{ color: '#ea4335' }} />;
      label = 'Google Ads';
      break;
    case 'WEBSITE_FORM':
      icon = <Layout size={14} style={{ color: '#10b981' }} />;
      label = 'Website Form';
      break;
    case 'MANUAL_ENTRY':
      icon = <UserPlus size={14} style={{ color: '#64748b' }} />;
      label = 'Manual Entry';
      break;
    case 'CSV_IMPORT':
      icon = <FileSpreadsheet size={14} style={{ color: '#0284c7' }} />;
      label = 'CSV Import';
      break;
  }

  return (
    <span className="source-icon-badge">
      {icon}
      {showLabel ? <span>{label}</span> : null}
    </span>
  );
};
