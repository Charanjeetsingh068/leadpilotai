import { create } from 'zustand';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timeAgo: string;
  isRead: boolean;
  type: 'INFO' | 'WARNING' | 'SUCCESS';
}

interface NotificationState {
  notifications: NotificationItem[];
  unreadCount: number;
  isPanelOpen: boolean;
  togglePanel: () => void;
  closePanel: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  unreadCount: 8,
  isPanelOpen: false,
  notifications: [
    {
      id: 'notif-1',
      title: 'Human Verification Required',
      message: 'Site visit confirmation needed for Lead #101 (Rohit Sharma).',
      timeAgo: '2m ago',
      isRead: false,
      type: 'WARNING',
    },
    {
      id: 'notif-2',
      title: 'High Qualification Score',
      message: 'Priya Verma reached AI qualification score of 94/100.',
      timeAgo: '5m ago',
      isRead: false,
      type: 'SUCCESS',
    },
    {
      id: 'notif-3',
      title: 'New Facebook Lead Ingested',
      message: 'Amit Kumar submitted inquiry via Facebook Lead Ads.',
      timeAgo: '12m ago',
      isRead: false,
      type: 'INFO',
    },
  ],

  togglePanel: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),
  closePanel: () => set({ isPanelOpen: false }),

  markAsRead: (id) => {
    set((state) => {
      const updated = state.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
      const unread = updated.filter((n) => !n.isRead).length;
      return { notifications: updated, unreadCount: unread };
    });
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    }));
  },
}));
