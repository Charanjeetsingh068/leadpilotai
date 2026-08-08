import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { InstagramIcon } from './InstagramIcon';
import { InstagramAccountItem } from '@/types/facebook.types';

interface Props {
  accounts?: InstagramAccountItem[];
}

export const InstagramAccountsCard: React.FC<Props> = ({ accounts = [] }) => {
  const formatFollowers = (count?: number) => {
    if (!count) return '0';
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
              <th>Business Link</th>
              <th>Followers</th>
              <th>Messaging</th>
              <th>Webhook</th>
            </tr>
          </thead>
          <tbody>
            {accounts.length === 0 ? (
              <tr>
                <td colSpan={5} className="fb-table-empty-cell">
                  No Instagram Business Accounts connected. Connect Facebook Page with linked Instagram account.
                </td>
              </tr>
            ) : (
              accounts.map((ig) => (
                <tr key={ig.id || ig.instagramId}>
                  <td>
                    <div className="fb-cell-account">
                      <div className="fb-ig-avatar font-sans overflow-hidden rounded-full">
                        {ig.profilePictureUrl ? (
                          <img src={ig.profilePictureUrl} alt={ig.username} className="fb-page-img w-full h-full object-cover" />
                        ) : (
                          <div className="fb-avatar-fallback">{ig.username ? ig.username[0].toUpperCase() : 'I'}</div>
                        )}
                      </div>
                      <div>
                        <div className="fb-cell-title">@{ig.username}</div>
                        <div className="fb-cell-sub">ID: {ig.instagramId || ig.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="fb-status-pill status-active">
                      Connected
                    </span>
                  </td>
                  <td>
                    <span className="fb-cell-bold">{formatFollowers(ig.followersCount || ig.followers)}</span>
                  </td>
                  <td>
                    <div className="fb-status-with-icon">
                      <CheckCircle2 size={14} className="text-success-icon" />
                      <span>Enabled</span>
                    </div>
                  </td>
                  <td>
                    <div className="fb-status-with-icon">
                      <CheckCircle2 size={14} className="text-success-icon" />
                      <span>Active</span>
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
