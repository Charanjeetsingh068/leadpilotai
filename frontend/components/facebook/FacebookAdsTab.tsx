'use client';

import React from 'react';

export interface AdData {
  id: string;
  adId: string;
  name: string;
  imageUrl?: string;
  spend: number;
  clicks: number;
  conversions: number;
  roas: number;
  status: string;
}

interface AdsTabProps {
  ads: AdData[];
}

export const FacebookAdsTab: React.FC<AdsTabProps> = ({ ads }) => {
  return (
    <div className="fb-lead-inbox-card">
      <div className="fb-lead-inbox-header-row">
        <h3 className="fb-lead-inbox-title">Meta Ads Performance</h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {ads.map((ad) => (
          <div
            key={ad.id || ad.adId}
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: '0.75rem',
              overflow: 'hidden',
              backgroundColor: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ height: '160px', width: '100%', overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
              <img
                src={ad.imageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&auto=format&fit=crop&q=80'}
                alt={ad.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a' }}>{ad.name}</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8125rem' }}>
                <div>
                  <span style={{ color: '#64748b', display: 'block' }}>Spend</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>${ad.spend.toFixed(2)}</span>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block' }}>Clicks</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{ad.clicks}</span>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block' }}>Conversions</span>
                  <span style={{ fontWeight: 600, color: '#10b981' }}>{ad.conversions}</span>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block' }}>ROAS</span>
                  <span style={{ fontWeight: 600, color: '#2563eb' }}>{ad.roas}x</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
