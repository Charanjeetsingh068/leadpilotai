'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { facebookIntegrationService } from '@/services/facebook-integration.service';

export function useFacebookDashboard(businessId?: string) {
  return useQuery({
    queryKey: ['facebook-dashboard', businessId],
    queryFn: () => facebookIntegrationService.getDashboard(businessId),
    refetchInterval: 30000, // Auto refresh every 30 seconds
    staleTime: 10000,
  });
}

export function useFacebookPages() {
  return useQuery({
    queryKey: ['facebook-pages'],
    queryFn: () => facebookIntegrationService.getPages(),
    staleTime: 15000,
  });
}

export function useFacebookAccountDetails(facebookAccountId: string) {
  return useQuery({
    queryKey: ['facebook-account-details', facebookAccountId],
    queryFn: () => facebookIntegrationService.getAccountDetails(facebookAccountId),
    enabled: Boolean(facebookAccountId),
    staleTime: 15000,
  });
}

export function useFacebookAccountLeads(facebookAccountId: string, params?: any) {
  return useQuery({
    queryKey: ['facebook-account-leads', facebookAccountId, params],
    queryFn: () => facebookIntegrationService.getAccountLeads(facebookAccountId, params),
    enabled: Boolean(facebookAccountId),
    staleTime: 10000,
  });
}

export function useFacebookSync() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => facebookIntegrationService.triggerManualSync(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facebook-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['facebook-pages'] });
      queryClient.invalidateQueries({ queryKey: ['facebook-account-details'] });
      queryClient.invalidateQueries({ queryKey: ['facebook-account-leads'] });
    },
  });
}
