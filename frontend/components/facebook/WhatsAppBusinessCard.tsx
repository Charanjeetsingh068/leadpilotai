import React from 'react';
import { MessageSquare, CheckCircle2, ShieldCheck } from 'lucide-react';
import { WhatsAppAccountItem } from '@/types/facebook.types';

interface Props {
  accounts?: WhatsAppAccountItem[];
}

export const WhatsAppBusinessCard: React.FC<Props> = ({ accounts = [] }) => {
  return (
    <div className="fb-card fb-whatsapp-card">
      <div className="fb-card-header-row">
        <div className="fb-title-with-icon">
          <MessageSquare size={18} className="fb-wa-icon" />
          <h3 className="fb-card-title">WhatsApp Business Accounts ({accounts.length})</h3>
        </div>
        {accounts.length > 0 && <span className="fb-live-badge">🟢 Webhook Active</span>}
      </div>

      <div className="fb-table-container">
        <table className="fb-data-table">
          <thead>
            <tr>
              <th>Business Name</th>
              <th>Phone Number</th>
              <th>Quality Rating</th>
              <th>Webhook</th>
              <th>Templates</th>
              <th>Messaging Status</th>
            </tr>
          </thead>
          <tbody>
            {accounts.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-muted">
                  No WhatsApp Business Accounts connected. Connect Meta Business portfolio first.
                </td>
              </tr>
            ) : (
              accounts.map((wa) => (
              <tr key={wa.id || wa.wabaId}>
                <td>
                  <div className="fb-cell-account">
                    <div className="fb-wa-avatar font-sans">WA</div>
                    <div>
                      <div className="fb-cell-title">{wa.name}</div>
                      <div className="fb-cell-sub">WABA ID: {wa.wabaId}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="fb-cell-bold font-mono">{wa.phoneNumber}</span>
                </td>
                <td>
                  <span className="fb-status-pill status-quality-high">
                    {wa.qualityRating || 'High'}
                  </span>
                </td>
                <td>
                  <div className="fb-status-with-icon">
                    <CheckCircle2 size={14} className="text-success-icon" />
                    <span>{wa.webhookActive ? 'Active' : 'Inactive'}</span>
                  </div>
                </td>
                <td>
                  <span className="fb-cell-bold">{wa.templatesCount || 12} Active</span>
                </td>
                <td>
                  <span className="fb-status-pill status-active">
                    {wa.messagingStatus || 'Active'}
                  </span>
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
