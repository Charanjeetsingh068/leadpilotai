'use client';

import React from 'react';
import { CheckCircle2, RotateCw } from 'lucide-react';

export interface FormItem {
  id: string;
  formId: string;
  name: string;
  campaign?: string;
  leadCount?: number;
  status: string;
  webhookStatus?: string;
}

interface FacebookLeadFormsTabProps {
  forms?: FormItem[];
  onSyncForm?: (formId: string) => void;
}

export const FacebookLeadFormsTab: React.FC<FacebookLeadFormsTabProps> = ({
  forms = [],
  onSyncForm,
}) => {
  return (
    <div className="fb-lead-inbox-card">
      <div className="fb-lead-inbox-header-row">
        <h3 className="fb-lead-inbox-title">Connected Leadgen Forms (Meta Graph API)</h3>
      </div>

      <div className="fb-lead-table-wrapper">
        <table className="fb-lead-table">
          <thead>
            <tr>
              <th>Form Name</th>
              <th>Form ID</th>
              <th>Campaign</th>
              <th>Total Leads</th>
              <th>Status</th>
              <th>Webhook Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {forms.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                  No Meta Lead Forms discovered for this Facebook Page.
                </td>
              </tr>
            ) : (
              forms.map((form) => (
                <tr key={form.id || form.formId}>
                  <td style={{ fontWeight: 600, color: '#0f172a' }}>{form.name}</td>
                  <td style={{ color: '#64748b' }}>{form.formId}</td>
                  <td>{form.campaign || 'Default Performance Campaign'}</td>
                  <td style={{ fontWeight: 700, color: '#2563eb' }}>{form.leadCount || 0}</td>
                  <td>
                    <span className="fb-active-badge">{form.status || 'Active'}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#059669', fontSize: '0.8125rem' }}>
                      <CheckCircle2 width={14} height={14} />
                      <span>{form.webhookStatus || 'Verified'}</span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      onClick={() => onSyncForm?.(form.formId)}
                      className="fb-btn-outline"
                      style={{ padding: '0.375rem 0.625rem' }}
                    >
                      <RotateCw width={14} height={14} />
                      <span>Sync Form</span>
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
