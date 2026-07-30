import React from 'react';
import { CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { FacebookPermissionItem } from '@/types/facebook.types';

interface Props {
  permissions: FacebookPermissionItem[];
}

export const PermissionsCard: React.FC<Props> = ({ permissions = [] }) => {
  const defaultPermissions: FacebookPermissionItem[] = [
    {
      id: '1',
      permission: 'pages_show_list',
      description: 'View and manage your Pages',
      status: 'Granted',
    },
    {
      id: '2',
      permission: 'pages_read_engagement',
      description: 'Read content posted on the Page',
      status: 'Granted',
    },
    {
      id: '3',
      permission: 'leads_retrieval',
      description: 'Manage and retrieve your leads',
      status: 'Granted',
    },
    {
      id: '4',
      permission: 'business_management',
      description: 'Manage your business',
      status: 'Granted',
    },
  ];

  const displayPermissions = permissions.length > 0 ? permissions : defaultPermissions;

  return (
    <div className="fb-card fb-permissions-card">
      <h3 className="fb-card-title">6. Permissions</h3>
      <p className="fb-card-subtitle">Below are the permissions we have access to:</p>

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
