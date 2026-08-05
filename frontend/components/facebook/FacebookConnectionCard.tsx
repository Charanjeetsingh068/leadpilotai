import React from 'react';
import { ShieldCheck, RefreshCw, Trash2 } from 'lucide-react';
import { FacebookIcon } from './FacebookIcon';
import { FacebookConnectionStatus } from '@/types/facebook.types';

interface Props {
  connection?: FacebookConnectionStatus;
  onReconnect?: () => void;
  onDisconnect?: () => void;
  isConnecting?: boolean;
}

export const FacebookConnectionCard: React.FC<Props> = ({
  connection,
  onReconnect,
  onDisconnect,
  isConnecting = false,
}) => {
  const isConnected = isConnecting ? false : (connection?.isConnected === true || connection?.status === 'CONNECTED' || Boolean(connection?.user));
  const displayStatus: string = isConnecting ? 'CONNECTING' : (isConnected ? (connection?.status || 'CONNECTED') : 'NOT_CONNECTED');

  const getStatusBadgeClass = () => {
    switch (displayStatus) {
      case 'CONNECTED':
        return 'connected';
      case 'CONNECTING':
        return 'connecting';
      case 'TOKEN_EXPIRED':
        return 'expired';
      case 'PERMISSIONS_MISSING':
      case 'SYNC_FAILED':
        return 'warning';
      case 'NOT_CONNECTED':
      default:
        return 'disconnected';
    }
  };

  const getStatusTextClass = () => {
    switch (displayStatus) {
      case 'CONNECTED':
        return 'text-success';
      case 'TOKEN_EXPIRED':
      case 'SYNC_FAILED':
        return 'text-danger';
      case 'PERMISSIONS_MISSING':
        return 'text-warning';
      default:
        return 'text-subtle';
    }
  };

  const formattedExpiry = connection?.tokenExpiry
    ? new Date(connection.tokenExpiry).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : (isConnected ? 'Active (60 Days)' : 'None');

  const connectedName = connection?.user?.name || connection?.connectedBy || 'Meta Account';
  const connectedEmail = connection?.user?.email || connection?.email || 'Authorized Meta User';

  return (
    <div className="fb-card fb-connection-card">
      <div className="fb-card-header-row">
        <h3 className="fb-card-title">Meta Business Connection</h3>
        <span className={`fb-status-badge ${getStatusBadgeClass()}`}>
          {displayStatus}
        </span>
      </div>

      <p className="fb-card-subtitle">
        {isConnected
          ? 'Verified Meta Business integration & AES-256 token session from Meta Graph API.'
          : 'No Facebook account connected. Click Connect Meta to authorize Business Portfolios, Pages, Instagram & WhatsApp.'}
      </p>

      <div className="fb-connection-body">
        <div className="fb-icon-circle">
          <FacebookIcon size={32} className="fb-icon-large" />
        </div>

        <div className="fb-connection-info-grid">
          <div className="fb-info-row">
            <span className="fb-info-label">Connected User</span>
            <span className="fb-info-value font-semibold">
              {isConnected ? connectedName : 'Not Connected'}
            </span>
          </div>

          <div className="fb-info-row">
            <span className="fb-info-label">User Email / ID</span>
            <span className="fb-info-value text-xs font-mono">
              {isConnected ? connectedEmail : 'N/A'}
            </span>
          </div>

          <div className="fb-info-row">
            <span className="fb-info-label">Connection State</span>
            <span className={`fb-info-value-status ${getStatusTextClass()}`}>
              {displayStatus}
            </span>
          </div>

          <div className="fb-info-row">
            <span className="fb-info-label">Token Security</span>
            <span className="fb-info-value text-xs font-medium">
              {formattedExpiry}
            </span>
          </div>
        </div>
      </div>

      <div className="fb-connection-action-area">
        <button
          type="button"
          className="fb-btn-facebook-connect"
          onClick={onReconnect}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <RefreshCw size={18} className="fb-btn-icon spin" />
          ) : (
            <FacebookIcon size={18} className="fb-btn-icon" />
          )}
          <span>{isConnecting ? 'Connecting to Meta...' : (isConnected ? 'Reconnect Meta Account' : 'Connect Meta')}</span>
        </button>

        {onDisconnect && isConnected && (
          <button
            type="button"
            className="fb-btn-secondary"
            onClick={onDisconnect}
            title="Disconnect Meta Integration"
          >
            <Trash2 size={16} />
            <span>Disconnect</span>
          </button>
        )}
      </div>

      <div className="fb-security-note">
        <ShieldCheck size={14} className="fb-security-icon" />
        <span>AES-256-GCM Token Encryption &amp; Auto-Refresh Active.</span>
      </div>
    </div>
  );
};
