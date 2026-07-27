import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

export const PendingApprovalsWidget: React.FC = () => {
  return (
    <Card className="pending-approvals-widget">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-warning-bg)',
              color: 'var(--color-warning-text)',
            }}
          >
            <AlertCircle size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h4 style={{ margin: 0 }}>Human Approvals Required</h4>
              <Badge variant="warning" label="2 Pending" />
            </div>
            <p className="text-muted" style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>
              AI requested human verification for site visit slot confirmation and pricing overrides.
            </p>
          </div>
        </div>

        <Link href="/approvals" className="btn btn-primary btn-sm">
          Review Approval Queue
        </Link>
      </div>
    </Card>
  );
};
