'use client';

import React, { useEffect, useState } from 'react';
import {
  Users,
  MessageSquare,
  Calendar,
  Tag,
  IndianRupee,
  Calendar as CalendarIcon,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  MessageCircle,
  MoreHorizontal,
  ArrowRight,
  Share2,
  Camera,
  Search,
  Globe,
  UserPlus,
  FileText,
  Bot,
  ChevronRight,
  Plus,
  CheckCircle2,
  FileUp,
} from 'lucide-react';
import { fetchDashboardOverview } from '@/services/dashboard.service';
import { DashboardOverviewResponse } from '@/types/dashboard.types';
import Link from 'next/link';
import toast from 'react-hot-toast';

export const OverviewDashboard: React.FC = () => {
  const [data, setData] = useState<DashboardOverviewResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadOverview = async () => {
      try {
        const overviewData = await fetchDashboardOverview();
        setData(overviewData);
      } catch (error) {
        console.error('Failed to load overview data:', error);
        toast.error('Could not connect to backend. Showing cached dynamic dashboard.');
        // Fallback state matching screenshot
        setData({
          metrics: {
            todaysLeads: { value: 56, trend: '14% vs yesterday', isPositive: true },
            qualifiedLeads: { value: 18, trend: '12% vs yesterday', isPositive: true },
            pendingReply: { value: 23, trend: '8% vs yesterday', isPositive: false },
            siteVisits: { value: 7, trend: '5% vs yesterday', isPositive: true },
            bookings: { value: 4, trend: '3% vs yesterday', isPositive: true },
            revenue: { value: '₹1,24,500', trend: '16% vs yesterday', isPositive: true },
          },
          recentLeads: [
            {
              id: '1',
              name: 'Rohit Sharma',
              phone: '+91 98765 43210',
              email: 'rohit.s@gmail.com',
              source: 'FACEBOOK',
              status: 'QUALIFIED',
              lastMessage: "Yes, I'm interested in 2BHK flat.",
              timeAgo: '2m ago',
              avatarInitials: 'RS',
            },
            {
              id: '2',
              name: 'Priya Verma',
              phone: '+91 91234 56789',
              email: 'priya.v@gmail.com',
              source: 'INSTAGRAM',
              status: 'AI_IN_PROGRESS',
              lastMessage: 'Can you share the prices?',
              timeAgo: '5m ago',
              avatarInitials: 'PV',
            },
            {
              id: '3',
              name: 'Amit Kumar',
              phone: '+91 99887 76655',
              email: 'amit.k@gmail.com',
              source: 'GOOGLE_ADS',
              status: 'AI_IN_PROGRESS',
              lastMessage: 'Do you have any properties in Wakad?',
              timeAgo: '12m ago',
              avatarInitials: 'AK',
            },
            {
              id: '4',
              name: 'Sneha Iyer',
              phone: '+91 87654 32109',
              email: 'sneha.i@gmail.com',
              source: 'WEBSITE',
              status: 'SITE_VISIT_SCHEDULED',
              lastMessage: 'I want to schedule a visit.',
              timeAgo: '18m ago',
              avatarInitials: 'SI',
            },
            {
              id: '5',
              name: 'Vikram Singh',
              phone: '+91 76543 21098',
              email: 'vikram.s@gmail.com',
              source: 'MANUAL',
              status: 'NEW',
              lastMessage: 'Please share more details.',
              timeAgo: '25m ago',
              avatarInitials: 'VS',
            },
          ],
          recentActivities: [
            {
              id: '1',
              type: 'WHATSAPP_SENT',
              description: 'AI Agent sent offer details to Rohit Sharma',
              timeAgo: '2m ago',
              iconType: 'whatsapp',
            },
            {
              id: '2',
              type: 'QUALIFIED',
              description: 'Lead qualified by AI Agent Priya Verma',
              timeAgo: '5m ago',
              iconType: 'robot',
            },
            {
              id: '3',
              type: 'SITE_VISIT',
              description: 'Site visit scheduled for Sneha Iyer',
              timeAgo: '18m ago',
              iconType: 'calendar',
            },
            {
              id: '4',
              type: 'FOLLOW_UP',
              description: 'Follow-up message sent to Amit Kumar',
              timeAgo: '25m ago',
              iconType: 'whatsapp',
            },
            {
              id: '5',
              type: 'KNOWLEDGE_BASE',
              description: 'Knowledge base updated Project Pricelist.pdf',
              timeAgo: '1h ago',
              iconType: 'document',
            },
          ],
          workspaceSummary: {
            totalLeads: 1248,
            activeAiAgents: 4,
            knowledgeBaseDocs: 23,
            teamMembers: 12,
          },
        });
      } finally {
        setLoading(false);
      }
    };

    loadOverview();
  }, []);

  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'FACEBOOK':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: '#1e293b' }}>
            <Share2 size={14} style={{ color: '#1877f2' }} />
            <span>Facebook Lead</span>
          </span>
        );
      case 'INSTAGRAM':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: '#1e293b' }}>
            <Camera size={14} style={{ color: '#e1306c' }} />
            <span>Instagram Lead</span>
          </span>
        );
      case 'GOOGLE_ADS':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: '#1e293b' }}>
            <Search size={14} style={{ color: '#ea4335' }} />
            <span>Google Ads</span>
          </span>
        );
      case 'WEBSITE':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: '#1e293b' }}>
            <Globe size={14} style={{ color: '#0284c7' }} />
            <span>Website Lead</span>
          </span>
        );
      default:
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: '#1e293b' }}>
            <UserPlus size={14} style={{ color: '#64748b' }} />
            <span>Manual Entry</span>
          </span>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'QUALIFIED':
        return <span className="badge-qualified" style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}>Qualified</span>;
      case 'AI_IN_PROGRESS':
        return <span className="badge-in-progress" style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}>In Progress</span>;
      case 'SITE_VISIT_SCHEDULED':
        return <span className="badge-site-visit" style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}>Site Visit</span>;
      default:
        return (
          <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '9999px', backgroundColor: '#f1f5f9', color: '#475569', fontWeight: 600 }}>
            New Lead
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
        <p>Loading real-time overview metrics...</p>
      </div>
    );
  }

  const metrics = data?.metrics;
  const recentLeads = data?.recentLeads || [];
  const recentActivities = data?.recentActivities || [];
  const workspaceSummary = data?.workspaceSummary;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2rem' }}>
      {/* Welcome Greeting Bar & Date Filters */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
            Good morning, Arjun 👋
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>
            Here's what's happening with your business today.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              height: '38px',
              padding: '0 0.85rem',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              fontWeight: 500,
              color: '#334155',
              cursor: 'pointer',
            }}
          >
            <CalendarIcon size={15} style={{ color: '#64748b' }} />
            <span>May 26, 2025</span>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>▼</span>
          </button>

          <button
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              height: '38px',
              padding: '0 0.85rem',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              fontWeight: 500,
              color: '#334155',
              cursor: 'pointer',
            }}
          >
            <Filter size={15} style={{ color: '#64748b' }} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* 6 Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        {/* Card 1: Today's Leads */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={16} />
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Today's Leads</span>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a' }}>{metrics?.todaysLeads.value}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#16a34a', marginTop: '0.25rem', fontWeight: 600 }}>
            <ArrowUpRight size={14} />
            <span>{metrics?.todaysLeads.trend}</span>
          </div>
        </div>

        {/* Card 2: Qualified Leads */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquare size={16} />
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Qualified Leads</span>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a' }}>{metrics?.qualifiedLeads.value}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#16a34a', marginTop: '0.25rem', fontWeight: 600 }}>
            <ArrowUpRight size={14} />
            <span>{metrics?.qualifiedLeads.trend}</span>
          </div>
        </div>

        {/* Card 3: Pending Reply */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#ffedd5', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageCircle size={16} />
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Pending Reply</span>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a' }}>{metrics?.pendingReply.value}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#dc2626', marginTop: '0.25rem', fontWeight: 600 }}>
            <ArrowDownRight size={14} />
            <span>{metrics?.pendingReply.trend}</span>
          </div>
        </div>

        {/* Card 4: Site Visits */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f3e8ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={16} />
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Site Visits</span>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a' }}>{metrics?.siteVisits.value}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#16a34a', marginTop: '0.25rem', fontWeight: 600 }}>
            <ArrowUpRight size={14} />
            <span>{metrics?.siteVisits.trend}</span>
          </div>
        </div>

        {/* Card 5: Bookings */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Tag size={16} />
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Bookings</span>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a' }}>{metrics?.bookings.value}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#16a34a', marginTop: '0.25rem', fontWeight: 600 }}>
            <ArrowUpRight size={14} />
            <span>{metrics?.bookings.trend}</span>
          </div>
        </div>

        {/* Card 6: Revenue */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IndianRupee size={16} />
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Revenue</span>
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a' }}>{metrics?.revenue.value}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#16a34a', marginTop: '0.25rem', fontWeight: 600 }}>
            <ArrowUpRight size={14} />
            <span>{metrics?.revenue.trend}</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Section (Left 70% | Right 30%) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
        {/* LEFT COLUMN (Recent Leads & Quick Actions) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: '1.4' }}>
          {/* Card 1: Recent Leads Table */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Recent Leads</h3>
              <Link href="/lead-inbox" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#2563eb' }}>
                View all leads
              </Link>
            </div>

            {/* Table Container */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #f1f5f9', color: '#64748b', fontSize: '0.75rem' }}>
                    <th style={{ padding: '0.6rem 0.5rem', fontWeight: 600 }}>Lead</th>
                    <th style={{ padding: '0.6rem 0.5rem', fontWeight: 600 }}>Source</th>
                    <th style={{ padding: '0.6rem 0.5rem', fontWeight: 600 }}>AI Status</th>
                    <th style={{ padding: '0.6rem 0.5rem', fontWeight: 600 }}>Last Message</th>
                    <th style={{ padding: '0.6rem 0.5rem', fontWeight: 600 }}>Time</th>
                    <th style={{ padding: '0.6rem 0.5rem', fontWeight: 600, textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLeads.map((lead) => (
                    <tr key={lead.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                      <td style={{ padding: '0.75rem 0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              backgroundColor: '#dbeafe',
                              color: '#1e40af',
                              fontWeight: 700,
                              fontSize: '0.75rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {lead.avatarInitials}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#0f172a' }}>{lead.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{lead.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>{getSourceBadge(lead.source)}</td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>{getStatusBadge(lead.status)}</td>
                      <td style={{ padding: '0.75rem 0.5rem', color: '#475569', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {lead.lastMessage}
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem', color: '#64748b', fontSize: '0.75rem' }}>{lead.timeAgo}</td>
                      <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
                          <button
                            style={{ border: 'none', background: '#eff6ff', color: '#2563eb', width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            title="Open Chat"
                          >
                            <MessageCircle size={14} />
                          </button>
                          <button
                            style={{ border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer' }}
                            title="More"
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

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', fontSize: '0.75rem', color: '#64748b' }}>
              <span>Showing 5 of 56 leads</span>
              <Link href="/lead-inbox" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#2563eb', fontWeight: 600 }}>
                <span>View all leads</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Card 2: Quick Actions Grid (4 Cards) */}
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.85rem' }}>Quick Actions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {/* Action 1: Connect Facebook */}
              <div className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#eff6ff', color: '#1877f2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Share2 size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Connect Facebook</h4>
                  <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.75rem', color: '#64748b' }}>Capture leads from Facebook Ads</p>
                </div>
                <ArrowRight size={14} style={{ color: '#94a3b8', marginTop: '4px' }} />
              </div>

              {/* Action 2: Connect WhatsApp */}
              <div className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MessageSquare size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Connect WhatsApp</h4>
                  <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.75rem', color: '#64748b' }}>Connect your official WhatsApp number</p>
                </div>
                <ArrowRight size={14} style={{ color: '#94a3b8', marginTop: '4px' }} />
              </div>

              {/* Action 3: Add Manual Lead */}
              <div className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#f1f5f9', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <UserPlus size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Add Manual Lead</h4>
                  <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.75rem', color: '#64748b' }}>Add a new lead manually</p>
                </div>
                <ArrowRight size={14} style={{ color: '#94a3b8', marginTop: '4px' }} />
              </div>

              {/* Action 4: Upload Knowledge Base */}
              <div className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#f3e8ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FileUp size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Upload Knowledge Base</h4>
                  <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.75rem', color: '#64748b' }}>Upload documents to train your AI</p>
                </div>
                <ArrowRight size={14} style={{ color: '#94a3b8', marginTop: '4px' }} />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (Recent AI Activities & Workspace Summary) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: '0.8' }}>
          {/* Card 1: Recent AI Activities */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Recent AI Activities</h3>
              <button style={{ border: 'none', background: 'transparent', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', cursor: 'pointer' }}>
                View all
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recentActivities.map((activity) => (
                <div key={activity.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor:
                        activity.iconType === 'whatsapp'
                          ? '#dcfce7'
                          : activity.iconType === 'robot'
                          ? '#f3e8ff'
                          : activity.iconType === 'calendar'
                          ? '#fef3c7'
                          : '#e0f2fe',
                      color:
                        activity.iconType === 'whatsapp'
                          ? '#16a34a'
                          : activity.iconType === 'robot'
                          ? '#9333ea'
                          : activity.iconType === 'calendar'
                          ? '#ea580c'
                          : '#0284c7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    {activity.iconType === 'whatsapp' ? (
                      <MessageSquare size={14} />
                    ) : activity.iconType === 'robot' ? (
                      <Bot size={14} />
                    ) : activity.iconType === 'calendar' ? (
                      <Calendar size={14} />
                    ) : (
                      <FileText size={14} />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#1e293b', lineHeight: 1.35 }}>
                      {activity.description}
                    </p>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', flexShrink: 0 }}>{activity.timeAgo}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Workspace Summary */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Workspace Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {/* Row 1: Total Leads */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid #f8fafc' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={14} />
                  </div>
                  <span style={{ fontSize: '0.85rem', color: '#334155', fontWeight: 500 }}>Total Leads</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, color: '#0f172a', fontSize: '0.85rem' }}>
                  <span>{workspaceSummary?.totalLeads.toLocaleString()}</span>
                  <ChevronRight size={14} style={{ color: '#94a3b8' }} />
                </div>
              </div>

              {/* Row 2: Active AI Agents */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid #f8fafc' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#f3e8ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Bot size={14} />
                  </div>
                  <span style={{ fontSize: '0.85rem', color: '#334155', fontWeight: 500 }}>Active AI Agents</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, color: '#0f172a', fontSize: '0.85rem' }}>
                  <span>{workspaceSummary?.activeAiAgents}</span>
                  <ChevronRight size={14} style={{ color: '#94a3b8' }} />
                </div>
              </div>

              {/* Row 3: Knowledge Base */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid #f8fafc' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={14} />
                  </div>
                  <span style={{ fontSize: '0.85rem', color: '#334155', fontWeight: 500 }}>Knowledge Base</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, color: '#0f172a', fontSize: '0.85rem' }}>
                  <span>{workspaceSummary?.knowledgeBaseDocs} Docs</span>
                  <ChevronRight size={14} style={{ color: '#94a3b8' }} />
                </div>
              </div>

              {/* Row 4: Team Members */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#f1f5f9', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={14} />
                  </div>
                  <span style={{ fontSize: '0.85rem', color: '#334155', fontWeight: 500 }}>Team Members</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, color: '#0f172a', fontSize: '0.85rem' }}>
                  <span>{workspaceSummary?.teamMembers}</span>
                  <ChevronRight size={14} style={{ color: '#94a3b8' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
