import React from 'react';
import { RefreshCw, Bot, CheckCircle2, XCircle } from 'lucide-react';
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
        <h3 className="fb-card-title">Facebook Pages ({pages.length || totalPages})</h3>
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
              <th>Category</th>
              <th>Followers</th>
              <th>Lead Forms</th>
              <th>Webhook</th>
              <th>Sync Status</th>
              <th>Last Sync</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pages.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-6 text-muted">
                  No pages loaded for this Business Manager. Click "Refresh Pages".
                </td>
              </tr>
            ) : (
              pages.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="fb-cell-page">
                      <div className="fb-page-avatar font-sans">
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
                    <span className="fb-cell-muted text-xs">{p.category || 'Real Estate'}</span>
                  </td>
                  <td>
                    <span className="fb-cell-bold">{formatFollowers(p.followersCount)}</span>
                  </td>
                  <td>
                    <span className="fb-cell-bold">{p.leadFormsCount || 2} Forms</span>
                  </td>
                  <td>
                    <span className="fb-status-pill status-active">{p.webhookStatus || 'Active'}</span>
                  </td>
                  <td>
                    <span className="fb-status-pill status-active">{p.syncStatus || 'Synced'}</span>
                  </td>
                  <td>
                    <span className="fb-cell-muted text-xs">{p.lastSync || 'Just now'}</span>
                  </td>
                  <td className="text-right">
                    <div className="fb-page-actions flex items-center justify-end gap-1">
                      <button type="button" className="fb-btn-toggle-active">
                        {p.status === 'Active' ? 'Disable' : 'Enable'}
                      </button>
                      <button type="button" className="fb-btn-view">
                        Select
                      </button>
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
