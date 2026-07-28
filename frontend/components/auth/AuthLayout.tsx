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
          {/* Header Logo */}
          <div className="auth-brand-header">
            <div className="auth-brand-logo-icon">K</div>
            <span className="auth-brand-title">
              LeadPilot <span className="auth-brand-title-accent">AI</span>
            </span>
          </div>

          {/* Hero Header Section */}
          <div className="auth-hero-section">
            <div className="badge-operating-system">
              <Zap size={13} />
              <span>Autonomous WhatsApp AI Sales Operating System</span>
            </div>

            <h1 className="auth-hero-title">
              AI that talks. Qualifies. <br />
              Nurtures. Converts.
            </h1>

            <p className="auth-hero-desc">
              LeadPilot AI automatically engages leads from multiple sources on WhatsApp, qualifies them using AI and hands over only sales-ready leads to your team.
            </p>
          </div>

          {/* Middle Side-by-Side Features & Robot Graphic */}
          <div className="auth-middle-showcase">
            <div className="auth-feature-list">
              <div className="auth-feature-item">
                <div className="auth-feature-icon">
                  <MessageSquare size={14} />
                </div>
                <div>
                  <h4 className="auth-feature-title">Multi-Channel Lead Capture</h4>
                  <p className="auth-feature-desc">
                    Facebook, Instagram, Google Ads, Website & Manual leads in one place.
                  </p>
                </div>
              </div>

              <div className="auth-feature-item">
                <div className="auth-feature-icon">
                  <Bot size={14} />
                </div>
                <div>
                  <h4 className="auth-feature-title">AI-Powered Conversations</h4>
                  <p className="auth-feature-desc">
                    AI agents engage, answer, qualify and nurture leads automatically.
                  </p>
                </div>
              </div>

              <div className="auth-feature-item">
                <div className="auth-feature-icon">
                  <Calendar size={14} />
                </div>
                <div>
                  <h4 className="auth-feature-title">Smart Scheduling</h4>
                  <p className="auth-feature-desc">
                    AI schedules site visits and meetings seamlessly on WhatsApp.
                  </p>
                </div>
              </div>

              <div className="auth-feature-item">
                <div className="auth-feature-icon">
                  <BarChart3 size={14} />
                </div>
                <div>
                  <h4 className="auth-feature-title">Sales-Ready Handovers</h4>
                  <p className="auth-feature-desc">
                    Only qualified leads are handed over to your sales team.
                  </p>
                </div>
              </div>
            </div>

            {/* AI Graphic Illustration */}
            <HeroGraphic />
          </div>

          {/* Bottom Security Footer */}
          <div className="auth-footer-security">
            <div className="auth-security-row">
              <ShieldCheck size={18} className="lead-source-icon-manual" />
              <div>
                <h5 className="auth-security-text">Enterprise Grade Security</h5>
                <p className="auth-security-subtext">
                  Your data is encrypted and protected with enterprise-grade security.
                </p>
              </div>
            </div>

            <div className="auth-footer-links">
              <span>© 2025 LeadPilot AI. All rights reserved.</span>
              <div className="auth-footer-nav">
                <a href="/privacy" className="auth-footer-link">Privacy Policy</a>
                <a href="/terms" className="auth-footer-link">Terms of Service</a>
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
