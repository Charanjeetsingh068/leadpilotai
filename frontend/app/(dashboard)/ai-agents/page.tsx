'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bot,
  BookOpen,
  MessageCircle,
  Users,
  Zap,
  FileText,
  SlidersHorizontal,
  Plus,
  Search,
  ChevronDown,
  Building,
  Pill,
  GraduationCap,
  Car,
  Shield,
  HeartPulse,
  MoreVertical,
  ExternalLink,
  Send,
  Edit,
  Sparkles,
  CheckCircle2,
  Upload,
  BarChart2,
  Clock,
  Activity,
  MoreHorizontal,
} from 'lucide-react';
import { AgentClientService, AIAgentItem, AgentMetricsSummary, RecentActivityItem } from '@/services/agent.service';
import { CreateAgentWizardModal } from '@/components/ai-agents/CreateAgentWizardModal';
import toast from 'react-hot-toast';

export default function AIAgentsPage() {
  const router = useRouter();
  const [agents, setAgents] = useState<AIAgentItem[]>([]);
  const [metrics, setMetrics] = useState<AgentMetricsSummary>({
    totalAgents: 12,
    activeAgents: 12,
    pausedAgents: 0,
    conversationsToday: 1248,
    activeLeads: 2856,
    automationRunning: 8,
    whatsappConnected: 342,
  });
  const [activities, setActivities] = useState<RecentActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);

  // Filters State
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All Industries');
  const [selectedStatus, setSelectedStatus] = useState<string>('All Status');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');

  const loadPageData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [agentsRes, metricsRes, activityRes] = await Promise.all([
        AgentClientService.getAgents({
          industry: selectedIndustry,
          status: selectedStatus,
          search: searchQuery,
          sortBy: sortBy === 'name' ? 'name' : 'createdAt',
        }),
        AgentClientService.getMetricsSummary(),
        AgentClientService.getRecentActivity(),
      ]);

      if (agentsRes) {
        if (Array.isArray(agentsRes.data)) {
          setAgents(agentsRes.data);
        } else if (Array.isArray(agentsRes)) {
          setAgents(agentsRes);
        }
      }
      if (metricsRes && metricsRes.data) {
        setMetrics(metricsRes.data);
      }
      if (activityRes) {
        if (Array.isArray(activityRes.data)) {
          setActivities(activityRes.data);
        } else if (Array.isArray(activityRes)) {
          setActivities(activityRes);
        }
      }

    } catch {
      toast.error('Failed to load AI Agents data.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedIndustry, selectedStatus, searchQuery, sortBy]);

  useEffect(() => {
    loadPageData();
  }, [loadPageData]);

  const handleToggleStatus = async (id: string) => {
    try {
      const res = await AgentClientService.toggleStatus(id);
      if (res.success) {
        toast.success(`Agent status updated to ${res.data.status}`);
        loadPageData();
      }
    } catch {
      toast.error('Failed to update agent status.');
    }
  };

  return (
    <div className="agent-page-workspace">
      
      {/* Header Row */}
      <div className="agent-header-row">
        <div>
          <h1 className="agent-page-title">AI Agents</h1>
          <p className="agent-page-subtitle">Manage and monitor your AI agents, knowledge base, and automation workflows.</p>
        </div>

        <div className="agent-header-actions">
          <div className="agent-select-wrapper">
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="agent-header-select"
            >
              <option value="All Industries">All Industries</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Pharma">Pharma</option>
              <option value="Education">Education</option>
              <option value="Automobile">Automobile</option>
              <option value="Insurance">Insurance</option>
              <option value="Healthcare">Healthcare</option>
            </select>
          </div>

          <div className="agent-select-wrapper">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="agent-header-select"
            >
              <option value="All Status">All Status</option>
              <option value="Active">Active</option>
              <option value="Paused">Paused</option>
            </select>
          </div>

          <button type="button" className="btn-agent-filter">
            <SlidersHorizontal size={15} />
            <span>Filter</span>
          </button>

          <button
            type="button"
            onClick={() => setIsWizardOpen(true)}
            className="btn-agent-create-primary"
          >
            <Plus size={16} />
            <span>Create AI Agent</span>
          </button>
        </div>
      </div>

      {/* Top 5 KPI Metrics Cards Bar */}
      <div className="agent-kpi-grid">
        
        {/* KPI 1 */}
        <div className="agent-kpi-card">
          <div className="agent-kpi-icon-box bg-blue-light text-blue">
            <Bot size={20} />
          </div>
          <div>
            <span className="agent-kpi-label">Active AI Agents</span>
            <div className="agent-kpi-val-row">
              <span className="agent-kpi-value">{metrics.activeAgents}</span>
            </div>
            <span className="agent-kpi-trend text-green">↑ 20% vs yesterday</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="agent-kpi-card">
          <div className="agent-kpi-icon-box bg-green-light text-green">
            <MessageCircle size={20} />
          </div>
          <div>
            <span className="agent-kpi-label">Conversations Today</span>
            <div className="agent-kpi-val-row">
              <span className="agent-kpi-value">{metrics.conversationsToday.toLocaleString()}</span>
            </div>
            <span className="agent-kpi-trend text-green">↑ 18% vs yesterday</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="agent-kpi-card">
          <div className="agent-kpi-icon-box bg-orange-light text-orange">
            <Users size={20} />
          </div>
          <div>
            <span className="agent-kpi-label">Active Leads</span>
            <div className="agent-kpi-val-row">
              <span className="agent-kpi-value">{metrics.activeLeads.toLocaleString()}</span>
            </div>
            <span className="agent-kpi-trend text-green">↑ 15% vs yesterday</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="agent-kpi-card">
          <div className="agent-kpi-icon-box bg-purple-light text-purple">
            <Zap size={20} />
          </div>
          <div>
            <span className="agent-kpi-label">Automation Running</span>
            <div className="agent-kpi-val-row">
              <span className="agent-kpi-value">{String(metrics.automationRunning).padStart(2, '0')}</span>
            </div>
            <span className="agent-kpi-trend text-green">↑ 10% vs yesterday</span>
          </div>
        </div>

        {/* KPI 5 */}
        <div className="agent-kpi-card">
          <div className="agent-kpi-icon-box bg-cyan-light text-cyan">
            <FileText size={20} />
          </div>
          <div>
            <span className="agent-kpi-label">WhatsApp Connected</span>
            <div className="agent-kpi-val-row">
              <span className="agent-kpi-value">{metrics.whatsappConnected}</span>
            </div>
            <span className="agent-kpi-trend text-green">100% Connected</span>
          </div>
        </div>

      </div>

      {/* Main 2-Column Content Layout */}
      <div className="agent-main-layout">
        
        {/* LEFT COLUMN: Agent Cards Grid */}
        <div className="agent-left-col">
          <div className="agent-grid-card-wrapper">
            
            {/* Search & Sort Toolbar */}
            <div className="agent-toolbar-row">
              <h2 className="agent-section-title">AI Agents</h2>
              
              <div className="agent-toolbar-controls">
                <div className="agent-search-input-wrap">
                  <Search size={15} className="agent-search-icon" />
                  <input
                    type="text"
                    placeholder="Search agents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="agent-search-input"
                  />
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="agent-sort-select"
                >
                  <option value="newest">Newest First</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>
            </div>

            {/* Cards Grid */}
            <div className="agent-cards-grid">
              {agents.map((agent) => (
                <div key={agent.id} className="agent-card-item">
                  
                  {/* Card Header */}
                  <div className="agent-card-header">
                    <div
                      className="agent-card-title-wrap cursor-pointer"
                      onClick={() => router.push(`/ai-agents/${agent.id}`)}
                    >
                      <div className={`agent-card-icon-box ${getIndustryBgClass(agent.industry)}`}>
                        {getIndustryIcon(agent.industry)}
                      </div>
                      <div>
                        <div className="agent-name-status-row">
                          <h3 className="agent-card-name hover-blue">{agent.name}</h3>
                          <span className={`agent-status-badge ${agent.status === 'Active' ? 'active' : 'paused'}`}>
                            {agent.status}
                          </span>
                        </div>
                        <span className="agent-card-industry">{agent.industry}</span>
                      </div>
                    </div>
                    <button type="button" className="agent-menu-dots-btn">
                      <MoreVertical size={16} />
                    </button>
                  </div>

                  {/* Meta Pills Row */}
                  <div className="agent-meta-pills-row">
                    <div className="agent-meta-pill">
                      <span className="agent-meta-label">WhatsApp</span>
                      <span className="agent-meta-value text-green">
                        <CheckCircle2 size={12} className="inline-icon" /> Connected
                      </span>
                    </div>

                    <div className="agent-meta-pill">
                      <span className="agent-meta-label">Knowledge</span>
                      <span className="agent-meta-value text-blue">
                        <CheckCircle2 size={12} className="inline-icon" /> {agent.knowledgeVersion || 'v2.4.1'}
                      </span>
                    </div>

                    <div className="agent-meta-pill">
                      <span className="agent-meta-label">Leads</span>
                      <span className="agent-meta-value font-bold">{agent.activeLeadsCount}</span>
                    </div>
                  </div>

                  {/* Metrics 4-Col Grid */}
                  <div className="agent-card-metrics-grid">
                    <div className="agent-metric-item">
                      <span className="agent-metric-lbl">Conversations Today</span>
                      <span className="agent-metric-num">{agent.conversationsToday}</span>
                    </div>

                    <div className="agent-metric-item">
                      <span className="agent-metric-lbl">Qualification Rate</span>
                      <span className="agent-metric-num text-green">{agent.qualificationRate}%</span>
                    </div>

                    <div className="agent-metric-item">
                      <span className="agent-metric-lbl">Avg. Response Time</span>
                      <span className="agent-metric-num text-blue">{agent.avgResponseTime}</span>
                    </div>

                    <div className="agent-metric-item">
                      <span className="agent-metric-lbl">Human Takeover</span>
                      <span className="agent-metric-num text-orange">{agent.humanTakeoverRate}%</span>
                    </div>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="agent-card-actions-row">
                    {agent.status === 'Paused' ? (
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(agent.id)}
                        className="btn-agent-card-action action-enable"
                      >
                        <span>Enable</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => router.push(`/ai-agents/${agent.id}`)}
                        className="btn-agent-card-action"
                      >
                        <ExternalLink size={13} />
                        <span>Open</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => router.push(`/ai-agents/${agent.id}/qualification-flow`)}
                      className="btn-agent-card-action text-purple-600 font-semibold"
                    >
                      <Sparkles size={13} />
                      <span>Flow Builder</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => router.push(`/ai-agents/${agent.id}/knowledge-base`)}
                      className="btn-agent-card-action text-blue font-semibold"
                    >
                      <BookOpen size={13} />
                      <span>Knowledge Base</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => router.push(`/ai-agents/${agent.id}`)}
                      className="btn-agent-card-action"
                    >
                      <Send size={13} />
                      <span>Test</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => router.push(`/ai-agents/${agent.id}`)}
                      className="btn-agent-card-action"
                    >
                      <Edit size={13} />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => router.push(`/ai-agents/${agent.id}/knowledge-base`)}
                      className="btn-agent-card-more"
                      title="Knowledge Base & Settings"
                    >
                      <MoreHorizontal size={14} />
                    </button>
                  </div>

                </div>
              ))}
            </div>

            {/* Load More Button */}
            <div className="agent-load-more-row">
              <button type="button" className="btn-agent-load-more">
                <span>Load more agents</span>
                <ChevronDown size={15} />
              </button>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: Sidebar Cards */}
        <div className="agent-right-col">
          
          {/* Card 1: Quick Actions */}
          <div className="agent-sidebar-card">
            <h3 className="agent-sidebar-title">Quick Actions</h3>
            
            <div className="agent-quick-actions-list">
              
              <button type="button" onClick={() => setIsWizardOpen(true)} className="agent-quick-item">
                <div className="agent-quick-icon bg-blue-light text-blue">
                  <Bot size={16} />
                </div>
                <div className="agent-quick-text">
                  <span className="agent-quick-name">Create AI Agent</span>
                  <span className="agent-quick-sub">Build a new AI agent</span>
                </div>
                <span className="agent-quick-arrow">&gt;</span>
              </button>

              <button type="button" className="agent-quick-item">
                <div className="agent-quick-icon bg-purple-light text-purple">
                  <Upload size={16} />
                </div>
                <div className="agent-quick-text">
                  <span className="agent-quick-name">Upload Knowledge</span>
                  <span className="agent-quick-sub">Add documents to train AI</span>
                </div>
                <span className="agent-quick-arrow">&gt;</span>
              </button>

              <button type="button" className="agent-quick-item">
                <div className="agent-quick-icon bg-green-light text-green">
                  <MessageCircle size={16} />
                </div>
                <div className="agent-quick-text">
                  <span className="agent-quick-name">Connect WhatsApp</span>
                  <span className="agent-quick-sub">Connect new WhatsApp number</span>
                </div>
                <span className="agent-quick-arrow">&gt;</span>
              </button>

              <button
                type="button"
                onClick={() => agents.length > 0 && router.push(`/ai-agents/${agents[0].id}`)}
                className="agent-quick-item"
              >
                <div className="agent-quick-icon bg-blue-light text-blue">
                  <Send size={16} />
                </div>
                <div className="agent-quick-text">
                  <span className="agent-quick-name">Run AI Test</span>
                  <span className="agent-quick-sub">Test your AI agent</span>
                </div>
                <span className="agent-quick-arrow">&gt;</span>
              </button>

              <button
                type="button"
                onClick={() => agents.length > 0 && router.push(`/ai-agents/${agents[0].id}`)}
                className="agent-quick-item"
              >
                <div className="agent-quick-icon bg-orange-light text-orange">
                  <BarChart2 size={16} />
                </div>
                <div className="agent-quick-text">
                  <span className="agent-quick-name">View Analytics</span>
                  <span className="agent-quick-sub">Detailed performance insights</span>
                </div>
                <span className="agent-quick-arrow">&gt;</span>
              </button>

            </div>
          </div>

          {/* Card 2: Recent Activity */}
          <div className="agent-sidebar-card">
            <div className="agent-sidebar-header-row">
              <h3 className="agent-sidebar-title mb-0">Recent Activity</h3>
              <button type="button" className="agent-link-btn">View all</button>
            </div>

            <div className="agent-activity-list">
              {activities.map((act) => (
                <div key={act.id} className="agent-activity-item">
                  <div className="agent-activity-icon-box">
                    <Bot size={14} className="text-blue" />
                  </div>
                  <div className="agent-activity-content">
                    <div className="agent-act-name">{act.agentName}</div>
                    <div className="agent-act-desc">{act.action}</div>
                  </div>
                  <span className="agent-act-time">{act.timeAgo}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: System Status */}
          <div className="agent-sidebar-card">
            <div className="agent-sidebar-header-row">
              <h3 className="agent-sidebar-title mb-0">System Status</h3>
              <button type="button" className="agent-link-btn">View status</button>
            </div>

            <div className="agent-status-pill-row mb-3">
              <span className="agent-status-operational-pill">
                <span className="conv-status-green-dot" />
                <span>All systems operational</span>
              </span>
            </div>

            <div className="agent-system-checklist">
              <div className="agent-checklist-item">
                <span className="conv-status-green-dot" />
                <span>AI Services</span>
              </div>
              <div className="agent-checklist-item">
                <span className="conv-status-green-dot" />
                <span>WhatsApp API</span>
              </div>
              <div className="agent-checklist-item">
                <span className="conv-status-green-dot" />
                <span>Knowledge Base</span>
              </div>
              <div className="agent-checklist-item">
                <span className="conv-status-green-dot" />
                <span>Automation Engine</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Wizard Modal Component */}
      <CreateAgentWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSuccess={loadPageData}
      />

    </div>
  );
}

// Helpers for industry icons & colored boxes
function getIndustryIcon(industry: string) {
  switch (industry) {
    case 'Real Estate': return <Building size={18} />;
    case 'Pharma': return <Pill size={18} />;
    case 'Education': return <GraduationCap size={18} />;
    case 'Automobile': return <Car size={18} />;
    case 'Insurance': return <Shield size={18} />;
    case 'Healthcare': return <HeartPulse size={18} />;
    default: return <Bot size={18} />;
  }
}

function getIndustryBgClass(industry: string) {
  switch (industry) {
    case 'Real Estate': return 'bg-blue-light text-blue';
    case 'Pharma': return 'bg-green-light text-green';
    case 'Education': return 'bg-purple-light text-purple';
    case 'Automobile': return 'bg-orange-light text-orange';
    case 'Insurance': return 'bg-pink-light text-pink';
    case 'Healthcare': return 'bg-yellow-light text-yellow';
    default: return 'bg-blue-light text-blue';
  }
}
