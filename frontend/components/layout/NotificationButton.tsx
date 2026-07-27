'use client';

import React from 'react';
import { Bell } from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';

export interface NotificationButtonProps {
  unreadCount?: number;
}

export const NotificationButton: React.FC<NotificationButtonProps> = ({ unreadCount = 3 }) => {
  const { openDrawer } = useUIStore();

  return (
    <button
      className="notification-btn"
      onClick={() => openDrawer('NOTIFICATIONS')}
      title="Notifications"
    >
      <Bell size={18} />
      {unreadCount > 0 ? <span className="notification-badge">{unreadCount}</span> : null}
    </button>
  );
};
