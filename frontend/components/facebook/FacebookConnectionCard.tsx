import React from 'react';
import { ShieldCheck, RefreshCw, LogOut, Trash2 } from 'lucide-react';
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
  const isConnected = connection && connection.status !== 'NOT_CONNECTED' && connection.status !== 'Disconnected';
  const displayStatus = connection?.status || 'NOT_CONNECTED';

  return (
    <div className="fb-card fb-connection-card">
      <div className="fb-card-header-row">
        <h3 className="fb-card-title">Meta Connection</h3>
        <span className={`fb-status-badge ${connection?.isExpired ? 'expired' : (isConnected ? 'connected' : 'disconnected')}`}>
          {connection?.isExpired ? 'Expired' : displayStatus}
        </span>
      </div>

      <p className="fb-card-subtitle">
        {isConnected ? 'Connected Meta Business User session & token security state.' : 'No Facebook account connected. Click Connect Meta Business to start.'}
      </p>

      <div className="fb-connection-body">
        <div className="fb-icon-circle">
          <FacebookIcon size={32} className="fb-icon-large" />
        </div>

        <div className="fb-connection-info-grid">
          <div className="fb-info-row">
            <span className="fb-info-label">Connected User</span>
            <span className="fb-info-value font-semibold">
              {isConnected ? (connection?.connectedBy || 'Connected Meta Account') : 'Not Connected'}
            </span>
          </div>

          <div className="fb-info-row">
            <span className="fb-info-label">Email</span>
            <span className="fb-info-value text-xs font-mono">
              {isConnected ? (connection?.email || 'N/A') : 'N/A'}
            </span>
          </div>

          <div className="fb-info-row">
            <span className="fb-info-label">Connection Status</span>
            <span className={`fb-info-value-status ${connection?.isExpired ? 'text-danger' : (isConnected ? 'text-success' : 'text-slate-400')}`}>
              {connection?.isExpired ? 'Token Expired' : displayStatus}
            </span>
          </div>

          <div className="fb-info-row">
            <span className="fb-info-label">Token Expiry</span>
            <span className="fb-info-value text-xs text-brand-blue font-medium">
              {isConnected ? (connection?.tokenExpiry || '60 Days (Long-Lived Token)') : 'None'}
            </span>
          </div>
        </div>
      </div>

      <div className="fb-connection-action-area flex items-center gap-2">
        <button
          type="button"
          className="fb-btn-facebook-connect flex-1"
          onClick={onReconnect}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <RefreshCw size={18} className="fb-btn-icon spin" />
          ) : (
            <FacebookIcon size={18} className="fb-btn-icon" />
          )}
          <span>{isConnecting ? 'Connecting...' : 'Reconnect Meta Business'}</span>
        </button>

        {onDisconnect && (
          <button
            type="button"
            className="fb-btn-secondary text-danger-hover"
            onClick={onDisconnect}
            title="Disconnect Meta Connection"
          >
            <Trash2 size={16} />
            <span>Disconnect</span>
          </button>
        )}
      </div>

      <div className="fb-security-note">
        <ShieldCheck size={14} className="fb-security-icon" />
        <span>AES-256-GCM Token Encryption & Auto-Refresh Active.</span>
      </div>
    </div>
  );
};
