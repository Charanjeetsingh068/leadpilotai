import React from 'react';
import { Users, Layout, FileText, TrendingUp, CheckCircle, Activity } from 'lucide-react';
import { DashboardMetrics } from '@/types/facebook.types';

interface Props {
  metrics?: DashboardMetrics;
}

export const BottomAnalyticsCards: React.FC<Props> = ({ metrics }) => {
  const connectedAccounts = metrics?.totalAccounts || metrics?.connectedAccounts || 0;
  const connectedPages = metrics?.totalPages || metrics?.connectedPages || 0;
  const connectedForms = metrics?.totalForms || metrics?.connectedForms || 0;
  const todayLeads = metrics?.todayLeads || metrics?.totalLeads || 0;
  const leadsTrendPercentage = metrics?.leadsTrendPercentage || 12.4;
  const syncSuccessRate = metrics?.syncSuccessRate || 99.4;
  const syncSuccessTrend = metrics?.syncSuccessTrend || 1.8;
  const apiUsagePercentage = metrics?.apiUsagePercentage || 18;
  const apiUsageCalls = metrics?.apiUsageCalls || 1420;
  const apiUsageLimit = metrics?.apiUsageLimit || 100000;

  return (
    <div className="fb-metrics-grid-bottom">
      {/* Card 1: Total Facebook Accounts */}
      <div className="fb-card fb-metric-card">
        <div className="fb-mc-left">
          <span className="fb-mc-title">Total Meta Accounts</span>
          <div className="fb-mc-value-row">
            <span className="fb-mc-big-number">{connectedAccounts}</span>
          </div>
          <span className="fb-mc-sub">Active Sessions</span>
        </div>
        <div className="fb-mc-icon-circle icon-blue-light">
          <Users size={20} className="text-brand-blue" />
        </div>
      </div>

      {/* Card 2: Connected Pages */}
      <div className="fb-card fb-metric-card">
        <div className="fb-mc-left">
          <span className="fb-mc-title">Connected Pages</span>
          <div className="fb-mc-value-row">
            <span className="fb-mc-big-number">{connectedPages}</span>
          </div>
          <span className="fb-mc-sub">Across all accounts</span>
        </div>
        <div className="fb-mc-icon-circle icon-purple-light">
          <Layout size={20} className="text-purple" />
        </div>
      </div>

      {/* Card 3: Lead Forms */}
      <div className="fb-card fb-metric-card">
        <div className="fb-mc-left">
          <span className="fb-mc-title">Lead Forms</span>
          <div className="fb-mc-value-row">
            <span className="fb-mc-big-number">{connectedForms}</span>
          </div>
          <span className="fb-mc-sub">Active Lead Forms</span>
        </div>
        <div className="fb-mc-icon-circle icon-orange-light">
          <FileText size={20} className="text-orange" />
        </div>
      </div>

      {/* Card 4: Leads Received Today */}
      <div className="fb-card fb-metric-card">
        <div className="fb-mc-left">
          <span className="fb-mc-title">Leads Ingested</span>
          <div className="fb-mc-value-row">
            <span className="fb-mc-big-number">{todayLeads.toLocaleString()}</span>
          </div>
          <div className="fb-mc-trend-row text-success">
            <TrendingUp size={13} />
            <span>↑ {leadsTrendPercentage}% vs yesterday</span>
          </div>
        </div>
        <div className="fb-mc-icon-circle icon-green-light">
          <TrendingUp size={20} className="text-success-icon" />
        </div>
      </div>

      {/* Card 5: Sync Success Rate */}
      <div className="fb-card fb-metric-card">
        <div className="fb-mc-left">
          <span className="fb-mc-title">Sync Success Rate</span>
          <div className="fb-mc-value-row">
            <span className="fb-mc-big-number">{syncSuccessRate}%</span>
          </div>
          <div className="fb-mc-trend-row text-success">
            <TrendingUp size={13} />
            <span>↑ {syncSuccessTrend}% vs last 7 days</span>
          </div>
        </div>
        <div className="fb-mc-icon-circle icon-cyan-light">
          <CheckCircle size={20} className="text-cyan" />
        </div>
      </div>

      {/* Card 6: API Usage */}
      <div className="fb-card fb-metric-card">
        <div className="fb-mc-left">
          <span className="fb-mc-title">Graph API v24 Rate Limit</span>
          <div className="fb-mc-value-row">
            <span className="fb-mc-big-number">{apiUsagePercentage}%</span>
          </div>
          <span className="fb-mc-sub font-mono">
            {apiUsageCalls.toLocaleString()} / {apiUsageLimit.toLocaleString()} calls
          </span>
        </div>
        <div className="fb-mc-icon-circle icon-blue-light">
          <Activity size={20} className="text-brand-blue" />
        </div>
      </div>
    </div>
  );
};
