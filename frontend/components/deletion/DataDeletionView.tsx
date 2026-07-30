'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Trash2,
  CheckCircle2,
  Clock,
  Mail,
  Globe,
  Building2,
  AlertTriangle,
  ArrowRight,
  Send,
  ShieldCheck,
  FileText,
  Key,
  Database,
  Layers,
  HelpCircle,
  Lock,
  UserCheck
} from 'lucide-react';

export const DataDeletionView: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    companyName: '',
    facebookAccount: '',
    reason: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<{
    confirmationCode: string;
    requestedAt: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.email.includes('@')) {
      setErrorMsg('Please enter a valid registered email address.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/privacy/data-deletion-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit data deletion request.');
      }

      setConfirmationResult({
        confirmationCode: data.confirmationCode,
        requestedAt: data.requestedAt
      });
      setFormData({ email: '', companyName: '', facebookAccount: '', reason: '' });
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while submitting your request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="deletion-page-wrapper">
      {/* Header */}
      <header className="deletion-site-header">
        <div className="deletion-header-container">
          <Link href="/" className="deletion-logo-link">
            <div className="deletion-logo-box">LP</div>
            <span className="deletion-logo-text">LeadPilot AI</span>
          </Link>
          <nav className="deletion-header-nav">
            <span className="deletion-header-badge">
              <ShieldAlert className="deletion-deleted-icon" size={14} /> Meta Platform Compliant
            </span>
            <Link href="/" className="deletion-header-link">Home</Link>
            <Link href="/privacy-policy" className="deletion-header-link">Privacy Policy</Link>
            <Link href="/terms-of-service" className="deletion-header-link">Terms of Service</Link>
            <a href="mailto:support@leadpilotai.com" className="deletion-header-link">Support</a>
          </nav>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="deletion-hero-section">
        <div className="deletion-hero-container">
          <div className="deletion-hero-pill-group">
            <span className="deletion-pill-item">
              <Trash2 size={16} /> Meta App Review Requirement
            </span>
            <span className="deletion-pill-item">
              <ShieldCheck size={16} /> Data Protection & Privacy Rights
            </span>
          </div>
          <h1 className="deletion-hero-title">Facebook Data Deletion Instructions</h1>
          <p className="deletion-hero-subtitle">
            LeadPilot AI respects your privacy. If you have connected your Facebook account with LeadPilot AI and wish to delete your personal data, you can request deletion at any time using the instructions below.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="deletion-main-container">
        {/* Section 1: In-App How To Request Data Deletion */}
        <section className="deletion-card">
          <div className="deletion-card-header">
            <div className="deletion-card-icon">
              <UserCheck size={20} />
            </div>
            <h2 className="deletion-card-title">How To Request Data Deletion (In-App Method)</h2>
          </div>
          <p className="deletion-p">
            If you have active account access to LeadPilot AI, you can disconnect Meta platform permissions and initiate automated data deletion directly from your settings dashboard:
          </p>

          <div className="deletion-steps-grid">
            <div className="deletion-step-card">
              <div className="deletion-step-badge">1</div>
              <div className="deletion-step-info">
                <div className="deletion-step-title">Open LeadPilot AI</div>
                <div className="deletion-step-desc">Access the official application platform at leadpilotai-rust.vercel.app.</div>
              </div>
            </div>

            <div className="deletion-step-card">
              <div className="deletion-step-badge">2</div>
              <div className="deletion-step-info">
                <div className="deletion-step-title">Login to Account</div>
                <div className="deletion-step-desc">Log into your registered user or workspace administrative account.</div>
              </div>
            </div>

            <div className="deletion-step-card">
              <div className="deletion-step-badge">3</div>
              <div className="deletion-step-info">
                <div className="deletion-step-title">Navigate to Settings</div>
                <div className="deletion-step-desc">Go to the Privacy &amp; Integrations management panel.</div>
                <div className="deletion-step-path">
                  Settings &rarr; Privacy &rarr; Delete Connected Facebook Data
                </div>
              </div>
            </div>

            <div className="deletion-step-card">
              <div className="deletion-step-badge">4</div>
              <div className="deletion-step-info">
                <div className="deletion-step-title">Click Disconnect</div>
                <div className="deletion-step-desc">Click the &quot;Delete Facebook Connection&quot; action button.</div>
              </div>
            </div>

            <div className="deletion-step-card">
              <div className="deletion-step-badge">5</div>
              <div className="deletion-step-info">
                <div className="deletion-step-title">Confirm Deletion</div>
                <div className="deletion-step-desc">Confirm your data purge request in the security prompt modal.</div>
              </div>
            </div>

            <div className="deletion-step-card">
              <div className="deletion-step-badge">6</div>
              <div className="deletion-step-info">
                <div className="deletion-step-title">Automatic Removal</div>
                <div className="deletion-step-desc">Your Facebook tokens, connected pages, permissions, and associated integration data will be permanently removed.</div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Alternative Interactive Request Form */}
        <section className="deletion-form-card">
          <div className="deletion-card-header">
            <div className="deletion-card-icon">
              <Mail size={20} />
            </div>
            <h2 className="deletion-card-title">Alternative Deletion Request</h2>
          </div>
          <p className="deletion-p">
            If you no longer have access to your LeadPilot AI account or wish to submit an offline deletion request, submit your details using the form below or email us directly at <a href="mailto:support@leadpilotai.com" className="terms-contact-link">support@leadpilotai.com</a> / <a href="mailto:entecmedia@gmail.com" className="terms-contact-link">entecmedia@gmail.com</a>.
          </p>

          <form onSubmit={handleSubmit} className="deletion-form">
            <div className="deletion-form-grid">
              <div className="deletion-form-group">
                <label className="deletion-form-label">Registered Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. admin@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="deletion-form-input"
                />
              </div>

              <div className="deletion-form-group">
                <label className="deletion-form-label">Company Name</label>
                <input
                  type="text"
                  placeholder="e.g. Skyline Realty Inc."
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="deletion-form-input"
                />
              </div>

              <div className="deletion-form-group">
                <label className="deletion-form-label">Facebook Account Name / Page ID</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe / Page ID 109283749"
                  value={formData.facebookAccount}
                  onChange={(e) => setFormData({ ...formData, facebookAccount: e.target.value })}
                  className="deletion-form-input"
                />
              </div>

              <div className="deletion-form-group">
                <label className="deletion-form-label">Reason for Request (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Disconnecting Facebook integration"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="deletion-form-input"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="deletion-retained-box" style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca', marginBottom: '1.25rem' }}>
                <AlertTriangle style={{ color: '#ef4444' }} size={20} />
                <div style={{ color: '#991b1b', fontSize: '0.875rem' }}>{errorMsg}</div>
              </div>
            )}

            <button type="submit" disabled={submitting} className="deletion-submit-btn">
              {submitting ? (
                <span>Processing Request...</span>
              ) : (
                <>
                  <Send size={16} /> Submit Data Deletion Request
                </>
              )}
            </button>
          </form>

          {confirmationResult && (
            <div className="deletion-success-box">
              <div className="deletion-success-header">
                <CheckCircle2 size={24} /> Data Deletion Request Submitted Successfully
              </div>
              <p className="deletion-p" style={{ margin: 0 }}>
                Your request has been logged in our system. Your Meta access tokens and connected integration records are scheduled for permanent erasure.
              </p>
              <div className="deletion-code-badge-wrapper">
                <span className="deletion-code-label">Confirmation Code:</span>
                <span className="deletion-code-val">{confirmationResult.confirmationCode}</span>
              </div>
              <div style={{ fontSize: '0.813rem', color: '#047857' }}>
                Requested At: {new Date(confirmationResult.requestedAt).toLocaleString()} | Tracking Status: PENDING (Scheduled completion within 30 days)
              </div>
            </div>
          )}
        </section>

        {/* Section 3: What Data Will Be Deleted */}
        <section className="deletion-card">
          <div className="deletion-card-header">
            <div className="deletion-card-icon">
              <Trash2 size={20} />
            </div>
            <h2 className="deletion-card-title">What Data Will Be Deleted</h2>
          </div>
          <p className="deletion-p">
            Upon processing your deletion request, LeadPilot AI permanently purges the following Facebook-connected tokens, credentials, permissions, and metadata from our servers:
          </p>

          <div className="deletion-items-grid">
            <div className="deletion-deleted-card">
              <Key className="deletion-deleted-icon" size={18} />
              <span className="deletion-deleted-text">Facebook Access Token</span>
            </div>
            <div className="deletion-deleted-card">
              <Lock className="deletion-deleted-icon" size={18} />
              <span className="deletion-deleted-text">Facebook Refresh Token</span>
            </div>
            <div className="deletion-deleted-card">
              <Building2 className="deletion-deleted-icon" size={18} />
              <span className="deletion-deleted-text">Connected Business Managers</span>
            </div>
            <div className="deletion-deleted-card">
              <Globe className="deletion-deleted-icon" size={18} />
              <span className="deletion-deleted-text">Connected Pages</span>
            </div>
            <div className="deletion-deleted-card">
              <FileText className="deletion-deleted-icon" size={18} />
              <span className="deletion-deleted-text">Lead Forms Mapping</span>
            </div>
            <div className="deletion-deleted-card">
              <ShieldCheck className="deletion-deleted-icon" size={18} />
              <span className="deletion-deleted-text">Facebook Permissions</span>
            </div>
            <div className="deletion-deleted-card">
              <Layers className="deletion-deleted-icon" size={18} />
              <span className="deletion-deleted-text">Webhook Subscriptions</span>
            </div>
            <div className="deletion-deleted-card">
              <Database className="deletion-deleted-icon" size={18} />
              <span className="deletion-deleted-text">Integration Logs</span>
            </div>
            <div className="deletion-deleted-card">
              <UserCheck className="deletion-deleted-icon" size={18} />
              <span className="deletion-deleted-text">Stored Facebook Profile Information</span>
            </div>
          </div>
        </section>

        {/* Section 4: What Will NOT Be Deleted */}
        <section className="deletion-card">
          <div className="deletion-card-header">
            <div className="deletion-card-icon">
              <AlertTriangle size={20} />
            </div>
            <h2 className="deletion-card-title">What Will NOT Be Deleted</h2>
          </div>
          <div className="deletion-retained-box">
            <AlertTriangle className="deletion-retained-icon" size={22} />
            <div>
              <div className="deletion-retained-title">CRM Lead Record Legal Retention Policy</div>
              <div className="deletion-retained-text">
                Lead records already created inside your CRM before the deletion request may be retained if required for legal, contractual, or regulatory compliance obligations. <strong>These historical lead records will no longer remain connected to Facebook and all Meta OAuth tokens will be completely invalidated.</strong>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Deletion Timeline */}
        <section className="deletion-card">
          <div className="deletion-card-header">
            <div className="deletion-card-icon">
              <Clock size={20} />
            </div>
            <h2 className="deletion-card-title">Deletion Timeline</h2>
          </div>
          <div className="deletion-timeline-box">
            <Clock className="deletion-timeline-icon" size={24} />
            <div className="deletion-timeline-text">
              All validated data deletion requests are processed and completed within <strong>30 days</strong> of submission. You will receive an automated confirmation email once the deletion process is complete.
            </div>
          </div>
        </section>

        {/* Section 6: Contact Information */}
        <section className="deletion-card">
          <div className="deletion-card-header">
            <div className="deletion-card-icon">
              <Mail size={20} />
            </div>
            <h2 className="deletion-card-title">Contact Information</h2>
          </div>
          <p className="deletion-p">
            For questions or support regarding Facebook data deletion, reach out to our privacy compliance team:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginTop: '1rem' }}>
            <div className="terms-contact-card">
              <div className="terms-contact-icon">
                <Mail size={20} />
              </div>
              <div className="terms-contact-info">
                <div className="terms-contact-label">Support Email</div>
                <a href="mailto:support@leadpilotai.com" className="terms-contact-val terms-contact-link">
                  support@leadpilotai.com
                </a>
              </div>
            </div>

            <div className="terms-contact-card">
              <div className="terms-contact-icon">
                <Mail size={20} />
              </div>
              <div className="terms-contact-info">
                <div className="terms-contact-label">Alternative Email</div>
                <a href="mailto:entecmedia@gmail.com" className="terms-contact-val terms-contact-link">
                  entecmedia@gmail.com
                </a>
              </div>
            </div>

            <div className="terms-contact-card">
              <div className="terms-contact-icon">
                <Globe size={20} />
              </div>
              <div className="terms-contact-info">
                <div className="terms-contact-label">Official Website</div>
                <a href="https://leadpilotai-rust.vercel.app" target="_blank" rel="noopener noreferrer" className="terms-contact-val terms-contact-link">
                  leadpilotai-rust.vercel.app
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="deletion-site-footer">
        <div className="deletion-footer-container">
          <div className="deletion-footer-top">
            <div className="deletion-footer-brand">
              <Link href="/" className="deletion-footer-logo">
                <div className="deletion-logo-box">LP</div>
                <span>LeadPilot AI</span>
              </Link>
              <p className="deletion-footer-desc">
                AI-Powered Real Estate CRM, Lead Qualification & Multi-Channel Automation Engine for Enterprise Sales Teams.
              </p>
            </div>

            <div className="deletion-footer-nav">
              <div className="deletion-footer-col">
                <div className="deletion-footer-heading">Legal & Privacy</div>
                <div className="deletion-footer-links">
                  <Link href="/privacy-policy" className="deletion-footer-link">Privacy Policy</Link>
                  <Link href="/terms-of-service" className="deletion-footer-link">Terms of Service</Link>
                  <Link href="/data-deletion" className="deletion-footer-link">Data Deletion</Link>
                  <a href="mailto:support@leadpilotai.com" className="deletion-footer-link">Security Overview</a>
                </div>
              </div>

              <div className="deletion-footer-col">
                <div className="deletion-footer-heading">Platform</div>
                <div className="deletion-footer-links">
                  <Link href="/" className="deletion-footer-link">Dashboard</Link>
                  <a href="mailto:support@leadpilotai.com" className="deletion-footer-link">Contact Sales</a>
                  <a href="mailto:support@leadpilotai.com" className="deletion-footer-link">Support</a>
                </div>
              </div>
            </div>
          </div>

          <div className="deletion-footer-bottom">
            <div>&copy; {new Date().getFullYear()} LeadPilot AI Inc. All rights reserved.</div>
            <div>Meta Developer Partner &amp; Google API Compliant</div>
          </div>
        </div>
      </footer>
    </div>
  );
};
