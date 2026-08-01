import React from 'react';
import { RefreshCw } from 'lucide-react';
import { FacebookPageItem } from '@/types/facebook.types';

interface Props {
  pages: FacebookPageItem[];
  totalPages?: number;
  onRefreshPages: () => void;
  isRefreshing: boolean;
}

export const ConnectedPagesTable: React.FC<Props> = ({
  pages = [],
  totalPages = 0,
  onRefreshPages,
  isRefreshing,
}) => {
  const formatFollowers = (count?: number) => {
    if (!count) return '0';
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
                <td colSpan={8} className="fb-table-empty-cell">
                  No pages connected for this Business Manager. Click "Refresh Pages".
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
                          <div className="fb-page-avatar-fallback">{p.name ? p.name[0] : 'P'}</div>
                        )}
                      </div>
                      <div>
                        <div className="fb-cell-title">{p.name}</div>
                        <div className="fb-cell-sub">ID: {p.pageId}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="fb-cell-muted text-xs">{p.category || 'General Page'}</span>
                  </td>
                  <td>
                    <span className="fb-cell-bold">{formatFollowers(p.followersCount)}</span>
                  </td>
                  <td>
                    <span className="fb-cell-bold">{p.leadFormsCount || 0} Forms</span>
                  </td>
                  <td>
                    <span className="fb-status-pill status-active">{p.webhookStatus || 'Active'}</span>
                  </td>
                  <td>
                    <span className="fb-status-pill status-active">{p.syncStatus || 'Synced'}</span>
                  </td>
                  <td>
                    <span className="fb-cell-muted text-xs">{p.lastSync || 'N/A'}</span>
                  </td>
                  <td className="text-right">
                    <div className="fb-page-actions">
                      <button type="button" className="fb-btn-toggle-active">
                        {p.status === 'Active' ? 'Disable' : 'Enable'}
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
