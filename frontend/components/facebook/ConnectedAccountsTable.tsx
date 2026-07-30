import React from 'react';
import { Plus, MoreHorizontal, Search, RefreshCw, AlertCircle, Trash2 } from 'lucide-react';
import { FacebookAccountItem } from '@/types/facebook.types';

interface Props {
  accounts: FacebookAccountItem[];
  onAddAccount: () => void;
  onDisconnectAccount?: (accountId: string) => void;
  search: string;
  onSearchChange: (val: string) => void;
}

export const ConnectedAccountsTable: React.FC<Props> = ({
  accounts = [],
  onAddAccount,
  onDisconnectAccount,
  search,
  onSearchChange,
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const filteredAccounts = accounts.filter(acc => 
    !search || 
    acc.accountName.toLowerCase().includes(search.toLowerCase()) || 
    acc.fbUserId.includes(search) ||
    (acc.connectedByUser?.name && acc.connectedByUser.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="fb-card fb-accounts-card">
      <div className="fb-card-header-row">
        <h3 className="fb-card-title">2. Connected Facebook Accounts</h3>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search accounts..."
              className="fb-search-input pl-8 py-1 text-xs"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <button type="button" className="fb-btn-secondary" onClick={onAddAccount}>
            <Plus size={16} />
            <span>Add Account</span>
          </button>
        </div>
      </div>

      <div className="fb-table-container">
        <table className="fb-data-table">
          <thead>
            <tr>
              <th>Account Name</th>
              <th>Business Manager</th>
              <th>Connected By</th>
              <th>Status</th>
              <th>Last Sync</th>
              <th>Token Expiry</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-6 text-muted">
                  {search ? 'No Facebook accounts match your search.' : 'No Facebook accounts connected yet. Click "+ Add Account" to connect.'}
                </td>
              </tr>
            ) : (
              filteredAccounts.map((acc) => (
                <tr key={acc.id}>
                  <td>
                    <div className="fb-cell-account">
                      <div className="fb-avatar-circle">{getInitials(acc.accountName)}</div>
                      <div>
                        <div className="fb-cell-title">{acc.accountName}</div>
                        <div className="fb-cell-sub">ID: {acc.fbUserId}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="fb-cell-title">{acc.businessManagerName || 'LeadPilot Marketing'}</div>
                    <div className="fb-cell-sub">ID: {acc.businessManagerId || '987654321098765'}</div>
                  </td>
                  <td>
                    <div className="fb-cell-user">
                      <div className="fb-user-avatar-mini">
                        {getInitials(acc.connectedByUser?.name || 'Arjun Mehta')}
                      </div>
                      <div>
                        <div className="fb-cell-title">{acc.connectedByUser?.name || 'Arjun Mehta'}</div>
                        <div className="fb-cell-sub">{acc.connectedByUser?.roleName || 'Super Admin'}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`fb-status-pill ${
                        acc.tokenStatus === 'Active' ? 'status-active' : 'status-expired'
                      }`}
                    >
                      {acc.tokenStatus}
                    </span>
                  </td>
                  <td>
                    <span className="fb-cell-muted">{acc.lastSync || '2 min ago'}</span>
                  </td>
                  <td>
                    <span
                      className={`fb-cell-expiry ${
                        acc.tokenStatus === 'Expired' ? 'text-danger' : 'text-main'
                      }`}
                    >
                      {acc.tokenExpiry || 'Jun 20, 2025 10:15 AM'}
                    </span>
                  </td>
                  <td className="text-right">
                    <button
                      type="button"
                      className="fb-action-icon-btn text-danger-hover"
                      title="Disconnect Account (Leads remain saved)"
                      onClick={() => {
                        if (confirm(`Are you sure you want to disconnect ${acc.accountName}? All past leads will remain saved.`)) {
                          onDisconnectAccount?.(acc.id);
                        }
                      }}
                    >
                      <Trash2 size={16} />
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
