'use client';

import React from 'react';
import { useNotificationStore } from '@/store/useNotificationStore';
import { Bell } from 'lucide-react';

export const NotificationBell: React.FC = () => {
  const { unreadCount, togglePanel } = useNotificationStore();

  return (
    <button
      type="button"
      className="icon-action-btn"
      onClick={togglePanel}
      title="Notifications"
      aria-label="Notifications"
    >
      <Bell size={18} />
      {unreadCount > 0 ? (
        <span className="icon-notification-badge">{unreadCount}</span>
      ) : null}
    </button>
  );
};
