import React from 'react';
import { LeadSource } from '@/types/lead.types';
import { Share2, Globe, Layout, UserPlus, FileSpreadsheet, MessageSquare, Code } from 'lucide-react';

export interface LeadSourceIconProps {
  source: LeadSource | string;
  showLabel?: boolean;
}

export const LeadSourceIcon: React.FC<LeadSourceIconProps> = ({ source, showLabel = true }) => {
  let icon = <UserPlus size={14} className="lead-source-icon-manual" />;
  let label = 'Manual';

  const normalized = String(source).toUpperCase().replace(/\s+/g, '_');

  switch (normalized) {
    case 'FACEBOOK_ADS':
    case 'FACEBOOK':
      icon = <Share2 size={14} className="lead-source-icon-facebook" />;
      label = 'Facebook';
      break;
    case 'INSTAGRAM_ADS':
    case 'INSTAGRAM':
      icon = <MessageSquare size={14} className="lead-source-icon-instagram" />;
      label = 'Instagram';
      break;
    case 'GOOGLE_ADS':
    case 'GOOGLE':
      icon = <Globe size={14} className="lead-source-icon-google" />;
      label = 'Google Ads';
      break;
    case 'WEBSITE_FORM':
    case 'WEBSITE':
      icon = <Layout size={14} className="lead-source-icon-website" />;
      label = 'Website';
      break;
    case 'MANUAL_ENTRY':
    case 'MANUAL':
      icon = <UserPlus size={14} className="lead-source-icon-manual" />;
      label = 'Manual';
      break;
    case 'WHATSAPP':
      icon = <MessageSquare size={14} className="lead-source-icon-facebook" />;
      label = 'WhatsApp';
      break;
    case 'CSV_IMPORT':
    case 'CSV':
      icon = <FileSpreadsheet size={14} className="lead-source-icon-website" />;
      label = 'CSV';
      break;
    case 'API':
      icon = <Code size={14} className="lead-source-icon-manual" />;
      label = 'API';
      break;
    default:
      label = String(source);
      break;
  }

  return (
    <span className="lead-source-badge">
      {icon}
      {showLabel ? <span>{label}</span> : null}
    </span>
  );
};
