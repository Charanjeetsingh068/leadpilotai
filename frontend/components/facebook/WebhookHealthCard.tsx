import React, { useState } from 'react';
import { Copy, Eye, EyeOff, Check, RotateCw } from 'lucide-react';
import { WebhookHealthData } from '@/types/facebook.types';

interface Props {
  webhookHealth?: WebhookHealthData;
  onRetryWebhooks?: () => void;
  isRetrying?: boolean;
}

export const WebhookHealthCard: React.FC<Props> = ({
  webhookHealth = {
    id: 'w1',
    webhookUrl: 'https://app.leadpilot.ai/webhooks/facebook',
    verifyToken: 'leadpilot_fb_secret_token_98765',
    status: 'Active',
    lastEventTime: '10:30:15 AM May 20, 2025',
    successRate7d: 99.2,
    failedEvents7d: 12,
    retryQueueCount: 3,
  },
  onRetryWebhooks,
  isRetrying,
}) => {
  const [showToken, setShowToken] = useState<boolean>(false);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const [copiedToken, setCopiedToken] = useState<boolean>(false);

  const copyToClipboard = (text: string, type: 'url' | 'token') => {
    navigator.clipboard.writeText(text);
    if (type === 'url') {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } else {
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  return (
    <div className="fb-card fb-webhook-card">
      <div className="fb-card-header-row">
        <h3 className="fb-card-title">7. Webhook Health</h3>
        <span className="fb-live-badge">🟢 Active</span>
      </div>

      <div className="fb-webhook-metrics-grid">
        <div className="fb-wh-metric">
          <span className="fb-wh-label">Status</span>
          <span className="fb-wh-value-status text-success font-semibold">
            {webhookHealth.status}
          </span>
        </div>

        <div className="fb-wh-metric">
          <span className="fb-wh-label">Last Event</span>
          <span className="fb-wh-value-time">{webhookHealth.lastEventTime || '10:30:15 AM'}</span>
        </div>

        <div className="fb-wh-metric">
          <span className="fb-wh-label">Success Rate (7D)</span>
          <span className="fb-wh-value">{webhookHealth.successRate7d}%</span>
        </div>

        <div className="fb-wh-metric">
          <span className="fb-wh-label">Failed Events (7D)</span>
          <span className="fb-wh-value">{webhookHealth.failedEvents7d}</span>
        </div>

        <div className="fb-wh-metric">
          <span className="fb-wh-label">Retry Queue</span>
          <span className="fb-wh-value">{webhookHealth.retryQueueCount}</span>
        </div>
      </div>

      <div className="fb-webhook-inputs-row">
        <div className="fb-wh-input-group">
          <label className="fb-wh-input-label">Webhook URL</label>
          <div className="fb-wh-input-box">
            <input
              type="text"
              readOnly
              value={webhookHealth.webhookUrl}
              className="fb-wh-input-field"
            />
            <button
              type="button"
              className="fb-wh-copy-btn"
              onClick={() => copyToClipboard(webhookHealth.webhookUrl, 'url')}
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
              value={webhookHealth.verifyToken}
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
              onClick={() => copyToClipboard(webhookHealth.verifyToken, 'token')}
              title="Copy token"
            >
              {copiedToken ? <Check size={14} className="text-success" /> : <Copy size={14} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
