import React from 'react';
import { MessageSquare, Share2, Camera, Globe, Bot } from 'lucide-react';

export const HeroGraphic: React.FC = () => {
  return (
    <div className="hero-graphic-container" style={{ margin: 0 }}>
      {/* Floating Channel Badges & AI Robot Circle */}
      <div className="hero-floating-box">
        {/* Central Robot Avatar */}
        <div className="hero-robot-circle">
          <Bot size={28} style={{ color: '#2563eb' }} />
        </div>

        {/* Floating WhatsApp Icon */}
        <div className="hero-badge-whatsapp" title="WhatsApp Leads">
          <MessageSquare size={12} />
        </div>

        {/* Floating Facebook Icon */}
        <div className="hero-badge-facebook" title="Facebook Ads">
          <Share2 size={10} />
        </div>

        {/* Floating Instagram Icon */}
        <div className="hero-badge-instagram" title="Instagram Lead Forms">
          <Camera size={10} />
        </div>

        {/* Floating Google Icon */}
        <div className="hero-badge-google" title="Google Ads Lead Forms">
          <Globe size={10} style={{ color: '#ea4335' }} />
        </div>
      </div>

      {/* Mini CRM Dashboard Card Preview (Exact Screenshot Match) */}
      <div className="hero-mini-card">
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '0.5rem', alignItems: 'center' }}>
          {/* Left Column: Lead Status Rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {/* Row 1: Qualified Badge */}
            <div className="hero-card-row">
              <div className="hero-card-meta">
                <div className="hero-avatar-placeholder" />
                <div className="hero-bar-placeholder-lg" />
              </div>
              <span className="badge-qualified">Qualified</span>
            </div>

            {/* Row 2: In Progress Badge */}
            <div className="hero-card-row">
              <div className="hero-card-meta">
                <div className="hero-avatar-placeholder" />
                <div className="hero-bar-placeholder-md" />
              </div>
              <span className="badge-in-progress">In Progress</span>
            </div>

            {/* Row 3: Site Visit Badge */}
            <div className="hero-card-row">
              <div className="hero-card-meta">
                <div className="hero-avatar-placeholder" />
                <div className="hero-bar-placeholder-xl" />
              </div>
              <span className="badge-site-visit">Site Visit</span>
            </div>
          </div>

          {/* Right Column: Trending Upwards Line Chart */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="70" height="35" viewBox="0 0 100 40" fill="none">
              <path
                d="M0 32 C 25 15, 45 35, 65 18 C 80 8, 90 18, 100 4"
                stroke="#2563eb"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>
        </div>

        {/* Bottom Graphic Row: Bar Chart & 3x3 Skeleton Grid */}
        <div className="hero-card-footer">
          {/* Bar Chart Bars */}
          <div className="hero-bars-group">
            <div className="hero-bar-1" />
            <div className="hero-bar-2" />
            <div className="hero-bar-3" />
          </div>

          {/* 3x3 Skeleton Grid Lines */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', width: '50%' }}>
            <div style={{ display: 'flex', gap: '3px' }}>
              <div style={{ flex: 1, height: '3px', backgroundColor: '#e2e8f0', borderRadius: '2px' }} />
              <div style={{ flex: 1, height: '3px', backgroundColor: '#e2e8f0', borderRadius: '2px' }} />
              <div style={{ flex: 1, height: '3px', backgroundColor: '#e2e8f0', borderRadius: '2px' }} />
            </div>
            <div style={{ display: 'flex', gap: '3px' }}>
              <div style={{ flex: 1, height: '3px', backgroundColor: '#e2e8f0', borderRadius: '2px' }} />
              <div style={{ flex: 1, height: '3px', backgroundColor: '#e2e8f0', borderRadius: '2px' }} />
              <div style={{ flex: 1, height: '3px', backgroundColor: '#e2e8f0', borderRadius: '2px' }} />
            </div>
            <div style={{ display: 'flex', gap: '3px' }}>
              <div style={{ flex: 1, height: '3px', backgroundColor: '#e2e8f0', borderRadius: '2px' }} />
              <div style={{ flex: 1, height: '3px', backgroundColor: '#e2e8f0', borderRadius: '2px' }} />
              <div style={{ flex: 1, height: '3px', backgroundColor: '#e2e8f0', borderRadius: '2px' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
