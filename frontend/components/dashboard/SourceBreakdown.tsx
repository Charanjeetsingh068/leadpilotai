import React from 'react';
import { Card } from '@/components/ui/Card';
import { SourceDistribution } from '@/types/dashboard.types';

export interface SourceBreakdownProps {
  sources: SourceDistribution[];
}

const SOURCE_LABELS: Record<string, string> = {
  FACEBOOK_ADS: 'Facebook Lead Ads',
  INSTAGRAM_ADS: 'Instagram Lead Ads',
  GOOGLE_ADS: 'Google Ads Lead Forms',
  WEBSITE_FORM: 'Website Contact Forms',
  MANUAL_ENTRY: 'Manual Entry',
};

const SOURCE_COLORS: Record<string, string> = {
  FACEBOOK_ADS: '#1877f2',
  INSTAGRAM_ADS: '#e1306c',
  GOOGLE_ADS: '#ea4335',
  WEBSITE_FORM: '#10b981',
  MANUAL_ENTRY: '#64748b',
};

export const SourceBreakdown: React.FC<SourceBreakdownProps> = ({ sources }) => {
  return (
    <Card title="Lead Acquisition Channels" subtitle="Ingestion breakdown across all integrated channels">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
        {sources.map((item) => {
          const label = SOURCE_LABELS[item.source] || item.source;
          const color = SOURCE_COLORS[item.source] || 'var(--color-primary-600)';

          return (
            <div key={item.source}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                <span style={{ fontWeight: 500 }}>{label}</span>
                <span className="text-muted">{item.count} leads ({item.percentage}%)</span>
              </div>
              <div style={{ height: '8px', width: '100%', backgroundColor: 'var(--color-neutral-100)', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${item.percentage}%`,
                    backgroundColor: color,
                    borderRadius: '4px',
                    transition: 'width 300ms ease',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
