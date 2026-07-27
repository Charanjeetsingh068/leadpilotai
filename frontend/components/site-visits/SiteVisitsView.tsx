'use client';

import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Calendar, MapPin, Clock, Plus } from 'lucide-react';
import Image from 'next/image';

export const SiteVisitsView: React.FC = () => {
  return (
    <PageContainer
      title="Site Visits Calendar"
      subtitle="Track and manage property site visits scheduled by AI or sales agents."
      action={
        <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={16} />
          <span>Schedule Visit</span>
        </button>
      }
    >
      <div className="card" style={{ padding: '2rem', textAlign: 'center', marginTop: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <div style={{ position: 'relative', width: '120px', height: '120px' }}>
          <Image src="/images/site-visits/calendar-illustration.svg" alt="Site Visits" fill style={{ objectFit: 'contain' }} />
        </div>
        <h3 style={{ margin: 0, fontWeight: 700, color: '#0f172a' }}>Site Visit Schedule</h3>
        <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>
          7 site visits scheduled for this week.
        </p>
      </div>
    </PageContainer>
  );
};
