import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorBannerProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  title = 'Failed to load data',
  message,
  onRetry,
}) => {
  return (
    <div
      style={{
        padding: '1.25rem',
        borderRadius: 'var(--radius-lg)',
        backgroundColor: 'var(--color-danger-bg)',
        border: '1px solid var(--color-danger-border)',
        color: 'var(--color-danger-text)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: '1rem 0',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <AlertTriangle size={20} />
        <div>
          <h4 style={{ margin: 0, color: 'var(--color-danger-text)' }}>{title}</h4>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: 'var(--color-danger-text)' }}>
            {message}
          </p>
        </div>
      </div>

      {onRetry ? (
        <Button variant="outline" size="sm" onClick={onRetry} leftIcon={<RotateCcw size={14} />}>
          Retry
        </Button>
      ) : null}
    </div>
  );
};
