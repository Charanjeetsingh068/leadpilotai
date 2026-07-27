'use client';

import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import Image from 'next/image';

export const ApprovalsView: React.FC = () => {
  return (
    <PageContainer
      title="Human Approvals Queue"
      subtitle="Review and override high-value AI decisions before message dispatch."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ position: 'relative', width: '80px', height: '80px', flexShrink: 0 }}>
            <Image src="/images/approvals/empty-approvals.svg" alt="Approvals" fill style={{ objectFit: 'contain' }} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0, fontWeight: 700, color: '#0f172a' }}>Approval Queue Status</h3>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#64748b' }}>
              2 pending AI verification requests require manager review.
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
