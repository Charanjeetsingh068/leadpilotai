'use client';

import React, { useEffect } from 'react';
import {
  Users,
  MessageSquare,
  MessageCircle,
  Calendar as CalendarIcon,
  Tag,
  IndianRupee,
  Filter,
  Share2,
  Camera,
  Search,
  Globe,
  UserPlus,
  MoreHorizontal,
  ArrowRight,
  FileUp,
} from 'lucide-react';
import { useDashboardStore } from '@/store/useDashboardStore';
import { useUserStore } from '@/store/useUserStore';
import { StatCard } from './StatCard';
import { QuickActionCard } from './QuickActionCard';
import { RecentActivitiesList } from './RecentActivitiesList';
import { WorkspaceSummaryWidget } from './WorkspaceSummaryWidget';
import Link from 'next/link';

export const OverviewDashboard: React.FC = () => {
  const { data, fetchDashboard, selectedDateFilter } = useDashboardStore();
  const { profile } = useUserStore();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const metrics = data?.metrics;
  const recentLeads = data?.recentLeads || [];
  const recentActivities = data?.recentActivities || [];
  const workspaceSummary = data?.workspaceSummary;

  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'FACEBOOK':
        return (
          <span className="source-badge-item">
            <Share2 size={14} className="source-icon-facebook" />
            <span>Facebook Lead</span>
          </span>
        );
      case 'INSTAGRAM':
        return (
          <span className="source-badge-item">
            <Camera size={14} className="source-icon-instagram" />
            <span>Instagram Lead</span>
          </span>
        );
      case 'GOOGLE_ADS':
        return (
          <span className="source-badge-item">
            <Search size={14} className="source-icon-google" />
            <span>Google Ads</span>
          </span>
        );
      case 'WEBSITE':
        return (
          <span className="source-badge-item">
            <Globe size={14} className="source-icon-website" />
            <span>Website Lead</span>
          </span>
        );
      default:
        return (
          <span className="source-badge-item">
            <UserPlus size={14} className="source-icon-manual" />
            <span>Manual Entry</span>
          </span>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'QUALIFIED':
        return <span className="status-pill-qualified">Qualified</span>;
      case 'AI_IN_PROGRESS':
        return <span className="status-pill-in-progress">In Progress</span>;
      case 'SITE_VISIT_SCHEDULED':
        return <span className="status-pill-site-visit">Site Visit</span>;
      default:
        return <span className="status-pill-new">New Lead</span>;
    }
  };

  return (
    <div className="dashboard-layout-wrapper">
      {/* Top Greeting Bar & Filters matching reference image */}
      <div className="dashboard-header-bar">
        <div>
          <h1 className="dashboard-title-text">
            Good morning, {profile.name.split(' ')[0]} 👋
          </h1>
          <p className="dashboard-subtitle-text">
            Heres whats happening with your business today.
          </p>
        </div>

        <div className="dashboard-filter-group">
          <button type="button" className="filter-pill-btn">
            <CalendarIcon size={15} className="text-muted" />
            <span>{selectedDateFilter}</span>
            <span className="text-subtle">▼</span>
          </button>

          <button type="button" className="filter-pill-btn">
            <Filter size={15} className="text-muted" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* 6 KPI Cards Grid */}
      <div className="kpi-cards-grid">
        <StatCard
          title="Today's Leads"
          value={metrics?.todaysLeads.value || 56}
          trend={metrics?.todaysLeads.trend || '14% vs yesterday'}
          isPositive={metrics?.todaysLeads.isPositive ?? true}
          icon={<Users size={16} />}
          iconBgColor="#eff6ff"
          iconColor="#2563eb"
        />

        <StatCard
          title="Qualified Leads"
          value={metrics?.qualifiedLeads.value || 18}
          trend={metrics?.qualifiedLeads.trend || '12% vs yesterday'}
          isPositive={metrics?.qualifiedLeads.isPositive ?? true}
          icon={<MessageSquare size={16} />}
          iconBgColor="#dcfce7"
          iconColor="#16a34a"
        />

        <StatCard
          title="Pending Reply"
          value={metrics?.pendingReply.value || 23}
          trend={metrics?.pendingReply.trend || '8% vs yesterday'}
          isPositive={metrics?.pendingReply.isPositive ?? false}
          icon={<MessageCircle size={16} />}
          iconBgColor="#ffedd5"
          iconColor="#ea580c"
        />

        <StatCard
          title="Site Visits"
          value={metrics?.siteVisits.value || 7}
          trend={metrics?.siteVisits.trend || '5% vs yesterday'}
          isPositive={metrics?.siteVisits.isPositive ?? true}
          icon={<CalendarIcon size={16} />}
          iconBgColor="#f3e8ff"
          iconColor="#9333ea"
        />

        <StatCard
          title="Bookings"
          value={metrics?.bookings.value || 4}
          trend={metrics?.bookings.trend || '3% vs yesterday'}
          isPositive={metrics?.bookings.isPositive ?? true}
          icon={<Tag size={16} />}
          iconBgColor="#e0f2fe"
          iconColor="#0284c7"
        />

        <StatCard
          title="Revenue"
          value={metrics?.revenue.value || '₹1,24,500'}
          trend={metrics?.revenue.trend || '16% vs yesterday'}
          isPositive={metrics?.revenue.isPositive ?? true}
          icon={<IndianRupee size={16} />}
          iconBgColor="#dcfce7"
          iconColor="#16a34a"
        />
      </div>

      {/* Main 2-Column Section (Left 70% | Right 30%) */}
      <div className="dashboard-columns-grid">
        {/* LEFT COLUMN (Recent Leads & Quick Actions) */}
        <div className="dashboard-left-column">
          {/* Card 1: Recent Leads Table */}
          <div className="card recent-leads-card-padding">
            <div className="recent-leads-header-row">
              <h3 className="recent-leads-title">Recent Leads</h3>
              <Link href="/lead-inbox" className="view-all-link">
                View all leads
              </Link>
            </div>

            <div className="table-responsive-wrapper">
              <table className="recent-leads-table-el">
                <thead>
                  <tr className="recent-leads-table-head-row">
                    <th className="recent-leads-th">Lead</th>
                    <th className="recent-leads-th">Source</th>
                    <th className="recent-leads-th">AI Status</th>
                    <th className="recent-leads-th">Last Message</th>
                    <th className="recent-leads-th">Time</th>
                    <th className="recent-leads-th text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLeads.map((lead) => (
                    <tr key={lead.id} className="recent-leads-tr">
                      <td className="recent-leads-td">
                        <div className="lead-user-wrapper">
                          <div className="lead-avatar-circle">
                            {lead.avatarInitials}
                          </div>
                          <div>
                            <div className="lead-user-name">{lead.name}</div>
                            <div className="lead-user-phone">{lead.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="recent-leads-td">{getSourceBadge(lead.source)}</td>
                      <td className="recent-leads-td">{getStatusBadge(lead.status)}</td>
                      <td className="recent-leads-td lead-last-msg">
                        {lead.lastMessage}
                      </td>
                      <td className="recent-leads-td lead-time-text">{lead.timeAgo}</td>
                      <td className="recent-leads-td text-right">
                        <div className="action-buttons-group">
                          <Link
                            href={`/conversation/${lead.id}`}
                            className="chat-bubble-action-btn"
                            title="Open Chat"
                          >
                            <MessageCircle size={14} />
                          </Link>
                          <button
                            type="button"
                            className="more-action-btn"
                            title="More options"
                          >
                            <MoreHorizontal size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="recent-leads-footer">
              <span>Showing 5 of 56 leads</span>
              <Link href="/lead-inbox" className="view-all-link">
                <span>View all leads</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Quick Actions Grid (4 Cards) */}
          <div className="quick-actions-wrapper">
            <h3 className="quick-actions-heading">Quick Actions</h3>
            <div className="quick-actions-cards-grid">
              <QuickActionCard
                title="Connect Facebook"
                description="Capture leads from Facebook Ads"
                icon={<Share2 size={18} />}
                iconBgColor="#eff6ff"
                iconColor="#1877f2"
              />

              <QuickActionCard
                title="Connect WhatsApp"
                description="Connect your official WhatsApp number"
                icon={<MessageSquare size={18} />}
                iconBgColor="#dcfce7"
                iconColor="#16a34a"
              />

              <QuickActionCard
                title="Add Manual Lead"
                description="Add a new lead manually"
                icon={<UserPlus size={18} />}
                iconBgColor="#f1f5f9"
                iconColor="#475569"
              />

              <QuickActionCard
                title="Upload Knowledge Base"
                description="Upload documents to train your AI"
                icon={<FileUp size={18} />}
                iconBgColor="#f3e8ff"
                iconColor="#9333ea"
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (Recent AI Activities & Workspace Summary) */}
        <div className="dashboard-right-column">
          <RecentActivitiesList activities={recentActivities} />
          <WorkspaceSummaryWidget summary={workspaceSummary} />
        </div>
      </div>
    </div>
  );
};
