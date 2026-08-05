'use client';

import React from 'react';
import { CheckCircle2, AlertTriangle, ShieldCheck, AlertCircle, Clock, Key, ShieldAlert } from 'lucide-react';
import { FacebookPermissionItem } from '@/types/facebook.types';

interface Props {
  permissions: FacebookPermissionItem[];
}

export type PermissionStatusType = 'Granted' | 'Missing' | 'Expired' | 'Reconnect Required' | 'Admin Required';

export const PermissionsCard: React.FC<Props> = ({ permissions = [] }) => {
  const requiredPermissions: { permission: string; description: string; defaultStatus?: PermissionStatusType }[] = [
    { permission: 'business_management', description: 'Access Business Portfolios, asset discovery & system users', defaultStatus: 'Granted' },
    { permission: 'pages_show_list', description: 'Discover owned and client Facebook Pages', defaultStatus: 'Granted' },
    { permission: 'pages_manage_metadata', description: 'Subscribe Page webhooks & lead form listeners', defaultStatus: 'Granted' },
    { permission: 'pages_read_engagement', description: 'Read page engagement, posts & insights', defaultStatus: 'Granted' },
    { permission: 'pages_manage_posts', description: 'Manage and publish page feed content', defaultStatus: 'Granted' },
    { permission: 'leads_retrieval', description: 'Retrieve Meta Lead Ads submissions in real time', defaultStatus: 'Granted' },
    { permission: 'instagram_basic', description: 'Discover linked Instagram Business Accounts', defaultStatus: 'Granted' },
    { permission: 'instagram_manage_messages', description: 'Manage Instagram direct messaging and comments', defaultStatus: 'Granted' },
    { permission: 'whatsapp_business_management', description: 'Discover WhatsApp Business Accounts & phone numbers', defaultStatus: 'Granted' },
    { permission: 'whatsapp_business_messaging', description: 'Send and receive WhatsApp Cloud API messages', defaultStatus: 'Granted' },
  ];

  const totalRequired = requiredPermissions.length;

  const statusMap = new Map<string, PermissionStatusType>();
  permissions.forEach((p: any) => {
    const code = p?.permission || p?.name || (typeof p === 'string' ? p : '');
    if (!code) return;

    const rawStatus = (p?.status || 'Granted').toString().toUpperCase();
    let normalized: PermissionStatusType = 'Granted';

    if (rawStatus === 'GRANTED') normalized = 'Granted';
    else if (rawStatus === 'MISSING') normalized = 'Missing';
    else if (rawStatus === 'EXPIRED') normalized = 'Expired';
    else if (rawStatus === 'RECONNECT_REQUIRED' || rawStatus === 'RECONNECT REQUIRED') normalized = 'Reconnect Required';
    else if (rawStatus === 'ADMIN_REQUIRED' || rawStatus === 'ADMIN REQUIRED') normalized = 'Admin Required';

    statusMap.set(code, normalized);
  });

  const displayPermissions = requiredPermissions.map((req, idx) => {
    const currentStatus = statusMap.get(req.permission) || req.defaultStatus || 'Granted';
    return {
      id: `p-${idx}`,
      permission: req.permission,
      description: req.description,
      status: currentStatus,
    };
  });

  const grantedCount = displayPermissions.filter((p) => p.status === 'Granted').length;
  const missingCount = totalRequired - grantedCount;

  return (
    <div className="fb-card fb-permissions-card">
      <div className="fb-card-header-row">
        <div className="fb-title-with-icon">
          <ShieldCheck size={18} className="text-brand-blue" />
          <h3 className="fb-card-title">Granted Permissions &amp; Scopes</h3>
        </div>
        <span className={`fb-status-pill ${missingCount === 0 ? 'status-active' : 'status-warning'}`}>
          {`${grantedCount} / ${totalRequired} Granted`}
        </span>
      </div>

      {missingCount > 0 && (
        <div className="fb-perm-warning-banner">
          <AlertCircle size={16} className="text-warning-icon" />
          <span>Notice: Action required for {missingCount} permission(s). Reconnect account to update access rights.</span>
        </div>
      )}

      <div className="fb-permissions-list">
        {displayPermissions.map((perm) => (
          <div key={perm.id || perm.permission} className="fb-permission-item">
            <div className="fb-permission-icon">
              {perm.status === 'Granted' && <CheckCircle2 size={16} className="text-emerald" />}
              {perm.status === 'Missing' && <AlertTriangle size={16} className="text-amber" />}
              {perm.status === 'Expired' && <Clock size={16} className="text-amber" />}
              {perm.status === 'Reconnect Required' && <ShieldAlert size={16} className="text-rose" />}
              {perm.status === 'Admin Required' && <Key size={16} className="text-indigo" />}
            </div>
            
            <div className="fb-permission-text-group">
              <span className="fb-permission-code">{perm.permission}</span>
              <span className="fb-permission-desc">{perm.description}</span>
            </div>

            <div className={`perm-status-badge perm-status-${perm.status.toLowerCase().replace(/\s+/g, '-')}`}>
              {perm.status.toUpperCase()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
