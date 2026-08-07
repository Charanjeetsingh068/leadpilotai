import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { facebookIntegrationService } from '@/services/facebook-integration.service';

export function useFacebookIntegration() {
  const queryClient = useQueryClient();
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>('');
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

  // Listen for popup OAuth success / error message
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data && event.data.type === 'FB_OAUTH_SUCCESS') {
        setIsConnecting(false);
        setIsAddAccountOpen(false);
        setConnectionErrorMsg(null);
        setConnectionSuccessMsg('Meta Business account authorized successfully!');
        
        // Refetch backend data and invalidate query keys
        queryClient.invalidateQueries({ queryKey: ['facebook-dashboard'] });
        queryClient.invalidateQueries({ queryKey: ['facebook-status'] });
        queryClient.invalidateQueries({ queryKey: ['connected-accounts'] });
        queryClient.invalidateQueries({ queryKey: ['leads'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      } else if (event.data && event.data.type === 'FB_OAUTH_ERROR') {
        setIsConnecting(false);
        setConnectionErrorMsg(event.data.error || 'Meta OAuth authorization was denied or failed.');
      }
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'fb_oauth_success' && event.newValue) {
        setIsConnecting(false);
        setIsAddAccountOpen(false);
        setConnectionErrorMsg(null);
        setConnectionSuccessMsg('Meta Business account authorized successfully!');
        
        queryClient.invalidateQueries({ queryKey: ['facebook-dashboard'] });
        queryClient.invalidateQueries({ queryKey: ['facebook-status'] });
        queryClient.invalidateQueries({ queryKey: ['connected-accounts'] });
        localStorage.removeItem('fb_oauth_success');
      }
    };

    window.addEventListener('message', handleMessage);
    window.addEventListener('storage', handleStorage);
    
    // Auto-close if this window is a popup fallback
    if (typeof window !== 'undefined' && window.location.search.includes('popup_close=true')) {
      if (window.opener) {
        try { window.opener.postMessage({ type: 'FB_OAUTH_SUCCESS' }, '*'); } catch (e) {}
      }
      try { window.close(); } catch(e) {}
    }
    
    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('storage', handleStorage);
    };
  }, [queryClient]);

  // Start Meta OAuth Flow
  const handleConnectFacebook = async () => {
    setIsConnecting(true);
    setConnectionErrorMsg(null);

    const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '1712255293083461';
    const redirectUri = process.env.NEXT_PUBLIC_FACEBOOK_REDIRECT_URI || 'https://leadpilotai-2kar.onrender.com/api/integrations/facebook/callback';
    const scopes = [
      'public_profile',
      'email',
      'business_management',
      'pages_show_list',
      'pages_manage_metadata',
      'pages_read_engagement',
      'pages_manage_posts',
      'leads_retrieval',
      'instagram_basic',
      'instagram_manage_messages',
      'whatsapp_business_management',
      'whatsapp_business_messaging',
    ].join(',');

    const statePayload = {
      scope: { companyId: 'default-company', workspaceId: 'default-workspace', userId: 'default-user' },
      timestamp: Date.now(),
      frontendUrl: typeof window !== 'undefined' ? window.location.origin : 'https://leadpilotai-rust.vercel.app',
    };
    const state = typeof btoa !== 'undefined'
      ? btoa(JSON.stringify(statePayload)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
      : '';

    let oauthUrl = `https://www.facebook.com/v23.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&state=${state}&auth_type=rerequest&scope=${scopes}`;

    try {
      const apiData = await facebookIntegrationService.startOAuth();
      if (apiData?.oauthUrl) {
        oauthUrl = apiData.oauthUrl;
      }
    } catch (e) {
      console.warn('API startOAuth fallback used:', e);
    }

    const width = 600;
    const height = 700;
    const left = typeof window !== 'undefined' ? window.screen.width / 2 - width / 2 : 200;
    const top = typeof window !== 'undefined' ? window.screen.height / 2 - height / 2 : 100;

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
  };

  // Business Switch Mutation
  const handleBusinessChange = async (businessId: string) => {
    setSelectedBusinessId(businessId);
    try {
      await facebookIntegrationService.selectBusiness(businessId);
    } catch (e) {}
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
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['facebook-dashboard'] });
      await queryClient.invalidateQueries({ queryKey: ['facebook-status'] });
      await queryClient.invalidateQueries({ queryKey: ['connected-accounts'] });
      setConnectionSuccessMsg('Facebook account disconnected. All imported leads remain safe.');
      dashboardQuery.refetch();
    },
  });

  const activeAccounts = dashboardQuery.data?.accounts?.filter((a: any) => a.tokenStatus !== 'Disconnected' && a.status !== 'Disconnected' && a.tokenStatus !== 'REVOKED') || [];
  const hasConnectedAccount = Boolean(activeAccounts.length > 0);
  const rawStatus = dashboardQuery.data?.connection?.status;
  const connectionStatus = (rawStatus && rawStatus !== 'NOT_CONNECTED') ? rawStatus : (hasConnectedAccount ? 'CONNECTED' : 'NOT_CONNECTED');
  const isBackendConnected = hasConnectedAccount || (dashboardQuery.data?.connection?.isConnected === true) || connectionStatus === 'CONNECTED';

  let integrationStatus: 'NOT_CONNECTED' | 'CONNECTING' | 'CONNECTED' | 'TOKEN_EXPIRED' | 'ERROR' = 'NOT_CONNECTED';
  if (isConnecting) {
    integrationStatus = 'CONNECTING';
  } else if (connectionStatus === 'TOKEN_EXPIRED' || dashboardQuery.data?.connection?.isExpired) {
    integrationStatus = 'TOKEN_EXPIRED';
  } else if (isBackendConnected) {
    integrationStatus = 'CONNECTED';
  } else {
    integrationStatus = 'NOT_CONNECTED';
  }

  return {
    data: dashboardQuery.data,
    integrationStatus,
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
