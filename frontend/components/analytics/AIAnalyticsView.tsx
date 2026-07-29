'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  BarChart3,
  Calendar,
  SlidersHorizontal,
  Download,
  MessageSquare,
  UserCheck,
  Building,
  TrendingUp,
  DollarSign,
  Zap,
  CheckCircle2,
  Clock,
  ThumbsUp,
  AlertTriangle,
  Users,
  Award,
  Layers,
  ArrowUpRight,
  Bot,
  BookOpen,
  Send,
  UserX,
  FileText,
  ShieldCheck,
  PieChart,
} from 'lucide-react';
import { AgentClientService, AIAgentItem } from '@/services/agent.service';
import { AnalyticsClientService } from '@/services/analytics.service';
import toast from 'react-hot-toast';

interface Props {
  agentId?: string;
}

export const AIAnalyticsView: React.FC<Props> = ({ agentId }) => {
  const router = useRouter();
  const [agents, setAgents] = useState<AIAgentItem[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agentId || '');
  const [currentAgent, setCurrentAgent] = useState<AIAgentItem | null>(null);

  const [activeTab, setActiveTab] = useState<
    'overview' | 'conversations' | 'qualification' | 'knowledge' | 'automation' | 'handover' | 'performance' | 'revenue'
  >('overview');

  const [dateRange, setDateRange] = useState<string>('May 20, 2025 - May 26, 2025');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Tab State Collections
  const [overview, setOverview] = useState<any>(null);
  const [conversationsData, setConversationsData] = useState<any>(null);
  const [leadsData, setLeadsData] = useState<any>(null);
  const [knowledgeData, setKnowledgeData] = useState<any>(null);
  const [automationData, setAutomationData] = useState<any>(null);
  const [handoverData, setHandoverData] = useState<any>(null);
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [revenueData, setRevenueData] = useState<any>(null);

  const [channels, setChannels] = useState<any[]>([]);
  const [funnel, setFunnel] = useState<any[]>([]);
  const [intents, setIntents] = useState<any[]>([]);
  const [agentLeaderboard, setAgentLeaderboard] = useState<any[]>([]);
  const [heatmap, setHeatmap] = useState<any>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [
        agentsRes,
        overviewRes,
        conversationsRes,
        leadsRes,
        knowledgeRes,
        automationRes,
        handoverRes,
        perfRes,
        revenueRes,
        channelsRes,
        funnelRes,
        intentsRes,
        leaderboardRes,
        heatmapRes,
      ] = await Promise.all([
        AgentClientService.getAgents(),
        AnalyticsClientService.getOverview(selectedAgentId),
        AnalyticsClientService.getConversations(),
        AnalyticsClientService.getLeadsAnalytics(),
        AnalyticsClientService.getKnowledgeAnalytics(),
        AnalyticsClientService.getAutomationAnalytics(),
        AnalyticsClientService.getHandover(),
        AnalyticsClientService.getPerformance(),
        AnalyticsClientService.getRevenueAnalytics(),
        AnalyticsClientService.getChannels(),
        AnalyticsClientService.getFunnel(),
        AnalyticsClientService.getIntents(),
        AnalyticsClientService.getAgentsLeaderboard(),
        AnalyticsClientService.getHeatmap(),
      ]);

      if (agentsRes && agentsRes.success && Array.isArray(agentsRes.data)) {
        setAgents(agentsRes.data);
        if (selectedAgentId) {
          const match = agentsRes.data.find((a: AIAgentItem) => a.id === selectedAgentId);
          if (match) setCurrentAgent(match);
        }
      }

      if (overviewRes && overviewRes.success) setOverview(overviewRes.data);
      if (conversationsRes && conversationsRes.success) setConversationsData(conversationsRes.data);
      if (leadsRes && leadsRes.success) setLeadsData(leadsRes.data);
      if (knowledgeRes && knowledgeRes.success) setKnowledgeData(knowledgeRes.data);
      if (automationRes && automationRes.success) setAutomationData(automationRes.data);
      if (handoverRes && handoverRes.success) setHandoverData(handoverRes.data);
      if (perfRes && perfRes.success) setPerformanceData(perfRes.data);
      if (revenueRes && revenueRes.success) setRevenueData(revenueRes.data);

      if (channelsRes && channelsRes.success && Array.isArray(channelsRes.data)) setChannels(channelsRes.data);
      if (funnelRes && funnelRes.success && Array.isArray(funnelRes.data)) setFunnel(funnelRes.data);
      if (intentsRes && intentsRes.success && Array.isArray(intentsRes.data)) setIntents(intentsRes.data);
      if (leaderboardRes && leaderboardRes.success && Array.isArray(leaderboardRes.data)) setAgentLeaderboard(leaderboardRes.data);
      if (heatmapRes && heatmapRes.success && heatmapRes.data) setHeatmap(heatmapRes.data);
    } catch {
      toast.error('Failed to load AI Analytics metrics');
    } finally {
      setIsLoading(false);
    }
  }, [selectedAgentId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const res = await AnalyticsClientService.exportReport('csv');
      if (res && res.success) {
        toast.success(`Report exported: ${res.data?.filename || 'Analytics_Report.csv'}`);
      }
    } catch {
      toast.error('Failed to export analytics report');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="an-container">
      
      {/* Top Breadcrumb */}
      <div className="an-breadcrumb-row">
        <span onClick={() => router.push('/ai-agents')} className="an-breadcrumb-link">
          AI Agents
        </span>
        <span className="an-breadcrumb-sep">&gt;</span>
        <span
          onClick={() => selectedAgentId && router.push(`/ai-agents/${selectedAgentId}`)}
          className="an-breadcrumb-link"
        >
          {currentAgent ? currentAgent.name : 'Property Advisor AI'}
        </span>
        <span className="an-breadcrumb-sep">&gt;</span>
        <span className="an-breadcrumb-current">AI Analytics</span>
      </div>

      {/* Page Header */}
      <div className="an-header-row">
        <div>
          <h1 className="an-header-title">AI Analytics</h1>
          <p className="an-header-subtitle">
            Track your AI agent performance, conversations, leads, and business impact.
          </p>
        </div>

        <div className="an-header-actions">
          <button type="button" className="wa-btn-secondary">
            <Calendar size={14} />
            <span>{dateRange} ▼</span>
          </button>

          <button type="button" className="wa-btn-secondary">
            <SlidersHorizontal size={14} />
            <span>Filters</span>
          </button>

          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="wa-btn-primary"
          >
            <Download size={14} />
            <span>{isExporting ? 'Exporting...' : 'Export Report'}</span>
          </button>
        </div>
      </div>

      {/* Analytics Sub Navigation Tabs */}
      <div className="an-tabs-bar">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`an-tab-item ${activeTab === 'overview' ? 'active' : ''}`}
        >
          Overview
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('conversations')}
          className={`an-tab-item ${activeTab === 'conversations' ? 'active' : ''}`}
        >
          Conversations
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('qualification')}
          className={`an-tab-item ${activeTab === 'qualification' ? 'active' : ''}`}
        >
          Leads &amp; Qualification
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('knowledge')}
          className={`an-tab-item ${activeTab === 'knowledge' ? 'active' : ''}`}
        >
          Knowledge
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('automation')}
          className={`an-tab-item ${activeTab === 'automation' ? 'active' : ''}`}
        >
          Automation
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('handover')}
          className={`an-tab-item ${activeTab === 'handover' ? 'active' : ''}`}
        >
          Human Handover
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('performance')}
          className={`an-tab-item ${activeTab === 'performance' ? 'active' : ''}`}
        >
          Performance
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('revenue')}
          className={`an-tab-item ${activeTab === 'revenue' ? 'active' : ''}`}
        >
          Revenue Impact
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <>
          {/* ROW 1: 6 Overview KPI Cards */}
          <div className="an-kpi-grid">
            <div className="an-kpi-card">
              <div className="an-kpi-top-row">
                <span className="an-kpi-label">Total Conversations</span>
                <div className="an-kpi-icon-box blue"><MessageSquare size={16} /></div>
              </div>
              <span className="an-kpi-num">{overview?.totalConversations?.value ? overview.totalConversations.value.toLocaleString() : '5,842'}</span>
              <div className="an-kpi-growth green">
                <span>↑ {overview?.totalConversations?.growth || '18.6%'}</span>
                <span className="an-kpi-prev">{overview?.totalConversations?.prevPeriod || 'vs May 13 - May 19'}</span>
              </div>
            </div>

            <div className="an-kpi-card">
              <div className="an-kpi-top-row">
                <span className="an-kpi-label">Qualified Leads</span>
                <div className="an-kpi-icon-box green"><UserCheck size={16} /></div>
              </div>
              <span className="an-kpi-num">{overview?.qualifiedLeads?.value ? overview.qualifiedLeads.value.toLocaleString() : '1,248'}</span>
              <div className="an-kpi-growth green">
                <span>↑ {overview?.qualifiedLeads?.growth || '20.4%'}</span>
                <span className="an-kpi-prev">{overview?.qualifiedLeads?.prevPeriod || 'vs May 13 - May 19'}</span>
              </div>
            </div>

            <div className="an-kpi-card">
              <div className="an-kpi-top-row">
                <span className="an-kpi-label">Site Visits Booked</span>
                <div className="an-kpi-icon-box purple"><Calendar size={16} /></div>
              </div>
              <span className="an-kpi-num">{overview?.siteVisitsBooked?.value || '328'}</span>
              <div className="an-kpi-growth green">
                <span>↑ {overview?.siteVisitsBooked?.growth || '16.7%'}</span>
                <span className="an-kpi-prev">{overview?.siteVisitsBooked?.prevPeriod || 'vs May 13 - May 19'}</span>
              </div>
            </div>

            <div className="an-kpi-card">
              <div className="an-kpi-top-row">
                <span className="an-kpi-label">Bookings / Deals</span>
                <div className="an-kpi-icon-box rose"><Building size={16} /></div>
              </div>
              <span className="an-kpi-num">{overview?.bookingsDeals?.value || '86'}</span>
              <div className="an-kpi-growth green">
                <span>↑ {overview?.bookingsDeals?.growth || '21.1%'}</span>
                <span className="an-kpi-prev">{overview?.bookingsDeals?.prevPeriod || 'vs May 13 - May 19'}</span>
              </div>
            </div>

            <div className="an-kpi-card">
              <div className="an-kpi-top-row">
                <span className="an-kpi-label">Conversion Rate</span>
                <div className="an-kpi-icon-box amber"><TrendingUp size={16} /></div>
              </div>
              <span className="an-kpi-num">{overview?.conversionRate?.value || '3.28%'}</span>
              <div className="an-kpi-growth green">
                <span>↑ {overview?.conversionRate?.growth || '0.61%'}</span>
                <span className="an-kpi-prev">{overview?.conversionRate?.prevPeriod || 'vs May 13 - May 19'}</span>
              </div>
            </div>

            <div className="an-kpi-card">
              <div className="an-kpi-top-row">
                <span className="an-kpi-label">Revenue Impact</span>
                <div className="an-kpi-icon-box cyan"><DollarSign size={16} /></div>
              </div>
              <span className="an-kpi-num">{overview?.revenueImpact?.value || '₹ 48.6 Lakh'}</span>
              <div className="an-kpi-growth green">
                <span>↑ {overview?.revenueImpact?.growth || '24.3%'}</span>
                <span className="an-kpi-prev">{overview?.revenueImpact?.prevPeriod || 'vs May 13 - May 19'}</span>
              </div>
            </div>
          </div>

          {/* ROW 2: 3 Main Charts */}
          <div className="an-charts-grid-3">
            <div className="an-card">
              <div className="an-card-header">
                <h3 className="an-card-title">Conversations Over Time</h3>
                <span className="wa-kv-label">Daily ▼</span>
              </div>

              <div className="wa-card-header-actions">
                <span className="wa-kv-label an-text-blue">&mdash; This Period</span>
                <span className="wa-kv-label an-text-gray">- - - Previous Period</span>
              </div>

              <div className="an-svg-chart-container">
                <svg viewBox="0 0 500 160" className="an-full-svg">
                  <line x1="0" y1="20" x2="500" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="0" y1="60" x2="500" y2="60" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="0" y1="100" x2="500" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="0" y1="140" x2="500" y2="140" stroke="#f1f5f9" strokeWidth="1" />

                  <path d="M 10 110 L 80 90 L 150 70 L 220 100 L 290 90 L 360 120 L 430 115 L 490 115" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" />
                  <path d="M 10 70 L 80 50 L 150 35 L 220 60 L 290 50 L 360 70 L 430 70 L 490 70" fill="none" stroke="#2563eb" strokeWidth="3" />

                  <circle cx="10" cy="70" r="4" fill="#2563eb" />
                  <circle cx="80" cy="50" r="4" fill="#2563eb" />
                  <circle cx="150" cy="35" r="4" fill="#2563eb" />
                  <circle cx="220" cy="60" r="4" fill="#2563eb" />
                  <circle cx="290" cy="50" r="4" fill="#2563eb" />
                  <circle cx="360" cy="70" r="4" fill="#2563eb" />
                  <circle cx="490" cy="70" r="4" fill="#2563eb" />
                </svg>
              </div>

              <div className="wa-card-header-actions wa-justify-between">
                <span className="wa-kv-label">May 20</span>
                <span className="wa-kv-label">May 21</span>
                <span className="wa-kv-label">May 22</span>
                <span className="wa-kv-label">May 23</span>
                <span className="wa-kv-label">May 24</span>
                <span className="wa-kv-label">May 25</span>
                <span className="wa-kv-label">May 26</span>
              </div>
            </div>

            <div className="an-card">
              <div className="an-card-header">
                <h3 className="an-card-title">Conversations by Channel</h3>
              </div>

              <div className="an-donut-container">
                <svg viewBox="0 0 100 100" className="an-full-svg">
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#22c55e" strokeWidth="14" strokeDasharray="174 238" strokeDashoffset="0" />
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#3b82f6" strokeWidth="14" strokeDasharray="36 238" strokeDashoffset="-174" />
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#ec4899" strokeWidth="14" strokeDasharray="17 238" strokeDashoffset="-210" />
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#06b6d4" strokeWidth="14" strokeDasharray="8 238" strokeDashoffset="-227" />
                </svg>
                <div className="an-donut-center-text">
                  <span className="wa-kv-val an-text-lg">5,842</span>
                  <div className="wa-kv-label">Total</div>
                </div>
              </div>

              <div className="an-legend-list">
                <div className="an-legend-item">
                  <div className="an-legend-dot-label"><span className="an-dot an-dot-green" /><span>WhatsApp</span></div>
                  <span className="wa-kv-val">4,256 (72.9%)</span>
                </div>
                <div className="an-legend-item">
                  <div className="an-legend-dot-label"><span className="an-dot an-dot-blue" /><span>Facebook</span></div>
                  <span className="wa-kv-val">892 (15.3%)</span>
                </div>
                <div className="an-legend-item">
                  <div className="an-legend-dot-label"><span className="an-dot an-dot-pink" /><span>Instagram</span></div>
                  <span className="wa-kv-val">412 (7.1%)</span>
                </div>
                <div className="an-legend-item">
                  <div className="an-legend-dot-label"><span className="an-dot an-dot-cyan" /><span>Website</span></div>
                  <span className="wa-kv-val">198 (3.4%)</span>
                </div>
                <div className="an-legend-item">
                  <div className="an-legend-dot-label"><span className="an-dot an-dot-slate" /><span>Others</span></div>
                  <span className="wa-kv-val">84 (1.3%)</span>
                </div>
              </div>
            </div>

            <div className="an-card">
              <div className="an-card-header">
                <h3 className="an-card-title">Lead Qualification Rate</h3>
              </div>

              <div className="an-funnel-list">
                <div className="an-funnel-bar an-funnel-1"><span>Total Conversations</span><span>5,842</span></div>
                <div className="an-funnel-bar an-funnel-2"><span>Contacted / Engaged</span><span>2,816 (48.2%)</span></div>
                <div className="an-funnel-bar an-funnel-3"><span>Qualified Leads</span><span>1,248 (21.4%)</span></div>
                <div className="an-funnel-bar an-funnel-4"><span>Site Visit Booked</span><span>328 (5.6%)</span></div>
                <div className="an-funnel-bar an-funnel-5"><span>Bookings / Closed</span><span>86 (1.5%)</span></div>
              </div>
            </div>
          </div>

          {/* ROW 3 & 4: Performance, Intents, Handover, Leaderboard & Heatmap */}
          <div className="an-charts-grid-3">
            <div className="an-card">
              <div className="an-card-header"><h3 className="an-card-title">AI Performance Overview</h3></div>
              <div className="an-perf-grid">
                <div className="an-perf-tile"><span className="wa-kv-label">Avg Response Time</span><span className="an-kpi-num">2.3s</span><span className="wa-kv-val green">↑ 0.6s</span></div>
                <div className="an-perf-tile"><span className="wa-kv-label">AI Accuracy Score</span><span className="an-kpi-num">92%</span><span className="wa-kv-val green">↑ 4%</span></div>
                <div className="an-perf-tile"><span className="wa-kv-label">First Response Rate</span><span className="an-kpi-num">98.1%</span><span className="wa-kv-val green">↑ 2.1%</span></div>
                <div className="an-perf-tile"><span className="wa-kv-label">Auto Resolution Rate</span><span className="an-kpi-num">67.3%</span><span className="wa-kv-val green">↑ 5.7%</span></div>
                <div className="an-perf-tile"><span className="wa-kv-label">Human Handover Rate</span><span className="an-kpi-num">12.8%</span><span className="wa-kv-val green">↓ 3.2%</span></div>
                <div className="an-perf-tile"><span className="wa-kv-label">Customer Satisfaction</span><span className="an-kpi-num">4.6 / 5</span><span className="wa-kv-val green">↑ 0.3</span></div>
              </div>
            </div>

            <div className="an-card">
              <div className="an-card-header"><h3 className="an-card-title">Top Intents Detected</h3><span className="wa-kv-label">This Period ▼</span></div>
              <div className="an-intents-list">
                {intents.map((item, idx) => (
                  <div key={idx} className="an-intent-row">
                    <span className="an-intent-name">{item.name}</span>
                    <div className="an-intent-track"><div className="an-intent-fill" /></div>
                    <span className="an-intent-val">{item.count.toLocaleString()} ({item.percentage}%)</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="an-card">
              <div className="an-card-header"><h3 className="an-card-title">Human Handover Insights</h3></div>
              <div className="an-donut-container">
                <svg viewBox="0 0 100 100" className="an-full-svg">
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#ef4444" strokeWidth="14" strokeDasharray="99 238" strokeDashoffset="0" />
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#f97316" strokeWidth="14" strokeDasharray="59 238" strokeDashoffset="-99" />
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#eab308" strokeWidth="14" strokeDasharray="39 238" strokeDashoffset="-158" />
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#a855f7" strokeWidth="14" strokeDasharray="21 238" strokeDashoffset="-197" />
                </svg>
                <div className="an-donut-center-text"><span className="wa-kv-val an-text-lg">749</span><div className="wa-kv-label">Total Handover</div></div>
              </div>
              <div className="an-legend-list">
                <div className="an-legend-item"><div className="an-legend-dot-label"><span className="an-dot an-dot-red" /><span>Complex Query</span></div><span className="wa-kv-val">312 (41.7%)</span></div>
                <div className="an-legend-item"><div className="an-legend-dot-label"><span className="an-dot an-dot-orange" /><span>Price Negotiation</span></div><span className="wa-kv-val">186 (24.8%)</span></div>
                <div className="an-legend-item"><div className="an-legend-dot-label"><span className="an-dot an-dot-yellow" /><span>Loan &amp; Finance</span></div><span className="wa-kv-val">124 (16.6%)</span></div>
                <div className="an-legend-item"><div className="an-legend-dot-label"><span className="an-dot an-dot-purple" /><span>Complaint / Negative</span></div><span className="wa-kv-val">67 (8.9%)</span></div>
                <div className="an-legend-item"><div className="an-legend-dot-label"><span className="an-dot an-dot-slate" /><span>Others</span></div><span className="wa-kv-val">60 (8.0%)</span></div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* TAB 2: CONVERSATIONS */}
      {activeTab === 'conversations' && (
        <div className="an-card">
          <div className="an-card-header">
            <h3 className="an-card-title">Conversations Analytics &amp; Log Engine</h3>
            <span className="wa-pill-blue">Active Sessions: {conversationsData?.openCount || 340}</span>
          </div>

          <div className="an-perf-grid">
            <div className="an-perf-tile"><span className="wa-kv-label">Total Conversations</span><span className="an-kpi-num">{conversationsData?.totalConversations || 5842}</span></div>
            <div className="an-perf-tile"><span className="wa-kv-label">Open / Active</span><span className="an-kpi-num">{conversationsData?.openCount || 340}</span></div>
            <div className="an-perf-tile"><span className="wa-kv-label">Closed / Resolved</span><span className="an-kpi-num">{conversationsData?.closedCount || 5210}</span></div>
            <div className="an-perf-tile"><span className="wa-kv-label">Pending Takeover</span><span className="an-kpi-num">{conversationsData?.pendingCount || 210}</span></div>
            <div className="an-perf-tile"><span className="wa-kv-label">Avg Duration</span><span className="an-kpi-num">{conversationsData?.avgDuration || '3m 12s'}</span></div>
            <div className="an-perf-tile"><span className="wa-kv-label">AI Replies Count</span><span className="an-kpi-num">{conversationsData?.aiRepliesCount || 22450}</span></div>
          </div>
        </div>
      )}

      {/* TAB 3: LEADS & QUALIFICATION */}
      {activeTab === 'qualification' && (
        <div className="an-card">
          <div className="an-card-header">
            <h3 className="an-card-title">Leads &amp; AI Qualification Engine</h3>
            <span className="wa-pill-green">Qualification Completion: {leadsData?.completionPct || 88.4}%</span>
          </div>

          <div className="an-perf-grid">
            <div className="an-perf-tile"><span className="wa-kv-label">New Leads</span><span className="an-kpi-num">{leadsData?.newLeads || 2856}</span></div>
            <div className="an-perf-tile"><span className="wa-kv-label">Qualified Hot Leads</span><span className="an-kpi-num text-green">{leadsData?.qualifiedLeads || 1248}</span></div>
            <div className="an-perf-tile"><span className="wa-kv-label">Rejected / Cold</span><span className="an-kpi-num text-orange">{leadsData?.rejectedLeads || 312}</span></div>
          </div>

          <div className="kb-documents-table-wrapper tp-mt-4">
            <table className="wa-table">
              <thead>
                <tr>
                  <th>Lead Name</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>Qualification Summary</th>
                  <th>Assigned Agent</th>
                  <th>Current Stage</th>
                  <th>Last Activity</th>
                </tr>
              </thead>
              <tbody>
                {leadsData?.leadsTable?.map((lead: any) => (
                  <tr key={lead.id}>
                    <td><span className="wa-kv-val">{lead.name}</span></td>
                    <td><span className="wa-pill-green">{lead.score}/100</span></td>
                    <td><span className="wa-kv-val green">{lead.status}</span></td>
                    <td><span className="wa-kv-val">{lead.qualification}</span></td>
                    <td><span className="wa-kv-val blue">{lead.assignedAgent}</span></td>
                    <td><span className="wa-kv-val">{lead.currentStage}</span></td>
                    <td><span className="wa-kv-label">{lead.lastActivity}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: KNOWLEDGE BASE ANALYTICS */}
      {activeTab === 'knowledge' && (
        <div className="an-card">
          <div className="an-card-header">
            <h3 className="an-card-title">Knowledge Base &amp; Vector Indexing Analytics</h3>
            <span className="wa-pill-green">Accuracy: {knowledgeData?.knowledgeAccuracy || '94.2%'}</span>
          </div>

          <div className="an-perf-grid">
            <div className="an-perf-tile"><span className="wa-kv-label">Total Documents</span><span className="an-kpi-num">{knowledgeData?.totalDocuments || 42}</span></div>
            <div className="an-perf-tile"><span className="wa-kv-label">Indexed Documents</span><span className="an-kpi-num text-green">{knowledgeData?.indexedCount || 38}</span></div>
            <div className="an-perf-tile"><span className="wa-kv-label">Total Embeddings Chunks</span><span className="an-kpi-num">{knowledgeData?.totalChunks || 1420}</span></div>
            <div className="an-perf-tile"><span className="wa-kv-label">Vector Storage Size</span><span className="an-kpi-num blue">{knowledgeData?.storageSize || '24.8 MB'}</span></div>
            <div className="an-perf-tile"><span className="wa-kv-label">Hallucination Rate</span><span className="an-kpi-num text-green">{knowledgeData?.hallucinationRate || '0.8%'}</span></div>
            <div className="an-perf-tile"><span className="wa-kv-label">Search Volume</span><span className="an-kpi-num">{knowledgeData?.searchVolume || 12480}</span></div>
          </div>

          <div className="kb-documents-table-wrapper tp-mt-4">
            <table className="wa-table">
              <thead>
                <tr>
                  <th>Document Name</th>
                  <th>Usage Count</th>
                  <th>Accuracy %</th>
                  <th>Vector Chunks</th>
                  <th>Last Used</th>
                </tr>
              </thead>
              <tbody>
                {knowledgeData?.documentsTable?.map((doc: any, idx: number) => (
                  <tr key={idx}>
                    <td>
                      <div className="wa-tmpl-name-wrap">
                        <FileText size={15} className="wa-kv-val blue" />
                        <span className="wa-kv-val">{doc.name}</span>
                      </div>
                    </td>
                    <td><span className="wa-kv-val">{doc.usage.toLocaleString()}</span></td>
                    <td><span className="wa-pill-green">{doc.accuracy}</span></td>
                    <td><span className="wa-kv-val">{doc.chunks}</span></td>
                    <td><span className="wa-kv-label">{doc.lastUsed}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: AUTOMATION */}
      {activeTab === 'automation' && (
        <div className="an-card">
          <div className="an-card-header">
            <h3 className="an-card-title">WhatsApp Automation &amp; Sequence Analytics</h3>
            <span className="wa-pill-green">Delivery Rate: {automationData?.deliveryRate || '98.1%'}</span>
          </div>

          <div className="an-perf-grid">
            <div className="an-perf-tile"><span className="wa-kv-label">Automations Running</span><span className="an-kpi-num">{automationData?.automationsRunning || 8}</span></div>
            <div className="an-perf-tile"><span className="wa-kv-label">Messages Sent</span><span className="an-kpi-num">{automationData?.messagesSent || 14250}</span></div>
            <div className="an-perf-tile"><span className="wa-kv-label">Messages Delivered</span><span className="an-kpi-num text-green">{automationData?.messagesDelivered || 13980}</span></div>
            <div className="an-perf-tile"><span className="wa-kv-label">Messages Read</span><span className="an-kpi-num blue">{automationData?.messagesRead || 11840}</span></div>
            <div className="an-perf-tile"><span className="wa-kv-label">Read Rate</span><span className="an-kpi-num text-green">{automationData?.readRate || '84.6%'}</span></div>
            <div className="an-perf-tile"><span className="wa-kv-label">Click Rate</span><span className="an-kpi-num">{automationData?.clickRate || '42.3%'}</span></div>
          </div>

          <div className="kb-documents-table-wrapper tp-mt-4">
            <table className="wa-table">
              <thead>
                <tr>
                  <th>Workflow Name</th>
                  <th>Total Runs</th>
                  <th>Success Rate</th>
                  <th>Failure Rate</th>
                  <th>Last Run</th>
                </tr>
              </thead>
              <tbody>
                {automationData?.workflowsTable?.map((wf: any, idx: number) => (
                  <tr key={idx}>
                    <td>
                      <div className="wa-tmpl-name-wrap">
                        <Zap size={15} className="wa-kv-val green" />
                        <span className="wa-kv-val">{wf.name}</span>
                      </div>
                    </td>
                    <td><span className="wa-kv-val">{wf.runs.toLocaleString()}</span></td>
                    <td><span className="wa-pill-green">{wf.success}</span></td>
                    <td><span className="wa-kv-val text-orange">{wf.failure}</span></td>
                    <td><span className="wa-kv-label">{wf.lastRun}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: HUMAN HANDOVER */}
      {activeTab === 'handover' && (
        <div className="an-card">
          <div className="an-card-header">
            <h3 className="an-card-title">Human Handover &amp; Agent Transfer Insights</h3>
            <span className="wa-pill-green">Avg Resolution: {handoverData?.avgResolutionTime || '14m 20s'}</span>
          </div>

          <div className="an-perf-grid">
            <div className="an-perf-tile"><span className="wa-kv-label">Total Takeovers</span><span className="an-kpi-num">{handoverData?.totalHandover || 749}</span></div>
            <div className="an-perf-tile"><span className="wa-kv-label">Resolved Takeovers</span><span className="an-kpi-num text-green">{handoverData?.resolvedCount || 680}</span></div>
            <div className="an-perf-tile"><span className="wa-kv-label">Pending Resolution</span><span className="an-kpi-num text-orange">{handoverData?.pendingCount || 45}</span></div>
          </div>

          <div className="kb-documents-table-wrapper tp-mt-4">
            <table className="wa-table">
              <thead>
                <tr>
                  <th>Conversation ID</th>
                  <th>Lead Name</th>
                  <th>AI Agent</th>
                  <th>Handover Reason</th>
                  <th>Duration</th>
                  <th>Resolved By</th>
                </tr>
              </thead>
              <tbody>
                {handoverData?.handoverTable?.map((row: any, idx: number) => (
                  <tr key={idx}>
                    <td><span className="wa-kv-val blue">{row.conversationId}</span></td>
                    <td><span className="wa-kv-val">{row.leadName}</span></td>
                    <td><span className="wa-kv-val">{row.agent}</span></td>
                    <td><span className="wa-pill-green">{row.reason}</span></td>
                    <td><span className="wa-kv-val">{row.duration}</span></td>
                    <td><span className="wa-kv-val green">{row.resolvedBy}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7: PERFORMANCE */}
      {activeTab === 'performance' && (
        <div className="an-card">
          <div className="an-card-header">
            <h3 className="an-card-title">AI Agent Performance &amp; CSAT Ratings</h3>
          </div>

          <div className="kb-documents-table-wrapper">
            <table className="wa-table">
              <thead>
                <tr>
                  <th>Agent Name</th>
                  <th>Conversations</th>
                  <th>Qualified Leads</th>
                  <th>Qualification Rate</th>
                  <th>Avg Response Time</th>
                  <th>CSAT Score</th>
                </tr>
              </thead>
              <tbody>
                {agentLeaderboard.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <div className="wa-tmpl-name-wrap">
                        <Bot size={15} className="wa-kv-val blue" />
                        <span className="wa-kv-val">{row.name}</span>
                      </div>
                    </td>
                    <td><span className="wa-kv-val">{row.conversations.toLocaleString()}</span></td>
                    <td><span className="wa-kv-val">{row.qualifiedLeads.toLocaleString()}</span></td>
                    <td><span className="wa-kv-val">{row.qualificationRate}</span></td>
                    <td><span className="wa-kv-val blue">{row.avgResponseTime}</span></td>
                    <td><span className="wa-pill-green">{row.csatScore}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 8: REVENUE IMPACT */}
      {activeTab === 'revenue' && (
        <div className="an-card">
          <div className="an-card-header">
            <h3 className="an-card-title">Revenue Impact &amp; Business ROI</h3>
            <span className="wa-pill-green">ROI: {revenueData?.roi || '14.8x'}</span>
          </div>

          <div className="an-perf-grid">
            <div className="an-perf-tile"><span className="wa-kv-label">Total Revenue</span><span className="an-kpi-num text-green">{revenueData?.totalRevenue || '₹ 48.6 Lakh'}</span></div>
            <div className="an-perf-tile"><span className="wa-kv-label">Closed Bookings</span><span className="an-kpi-num">{revenueData?.bookingsCount || 86}</span></div>
            <div className="an-perf-tile"><span className="wa-kv-label">Active Pipeline</span><span className="an-kpi-num blue">{revenueData?.pipelineValue || '₹ 1.82 Cr'}</span></div>
            <div className="an-perf-tile"><span className="wa-kv-label">Won Deals</span><span className="an-kpi-num text-green">{revenueData?.wonDeals || 86}</span></div>
            <div className="an-perf-tile"><span className="wa-kv-label">Forecast Revenue</span><span className="an-kpi-num">{revenueData?.forecast || '₹ 2.40 Cr'}</span></div>
            <div className="an-perf-tile"><span className="wa-kv-label">AI ROI Multiple</span><span className="an-kpi-num text-green">{revenueData?.roi || '14.8x'}</span></div>
          </div>

          <div className="kb-documents-table-wrapper tp-mt-4">
            <table className="wa-table">
              <thead>
                <tr>
                  <th>Deal Title</th>
                  <th>Revenue</th>
                  <th>Customer Name</th>
                  <th>Project Name</th>
                  <th>Campaign</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {revenueData?.dealsTable?.map((deal: any, idx: number) => (
                  <tr key={idx}>
                    <td><span className="wa-kv-val">{deal.deal}</span></td>
                    <td><span className="wa-kv-val green font-bold">{deal.revenue}</span></td>
                    <td><span className="wa-kv-val">{deal.customer}</span></td>
                    <td><span className="wa-kv-val blue">{deal.project}</span></td>
                    <td><span className="wa-kv-val">{deal.campaign}</span></td>
                    <td><span className="wa-pill-green">{deal.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
