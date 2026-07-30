import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { facebookIntegrationService } from '@/services/facebook-integration.service';

export function useFacebookIntegration() {
  const queryClient = useQueryClient();
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>('987654321098765');
  const [accountsSearch, setAccountsSearch] = useState<string>('');
  const [pagesSearch, setPagesSearch] = useState<string>('');
  const [formsSearch, setFormsSearch] = useState<string>('');
  const [isAddAccountOpen, setIsAddAccountOpen] = useState<boolean>(false);
  const [previewForm, setPreviewForm] = useState<any>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [connectionSuccessMsg, setConnectionSuccessMsg] = useState<string | null>(null);
  const [connectionErrorMsg, setConnectionErrorMsg] = useState<string | null>(null);

  // Main Dashboard query
  const dashboardQuery = useQuery({
    queryKey: ['facebook-dashboard', selectedBusinessId],
    queryFn: () => facebookIntegrationService.getDashboard(selectedBusinessId),
    refetchInterval: 15000,
  });

  // Listen for popup OAuth success message
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'FB_OAUTH_SUCCESS') {
        setIsConnecting(false);
        setIsAddAccountOpen(false);
        setConnectionSuccessMsg('Facebook account connected & encrypted token saved successfully!');
        queryClient.invalidateQueries({ queryKey: ['facebook-dashboard'] });
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [queryClient]);

  // Start Meta OAuth Flow
  const handleConnectFacebook = async () => {
    setIsConnecting(true);
    setConnectionErrorMsg(null);
    try {
      const { oauthUrl } = await facebookIntegrationService.startOAuth();
      const width = 600;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      const popup = window.open(
        oauthUrl,
        'Facebook Login',
        `width=${width},height=${height},top=${top},left=${left},scrollbars=yes`
      );

      if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        window.location.href = oauthUrl;
      } else {
        const timer = setInterval(() => {
          if (popup.closed) {
            clearInterval(timer);
            setIsConnecting(false);
          }
        }, 1000);
      }
    } catch (err: any) {
      console.error('Failed to start OAuth flow:', err);
      setIsConnecting(false);
      setConnectionErrorMsg('Failed to initialize Meta OAuth flow.');
    }
  };

  // Business Switch Mutation
  const handleBusinessChange = (businessId: string) => {
    setSelectedBusinessId(businessId);
    queryClient.invalidateQueries({ queryKey: ['facebook-dashboard'] });
  };

  // Sync Pages Mutation
  const syncPagesMutation = useMutation({
    mutationFn: (accountId?: string) => facebookIntegrationService.syncPages(accountId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facebook-dashboard'] });
    },
  });

  // Sync Forms Mutation
  const syncFormsMutation = useMutation({
    mutationFn: (pageId?: string) => facebookIntegrationService.syncForms(pageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facebook-dashboard'] });
    },
  });

  // Toggle Form Active Mutation
  const toggleFormActiveMutation = useMutation({
    mutationFn: ({ formId, isActive }: { formId: string; isActive: boolean }) =>
      facebookIntegrationService.toggleFormActive(formId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facebook-dashboard'] });
    },
  });

  // Assign AI Agent Mutation
  const assignAiAgentMutation = useMutation({
    mutationFn: ({ formId, aiAgentId }: { formId: string; aiAgentId: string }) =>
      facebookIntegrationService.assignAiAgent(formId, aiAgentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facebook-dashboard'] });
    },
  });

  // Retry Failed Webhooks Mutation
  const retryWebhooksMutation = useMutation({
    mutationFn: () => facebookIntegrationService.retryWebhooks(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facebook-dashboard'] });
    },
  });

  // Manual Full Sync Mutation
  const manualSyncMutation = useMutation({
    mutationFn: () => facebookIntegrationService.triggerManualSync(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facebook-dashboard'] });
    },
  });

  // Disconnect Account Mutation
  const disconnectAccountMutation = useMutation({
    mutationFn: (accountId: string) => facebookIntegrationService.disconnectAccount(accountId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facebook-dashboard'] });
      setConnectionSuccessMsg('Facebook account disconnected. All imported leads remain safe.');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
  });

  return {
    data: dashboardQuery.data,
    isLoading: dashboardQuery.isLoading,
    isError: dashboardQuery.isError,
    error: dashboardQuery.error,
    refetch: dashboardQuery.refetch,
    selectedBusinessId,
    handleBusinessChange,
    accountsSearch,
    setAccountsSearch,
    pagesSearch,
    setPagesSearch,
    formsSearch,
    setFormsSearch,
    isAddAccountOpen,
    setIsAddAccountOpen,
    previewForm,
    setPreviewForm,
    isConnecting,
    connectionSuccessMsg,
    connectionErrorMsg,
    handleConnectFacebook,
    disconnectAccount: disconnectAccountMutation.mutate,
    isDisconnectingAccount: disconnectAccountMutation.isPending,
    syncPages: syncPagesMutation.mutate,
    isSyncingPages: syncPagesMutation.isPending,
    syncForms: syncFormsMutation.mutate,
    isSyncingForms: syncFormsMutation.isPending,
    toggleFormActive: (formId: string, isActive: boolean) =>
      toggleFormActiveMutation.mutate({ formId, isActive }),
    assignAiAgent: assignAiAgentMutation.mutate,
    retryWebhooks: retryWebhooksMutation.mutate,
    isRetryingWebhooks: retryWebhooksMutation.isPending,
    manualSync: manualSyncMutation.mutate,
    isManualSyncing: manualSyncMutation.isPending,
  };
}
