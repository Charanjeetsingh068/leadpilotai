import { apiClient } from './api.client';
import { ApiResponse } from '@/types/api.types';

export interface SystemSettings {
  whatsAppPhoneNumberId: string;
  whatsAppBusinessAccountId: string;
  aiAutoResponseThreshold: number;
  workingHoursStart: string;
  workingHoursEnd: string;
}

export const SettingsService = {
  getSettings: async (): Promise<ApiResponse<SystemSettings>> => {
    const res = await apiClient.get('/settings');
    return res.data;
  },

  updateSettings: async (settings: Partial<SystemSettings>): Promise<ApiResponse<SystemSettings>> => {
    const res = await apiClient.patch('/settings', settings);
    return res.data;
  },
};
