import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { InstagramIcon } from './InstagramIcon';
import { InstagramAccountItem } from '@/types/facebook.types';

interface Props {
  accounts?: InstagramAccountItem[];
}

export const InstagramAccountsCard: React.FC<Props> = ({ accounts = [] }) => {
  const formatFollowers = (count: number) => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  };

  return (
    <div className="fb-card fb-instagram-card">
      <div className="fb-card-header-row">
        <div className="fb-title-with-icon">
          <InstagramIcon size={18} className="fb-ig-icon" />
          <h3 className="fb-card-title">Instagram Business Accounts ({accounts.length})</h3>
        </div>
        {accounts.length > 0 && <span className="fb-live-badge">🟢 Connected</span>}
      </div>

      <div className="fb-table-container">
        <table className="fb-data-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Business Connected</th>
              <th>Followers</th>
              <th>Messaging Enabled</th>
              <th>Webhook Enabled</th>
            </tr>
          </thead>
          <tbody>
            {accounts.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-muted">
                  No Instagram Business Accounts connected. Connect Facebook Page first.
                </td>
              </tr>
            ) : (
              accounts.map((ig) => (
              <tr key={ig.id || ig.instagramId}>
                <td>
                  <div className="fb-cell-account">
                    <div className="fb-ig-avatar font-sans">
                      {ig.username[0]?.toUpperCase() || 'I'}
                    </div>
                    <div>
                      <div className="fb-cell-title">@{ig.username}</div>
                      <div className="fb-cell-sub">ID: {ig.instagramId}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="fb-status-pill status-active">
                    {ig.businessConnected ? 'Connected' : 'Pending'}
                  </span>
                </td>
                <td>
                  <span className="fb-cell-bold">{formatFollowers(ig.followersCount)}</span>
                </td>
                <td>
                  <div className="fb-status-with-icon">
                    {ig.messagingEnabled ? (
                      <CheckCircle2 size={14} className="text-success-icon" />
                    ) : (
                      <AlertCircle size={14} className="text-warning-icon" />
                    )}
                    <span>{ig.messagingEnabled ? 'Enabled' : 'Disabled'}</span>
                  </div>
                </td>
                <td>
                  <div className="fb-status-with-icon">
                    {ig.webhookEnabled ? (
                      <CheckCircle2 size={14} className="text-success-icon" />
                    ) : (
                      <AlertCircle size={14} className="text-warning-icon" />
                    )}
                    <span>{ig.webhookEnabled ? 'Active' : 'Inactive'}</span>
                  </div>
                </td>
              </tr>
            ))
          )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
