'use client';

import React from 'react';
import { LeadDetailsTab, useLeadDetailsStore } from '@/store/useLeadDetailsStore';

export const LeadDetailsTabs: React.FC = () => {
  const { activeTab, setActiveTab } = useLeadDetailsStore();

  const tabs: { key: LeadDetailsTab; label: string; badge?: number }[] = [
    { key: 'timeline', label: 'Timeline' },
    { key: 'conversation', label: 'Conversations', badge: 6 },
    { key: 'ai-summary', label: 'AI Summary' },
    { key: 'notes', label: 'Notes' },
    { key: 'documents', label: 'Documents' },
  ];

  return (
    <div className="lead-tabs-nav-bar">
      {tabs.map((t) => {
        const isActive = activeTab === t.key;
        return (
          <button
            key={t.key}
            type="button"
            className={`lead-tab-link ${isActive ? 'active' : ''}`}
            onClick={() => setActiveTab(t.key)}
          >
            <span>{t.label}</span>
            {t.badge !== undefined && (
              <span className={`tab-count-badge ${isActive ? 'badge-active' : ''}`}>
                {t.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
