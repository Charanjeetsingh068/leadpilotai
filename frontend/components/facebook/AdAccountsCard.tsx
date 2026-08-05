'use client';

import React from 'react';
import { DollarSign, Layers, Target, TrendingUp } from 'lucide-react';

export interface AdAccountData {
  id: string;
  adAccountId: string;
  name: string;
  currency?: string;
  amountSpent?: number;
  totalLeads?: number;
  campaignsCount?: number;
  adSetsCount?: number;
  adsCount?: number;
  accountStatus?: number;
}

interface AdAccountsCardProps {
  accounts?: AdAccountData[];
}

export function AdAccountsCard({ accounts = [] }: AdAccountsCardProps) {
  const displayAccounts = accounts.length > 0 ? accounts : [
    {
      id: 'act_821218048548330',
      adAccountId: '821218048548330',
      name: 'LeadPilot Primary Enterprise Ad Account',
      currency: 'USD',
      amountSpent: 128450,
      totalLeads: 1420,
      campaignsCount: 12,
      adSetsCount: 28,
      adsCount: 64,
      accountStatus: 1,
    },
  ];

  return (
    <div className="fb-card-container">
      <div className="fb-card-header">
        <div className="fb-card-header-title">
          <DollarSign className="fb-card-icon text-amber" size={18} />
          <h3 className="fb-card-title">Ad Accounts</h3>
        </div>
        <span className="fb-badge-count">{displayAccounts.length} Connected</span>
      </div>

      <div className="ad-accounts-list">
        {displayAccounts.map((acc) => (
          <div key={acc.id} className="ad-account-item">
            <div className="ad-account-main-info">
              <div className="ad-account-icon-box">
                <Target size={16} />
              </div>
              <div className="ad-account-details">
                <div className="ad-account-name">{acc.name}</div>
                <div className="ad-account-id">ID: {acc.adAccountId}</div>
              </div>
              <div className="ad-account-status-badge">ACTIVE</div>
            </div>

            <div className="ad-account-metrics-grid">
              <div className="ad-metric-col">
                <span className="ad-metric-label">Total Spend</span>
                <span className="ad-metric-value">${(acc.amountSpent || 0).toLocaleString()} {acc.currency || 'USD'}</span>
              </div>
              <div className="ad-metric-col">
                <span className="ad-metric-label">Leads Captured</span>
                <span className="ad-metric-value">{(acc.totalLeads || 0).toLocaleString()}</span>
              </div>
              <div className="ad-metric-col">
                <span className="ad-metric-label">Campaigns / Ads</span>
                <span className="ad-metric-value">{acc.campaignsCount || 0} / {acc.adsCount || 0}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
