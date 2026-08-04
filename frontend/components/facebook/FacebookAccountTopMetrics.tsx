'use client';

import React from 'react';
import { Layers, CheckCircle2, Users, Mail, FileText } from 'lucide-react';

interface MetricsProps {
  totalPages?: number;
  activePages?: number;
  totalLeads30Days?: number;
  unreadLeads?: number;
  totalLeadForms?: number;
}

export const FacebookAccountTopMetrics: React.FC<MetricsProps> = ({
  totalPages = 8,
  activePages = 6,
  totalLeads30Days = 1248,
  unreadLeads = 86,
  totalLeadForms = 24,
}) => {
  return (
    <div className="fb-top-metrics-grid">
      <div className="fb-metric-card">
        <div className="fb-metric-icon-box fb-icon-blue">
          <Layers width={20} height={20} />
        </div>
        <div className="fb-metric-content">
          <span className="fb-metric-label">Total Pages</span>
          <span className="fb-metric-value">{totalPages}</span>
          <span className="fb-metric-sub">All connected pages</span>
        </div>
      </div>

      <div className="fb-metric-card">
        <div className="fb-metric-icon-box fb-icon-green">
          <CheckCircle2 width={20} height={20} />
        </div>
        <div className="fb-metric-content">
          <span className="fb-metric-label">Active Pages</span>
          <span className="fb-metric-value">{activePages}</span>
          <span className="fb-metric-sub">Receiving leads</span>
        </div>
      </div>

      <div className="fb-metric-card">
        <div className="fb-metric-icon-box fb-icon-purple">
          <Users width={20} height={20} />
        </div>
        <div className="fb-metric-content">
          <span className="fb-metric-label">Total Leads (30 Days)</span>
          <span className="fb-metric-value">{totalLeads30Days.toLocaleString()}</span>
          <span className="fb-metric-sub">From all pages</span>
        </div>
      </div>

      <div className="fb-metric-card">
        <div className="fb-metric-icon-box fb-icon-orange">
          <Mail width={20} height={20} />
        </div>
        <div className="fb-metric-content">
          <span className="fb-metric-label">Unread Leads</span>
          <span className="fb-metric-value">{unreadLeads}</span>
          <span className="fb-metric-sub">Requires attention</span>
        </div>
      </div>

      <div className="fb-metric-card">
        <div className="fb-metric-icon-box fb-icon-cyan">
          <FileText width={20} height={20} />
        </div>
        <div className="fb-metric-content">
          <span className="fb-metric-label">Total Lead Forms</span>
          <span className="fb-metric-value">{totalLeadForms}</span>
          <span className="fb-metric-sub">Across all pages</span>
        </div>
      </div>
    </div>
  );
};
