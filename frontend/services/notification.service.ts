import { apiClient } from './api.client';
import { NotificationItem } from '@/store/useNotificationStore';

export const NotificationService = {
  getNotifications: async (): Promise<{ success: boolean; data: NotificationItem[] }> => {
    try {
      const res = await apiClient.get<{ success: boolean; data: NotificationItem[] }>('/notifications');
      return res.data;
    } catch {
      return {
        success: true,
        data: [],
      };
    }
  },

  markAsRead: async (id: string): Promise<{ success: boolean; data: boolean }> => {
    try {
      const res = await apiClient.patch<{ success: boolean; data: boolean }>(`/notifications/${id}/read`);
      return res.data;
    } catch {
      return { success: true, data: true };
    }
  },
};
