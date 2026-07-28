import React, { useState } from 'react';
import Link from 'next/link';
import { Lead, LeadStatus } from '@/types/lead.types';
import { StatusBadge } from '@/components/leads/StatusBadge';
import { ScoreBadge } from '@/components/leads/ScoreBadge';
import { SourceBadge } from '@/components/leads/SourceBadge';
import { MoreVertical, Settings, ChevronDown, Phone, Calendar, MessageSquare, UserPlus, ExternalLink, Eye, XCircle, Archive, Trash2 } from 'lucide-react';

export interface LeadInboxTableProps {
  leads: Lead[];
  selectedLeadId?: string | null;
  selectedLeadIds: string[];
  isLoading?: boolean;
  onSelectLead: (lead: Lead) => void;
  onToggleSelectLead: (id: string) => void;
  onToggleSelectAll: () => void;
  onStatusChange: (leadId: string, status: LeadStatus) => void;
  onAssign: (leadId: string) => void;
  onDelete: (leadId: string) => void;
  onOpenConversation: (leadId: string) => void;
  onScheduleVisit: (leadId: string) => void;
  onBulkAssign: () => void;
  onBulkStatusChange: (status: LeadStatus) => void;
  onBulkDelete: () => void;
}

const getAvatarClass = (name: string) => {
  const charCode = name.charCodeAt(0) || 0;
  const classes = [
    'avatar-green',
    'avatar-purple',
    'avatar-pink',
    'avatar-coral',
    'avatar-teal',
    'avatar-blue',
    'avatar-yellow',
    'avatar-cyan',
  ];
  return classes[charCode % classes.length];
};

const getInitials = (name: string) => {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

export const LeadInboxTable: React.FC<LeadInboxTableProps> = ({
  leads,
  selectedLeadId,
  selectedLeadIds,
  isLoading,
  onSelectLead,
  onToggleSelectLead,
  onToggleSelectAll,
  onStatusChange,
  onAssign,
  onDelete,
  onOpenConversation,
  onScheduleVisit,
  onBulkAssign,
  onBulkStatusChange,
  onBulkDelete,
}) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isBulkDropdownOpen, setIsBulkDropdownOpen] = useState<boolean>(false);

  const isAllSelected = leads.length > 0 && selectedLeadIds.length === leads.length;

  const handleRowClick = (lead: Lead) => {
    onSelectLead(lead);
  };

  const handleMenuClick = (e: React.MouseEvent, leadId: string) => {
    e.stopPropagation();
    setActiveMenuId((prev) => (prev === leadId ? null : leadId));
  };

  return (
    <div className="lead-table-container">
      {/* Top Bulk Selection Action Sub-Bar */}
      <div className="lead-bulk-bar">
        <input
          type="checkbox"
          className="lead-checkbox"
          checked={isAllSelected}
          onChange={onToggleSelectAll}
        />
        <span className="lead-bulk-text">{selectedLeadIds.length} Selected</span>
        <div className="pos-relative">
          <button
            type="button"
            className="lead-bulk-select-dropdown"
            onClick={() => setIsBulkDropdownOpen(!isBulkDropdownOpen)}
            disabled={selectedLeadIds.length === 0}
          >
            Bulk Actions <ChevronDown size={14} />
          </button>

          {isBulkDropdownOpen && (
            <div className="dropdown-menu shadow-dropdown" onClick={() => setIsBulkDropdownOpen(false)}>
              <button type="button" className="dropdown-item" onClick={onBulkAssign}>
                Assign to Executive
              </button>
              <button type="button" className="dropdown-item" onClick={() => onBulkStatusChange('QUALIFIED')}>
                Mark Qualified
              </button>
              <button type="button" className="dropdown-item" onClick={() => onBulkStatusChange('ARCHIVED')}>
                Archive Selected
              </button>
              <button type="button" className="dropdown-item dropdown-item-danger" onClick={onBulkDelete}>
                Delete Selected
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Desktop Enterprise Data Table */}
      <div className="lead-table-card lead-desktop-table">
        <div className="lead-table-scroll-container">
          <table className="lead-table">
            <thead>
              <tr>
                <th className="cell-checkbox">
                  <input
                    type="checkbox"
                    className="lead-checkbox"
                    checked={isAllSelected}
                    onChange={onToggleSelectAll}
                  />
                </th>
                <th>Lead Name</th>
                <th>Phone</th>
                <th>Project</th>
                <th>Source</th>
                <th>Lead Score</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Created Time</th>
                <th className="text-right">
                  <button type="button" className="lead-row-actions-btn" title="Table Settings">
                    <Settings size={16} />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, idx) => (
                  <tr key={idx}>
                    <td colSpan={10} className="text-center text-muted cell-loading-padding">
                      Loading leads...
                    </td>
                  </tr>
                ))
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center text-muted cell-empty-padding">
                    No matching leads found.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => {
                  const isSelected = selectedLeadId === lead.id;
                  const isChecked = selectedLeadIds.includes(lead.id);
                  const avatarColorClass = getAvatarClass(lead.name);
                  const initials = getInitials(lead.name);

                  return (
                    <tr
                      key={lead.id}
                      className={`${isSelected ? 'active-row' : ''}`}
                      onClick={() => handleRowClick(lead)}
                    >
                      <td className="cell-checkbox" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          className="lead-checkbox"
                          checked={isChecked}
                          onChange={() => onToggleSelectLead(lead.id)}
                        />
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <Link
                          href={`/lead/${lead.id}`}
                          className="lead-name-cell lead-name-clickable-link"
                          title={`View ${lead.name} Details`}
                        >
                          <div className={`lead-avatar-circle ${avatarColorClass}`}>{initials}</div>
                          <span className="lead-name-text-bold">{lead.name}</span>
                        </Link>
                      </td>
                      <td>
                        <span className="lead-phone-text">{lead.phone}</span>
                      </td>
                      <td>
                        <span className="lead-project-text">{lead.project || 'General'}</span>
                      </td>
                      <td>
                        <SourceBadge source={lead.source} />
                      </td>
                      <td>
                        <ScoreBadge score={lead.qualificationScore || 70} />
                      </td>
                      <td>
                        <StatusBadge status={lead.status} />
                      </td>
                      <td>
                        <div className="lead-assigned-cell">
                          <div className="lead-avatar-circle avatar-purple lead-user-avatar-sm">
                            {getInitials(lead.assignedSalesUser?.name || 'Neha Singh')}
                          </div>
                          <span className="lead-user-name">{lead.assignedSalesUser?.name || 'Neha Singh'}</span>
                        </div>
                      </td>
                      <td>
                        <span className="text-muted lead-created-text">
                          {lead.createdAt ? '2m ago' : '5m ago'}
                        </span>
                      </td>
                      <td className="text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="pos-relative">
                          <button
                            type="button"
                            className="lead-row-actions-btn"
                            onClick={(e) => handleMenuClick(e, lead.id)}
                          >
                            <MoreVertical size={16} />
                          </button>

                          {activeMenuId === lead.id && (
                            <div className="dropdown-menu shadow-dropdown text-left dropdown-menu-right" onClick={() => setActiveMenuId(null)}>
                              <Link href={`/lead/${lead.id}`} className="dropdown-item">
                                <ExternalLink size={14} className="text-primary" /> View Full Details
                              </Link>
                              <button type="button" className="dropdown-item" onClick={() => onSelectLead(lead)}>
                                <Eye size={14} /> Quick Preview Drawer
                              </button>
                              <button type="button" className="dropdown-item" onClick={() => onOpenConversation(lead.id)}>
                                <MessageSquare size={14} /> Open Conversation
                              </button>
                              <button type="button" className="dropdown-item" onClick={() => onAssign(lead.id)}>
                                <UserPlus size={14} /> Assign User
                              </button>
                              <button type="button" className="dropdown-item" onClick={() => onScheduleVisit(lead.id)}>
                                <Calendar size={14} /> Schedule Site Visit
                              </button>
                              <button type="button" className="dropdown-item" onClick={() => onStatusChange(lead.id, 'LOST')}>
                                <XCircle size={14} /> Mark Lost
                              </button>
                              <button type="button" className="dropdown-item" onClick={() => onStatusChange(lead.id, 'ARCHIVED')}>
                                <Archive size={14} /> Archive
                              </button>
                              <button type="button" className="dropdown-item dropdown-item-danger" onClick={() => onDelete(lead.id)}>
                                <Trash2 size={14} /> Soft Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Responsive Card List View */}
      <div className="lead-mobile-card-list">
        {isLoading ? (
          <div className="lead-note-card text-center cell-loading-padding">Loading leads...</div>
        ) : leads.length === 0 ? (
          <div className="lead-note-card text-center cell-empty-padding">No matching leads found.</div>
        ) : (
          leads.map((lead) => {
            const isSelected = selectedLeadId === lead.id;
            const isChecked = selectedLeadIds.includes(lead.id);
            const avatarColorClass = getAvatarClass(lead.name);
            const initials = getInitials(lead.name);

            return (
              <div
                key={lead.id}
                className={`lead-mobile-card ${isSelected ? 'active-card' : ''}`}
                onClick={() => handleRowClick(lead)}
              >
                <div className="lead-mobile-card-header">
                  <div className="lead-name-cell">
                    <input
                      type="checkbox"
                      className="lead-checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        e.stopPropagation();
                        onToggleSelectLead(lead.id);
                      }}
                    />
                    <div className={`lead-avatar-circle ${avatarColorClass}`}>{initials}</div>
                    <div>
                      <span className="lead-mobile-name">{lead.name}</span>
                      <span className="lead-mobile-phone">{lead.phone}</span>
                    </div>
                  </div>

                  <StatusBadge status={lead.status} />
                </div>

                <div className="lead-mobile-card-body">
                  <div className="lead-mobile-meta-row">
                    <span className="text-muted">Project:</span>
                    <span className="lead-project-text">{lead.project || 'General'}</span>
                  </div>

                  <div className="lead-mobile-meta-row">
                    <span className="text-muted">Source:</span>
                    <SourceBadge source={lead.source} />
                  </div>

                  <div className="lead-mobile-meta-row">
                    <span className="text-muted">Score:</span>
                    <ScoreBadge score={lead.qualificationScore || 70} />
                  </div>

                  <div className="lead-mobile-meta-row">
                    <span className="text-muted">Assigned:</span>
                    <span className="lead-user-name">{lead.assignedSalesUser?.name || 'Neha Singh'}</span>
                  </div>
                </div>

                <div className="lead-mobile-card-actions" onClick={(e) => e.stopPropagation()}>
                  <button type="button" className="lead-mobile-action-btn" onClick={() => onOpenConversation(lead.id)}>
                    <MessageSquare size={14} /> Chat
                  </button>
                  <button type="button" className="lead-mobile-action-btn" onClick={() => onScheduleVisit(lead.id)}>
                    <Calendar size={14} /> Visit
                  </button>
                  <button type="button" className="lead-mobile-action-btn" onClick={() => onAssign(lead.id)}>
                    <UserPlus size={14} /> Assign
                  </button>
                  <a href={`tel:${lead.phone}`} className="lead-mobile-action-btn lead-mobile-action-call">
                    <Phone size={14} /> Call
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
