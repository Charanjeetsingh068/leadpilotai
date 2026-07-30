import React from 'react';
import { ShieldCheck, RefreshCw, LogOut } from 'lucide-react';
import { FacebookIcon } from './FacebookIcon';
import { FacebookConnectionStatus } from '@/types/facebook.types';

interface Props {
  connection?: FacebookConnectionStatus;
  onReconnect?: () => void;
  onDisconnect?: () => void;
  isConnecting?: boolean;
}

export const FacebookConnectionCard: React.FC<Props> = ({
  connection = {
    status: 'Connected',
    connectedBy: 'Arjun Mehta',
    connectedTime: 'May 20, 2025 10:15 AM',
    tokenExpiry: 'Jun 20, 2025 10:15 AM',
    lastRefresh: '2 min ago',
    isExpired: false,
  },
  onReconnect,
  onDisconnect,
  isConnecting = false,
}) => {
  return (
    <div className="fb-card fb-connection-card">
      <div className="fb-card-header-row">
        <h3 className="fb-card-title">1. Facebook Connection</h3>
        <span className={`fb-status-badge ${connection.isExpired ? 'expired' : 'connected'}`}>
          {connection.isExpired ? 'Expired' : connection.status}
        </span>
      </div>

      <p className="fb-card-subtitle">
        Connect your Facebook account to start receiving leads.
      </p>

      <div className="fb-connection-body">
        <div className="fb-icon-circle">
          <FacebookIcon size={32} className="fb-icon-large" />
        </div>

        <div className="fb-connection-info-grid">
          <div className="fb-info-row">
            <span className="fb-info-label">Status</span>
            <span className={`fb-info-value-status ${connection.isExpired ? 'text-danger' : 'text-success'}`}>
              {connection.isExpired ? 'Expired' : connection.status}
            </span>
          </div>

          <div className="fb-info-row">
            <span className="fb-info-label">Connected By</span>
            <span className="fb-info-value">{connection.connectedBy}</span>
          </div>

          <div className="fb-info-row">
            <span className="fb-info-label">Connected On</span>
            <span className="fb-info-value">{connection.connectedTime}</span>
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
          <span>{isConnecting ? 'Connecting to Meta...' : 'Connect with Facebook'}</span>
        </button>

        <div className="fb-security-note">
          <ShieldCheck size={14} className="fb-security-icon" />
          <span>We never post to your timeline. This is 100% secure.</span>
        </div>
      </div>
    </div>
  );
};
