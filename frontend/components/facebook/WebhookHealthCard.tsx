import React, { useState } from 'react';
import { Copy, Eye, EyeOff, Check, RotateCw, CheckCircle2 } from 'lucide-react';
import { WebhookHealthData } from '@/types/facebook.types';

interface Props {
  webhookHealth?: WebhookHealthData;
  onRetryWebhooks?: () => void;
  isRetrying?: boolean;
}

export const WebhookHealthCard: React.FC<Props> = ({
  webhookHealth,
  onRetryWebhooks,
  isRetrying = false,
}) => {
  const [showToken, setShowToken] = useState<boolean>(false);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const [copiedToken, setCopiedToken] = useState<boolean>(false);

  const copyToClipboard = (text: string, type: 'url' | 'token') => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    if (type === 'url') {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } else {
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  const topics = [
    { name: 'Leadgen', status: webhookHealth?.leadgenStatus || 'Inactive' },
    { name: 'Messages', status: webhookHealth?.messagesStatus || 'Inactive' },
    { name: 'Instagram', status: webhookHealth?.instagramStatus || 'Inactive' },
    { name: 'Comments', status: webhookHealth?.commentsStatus || 'Inactive' },
    { name: 'WhatsApp', status: webhookHealth?.whatsappStatus || 'Inactive' },
  ];

  const isConfigured = Boolean(webhookHealth);

  return (
    <div className="fb-card fb-webhook-card">
      <div className="fb-card-header-row">
        <h3 className="fb-card-title">Webhook Health</h3>
        <div className="flex items-center gap-2">
          <span className={`fb-status-pill ${isConfigured ? 'status-active' : 'status-warning'}`}>
            {isConfigured ? (webhookHealth?.verificationStatus || 'Verified') : 'No Active Webhooks'}
          </span>
          {isConfigured && (
            <button
              type="button"
              className="fb-btn-secondary-sm"
              onClick={onRetryWebhooks}
              disabled={isRetrying}
              title="Replay retry queue"
            >
              <RotateCw size={13} className={isRetrying ? 'spin' : ''} />
              <span>Retry Queue ({webhookHealth?.retryQueueCount || 0})</span>
            </button>
          )}
        </div>
      </div>

      {!isConfigured ? (
        <div className="py-6 text-center text-xs text-muted">
          No Active Webhooks. Connect Meta account to enable webhook subscriptions.
        </div>
      ) : (
        <>
          <div className="fb-wh-topics-grid">
            {topics.map((t) => (
              <div key={t.name} className="fb-wh-topic-pill">
                <CheckCircle2 size={13} className={t.status === 'Active' ? "text-success-icon" : "text-slate-400"} />
                <span className="fb-wh-topic-name">{t.name}</span>
                <span className={`fb-wh-topic-val ${t.status === 'Active' ? 'text-emerald-600' : 'text-slate-400'}`}>{t.status}</span>
              </div>
            ))}
          </div>

          <div className="fb-webhook-metrics-grid">
            <div className="fb-wh-metric">
              <span className="fb-wh-label">Verification</span>
              <span className="fb-wh-value-status text-success font-semibold">
                {webhookHealth?.verificationStatus || 'Verified'}
              </span>
            </div>

            <div className="fb-wh-metric">
              <span className="fb-wh-label">Last Event</span>
              <span className="fb-wh-value-time">{webhookHealth?.lastEventTime || webhookHealth?.lastEvent || 'N/A'}</span>
            </div>

            <div className="fb-wh-metric">
              <span className="fb-wh-label">Retry Queue</span>
              <span className="fb-wh-value">{webhookHealth?.retryQueueCount || 0}</span>
            </div>

            <div className="fb-wh-metric">
              <span className="fb-wh-label">Failures</span>
              <span className="fb-wh-value">{webhookHealth?.failures || webhookHealth?.failedEvents7d || 0}</span>
            </div>
          </div>

          <div className="fb-webhook-inputs-row">
            <div className="fb-wh-input-group">
              <label className="fb-wh-input-label">Webhook Callback URL</label>
              <div className="fb-wh-input-box">
                <input
                  type="text"
                  readOnly
                  value={webhookHealth?.webhookUrl || ''}
                  className="fb-wh-input-field"
                />
                <button
                  type="button"
                  className="fb-wh-copy-btn"
                  onClick={() => copyToClipboard(webhookHealth?.webhookUrl || '', 'url')}
                  title="Copy URL"
                >
                  {copiedUrl ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            <div className="fb-wh-input-group">
              <label className="fb-wh-input-label">Verify Token</label>
              <div className="fb-wh-input-box">
                <input
                  type={showToken ? 'text' : 'password'}
                  readOnly
                  value={webhookHealth?.verifyToken || ''}
                  className="fb-wh-input-field"
                />
                <button
                  type="button"
                  className="fb-wh-copy-btn"
                  onClick={() => setShowToken(!showToken)}
                  title={showToken ? 'Hide token' : 'Show token'}
                >
                  {showToken ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button
                  type="button"
                  className="fb-wh-copy-btn"
                  onClick={() => copyToClipboard(webhookHealth?.verifyToken || '', 'token')}
                  title="Copy token"
                >
                  {copiedToken ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
