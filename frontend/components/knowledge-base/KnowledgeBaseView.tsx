'use client';

import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Upload } from 'lucide-react';
import Image from 'next/image';

export const KnowledgeBaseView: React.FC = () => {
  return (
    <PageContainer
      title="Knowledge Base"
      subtitle="Upload brochures, pricing plans, and FAQs to train your LeadPilot AI engine."
      action={
        <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Upload size={16} />
          <span>Upload Document</span>
        </button>
      }
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ position: 'relative', width: '120px', height: '120px' }}>
            <Image src="/images/knowledge-base/knowledge-banner.svg" alt="Knowledge Base" fill style={{ objectFit: 'contain' }} />
          </div>
          <h3 style={{ margin: 0, fontWeight: 700, color: '#0f172a' }}>Active Knowledge Context</h3>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>
            23 documents trained. AI is ready to answer customer queries on pricing, location, and floor plans.
          </p>
        </div>
      </div>
    </PageContainer>
  );
};
