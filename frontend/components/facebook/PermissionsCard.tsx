import React from 'react';
import { CheckCircle2, AlertTriangle, ShieldCheck, AlertCircle } from 'lucide-react';
import { FacebookPermissionItem } from '@/types/facebook.types';

interface Props {
  permissions: FacebookPermissionItem[];
}

export const PermissionsCard: React.FC<Props> = ({ permissions = [] }) => {
  const requiredPermissions: { permission: string; description: string }[] = [
    { permission: 'public_profile', description: 'Access public profile info (name, picture)' },
    { permission: 'business_management', description: 'Manage Business Manager assets and settings' },
    { permission: 'pages_show_list', description: 'View and list owned Facebook Pages' },
    { permission: 'pages_read_engagement', description: 'Read engagement and posts on Facebook Pages' },
    { permission: 'pages_manage_metadata', description: 'Manage Page webhooks and metadata configuration' },
    { permission: 'leads_retrieval', description: 'Retrieve Meta lead form submissions in real time' },
  ];

  const totalRequired = requiredPermissions.length; // 6 permissions

  const displayPermissions = permissions.length > 0
    ? permissions
    : requiredPermissions.map((req, idx) => ({
        id: `p-${idx}`,
        permission: req.permission,
        description: req.description,
        status: 'Missing' as const,
      }));

  const grantedCount = permissions.filter((p) => p.status === 'Granted').length;
  const missingCount = permissions.length === 0 ? totalRequired : permissions.filter((p) => p.status !== 'Granted').length;

  return (
    <div className="fb-card fb-permissions-card">
      <div className="fb-card-header-row">
        <div className="fb-title-with-icon">
          <ShieldCheck size={18} className="text-brand-blue" />
          <h3 className="fb-card-title">Granted Permissions &amp; Scopes</h3>
        </div>
        <span className={`fb-status-pill ${permissions.length > 0 && missingCount === 0 ? 'status-active' : 'status-warning'}`}>
          {permissions.length === 0 ? `0 / ${totalRequired} Granted` : `${grantedCount} / ${totalRequired} Granted`}
        </span>
      </div>

      {permissions.length === 0 ? (
        <div className="fb-perm-warning-banner">
          <AlertCircle size={16} className="text-warning-icon" />
          <span>No Facebook account connected. Connect Meta Business account to grant required permissions.</span>
        </div>
      ) : missingCount > 0 ? (
        <div className="fb-perm-warning-banner">
          <AlertCircle size={16} className="text-warning-icon" />
          <span>Warning: {missingCount} required Meta permission(s) missing. Reconnect account to restore access.</span>
        </div>
      ) : null}

      <div className="fb-permissions-list">
        {displayPermissions.map((perm) => (
          <div key={perm.id || perm.permission} className="fb-permission-item">
            <div className="fb-permission-icon">
              {perm.status === 'Granted' ? (
                <CheckCircle2 size={16} className="text-success-icon" />
              ) : (
                <AlertTriangle size={16} className="text-warning-icon" />
              )}
            </div>
            <div className="fb-permission-text-group">
              <span className="fb-permission-code font-mono">{perm.permission}</span>
              <span className="fb-permission-desc">{perm.description}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
