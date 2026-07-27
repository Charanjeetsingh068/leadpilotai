'use client';

import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Settings, Shield, User, Bell, Sliders } from 'lucide-react';
import Image from 'next/image';

export const SettingsView: React.FC = () => {
  return (
    <PageContainer
      title="Settings & Workspace Preferences"
      subtitle="Manage your organization profile, team members, API keys, and notification rules."
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ position: 'relative', width: '60px', height: '60px', flexShrink: 0 }}>
            <Image src="/images/settings/profile-avatar.svg" alt="Settings" fill style={{ objectFit: 'contain' }} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontWeight: 700, color: '#0f172a' }}>Organization Profile</h4>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>Manage branding and workspace name</p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
