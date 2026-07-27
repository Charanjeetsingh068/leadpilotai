'use client';

import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import Image from 'next/image';

export interface LeadDetailViewProps {
  leadId: string;
}

export const LeadDetailView: React.FC<LeadDetailViewProps> = ({ leadId }) => {
  return (
    <PageContainer
      title={`Lead Profile: #${leadId}`}
      subtitle="Complete lead timeline, qualification history, and AI conversation context."
    >
      <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
        <div style={{ position: 'relative', width: '60px', height: '60px', flexShrink: 0 }}>
          <Image src="/images/lead/lead-avatar.svg" alt="Lead Avatar" fill style={{ objectFit: 'contain' }} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontWeight: 700, color: '#0f172a' }}>Lead Details Overview</h3>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.875rem', color: '#64748b' }}>
            Viewing lead ID: {leadId}
          </p>
        </div>
      </div>
    </PageContainer>
  );
};
