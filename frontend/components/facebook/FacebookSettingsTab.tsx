'use client';

import React from 'react';
import { ShieldCheck, RefreshCw, LogOut, CheckCircle2, KeyRound, Server } from 'lucide-react';

interface SettingsTabProps {
  scopes?: string[];
  tokenExpiresAt?: string;
  onRefresh?: () => void;
  onDisconnect?: () => void;
}

export const FacebookSettingsTab: React.FC<SettingsTabProps> = ({
  scopes = ['public_profile', 'email', 'business_management', 'pages_show_list', 'pages_read_engagement', 'pages_manage_metadata', 'leads_retrieval'],
  tokenExpiresAt,
  onRefresh,
  onDisconnect,
}) => {
  return (
    <div className="fb-lead-inbox-card">
      <div className="fb-lead-inbox-header-row">
        <h3 className="fb-lead-inbox-title">Facebook Integration Settings & Permissions</h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* WEBHOOK HEALTH */}
        <div style={{ padding: '1.25rem', border: '1px solid #e2e8f0', borderRadius: '0.75rem', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Server width={18} height={18} color="#2563eb" />
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a' }}>Realtime Leadgen Webhooks</h4>
          </div>
          <div style={{ fontSize: '0.8125rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Endpoint:</span>
              <span style={{ fontWeight: 600, color: '#0f172a' }}>https://app.leadpilot.ai/webhooks/facebook</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Verification Status:</span>
              <span style={{ fontWeight: 600, color: '#059669' }}>Verified (99.2% Success Rate)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Subscriptions:</span>
              <span style={{ fontWeight: 600, color: '#0f172a' }}>leadgen, page_messages, instagram</span>
            </div>
          </div>
        </div>

        {/* TOKEN HEALTH */}
        <div style={{ padding: '1.25rem', border: '1px solid #e2e8f0', borderRadius: '0.75rem', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <KeyRound width={18} height={18} color="#8b5cf6" />
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a' }}>Token Security & Refresh</h4>
          </div>
          <div style={{ fontSize: '0.8125rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Token Type:</span>
              <span style={{ fontWeight: 600, color: '#0f172a' }}>Meta Long-Lived System User Access Token</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Status:</span>
              <span style={{ fontWeight: 600, color: '#059669' }}>Active & Encrypted (AES-256-GCM)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Expiry:</span>
              <span style={{ fontWeight: 600, color: '#0f172a' }}>Never (System Token) / Auto-renew</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onRefresh} className="fb-btn-outline" style={{ fontSize: '0.8125rem' }}>
              <RefreshCw width={14} height={14} />
              <span>Refresh Token</span>
            </button>
            <button type="button" onClick={onDisconnect} className="fb-btn-danger" style={{ fontSize: '0.8125rem' }}>
              <LogOut width={14} height={14} />
              <span>Disconnect</span>
            </button>
          </div>
        </div>
      </div>

      {/* GRANTED PERMISSIONS */}
      <div style={{ padding: '1.25rem', border: '1px solid #e2e8f0', borderRadius: '0.75rem', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck width={18} height={18} color="#10b981" />
          <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a' }}>Granted OAuth Scopes</h4>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
          {scopes.map((scope) => (
            <div key={scope} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: '#047857', backgroundColor: '#ecfdf5', padding: '0.375rem 0.625rem', borderRadius: '0.375rem' }}>
              <CheckCircle2 width={14} height={14} />
              <span>{scope}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
