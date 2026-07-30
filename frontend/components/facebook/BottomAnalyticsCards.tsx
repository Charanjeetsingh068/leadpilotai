import React from 'react';
import { Users, Layout, FileText, TrendingUp, CheckCircle, Activity } from 'lucide-react';
import { DashboardMetrics } from '@/types/facebook.types';

interface Props {
  metrics?: DashboardMetrics;
}

export const BottomAnalyticsCards: React.FC<Props> = ({
  metrics = {
    connectedAccounts: 8,
    activeAccounts: 8,
    connectedPages: 24,
    activePages: 24,
    connectedForms: 48,
    activeForms: 48,
    todayLeads: 1245,
    leadsTrendPercentage: 18.6,
    syncSuccessRate: 98.6,
    syncSuccessTrend: 2.4,
    apiUsageCalls: 7856,
    apiUsageLimit: 10000,
    apiUsagePercentage: 78,
    webhookSuccessRate: 99.2,
    duplicateLeadsCount: 140,
    syncErrorsCount: 6,
    failedEventsCount: 12,
  },
}) => {
  return (
    <div className="fb-metrics-grid-bottom">
      {/* Card 1: Total Facebook Accounts */}
      <div className="fb-card fb-metric-card">
        <div className="fb-mc-left">
          <span className="fb-mc-title">Total Facebook Accounts</span>
          <div className="fb-mc-value-row">
            <span className="fb-mc-big-number">{metrics.connectedAccounts}</span>
          </div>
          <span className="fb-mc-sub">Active</span>
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
            <span className="fb-mc-big-number">{metrics.connectedPages}</span>
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
            <span className="fb-mc-big-number">{metrics.connectedForms}</span>
          </div>
          <span className="fb-mc-sub">Active forms</span>
        </div>
        <div className="fb-mc-icon-circle icon-orange-light">
          <FileText size={20} className="text-orange" />
        </div>
      </div>

      {/* Card 4: Leads Received Today */}
      <div className="fb-card fb-metric-card">
        <div className="fb-mc-left">
          <span className="fb-mc-title">Leads Received Today</span>
          <div className="fb-mc-value-row">
            <span className="fb-mc-big-number">{metrics.todayLeads.toLocaleString()}</span>
          </div>
          <div className="fb-mc-trend-row text-success">
            <TrendingUp size={13} />
            <span>↑ {metrics.leadsTrendPercentage}% vs yesterday</span>
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
            <span className="fb-mc-big-number">{metrics.syncSuccessRate}%</span>
          </div>
          <div className="fb-mc-trend-row text-success">
            <TrendingUp size={13} />
            <span>↑ {metrics.syncSuccessTrend}% vs last 7 days</span>
          </div>
        </div>
        <div className="fb-mc-icon-circle icon-cyan-light">
          <CheckCircle size={20} className="text-cyan" />
        </div>
      </div>

      {/* Card 6: API Usage (This Month) */}
      <div className="fb-card fb-metric-card">
        <div className="fb-mc-left">
          <span className="fb-mc-title">API Usage (This Month)</span>
          <div className="fb-mc-value-row">
            <span className="fb-mc-big-number">{metrics.apiUsagePercentage}%</span>
          </div>
          <span className="fb-mc-sub font-mono">
            {metrics.apiUsageCalls.toLocaleString()} / {metrics.apiUsageLimit.toLocaleString()} calls
          </span>
        </div>
        <div className="fb-mc-icon-circle icon-blue-light">
          <Activity size={20} className="text-brand-blue" />
        </div>
      </div>
    </div>
  );
};
