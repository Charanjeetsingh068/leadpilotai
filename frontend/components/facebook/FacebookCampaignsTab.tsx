'use client';

import React from 'react';

export interface CampaignData {
  id: string;
  campaignId: string;
  name: string;
  objective: string;
  budget: number;
  spend: number;
  reach: number;
  clicks: number;
  ctr: number;
  leadsCount: number;
  cpl: number;
  status: string;
}

interface CampaignsTabProps {
  campaigns: CampaignData[];
}

export const FacebookCampaignsTab: React.FC<CampaignsTabProps> = ({ campaigns }) => {
  return (
    <div className="fb-lead-inbox-card">
      <div className="fb-lead-inbox-header-row">
        <h3 className="fb-lead-inbox-title">Meta Ads Campaigns</h3>
      </div>

      <div className="fb-lead-table-wrapper">
        <table className="fb-lead-table">
          <thead>
            <tr>
              <th>Campaign Name</th>
              <th>Objective</th>
              <th>Budget</th>
              <th>Spend</th>
              <th>Reach</th>
              <th>Clicks</th>
              <th>CTR</th>
              <th>Leads</th>
              <th>CPL</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((cmp) => (
              <tr key={cmp.id || cmp.campaignId}>
                <td style={{ fontWeight: 600, color: '#0f172a' }}>{cmp.name}</td>
                <td>{cmp.objective}</td>
                <td>${cmp.budget.toFixed(2)}</td>
                <td>${cmp.spend.toFixed(2)}</td>
                <td>{cmp.reach.toLocaleString()}</td>
                <td>{cmp.clicks.toLocaleString()}</td>
                <td>{cmp.ctr}%</td>
                <td style={{ fontWeight: 700, color: '#2563eb' }}>{cmp.leadsCount}</td>
                <td>${cmp.cpl.toFixed(2)}</td>
                <td>
                  <span className="fb-active-badge">{cmp.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
