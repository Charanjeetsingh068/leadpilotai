import React from 'react';
import { MessageSquare, Share2, Camera, Globe, Bot } from 'lucide-react';

export const HeroGraphic: React.FC = () => {
  return (
    <div className="hero-graphic-container">
      {/* Floating Channel Badges & AI Robot Circle */}
      <div className="hero-floating-box">
        {/* Central Robot Avatar */}
        <div className="hero-robot-circle">
          <Bot size={28} className="lead-source-icon-facebook" />
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
          <Globe size={10} className="lead-source-icon-google" />
        </div>
      </div>

      {/* Mini CRM Dashboard Card Preview */}
      <div className="hero-mini-card">
        <div className="hero-mini-card-grid">
          {/* Left Column: Lead Status Rows */}
          <div className="hero-card-column-left">
            <div className="hero-card-row">
              <div className="hero-card-meta">
                <div className="hero-avatar-placeholder" />
                <div className="hero-bar-placeholder-lg" />
              </div>
              <span className="badge-qualified">Qualified</span>
            </div>

            <div className="hero-card-row">
              <div className="hero-card-meta">
                <div className="hero-avatar-placeholder" />
                <div className="hero-bar-placeholder-md" />
              </div>
              <span className="badge-in-progress">In Progress</span>
            </div>

            <div className="hero-card-row">
              <div className="hero-card-meta">
                <div className="hero-avatar-placeholder" />
                <div className="hero-bar-placeholder-xl" />
              </div>
              <span className="badge-site-visit">Site Visit</span>
            </div>
          </div>

          {/* Right Column: Trending Upwards Line Chart */}
          <div className="hero-card-column-right">
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
          <div className="hero-bars-group">
            <div className="hero-bar-1" />
            <div className="hero-bar-2" />
            <div className="hero-bar-3" />
          </div>

          <div className="hero-skeleton-grid">
            <div className="hero-skeleton-row">
              <div className="hero-skeleton-cell" />
              <div className="hero-skeleton-cell" />
              <div className="hero-skeleton-cell" />
            </div>
            <div className="hero-skeleton-row">
              <div className="hero-skeleton-cell" />
              <div className="hero-skeleton-cell" />
              <div className="hero-skeleton-cell" />
            </div>
            <div className="hero-skeleton-row">
              <div className="hero-skeleton-cell" />
              <div className="hero-skeleton-cell" />
              <div className="hero-skeleton-cell" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
