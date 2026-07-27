import React from 'react';
import { ShieldCheck, MessageSquare, Bot, Calendar, BarChart3, Zap } from 'lucide-react';
import { HeroGraphic } from './HeroGraphic';

export interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="auth-page-bg">
      <div className="auth-container">
        {/* Left Column - Branding & Product Showcase */}
        <div className="auth-left-branding">
          {/* 1. Header Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '1.25rem',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
                flexShrink: 0,
              }}
            >
              K
            </div>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em' }}>
              LeadPilot <span style={{ color: '#2563eb' }}>AI</span>
            </span>
          </div>

          {/* 2. Hero Header Section */}
          <div style={{ marginBottom: '1rem' }}>
            <div className="badge-operating-system">
              <Zap size={13} />
              <span>Autonomous WhatsApp AI Sales Operating System</span>
            </div>

            <h1
              style={{
                fontSize: '1.85rem',
                fontWeight: 800,
                lineHeight: 1.25,
                color: '#0f172a',
                letterSpacing: '-0.03em',
                margin: '0.6rem 0 0.5rem 0',
              }}
            >
              AI that talks. Qualifies. <br />
              Nurtures. Converts.
            </h1>

            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, maxWidth: '480px', margin: 0 }}>
              LeadPilot AI automatically engages leads from multiple sources on WhatsApp, qualifies them using AI and hands over only sales-ready leads to your team.
            </p>
          </div>

          {/* 3. Middle Side-by-Side Features & Robot Graphic */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.1fr 0.9fr',
              gap: '1.25rem',
              alignItems: 'center',
              margin: '0.5rem 0 1.25rem 0',
            }}
          >
            {/* Features List */}
            <div className="auth-feature-list">
              <div className="auth-feature-item">
                <div className="auth-feature-icon">
                  <MessageSquare size={14} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.825rem', fontWeight: 700, color: '#1e293b' }}>
                    Multi-Channel Lead Capture
                  </h4>
                  <p style={{ margin: '0.1rem 0 0 0', fontSize: '0.725rem', color: '#64748b', lineHeight: 1.35 }}>
                    Facebook, Instagram, Google Ads, Website & Manual leads in one place.
                  </p>
                </div>
              </div>

              <div className="auth-feature-item">
                <div className="auth-feature-icon">
                  <Bot size={14} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.825rem', fontWeight: 700, color: '#1e293b' }}>
                    AI-Powered Conversations
                  </h4>
                  <p style={{ margin: '0.1rem 0 0 0', fontSize: '0.725rem', color: '#64748b', lineHeight: 1.35 }}>
                    AI agents engage, answer, qualify and nurture leads automatically.
                  </p>
                </div>
              </div>

              <div className="auth-feature-item">
                <div className="auth-feature-icon">
                  <Calendar size={14} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.825rem', fontWeight: 700, color: '#1e293b' }}>
                    Smart Scheduling
                  </h4>
                  <p style={{ margin: '0.1rem 0 0 0', fontSize: '0.725rem', color: '#64748b', lineHeight: 1.35 }}>
                    AI schedules site visits and meetings seamlessly on WhatsApp.
                  </p>
                </div>
              </div>

              <div className="auth-feature-item">
                <div className="auth-feature-icon">
                  <BarChart3 size={14} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.825rem', fontWeight: 700, color: '#1e293b' }}>
                    Sales-Ready Handovers
                  </h4>
                  <p style={{ margin: '0.1rem 0 0 0', fontSize: '0.725rem', color: '#64748b', lineHeight: 1.35 }}>
                    Only qualified leads are handed over to your sales team.
                  </p>
                </div>
              </div>
            </div>

            {/* AI Graphic Illustration */}
            <HeroGraphic />
          </div>

          {/* 4. Bottom Security Footer (Pushed to bottom naturally) */}
          <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.6rem' }}>
              <ShieldCheck size={18} style={{ color: '#64748b' }} />
              <div>
                <h5 style={{ margin: 0, fontSize: '0.775rem', fontWeight: 700, color: '#1e293b' }}>
                  Enterprise Grade Security
                </h5>
                <p style={{ margin: '0.05rem 0 0 0', fontSize: '0.725rem', color: '#94a3b8' }}>
                  Your data is encrypted and protected with enterprise-grade security.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.725rem', color: '#94a3b8' }}>
              <span>© 2025 LeadPilot AI. All rights reserved.</span>
              <div style={{ display: 'flex', gap: '0.85rem' }}>
                <a href="/privacy" style={{ color: '#64748b' }}>Privacy Policy</a>
                <a href="/terms" style={{ color: '#64748b' }}>Terms of Service</a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Form Card */}
        <div className="auth-right-form">
          {children}
        </div>
      </div>
    </div>
  );
};
