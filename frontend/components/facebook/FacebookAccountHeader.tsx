'use client';

import React from 'react';
import { RefreshCw, RotateCw, LogOut } from 'lucide-react';

interface FacebookAccountHeaderProps {
  accountName: string;
  avatarUrl?: string;
  connectedAt?: string;
  tokenExpiresAt?: string;
  onSync: () => void;
  onRefresh: () => void;
  onDisconnect: () => void;
  isSyncing?: boolean;
}

export const FacebookAccountHeader: React.FC<FacebookAccountHeaderProps> = ({
  accountName,
  avatarUrl,
  connectedAt,
  onSync,
  onRefresh,
  onDisconnect,
  isSyncing = false,
}) => {
  const formattedDate = connectedAt
    ? new Date(connectedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'May 14, 2025 at 08:10 AM';

  return (
    <div className="fb-account-header">
      <div className="fb-account-title-area">
        <h1>
          <span>Facebook Account: {accountName || 'Sumit Chaudhary'}</span>
        </h1>
        <p>Connected on {formattedDate}</p>
      </div>

      <div className="fb-account-header-actions">
        <button
          type="button"
          onClick={onSync}
          disabled={isSyncing}
          className="fb-btn-outline"
        >
          <RotateCw width={16} height={16} />
          <span>Sync All</span>
        </button>

        <button
          type="button"
          onClick={onRefresh}
          className="fb-btn-outline"
        >
          <RefreshCw width={16} height={16} />
          <span>Refresh</span>
        </button>

        <button
          type="button"
          onClick={onDisconnect}
          className="fb-btn-danger"
        >
          <LogOut width={16} height={16} />
          <span>Disconnect</span>
        </button>
      </div>
    </div>
  );
};
