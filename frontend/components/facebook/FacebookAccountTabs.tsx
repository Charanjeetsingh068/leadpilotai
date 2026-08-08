'use client';

import React from 'react';

export type FacebookTabType =
  | 'overview'
  | 'facebook_pages'
  | 'lead_inbox'
  | 'lead_forms'
  | 'campaigns'
  | 'ads'
  | 'insights'
  | 'settings';

interface TabsProps {
  activeTab: FacebookTabType;
  onTabChange: (tab: FacebookTabType) => void;
}

export const FacebookAccountTabs: React.FC<TabsProps> = ({ activeTab, onTabChange }) => {
  const tabs: { id: FacebookTabType; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'facebook_pages', label: 'Facebook Pages' },
    { id: 'lead_inbox', label: 'Lead Inbox' },
    { id: 'lead_forms', label: 'Lead Forms' },
    { id: 'campaigns', label: 'Campaigns' },
    { id: 'ads', label: 'Ads' },
    { id: 'insights', label: 'Insights' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div className="fb-account-tabs-bar">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange(tab.id)}
          className={`fb-tab-button ${activeTab === tab.id ? 'active' : ''}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
