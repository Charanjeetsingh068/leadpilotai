import React from 'react';
import { Card } from '@/components/ui/Card';

export interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon?: React.ReactNode;
  subtitle?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon,
  subtitle,
}) => {
  return (
    <Card className="metric-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span className="text-muted" style={{ fontSize: '0.875rem', fontWeight: 500 }}>
            {title}
          </span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0.5rem 0' }}>{value}</h2>
        </div>
        {icon ? <div className="metric-icon-box">{icon}</div> : null}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
        {change ? (
          <span
            className={`badge ${isPositive ? 'badge-success' : 'badge-danger'}`}
            style={{ fontSize: '11px' }}
          >
            {isPositive ? `+${change}` : change}
          </span>
        ) : null}
        {subtitle ? <span className="text-subtle" style={{ fontSize: '0.75rem' }}>{subtitle}</span> : null}
      </div>
    </Card>
  );
};
