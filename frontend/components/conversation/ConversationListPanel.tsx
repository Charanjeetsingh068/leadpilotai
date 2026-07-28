'use client';

import React from 'react';
import { Search, Filter, CheckCircle2 } from 'lucide-react';
import { Conversation } from '@/types/conversation.types';
import { useConversationStore } from '@/store/useConversationStore';
import Link from 'next/link';

interface ConversationListPanelProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

const AVATAR_COLORS: Record<string, string> = {
  RS: 'avatar-teal',
  PV: 'avatar-purple',
  AK: 'avatar-pink',
  SI: 'avatar-orange',
  VS: 'avatar-green',
  DS: 'avatar-blue',
  AN: 'avatar-purple',
  MG: 'avatar-gold',
  PB: 'avatar-teal',
};

export const ConversationListPanel: React.FC<ConversationListPanelProps> = ({
  conversations,
  activeId,
  onSelect,
}) => {
  const { searchQuery, setSearchQuery } = useConversationStore();

  const filtered = conversations.filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.leadName.toLowerCase().includes(q) ||
      c.lastMessageContent.toLowerCase().includes(q) ||
      (c.leadPhone && c.leadPhone.includes(q))
    );
  });

  return (
    <div className="conv-left-panel">
      {/* Top Header Row */}
      <div className="conv-list-header">
        <div className="conv-list-title-row">
          <h3 className="conv-list-title">All Conversations</h3>
          <button type="button" className="conv-filter-icon-btn" title="Filter Conversations">
            <Filter size={16} />
          </button>
          <span className="conv-list-badge-count">{conversations.length || 23}</span>
        </div>

        {/* Search input */}
        <div className="conv-search-box">
          <Search size={16} className="conv-search-icon" />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="conv-search-input"
          />
        </div>
      </div>

      {/* Scrollable Conversation List */}
      <div className="conv-list-scroll">
        {filtered.map((conv) => {
          const initials = conv.leadName
            .split(' ')
            .map((n) => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();

          const isSelected = conv.id === activeId || conv.leadId === activeId;
          const avatarClass = AVATAR_COLORS[initials] || 'avatar-teal';

          let statusBadgeClass = 'status-pill-blue';
          let statusText = conv.status || 'Active';
          if (statusText === 'Waiting' || conv.unreadCount > 0) {
            statusBadgeClass = 'status-pill-orange';
            statusText = 'Waiting';
          } else if (statusText === 'Closed') {
            statusBadgeClass = 'status-pill-gray';
            statusText = 'Closed';
          } else {
            statusBadgeClass = 'status-pill-blue';
            statusText = 'Active';
          }

          return (
            <Link
              key={conv.id}
              href={`/conversations/${conv.id}`}
              onClick={() => onSelect(conv.id)}
              className={`conv-card-item ${isSelected ? 'selected' : ''}`}
            >
              <div className="conv-card-left">
                <div className={`conv-avatar-badge ${avatarClass}`}>
                  <span>{initials}</span>
                </div>
              </div>

              <div className="conv-card-content">
                <div className="conv-card-top-row">
                  <div className="conv-card-name-group">
                    <span className="conv-card-name">{conv.leadName}</span>
                    <CheckCircle2 size={14} className="conv-verified-check" />
                  </div>
                  <span className="conv-card-time">
                    {conv.lastMessageAt ? '2m ago' : '1h ago'}
                  </span>
                </div>

                <div className="conv-card-bottom-row">
                  <p className="conv-card-snippet">{conv.lastMessageContent}</p>
                  <span className={`conv-status-pill ${statusBadgeClass}`}>{statusText}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
