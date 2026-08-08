'use client';

import React from 'react';
import { UserCheck, Building2, Layers, Users, Megaphone } from 'lucide-react';

interface MetricsProps {
  totalAccounts?: number;
  totalBusinesses?: number;
  totalPages?: number;
  totalLeads?: number;
  totalCampaigns?: number;
}

export const FacebookAccountTopMetrics: React.FC<MetricsProps> = ({
  totalAccounts = 0,
  totalBusinesses = 0,
  totalPages = 0,
  totalLeads = 0,
  totalCampaigns = 0,
}) => {
  return (
    <div className="fb-top-metrics-grid">
      <div className="fb-metric-card">
        <div className="fb-metric-icon-box fb-icon-blue">
          <UserCheck width={20} height={20} />
        </div>
        <div className="fb-metric-content">
          <span className="fb-metric-label">Total Accounts</span>
          <span className="fb-metric-value">{totalAccounts}</span>
          <span className="fb-metric-sub">Connected Meta profiles</span>
        </div>
      </div>

      <div className="fb-metric-card">
        <div className="fb-metric-icon-box fb-icon-green">
          <Building2 width={20} height={20} />
        </div>
        <div className="fb-metric-content">
          <span className="fb-metric-label">Total Businesses</span>
          <span className="fb-metric-value">{totalBusinesses}</span>
          <span className="fb-metric-sub">Business Portfolios</span>
        </div>
      </div>

      <div className="fb-metric-card">
        <div className="fb-metric-icon-box fb-icon-purple">
          <Layers width={20} height={20} />
        </div>
        <div className="fb-metric-content">
          <span className="fb-metric-label">Total Pages</span>
          <span className="fb-metric-value">{totalPages}</span>
          <span className="fb-metric-sub">Connected Facebook Pages</span>
        </div>
      </div>

      <div className="fb-metric-card">
        <div className="fb-metric-icon-box fb-icon-orange">
          <Users width={20} height={20} />
        </div>
        <div className="fb-metric-content">
          <span className="fb-metric-label">Total Leads</span>
          <span className="fb-metric-value">{totalLeads.toLocaleString()}</span>
          <span className="fb-metric-sub">Ingested across forms</span>
        </div>
      </div>

      <div className="fb-metric-card">
        <div className="fb-metric-icon-box fb-icon-cyan">
          <Megaphone width={20} height={20} />
        </div>
        <div className="fb-metric-content">
          <span className="fb-metric-label">Total Campaigns</span>
          <span className="fb-metric-value">{totalCampaigns}</span>
          <span className="fb-metric-sub">Ad campaign performance</span>
        </div>
      </div>
    </div>
  );
};
