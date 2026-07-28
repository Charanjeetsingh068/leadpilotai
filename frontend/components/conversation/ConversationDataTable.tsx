'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronDown, MoreVertical, Columns, ChevronLeft, ChevronRight } from 'lucide-react';

export interface ConversationRowData {
  id: string;
  leadId: string;
  customerName: string;
  initials: string;
  avatarColorClass: string;
  phone: string;
  source: 'Facebook' | 'Instagram' | 'Google Ads' | 'Website' | 'Manual';
  project: string;
  assignedTo: {
    name: string;
    avatarUrl: string;
  };
  aiStatus: 'AI Active' | 'Human Takeover' | 'Paused' | 'Qualified';
  unreadCount: number;
  lastMessage: string;
  lastActivity: string;
  score: number;
}

interface ConversationDataTableProps {
  rows: ConversationRowData[];
  selectedFilter: string;
}

export const ConversationDataTable: React.FC<ConversationDataTableProps> = ({
  rows,
  selectedFilter,
}) => {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const toggleSelectAll = () => {
    if (selectedIds.length === rows.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(rows.map((r) => r.id));
    }
  };

  const toggleSelectRow = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleRowClick = (leadId: string) => {
    router.push(`/ai-whatsapp-conversation/${leadId}`);
  };

  return (
    <div className="conv-table-card">
      {/* Top Table Bar */}
      <div className="conv-table-top-bar">
        <span className="conv-showing-text">
          Showing 1 to {rows.length} of 23 conversations
        </span>
        <div className="conv-table-top-actions">
          <button type="button" className="conv-table-columns-btn">
            <Columns size={15} />
            <span>Columns</span>
            <ChevronDown size={14} />
          </button>
          <button type="button" className="conv-table-more-btn" title="More Options">
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      {/* Responsive Table Area */}
      <div className="conv-table-scroll-wrap">
        <table className="conv-data-table">
          <thead>
            <tr>
              <th className="th-checkbox">
                <input
                  type="checkbox"
                  checked={selectedIds.length === rows.length && rows.length > 0}
                  onChange={toggleSelectAll}
                  className="conv-checkbox"
                />
              </th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Lead Source</th>
              <th>Project</th>
              <th>Assigned To</th>
              <th>AI Status</th>
              <th>Unread</th>
              <th>Last Message</th>
              <th>Last Activity</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const isSelected = selectedIds.includes(row.id);

              let statusBadgeClass = 'badge-status-green';
              if (row.aiStatus === 'Human Takeover') {
                statusBadgeClass = 'badge-status-orange';
              } else if (row.aiStatus === 'Paused') {
                statusBadgeClass = 'badge-status-red';
              } else if (row.aiStatus === 'Qualified') {
                statusBadgeClass = 'badge-status-green';
              }

              let scoreClass = 'score-pill-green';
              if (row.score < 60) {
                scoreClass = 'score-pill-red';
              } else if (row.score < 80) {
                scoreClass = 'score-pill-orange';
              }

              return (
                <tr
                  key={row.id}
                  onClick={() => handleRowClick(row.leadId)}
                  className={isSelected ? 'selected-row' : ''}
                >
                  <td className="td-checkbox" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      onClick={(e) => toggleSelectRow(e, row.id)}
                      className="conv-checkbox"
                    />
                  </td>

                  {/* Customer */}
                  <td>
                    <div className="conv-customer-cell">
                      <div className={`conv-initials-badge ${row.avatarColorClass}`}>
                        {row.initials}
                      </div>
                      <span className="conv-customer-name">{row.customerName}</span>
                    </div>
                  </td>

                  {/* Phone */}
                  <td className="conv-phone-text">{row.phone}</td>

                  {/* Source */}
                  <td>
                    <div className="conv-source-cell">
                      <span className={`conv-source-icon-sm source-${row.source.toLowerCase().replace(/\s+/g, '')}`} />
                    </div>
                  </td>

                  {/* Project */}
                  <td className="conv-project-text">{row.project}</td>

                  {/* Assigned To */}
                  <td>
                    <div className="conv-assigned-cell">
                      <div className="conv-assigned-img-wrap">
                        <Image
                          src={row.assignedTo.avatarUrl}
                          alt={row.assignedTo.name}
                          width={24}
                          height={24}
                          className="conv-assigned-img"
                        />
                      </div>
                      <span className="conv-assigned-text">{row.assignedTo.name}</span>
                    </div>
                  </td>

                  {/* AI Status */}
                  <td>
                    <span className={`conv-status-badge ${statusBadgeClass}`}>
                      {row.aiStatus}
                    </span>
                  </td>

                  {/* Unread */}
                  <td>
                    {row.unreadCount > 0 ? (
                      <span className="conv-unread-count-bubble">{row.unreadCount}</span>
                    ) : (
                      <span className="conv-unread-zero">0</span>
                    )}
                  </td>

                  {/* Last Message */}
                  <td className="conv-last-msg-cell">
                    <p className="conv-last-msg-text">{row.lastMessage}</p>
                  </td>

                  {/* Last Activity */}
                  <td className="conv-activity-time-cell">{row.lastActivity}</td>

                  {/* Action / Score */}
                  <td>
                    <span className={`conv-score-pill ${scoreClass}`}>{row.score}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Bottom Table Toolbar & Pagination */}
      <div className="conv-table-bottom-bar">
        <div className="conv-bulk-actions-wrap">
          <span className="conv-selected-count">{selectedIds.length} Selected</span>
          <button type="button" className="conv-bulk-btn">
            <span>Bulk Actions</span>
            <ChevronDown size={14} />
          </button>
        </div>

        <div className="conv-pagination-wrap">
          <button type="button" className="conv-page-arrow" title="Previous Page">
            <ChevronLeft size={16} />
          </button>
          <button type="button" className="conv-page-num active">1</button>
          <button type="button" className="conv-page-num">2</button>
          <button type="button" className="conv-page-num">3</button>
          <span className="conv-page-dots">...</span>
          <button type="button" className="conv-page-num">10</button>
          <button type="button" className="conv-page-arrow" title="Next Page">
            <ChevronRight size={16} />
          </button>

          <button type="button" className="conv-per-page-btn">
            <span>10 / page</span>
            <ChevronDown size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
