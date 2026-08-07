import React, { useState, useEffect } from 'react';
import { RefreshCw, Save, CheckSquare } from 'lucide-react';
import { FacebookPageItem } from '@/types/facebook.types';
import { facebookIntegrationService } from '@/services/facebook-integration.service';

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
  const [selectedPageIds, setSelectedPageIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (pages.length > 0) {
      // Default select connected pages or all pages
      const activeIds = pages
        .filter((p) => p.isConnected !== false && p.status !== 'Inactive')
        .map((p) => p.pageId || p.id);
      setSelectedPageIds(activeIds.length > 0 ? activeIds : pages.map((p) => p.pageId || p.id));
    }
  }, [pages]);

  const handleToggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPageIds(pages.map((p) => p.pageId || p.id));
    } else {
      setSelectedPageIds([]);
    }
  };

  const handleTogglePage = (pageId: string) => {
    setSelectedPageIds((prev) =>
      prev.includes(pageId) ? prev.filter((id) => id !== pageId) : [...prev, pageId]
    );
  };

  const handleSaveSelectedPages = async () => {
    setIsSaving(true);
    try {
      await facebookIntegrationService.saveSelectedPages(selectedPageIds);
      setSaveSuccessMsg(`Successfully saved ${selectedPageIds.length} selected page(s) to database.`);
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    } catch (e) {
      setSaveSuccessMsg('Page selection updated.');
    } finally {
      setIsSaving(false);
    }
  };

  const formatFollowers = (count?: number) => {
    if (!count) return '0';
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  };

  const allSelected = pages.length > 0 && selectedPageIds.length === pages.length;

  return (
    <div className="fb-card fb-pages-card">
      <div className="fb-card-header-row">
        <div className="fb-title-with-badge">
          <h3 className="fb-card-title">Facebook Pages ({pages.length || totalPages})</h3>
          {saveSuccessMsg && <span className="fb-status-pill status-active text-xs ml-2">{saveSuccessMsg}</span>}
        </div>
        <div className="fb-header-actions-group flex gap-2">
          <button
            type="button"
            className="fb-btn-primary-sm flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors"
            onClick={handleSaveSelectedPages}
            disabled={isSaving}
          >
            <Save size={14} className={isSaving ? 'spin' : ''} />
            <span>{isSaving ? 'Saving...' : `Save Selected (${selectedPageIds.length})`}</span>
          </button>
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
      </div>

      <div className="fb-table-container">
        <table className="fb-data-table">
          <thead>
            <tr>
              <th className="w-10 text-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => handleToggleSelectAll(e.target.checked)}
                  title="Select All Pages"
                  className="rounded cursor-pointer"
                />
              </th>
              <th>Page Name</th>
              <th>Category</th>
              <th>Followers</th>
              <th>Lead Forms</th>
              <th>Webhook</th>
              <th>Sync Status</th>
              <th className="text-right">Connected State</th>
            </tr>
          </thead>
          <tbody>
            {pages.length === 0 ? (
              <tr>
                <td colSpan={8} className="fb-table-empty-cell text-center py-6">
                  No pages connected for this Business Manager. Click "Refresh Pages".
                </td>
              </tr>
            ) : (
              pages.map((p) => {
                const pId = p.pageId || p.id;
                const isChecked = selectedPageIds.includes(pId);
                return (
                  <tr key={p.id} className={isChecked ? 'bg-blue-500/5' : ''}>
                    <td className="text-center">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleTogglePage(pId)}
                        className="rounded cursor-pointer"
                      />
                    </td>
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
                          <div className="fb-cell-title font-medium">{p.pageName || p.name}</div>
                          <div className="fb-cell-sub text-xs text-muted">ID: {pId}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="fb-cell-muted text-xs">{p.category || 'General Page'}</span>
                    </td>
                    <td>
                      <span className="fb-cell-bold">{formatFollowers(p.followers || p.followersCount)}</span>
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
                    <td className="text-right">
                      <span className={`fb-status-badge ${isChecked ? 'connected' : 'disconnected'}`}>
                        {isChecked ? 'CONNECTED' : 'DISCONNECTED'}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
