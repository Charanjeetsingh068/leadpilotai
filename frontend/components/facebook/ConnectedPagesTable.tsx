import React from 'react';
import { RefreshCw, ExternalLink, Bot } from 'lucide-react';
import { FacebookPageItem } from '@/types/facebook.types';

interface Props {
  pages: FacebookPageItem[];
  totalPages: number;
  onRefreshPages: () => void;
  isRefreshing: boolean;
}

export const ConnectedPagesTable: React.FC<Props> = ({
  pages = [],
  totalPages = 4,
  onRefreshPages,
  isRefreshing,
}) => {
  const formatFollowers = (count: number) => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  };

  return (
    <div className="fb-card fb-pages-card">
      <div className="fb-card-header-row">
        <h3 className="fb-card-title">4. Connected Pages ({totalPages})</h3>
        <button
          type="button"
          className="fb-btn-secondary-sm"
          onClick={onRefreshPages}
          disabled={isRefreshing}
        >
          <RefreshCw size={14} className={isRefreshing ? 'spin' : ''} />
          <span>Refresh Pages</span>
        </button>
      </div>

      <div className="fb-table-container">
        <table className="fb-data-table">
          <thead>
            <tr>
              <th>Page Name</th>
              <th>Page ID</th>
              <th>Followers</th>
              <th>Status</th>
              <th>Webhook</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pages.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-muted">
                  No pages loaded for this Business Manager. Click "Refresh Pages".
                </td>
              </tr>
            ) : (
              pages.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="fb-cell-page">
                      <div className="fb-page-avatar">
                        {p.pictureUrl ? (
                          <img src={p.pictureUrl} alt={p.name} className="fb-page-img" />
                        ) : (
                          <div className="fb-page-avatar-fallback">{p.name[0]}</div>
                        )}
                      </div>
                      <div>
                        <div className="fb-cell-title">{p.name}</div>
                        <div className="fb-cell-sub">ID: {p.pageId}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="fb-cell-muted font-mono">{p.pageId}</span>
                  </td>
                  <td>
                    <span className="fb-cell-bold">{formatFollowers(p.followersCount)}</span>
                  </td>
                  <td>
                    <span className="fb-status-pill status-active">{p.status}</span>
                  </td>
                  <td>
                    <div className="fb-webhook-agent-tag">
                      <Bot size={13} className="text-brand-blue" />
                      <span>{p.assignedAiAgent?.name || 'Property Advisor AI'}</span>
                    </div>
                  </td>
                  <td className="text-right">
                    <button type="button" className="fb-btn-view">
                      View
                    </button>
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
