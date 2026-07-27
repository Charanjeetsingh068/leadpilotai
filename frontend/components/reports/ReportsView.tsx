'use client';

import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { BarChart3, TrendingUp, Download } from 'lucide-react';
import Image from 'next/image';

export const ReportsView: React.FC = () => {
  return (
    <PageContainer
      title="Analytics & Reports"
      subtitle="Comprehensive performance metrics for lead conversion and AI engagement."
      action={
        <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Download size={16} />
          <span>Export Analytics</span>
        </button>
      }
    >
      <div className="card" style={{ padding: '2rem', textAlign: 'center', marginTop: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <div style={{ position: 'relative', width: '120px', height: '120px' }}>
          <Image src="/images/reports/reports-illustration.svg" alt="Reports" fill style={{ objectFit: 'contain' }} />
        </div>
        <h3 style={{ margin: 0, fontWeight: 700, color: '#0f172a' }}>Performance Analytics Engine</h3>
        <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>
          Track qualification conversion rates, campaign ROI, and response SLAs across all channels.
        </p>
      </div>
    </PageContainer>
  );
};
