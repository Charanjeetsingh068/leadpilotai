'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { facebookIntegrationService } from '@/services/facebook-integration.service';
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function FacebookOAuthCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error_description') || searchParams.get('error');

    if (error) {
      setStatus('error');
      setErrorMessage(error);
      return;
    }

    if (!code) {
      // Dev mode or direct nav fallback
      processCallback('mock_code_123456');
      return;
    }

    processCallback(code);
  }, [searchParams]);

  const processCallback = async (authCode: string) => {
    try {
      const redirectUri = window.location.origin + window.location.pathname;
      const res = await axios.get(`${API_BASE}/integrations/facebook/callback`, {
        params: { code: authCode, redirect_uri: redirectUri },
        withCredentials: true,
      });

      setStatus('success');

      // Post message to parent if opened in popup
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage({ type: 'FB_OAUTH_SUCCESS', data: res.data.data }, '*');
        setTimeout(() => window.close(), 1000);
      } else {
        setTimeout(() => {
          router.push('/integrations/facebook?connected=true');
          window.location.reload();
        }, 1500);
      }
    } catch (err: any) {
      console.error('OAuth Callback processing error:', err);
      setStatus('error');
      setErrorMessage(err?.response?.data?.message || err.message || 'Failed to exchange Meta authorization code');
    }
  };

  return (
    <div className="fb-modal-overlay">
      <div className="fb-modal-box text-center p-8">
        {status === 'loading' && (
          <div className="flex flex-col items-center gap-4">
            <RefreshCw size={36} className="text-brand-blue spin" />
            <h3 className="text-lg font-bold text-slate-900">Connecting Facebook Account...</h3>
            <p className="text-sm text-slate-500">
              Exchanging authorization code for long-lived access token and securing token in database.
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center gap-4">
            <CheckCircle2 size={42} className="text-emerald-500" />
            <h3 className="text-lg font-bold text-slate-900">Facebook Account Connected!</h3>
            <p className="text-sm text-slate-500">
              Account assets and permissions synced successfully. Reloading dashboard...
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
