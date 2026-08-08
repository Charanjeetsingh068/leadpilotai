import React from 'react';
import { Plus, Search, Trash2, RefreshCw, Power, Link2 } from 'lucide-react';
import { FacebookAccountItem } from '@/types/facebook.types';

interface Props {
  accounts: FacebookAccountItem[];
  onAddAccount: () => void;
  onConnectAccount?: () => void;
  onReconnectAccount?: (accountId: string) => void;
  onDisconnectAccount?: (accountId: string) => void;
  onDeleteAccount?: (accountId: string) => void;
  search: string;
  onSearchChange: (val: string) => void;
}

export const ConnectedAccountsTable: React.FC<Props> = ({
  accounts = [],
  onAddAccount,
  onConnectAccount,
  onReconnectAccount,
  onDisconnectAccount,
  onDeleteAccount,
  search,
  onSearchChange,
}) => {
  const getInitials = (name?: string) => {
    if (!name) return 'FB';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const filteredAccounts = accounts.filter((acc) => {
    const accName = acc.name || acc.accountName || '';
    return (
      !search ||
      accName.toLowerCase().includes(search.toLowerCase()) ||
      (acc.fbUserId && acc.fbUserId.includes(search)) ||
      (acc.connectedByUser?.name && acc.connectedByUser.name.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <div className="fb-card fb-accounts-card">
      <div className="fb-card-header-row">
        <h3 className="fb-card-title">Connected Meta Accounts ({accounts.length})</h3>
        <div className="fb-header-actions-group">
          <div className="fb-search-wrapper">
            <Search size={14} className="fb-search-icon" />
            <input
              type="text"
              placeholder="Search accounts..."
              className="fb-search-input"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <button type="button" className="fb-btn-primary" onClick={onConnectAccount || onAddAccount}>
            <Link2 size={16} />
            <span>Connect Account</span>
          </button>
        </div>
      </div>

      <div className="fb-table-container">
        <table className="fb-data-table">
          <thead>
            <tr>
              <th>Account Name</th>
              <th>Business Portfolio</th>
              <th>Connected By</th>
              <th>Status</th>
              <th>Last Sync</th>
              <th>Token Security</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.length === 0 ? (
              <tr>
                <td colSpan={7} className="fb-table-empty-cell">
                  {search ? 'No Meta accounts match your search.' : 'No Meta accounts connected yet. Click "Connect Account" to add.'}
                </td>
              </tr>
            ) : (
              filteredAccounts.map((acc) => {
                const accName = acc.name || acc.accountName || 'Meta Account';
                const ownerName = acc.connectedByUser?.name || acc.user?.name || accName;

                return (
                  <tr key={acc.id}>
                    <td>
                      <div className="fb-cell-account">
                        <div className="fb-avatar-circle">{getInitials(accName)}</div>
                        <div>
                          <div className="fb-cell-title">{accName}</div>
                          <div className="fb-cell-sub">ID: {acc.fbUserId}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="fb-cell-title">{acc.businessManagerName || (acc.businesses && acc.businesses[0]?.name) || 'Meta Business Portfolio'}</div>
                      <div className="fb-cell-sub">{acc.businessManagerId || (acc.businesses && acc.businesses[0]?.businessId) ? `ID: ${acc.businessManagerId || acc.businesses?.[0]?.businessId}` : 'Connected Portfolio'}</div>
                    </td>
                    <td>
                      <div className="fb-cell-user">
                        <div className="fb-user-avatar-mini">
                          {getInitials(ownerName)}
                        </div>
                        <div>
                          <div className="fb-cell-title">{ownerName}</div>
                          <div className="fb-cell-sub">{acc.connectedByUser?.roleName || acc.user?.role?.name || 'Administrator'}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`fb-status-pill ${
                          acc.tokenStatus === 'VALID' || acc.status === 'VALID' || acc.tokenStatus === 'Active' || acc.tokenStatus === 'CONNECTED' ? 'status-active' : 'status-expired'
                        }`}
                      >
                        {acc.tokenStatus || acc.status || 'Active'}
                      </span>
                    </td>
                    <td>
                      <span className="fb-cell-muted">
                        {acc.lastSync || (acc.lastSyncAt ? new Date(acc.lastSyncAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now')}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`fb-cell-expiry ${
                          acc.tokenStatus === 'EXPIRED' ? 'text-danger' : 'text-main'
                        }`}
                      >
                        {acc.tokenExpiry || (acc.tokenExpiresAt ? new Date(acc.tokenExpiresAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'AES-256 Encrypted')}
                      </span>
                    </td>
                    <td className="text-right">
                      <div style={{ display: 'inline-flex', gap: '0.375rem', alignItems: 'center' }}>
                        <button
                          type="button"
                          className="fb-action-icon-btn text-primary-hover"
                          title="Reconnect Account"
                          onClick={() => onReconnectAccount?.(acc.id)}
                        >
                          <RefreshCw size={15} />
                        </button>
                        <button
                          type="button"
                          className="fb-action-icon-btn text-warning-hover"
                          title="Disconnect Account"
                          onClick={() => {
                            if (confirm(`Are you sure you want to disconnect ${accName}? Leads will remain saved.`)) {
                              onDisconnectAccount?.(acc.id);
                            }
                          }}
                        >
                          <Power size={15} />
                        </button>
                        <button
                          type="button"
                          className="fb-action-icon-btn text-danger-hover"
                          title="Delete Account Permanently"
                          onClick={() => {
                            if (confirm(`Are you sure you want to DELETE ${accName} permanently?`)) {
                              onDeleteAccount?.(acc.id);
                            }
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
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
