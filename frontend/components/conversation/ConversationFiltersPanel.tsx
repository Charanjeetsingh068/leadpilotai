'use client';

import React from 'react';
import {
  MessageSquare,
  Mail,
  Bot,
  UserCheck,
  CheckCircle2,
  Calendar,
  Flame,
  Globe,
  User,
} from 'lucide-react';
import { useConversationStore } from '@/store/useConversationStore';

interface ConversationFiltersPanelProps {
  activeFilter: string;
  onSelectFilter: (filterId: string) => void;
  onClearAll: () => void;
}

export const ConversationFiltersPanel: React.FC<ConversationFiltersPanelProps> = ({
  activeFilter,
  onSelectFilter,
  onClearAll,
}) => {
  const filterItems = [
    { id: 'All Conversations', label: 'All Conversations', count: 23, icon: <MessageSquare size={16} /> },
    { id: 'Unread', label: 'Unread', count: 8, icon: <Mail size={16} /> },
    { id: 'AI Active', label: 'AI Active', count: 12, icon: <Bot size={16} /> },
    { id: 'Human Takeover', label: 'Human Takeover', count: 3, icon: <UserCheck size={16} /> },
    { id: 'Qualified', label: 'Qualified', count: 6, icon: <CheckCircle2 size={16} /> },
    { id: 'Site Visit', label: 'Site Visit', count: 4, icon: <Calendar size={16} /> },
    { id: 'Hot Leads', label: 'Hot Leads', count: 5, icon: <Flame size={16} /> },
  ];

  const sourceItems = [
    { id: 'Facebook', label: 'Facebook', count: 7, iconClass: 'icon-facebook' },
    { id: 'Instagram', label: 'Instagram', count: 5, iconClass: 'icon-instagram' },
    { id: 'Google Ads', label: 'Google Ads', count: 4, iconClass: 'icon-google' },
    { id: 'Website', label: 'Website', count: 4, iconClass: 'icon-website' },
    { id: 'Manual', label: 'Manual', count: 3, iconClass: 'icon-manual' },
  ];

  return (
    <div className="conv-filters-card">
      <div className="conv-filters-header">
        <h4 className="conv-filters-title">Filters</h4>
        <button type="button" onClick={onClearAll} className="conv-filters-clear-btn">
          Clear All
        </button>
      </div>

      <div className="conv-filters-list">
        {filterItems.map((item) => {
          const isActive = activeFilter === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`conv-filter-item ${isActive ? 'active' : ''}`}
              onClick={() => onSelectFilter(item.id)}
            >
              <div className="conv-filter-item-left">
                <span className="conv-filter-icon">{item.icon}</span>
                <span className="conv-filter-label">{item.label}</span>
              </div>
              <span className={`conv-filter-badge ${isActive ? 'badge-blue' : ''}`}>{item.count}</span>
            </button>
          );
        })}

        <div className="conv-filter-divider" />

        {sourceItems.map((item) => {
          const isActive = activeFilter === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`conv-filter-item ${isActive ? 'active' : ''}`}
              onClick={() => onSelectFilter(item.id)}
            >
              <div className="conv-filter-item-left">
                <span className={`conv-source-dot ${item.iconClass}`} />
                <span className="conv-filter-label">{item.label}</span>
              </div>
              <span className={`conv-filter-badge ${isActive ? 'badge-blue' : ''}`}>{item.count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
