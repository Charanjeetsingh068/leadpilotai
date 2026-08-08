'use client';

import React, { useState } from 'react';
import { Eye, MoreVertical, Download, ArrowUpRight, Bot, UserCheck } from 'lucide-react';

export interface LeadRowData {
  id: string;
  name: string;
  phone: string;
  email?: string;
  formName?: string;
  formId?: string;
  pageName?: string;
  receivedAt: string;
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'SPAM' | 'REJECTED' | 'DUPLICATE' | string;
  assignedType?: 'AI' | 'HUMAN' | 'NONE';
  assignedName?: string;
  city?: string;
  country?: string;
  campaign?: string;
  adSet?: string;
  adName?: string;
}

interface LeadInboxTableProps {
  pageName?: string;
  leads: LeadRowData[];
  totalLeadsCount?: number;
  onSelectLead: (lead: LeadRowData) => void;
  onExportCsv?: () => void;
  onViewAllLeads?: () => void;
}

export const FacebookLeadInboxTable: React.FC<LeadInboxTableProps> = ({
  pageName = 'Meta Page',
  leads,
  totalLeadsCount,
  onSelectLead,
  onExportCsv,
  onViewAllLeads,
}) => {
  const [activeFilter, setActiveFilter] = useState('ALL');

  const totalCount = totalLeadsCount || leads.length;
  const newCount = leads.filter((l) => l.status.toUpperCase() === 'NEW').length;
  const contactedCount = leads.filter((l) => l.status.toUpperCase() === 'CONTACTED').length;
  const qualifiedCount = leads.filter((l) => l.status.toUpperCase() === 'QUALIFIED').length;
  const convertedCount = leads.filter((l) => l.status.toUpperCase() === 'CONVERTED').length;
  const spamCount = leads.filter((l) => l.status.toUpperCase() === 'SPAM' || l.status.toUpperCase() === 'REJECTED').length;

  const filterPills = [
    { id: 'ALL', label: 'All Leads', count: totalCount },
    { id: 'UNREAD', label: 'Unread', count: newCount },
    { id: 'NEW', label: 'New', count: newCount },
    { id: 'CONTACTED', label: 'Contacted', count: contactedCount },
    { id: 'QUALIFIED', label: 'Qualified', count: qualifiedCount },
    { id: 'CONVERTED', label: 'Converted', count: convertedCount },
    { id: 'SPAM', label: 'Spam', count: spamCount },
  ];

  const filteredLeads = leads.filter((lead) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'UNREAD') return lead.status.toUpperCase() === 'NEW';
    return lead.status.toUpperCase() === activeFilter;
  });

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getAvatarColorClass = (idx: number) => {
    const colors = ['pink', 'green', 'purple', 'blue', 'amber'];
    return colors[idx % colors.length];
  };

  return (
    <div className="fb-lead-inbox-card">
      <div className="fb-lead-inbox-header-row">
        <h3 className="fb-lead-inbox-title">Lead Inbox ({pageName})</h3>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={onExportCsv}
            className="fb-btn-outline"
          >
            <Download width={15} height={15} />
            <span>Export Leads</span>
          </button>

          <button
            type="button"
            onClick={onViewAllLeads}
            className="fb-btn-primary"
          >
            <span>View All Leads</span>
          </button>
        </div>
      </div>

      {/* FILTER PILLS */}
      <div className="fb-lead-pills-row">
        {filterPills.map((pill) => (
          <button
            key={pill.id}
            type="button"
            onClick={() => setActiveFilter(pill.id)}
            className={`fb-pill-btn ${activeFilter === pill.id ? 'active' : ''}`}
          >
            <span>{pill.label}</span>
            <span className="fb-pill-btn-count">{pill.count}</span>
          </button>
        ))}
      </div>

      {/* LEAD TABLE */}
      <div className="fb-lead-table-wrapper">
        <table className="fb-lead-table">
          <thead>
            <tr>
              <th>Lead</th>
              <th>Form</th>
              <th>Source</th>
              <th>Received</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map((lead, idx) => {
              const initials = getInitials(lead.name);
              const colorClass = getAvatarColorClass(idx);
              const statusLower = lead.status.toLowerCase();

              return (
                <tr key={lead.id}>
                  <td>
                    <div className="fb-lead-user-cell">
                      <div className={`fb-avatar-circle ${colorClass}`}>
                        {initials}
                      </div>
                      <div className="fb-lead-user-meta">
                        <span className="fb-lead-name">{lead.name}</span>
                        <span className="fb-lead-contact">{lead.phone}</span>
                        {lead.email && <span className="fb-lead-contact">{lead.email}</span>}
                      </div>
                    </div>
                  </td>

                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 600, color: '#0f172a' }}>
                        {lead.formName || 'Meta Lead Form'}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        Form ID: {lead.formId || '—'}
                      </span>
                    </div>
                  </td>

                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Facebook Page</span>
                      <span style={{ fontWeight: 600, color: '#2563eb' }}>
                        {lead.pageName || pageName}
                      </span>
                    </div>
                  </td>

                  <td>
                    <span style={{ fontSize: '0.8125rem', color: '#334155' }}>
                      {lead.receivedAt || '—'}
                    </span>
                  </td>

                  <td>
                    <span className={`fb-status-pill ${statusLower}`}>
                      {lead.status}
                    </span>
                  </td>

                  <td>
                    {lead.assignedType === 'AI' || !lead.assignedName?.includes('Human') ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#6b21a8', fontSize: '0.8125rem', fontWeight: 600 }}>
                        <Bot width={16} height={16} />
                        <span>{lead.assignedName || 'AI Sales Agent'}</span>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#047857', fontSize: '0.8125rem', fontWeight: 600 }}>
                        <UserCheck width={16} height={16} />
                        <span>{lead.assignedName || 'Human Agent - Sales'}</span>
                      </div>
                    )}
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
                      <button
                        type="button"
                        onClick={() => onSelectLead(lead)}
                        className="fb-btn-outline"
                        style={{ padding: '0.375rem' }}
                        title="View Lead Details"
                      >
                        <Eye width={15} height={15} />
                      </button>

                      <button
                        type="button"
                        className="fb-btn-outline"
                        style={{ padding: '0.375rem' }}
                      >
                        <MoreVertical width={15} height={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* PAGINATION FOOTER */}
      <div className="fb-lead-pagination">
        <span>Showing 1 to {filteredLeads.length} of {totalLeadsCount} leads</span>

        <div className="fb-page-numbers">
          <button type="button" className="fb-page-num-btn">&lt;</button>
          <button type="button" className="fb-page-num-btn active">1</button>
          <button type="button" className="fb-page-num-btn">2</button>
          <button type="button" className="fb-page-num-btn">3</button>
          <button type="button" className="fb-page-num-btn">4</button>
          <button type="button" className="fb-page-num-btn">5</button>
          <span style={{ padding: '0 0.25rem' }}>...</span>
          <button type="button" className="fb-page-num-btn">65</button>
          <button type="button" className="fb-page-num-btn">&gt;</button>
        </div>
      </div>
    </div>
  );
};
