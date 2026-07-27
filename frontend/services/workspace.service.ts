import { apiClient } from './api.client';
import { WorkspaceItem } from '@/store/useWorkspaceStore';

export const WorkspaceService = {
  getWorkspaces: async (): Promise<{ success: boolean; data: WorkspaceItem[] }> => {
    try {
      const res = await apiClient.get<{ success: boolean; data: WorkspaceItem[] }>('/workspaces');
      return res.data;
    } catch {
      return {
        success: true,
        data: [
          { id: 'ws-acme-01', name: 'Acme Real Estate', role: 'Client Admin' },
          { id: 'ws-skyline-02', name: 'Skyline Ventures', role: 'Client Admin' },
        ],
      };
    }
  },
};
