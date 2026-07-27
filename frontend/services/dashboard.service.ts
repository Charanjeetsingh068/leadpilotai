import { apiClient } from './api.client';
import { DashboardOverviewResponse } from '../types/dashboard.types';

export const fetchDashboardOverview = async (): Promise<DashboardOverviewResponse> => {
  const response = await apiClient.get<{ success: boolean; data: DashboardOverviewResponse }>('/dashboard/overview');
  return response.data.data;
};
