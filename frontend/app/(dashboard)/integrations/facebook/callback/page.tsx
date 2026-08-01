'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { facebookIntegrationService } from '@/services/facebook-integration.service';
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://leadpilotai-2kar.onrender.com/api';

export default function FacebookOAuthCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error_description') || searchParams.get('error');

    if (error) {
      const errMsg = error || 'Meta OAuth authorization was declined by user.';
      setStatus('error');
      setErrorMessage(errMsg);
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage({ type: 'FB_OAUTH_ERROR', error: errMsg }, '*');
      }
      return;
    }

    if (!code) {
      const errMsg = 'Missing authorization code parameter from Meta OAuth.';
      setStatus('error');
      setErrorMessage(errMsg);
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage({ type: 'FB_OAUTH_ERROR', error: errMsg }, '*');
      }
      return;
    }

    processCallback(code);
  }, [searchParams]);

  const processCallback = async (authCode: string) => {
    try {
      const redirectUri = window.location.origin + window.location.pathname;
      
      // 1. Exchange authorization code with backend Express API
      const res = await axios.get(`${API_BASE}/integrations/facebook/callback`, {
        params: { code: authCode, redirect_uri: redirectUri },
        withCredentials: true,
      });

      if (!res.data?.success) {
        throw new Error(res.data?.error || 'Backend failed to exchange Meta OAuth token.');
      }

      // 2. Perform backend status verification call per Phase 5 requirement
      const statusData = await facebookIntegrationService.getStatus();

      if (statusData && statusData.isConnected) {
        setStatus('success');

        if (window.opener && !window.opener.closed) {
          window.opener.postMessage({ type: 'FB_OAUTH_SUCCESS', data: res.data?.data }, '*');
          setTimeout(() => window.close(), 1000);
        } else {
          setTimeout(() => {
            router.push('/integrations/facebook');
          }, 1200);
        }
      } else {
        throw new Error('Backend status verification failed: Connection is NOT_CONNECTED after OAuth callback.');
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.error || err.message || 'OAuth code exchange failed.';
      console.error('Meta OAuth Callback Verification Error:', errMsg);
      setStatus('error');
      setErrorMessage(errMsg);

      if (window.opener && !window.opener.closed) {
        window.opener.postMessage({ type: 'FB_OAUTH_ERROR', error: errMsg }, '*');
      }
    }
  };

  return (
    <div className="fb-modal-overlay">
      <div className="fb-modal-box text-center p-8">
        {status === 'loading' && (
          <div className="flex flex-col items-center gap-4">
            <RefreshCw size={36} className="text-brand-blue spin" />
            <h3 className="text-lg font-bold text-slate-900">Verifying Meta Connection...</h3>
            <p className="text-sm text-slate-500">
              Exchanging authorization code for long-lived access token and verifying backend status.
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center gap-4">
            <CheckCircle2 size={42} className="text-emerald-500" />
            <h3 className="text-lg font-bold text-slate-900">Facebook Account Connected!</h3>
            <p className="text-sm text-slate-500">
              Account assets and permissions verified by backend. Returning to dashboard...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center gap-4">
            <AlertCircle size={42} className="text-rose-500" />
            <h3 className="text-lg font-bold text-slate-900">OAuth Connection Failed</h3>
            <p className="text-sm text-rose-600">{errorMessage}</p>
            <button
              type="button"
              className="fb-btn-secondary mt-2"
              onClick={() => router.push('/integrations/facebook')}
            >
              Return to Facebook Integration
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
