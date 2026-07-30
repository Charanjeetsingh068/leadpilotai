'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  FileText,
  ChevronRight,
  ExternalLink,
  Database,
  Key,
  Users,
  CheckCircle2,
  Share2,
  Cookie,
  Mail,
  Globe,
  Building2,
  Sparkles,
  Layers,
  AlertTriangle,
  ArrowRight,
  Shield,
  Activity,
  Cpu,
  Server
} from 'lucide-react';

interface TOCItem {
  id: string;
  number: string;
  title: string;
}

const TOC_ITEMS: TOCItem[] = [
  { id: 'section-1', number: '01', title: 'Introduction' },
  { id: 'section-2', number: '02', title: 'Information We Collect' },
  { id: 'section-3', number: '03', title: 'Facebook & Meta Permissions' },
  { id: 'section-4', number: '04', title: 'How We Use Your Information' },
  { id: 'section-5', number: '05', title: 'Third Party Services' },
  { id: 'section-6', number: '06', title: 'Data Storage & Encryption' },
  { id: 'section-7', number: '07', title: 'Data Security & Isolation' },
  { id: 'section-8', number: '08', title: 'Cookies & Tracking' },
  { id: 'section-9', number: '09', title: 'User Rights & Control' },
  { id: 'section-10', number: '10', title: 'Facebook Data Deletion' },
  { id: 'section-11', number: '11', title: 'Children\'s Privacy' },
  { id: 'section-12', number: '12', title: 'Policy Updates' },
  { id: 'section-13', number: '13', title: 'Contact Information' },
];

export const PrivacyPolicyView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('section-1');
  const [lastUpdatedDate, setLastUpdatedDate] = useState<string>('');
  const [effectiveDate, setEffectiveDate] = useState<string>('');
  const [tocOpenMobile, setTocOpenMobile] = useState<boolean>(false);

  useEffect(() => {
    // Dynamic formatting for dates
    const now = new Date();
    const formattedLastUpdated = now.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    setLastUpdatedDate(formattedLastUpdated);
    setEffectiveDate('January 1, 2026');

    // IntersectionObserver for TOC highlight
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    TOC_ITEMS.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setActiveSection(id);
    setTocOpenMobile(false); // Close TOC accordion on mobile after selection
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="privacy-page-wrapper">
      {/* Header */}
      <header className="privacy-site-header">
        <div className="privacy-header-container">
          <Link href="/" className="privacy-logo-link">
            <div className="privacy-logo-box">LP</div>
            <span className="privacy-logo-text">LeadPilot AI</span>
          </Link>
          <nav className="privacy-header-nav">
            <span className="privacy-header-badge">
              <ShieldCheck className="privacy-feature-icon" /> Meta Verified
            </span>
            <Link href="/" className="privacy-header-link">Home</Link>
            <Link href="/data-deletion" className="privacy-header-link">Data Deletion</Link>
            <a href="mailto:entecmedia@gmail.com" className="privacy-header-link">Legal Support</a>
          </nav>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="privacy-hero-section">
        <div className="privacy-hero-container">
          <div className="privacy-hero-pill-group">
            <span className="privacy-pill-item">
              <Shield className="privacy-feature-icon" /> Enterprise Privacy Policy
            </span>
            <span className="privacy-pill-item">
              <CheckCircle2 className="privacy-feature-icon" /> Meta & Google Audit Ready
            </span>
          </div>
          <h1 className="privacy-hero-title">LeadPilot AI Privacy Policy</h1>
          <p className="privacy-hero-subtitle">
            Transparency, rigorous data protection, and enterprise security for our AI-powered lead qualification and multi-channel CRM automation platform.
          </p>
          <div className="privacy-dates-bar">
            <div className="privacy-date-item">
              <span>Last Updated:</span>
              <strong>{lastUpdatedDate || 'July 30, 2026'}</strong>
            </div>
            <div className="privacy-date-divider" />
            <div className="privacy-date-item">
              <span>Effective Date:</span>
              <strong>{effectiveDate || 'January 1, 2026'}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="privacy-main-container">
        <div className="privacy-layout-grid">
          {/* Table of Contents Sidebar / Collapsible Accordion on Mobile */}
          <aside className="privacy-toc-sidebar">
            <div
              className="privacy-toc-header-toggle"
              onClick={() => setTocOpenMobile(!tocOpenMobile)}
            >
              <div className="privacy-toc-title">
                <FileText className="privacy-feature-icon" size={18} />
                <span>Table of Contents ({TOC_ITEMS.length})</span>
              </div>
              <ChevronRight
                className={`privacy-toc-chevron ${tocOpenMobile ? 'open' : ''}`}
                size={18}
              />
            </div>
            <nav className={`privacy-toc-nav ${tocOpenMobile ? 'mobile-expanded' : ''}`}>
              {TOC_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => scrollToSection(e, item.id)}
                  className={`privacy-toc-link ${activeSection === item.id ? 'active' : ''}`}
                >
                  <span className="privacy-toc-num">{item.number}</span>
                  <span>{item.title}</span>
                </a>
              ))}
            </nav>
          </aside>

          {/* Document Content Body */}
          <div className="privacy-content-body">
            {/* 1. Introduction */}
            <section id="section-1" className="privacy-section-card">
              <div className="privacy-section-header">
                <div className="privacy-section-icon">
                  <Sparkles size={20} />
                </div>
                <h2 className="privacy-section-title">1. Introduction</h2>
              </div>
              <p className="privacy-p">
                Welcome to <strong>LeadPilot AI</strong> (&quot;Company&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). LeadPilot AI operates a state-of-the-art enterprise Software-as-a-Service (SaaS) platform designed for real estate agencies, sales organizations, and enterprise businesses. Our platform delivers automated lead capture, artificial intelligence (AI) qualification, automated scheduling, and multi-channel CRM integration.
              </p>
              <p className="privacy-p">
                This Privacy Policy outlines how LeadPilot AI collects, uses, processes, stores, and protects personal and business information when you use our website at <a href="https://leadpilotai-rust.vercel.app" target="_blank" rel="noopener noreferrer" className="privacy-contact-link">https://leadpilotai-rust.vercel.app</a>, our enterprise application, or integrate your accounts with third-party platforms including <strong>Meta (Facebook & Instagram)</strong>, <strong>WhatsApp Business API</strong>, <strong>Google Services (Google Ads & OAuth)</strong>, and connected CRM systems.
              </p>
              <p className="privacy-p">
                By accessing or using LeadPilot AI, connecting your Meta Business accounts, or utilizing our automated lead qualification tools, you acknowledge that you have read, understood, and agreed to the practices described in this Privacy Policy.
              </p>
              <div className="privacy-callout-box">
                <ShieldCheck className="privacy-callout-icon" size={24} />
                <div className="privacy-callout-content">
                  <div className="privacy-callout-title">Developer & Platform Compliance Guaranteed</div>
                  <div className="privacy-callout-text">
                    This Privacy Policy is crafted to strictly adhere to Meta Developer Platform Terms, Facebook Lead Ads Data Processing Policies, Google API Services User Data Policy, and global data privacy standards (GDPR, CCPA/CPRA).
                  </div>
                </div>
              </div>
            </section>

            {/* 2. Information We Collect */}
            <section id="section-2" className="privacy-section-card">
              <div className="privacy-section-header">
                <div className="privacy-section-icon">
                  <Database size={20} />
                </div>
                <h2 className="privacy-section-title">2. Information We Collect</h2>
              </div>
              <p className="privacy-p">
                To provide our automated CRM, lead qualification, and multi-channel synchronization services, LeadPilot AI collects necessary personal data and technical information. We adhere strictly to the principle of data minimization—collecting only what is strictly required to fulfill our operational and agreement obligations.
              </p>

              <h3 className="privacy-subheading">
                <Users size={18} /> A. Account & Organization Information
              </h3>
              <div className="privacy-grid-2col">
                <div className="privacy-item-card">
                  <div className="privacy-item-title">Account Holder Details</div>
                  <div className="privacy-item-desc">Full Name, Business Email Address, Phone Number, Profile Photo, and Job Title.</div>
                </div>
                <div className="privacy-item-card">
                  <div className="privacy-item-title">Workspace & Organization Data</div>
                  <div className="privacy-item-desc">Company Name, Workspace ID, Billing Contact, Subscription Level, and Team Member Roles.</div>
                </div>
              </div>

              <h3 className="privacy-subheading">
                <Share2 size={18} /> B. Meta & Social Media Integrations (Facebook & Instagram)
              </h3>
              <div className="privacy-grid-2col">
                <div className="privacy-item-card">
                  <div className="privacy-item-title">Facebook Account Information</div>
                  <div className="privacy-item-desc">User ID, User Name, Primary Email Address, and User Access Tokens via Meta Login.</div>
                </div>
                <div className="privacy-item-card">
                  <div className="privacy-item-title">Instagram Business Accounts</div>
                  <div className="privacy-item-desc">Connected Instagram Professional Account IDs, Handles, Business Profiles, and Direct Message Webhooks.</div>
                </div>
                <div className="privacy-item-card">
                  <div className="privacy-item-title">Meta Business Assets & Pages</div>
                  <div className="privacy-item-desc">Meta Business Manager ID, Connected Facebook Page IDs, Page Names, Page Access Tokens, and Page Roles.</div>
                </div>
                <div className="privacy-item-card">
                  <div className="privacy-item-title">Facebook Lead Ad Forms & Leads</div>
                  <div className="privacy-item-desc">Form IDs, Form Field Mapping, Lead Form Submissions (Lead Name, Email, Phone Number, Custom Answers, Timestamp).</div>
                </div>
              </div>

              <h3 className="privacy-subheading">
                <Cpu size={18} /> C. Google Ads & Third-Party Platform Data
              </h3>
              <div className="privacy-grid-2col">
                <div className="privacy-item-card">
                  <div className="privacy-item-title">Google Ads Account Information</div>
                  <div className="privacy-item-desc">Google Customer ID, OAuth 2.0 Access/Refresh Tokens, Campaign IDs, Conversion Action IDs, and Lead Form Submissions.</div>
                </div>
                <div className="privacy-item-card">
                  <div className="privacy-item-title">WhatsApp Business API Data</div>
                  <div className="privacy-item-desc">WhatsApp Business Phone Number ID, WABA ID, Message Templates, Inbound Customer Messages, and Outbound Replies.</div>
                </div>
              </div>

              <h3 className="privacy-subheading">
                <Activity size={18} /> D. Technical, Device & Analytics Information
              </h3>
              <div className="privacy-grid-3col">
                <div className="privacy-item-card">
                  <div className="privacy-item-title">Browser Information</div>
                  <div className="privacy-item-desc">Browser Type, Version, Preferred Language, Timezone Setting, and Screen Resolution.</div>
                </div>
                <div className="privacy-item-card">
                  <div className="privacy-item-title">Device & IP Data</div>
                  <div className="privacy-item-desc">IP Address, Network Host, Hardware Model, Operating System, and Unique Device Identifier.</div>
                </div>
                <div className="privacy-item-card">
                  <div className="privacy-item-title">Usage Analytics</div>
                  <div className="privacy-item-desc">Pages Visited, Feature Usage, Session Duration, API Call Logs, Clickstreams, and Error Reports.</div>
                </div>
              </div>
            </section>

            {/* 3. Facebook & Meta Permissions */}
            <section id="section-3" className="privacy-section-card">
              <div className="privacy-section-header">
                <div className="privacy-section-icon">
                  <Lock size={20} />
                </div>
                <h2 className="privacy-section-title">3. Facebook & Meta Permissions</h2>
              </div>
              <p className="privacy-p">
                LeadPilot AI integrates with Meta Platforms via official Meta Graph APIs. When connecting your Facebook Page, Business Manager, or Lead Ad Forms, our application requests specific OAuth permissions. Below is an explicit breakdown of the permissions requested, why they are required, and how they are handled.
              </p>

              <div className="privacy-perm-list">
                <div className="privacy-perm-card">
                  <div className="privacy-perm-header">
                    <span className="privacy-perm-code">business_management</span>
                    <span className="privacy-perm-badge">Meta Graph API</span>
                  </div>
                  <p className="privacy-perm-desc">
                    Allows LeadPilot AI to view your Business Manager assets, enumerate owned Facebook Pages, and identify associated Lead Gen Forms.
                  </p>
                  <div className="privacy-perm-usage">
                    <CheckCircle2 size={16} className="privacy-feature-icon" />
                    <strong>Purpose:</strong> Seamless connection and mapping of enterprise Meta Business accounts to your LeadPilot AI workspace.
                  </div>
                </div>

                <div className="privacy-perm-card">
                  <div className="privacy-perm-header">
                    <span className="privacy-perm-code">pages_show_list</span>
                    <span className="privacy-perm-badge">Meta Graph API</span>
                  </div>
                  <p className="privacy-perm-desc">
                    Grants LeadPilot AI access to retrieve the list of Facebook Pages that you manage or administer.
                  </p>
                  <div className="privacy-perm-usage">
                    <CheckCircle2 size={16} className="privacy-feature-icon" />
                    <strong>Purpose:</strong> Allows workspace administrators to select which Facebook Pages should receive automated lead synchronization.
                  </div>
                </div>

                <div className="privacy-perm-card">
                  <div className="privacy-perm-header">
                    <span className="privacy-perm-code">pages_read_engagement</span>
                    <span className="privacy-perm-badge">Meta Graph API</span>
                  </div>
                  <p className="privacy-perm-desc">
                    Enables LeadPilot AI to read Page engagement metrics, form subscriptions, and Page metadata required for lead processing.
                  </p>
                  <div className="privacy-perm-usage">
                    <CheckCircle2 size={16} className="privacy-feature-icon" />
                    <strong>Purpose:</strong> Ensures LeadPilot AI receives instant webhooks when new lead forms are completed by potential customers.
                  </div>
                </div>

                <div className="privacy-perm-card">
                  <div className="privacy-perm-header">
                    <span className="privacy-perm-code">leads_retrieval</span>
                    <span className="privacy-perm-badge">Meta Graph API</span>
                  </div>
                  <p className="privacy-perm-desc">
                    Allows LeadPilot AI to fetch lead submissions generated via Facebook Lead Ads in real-time.
                  </p>
                  <div className="privacy-perm-usage">
                    <CheckCircle2 size={16} className="privacy-feature-icon" />
                    <strong>Purpose:</strong> Downloads submitted lead data (name, email, phone, custom fields) directly into LeadPilot AI CRM for instant AI qualification.
                  </div>
                </div>
              </div>

              <div className="privacy-callout-box">
                <ShieldCheck className="privacy-callout-icon" size={24} />
                <div className="privacy-callout-content">
                  <div className="privacy-callout-title">Strict No-Posting & Scope Enforcement Guarantee</div>
                  <div className="privacy-callout-text">
                    LeadPilot AI uses Meta permissions <strong>ONLY</strong> to connect business accounts, list Facebook pages, retrieve lead form submissions, synchronize lead records, and display actionable lead metrics inside the LeadPilot AI dashboard. <strong>LeadPilot AI NEVER posts content, publishes status updates, or modifies your Facebook Pages or Ads without your explicit, manual instruction.</strong>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. How We Use Your Information */}
            <section id="section-4" className="privacy-section-card">
              <div className="privacy-section-header">
                <div className="privacy-section-icon">
                  <Layers size={20} />
                </div>
                <h2 className="privacy-section-title">4. How We Use Your Information</h2>
              </div>
              <p className="privacy-p">
                We process collected data exclusively to deliver, maintain, optimize, and protect the LeadPilot AI SaaS platform. Key usage operational areas include:
              </p>

              <ul className="privacy-feature-list">
                <li className="privacy-feature-item">
                  <CheckCircle2 className="privacy-feature-icon" size={18} />
                  <div>
                    <strong>Enterprise CRM & Pipeline Management:</strong> Aggregating lead records from Facebook, Instagram, Google Ads, and manual entries into a centralized workspace dashboard.
                  </div>
                </li>
                <li className="privacy-feature-item">
                  <CheckCircle2 className="privacy-feature-icon" size={18} />
                  <div>
                    <strong>Real-Time Lead Synchronization:</strong> Instantly capturing incoming leads via webhooks and updating lead status, contact details, and custom field values.
                  </div>
                </li>
                <li className="privacy-feature-item">
                  <CheckCircle2 className="privacy-feature-icon" size={18} />
                  <div>
                    <strong>AI Qualification & Scoring:</strong> Processing lead parameters using trained AI algorithms to score purchase intent, extract client preferences, and assign leads to sales representatives.
                  </div>
                </li>
                <li className="privacy-feature-item">
                  <CheckCircle2 className="privacy-feature-icon" size={18} />
                  <div>
                    <strong>WhatsApp Business Automation:</strong> Triggering automated WhatsApp welcome messages, follow-up drip sequences, appointment reminders, and interactive chatbots.
                  </div>
                </li>
                <li className="privacy-feature-item">
                  <CheckCircle2 className="privacy-feature-icon" size={18} />
                  <div>
                    <strong>Campaign Management & Analytics:</strong> Tracking ad campaign conversion rates, cost-per-lead metrics, lead source attribution, and generating executive reports.
                  </div>
                </li>
                <li className="privacy-feature-item">
                  <CheckCircle2 className="privacy-feature-icon" size={18} />
                  <div>
                    <strong>System Notifications & Security Alerts:</strong> Sending transactional emails, login verifications, password reset links, and workspace activity alerts.
                  </div>
                </li>
              </ul>
            </section>

            {/* 5. Third Party Services */}
            <section id="section-5" className="privacy-section-card">
              <div className="privacy-section-header">
                <div className="privacy-section-icon">
                  <Globe size={20} />
                </div>
                <h2 className="privacy-section-title">5. Third Party Services & Integrations</h2>
              </div>
              <p className="privacy-p">
                LeadPilot AI connects with trusted third-party platforms to execute multi-channel marketing workflows. We share data with third parties only to the extent necessary to perform integration services under strict confidentiality and privacy agreements.
              </p>

              <div className="privacy-table-wrapper">
                <table className="privacy-table">
                  <thead>
                    <tr>
                      <th>Service Provider</th>
                      <th>Integration Type</th>
                      <th>Data Shared / Retrieved</th>
                      <th>Privacy Policy Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Meta Platforms Inc.</strong></td>
                      <td>Facebook Lead Ads & Pages</td>
                      <td>Lead Form Submissions, Page Tokens, Business IDs</td>
                      <td>
                        <a href="https://www.facebook.com/privacy/policy" target="_blank" rel="noopener noreferrer" className="privacy-contact-link">
                          Meta Privacy Policy <ExternalLink size={12} />
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td><strong>Instagram (Meta)</strong></td>
                      <td>Instagram Professional Accounts</td>
                      <td>Profile IDs, Webhooks, Direct Messages</td>
                      <td>
                        <a href="https://privacycenter.instagram.com/policy" target="_blank" rel="noopener noreferrer" className="privacy-contact-link">
                          Instagram Policy <ExternalLink size={12} />
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td><strong>WhatsApp Business</strong></td>
                      <td>WhatsApp Cloud API</td>
                      <td>Phone Numbers, Messaging Templates, Chat Logs</td>
                      <td>
                        <a href="https://www.whatsapp.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="privacy-contact-link">
                          WhatsApp Policy <ExternalLink size={12} />
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td><strong>Google LLC</strong></td>
                      <td>Google Ads & Google OAuth</td>
                      <td>OAuth Credentials, Campaign Conversion Data, Analytics</td>
                      <td>
                        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="privacy-contact-link">
                          Google Privacy <ExternalLink size={12} />
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td><strong>PostgreSQL / Vercel Cloud</strong></td>
                      <td>Infrastructure & Database</td>
                      <td>Encrypted Application Databases, Backups</td>
                      <td>
                        <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="privacy-contact-link">
                          Vercel Privacy <ExternalLink size={12} />
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 6. Data Storage */}
            <section id="section-6" className="privacy-section-card">
              <div className="privacy-section-header">
                <div className="privacy-section-icon">
                  <Server size={20} />
                </div>
                <h2 className="privacy-section-title">6. Data Storage & Encryption Architecture</h2>
              </div>
              <p className="privacy-p">
                Data security is at the core of LeadPilot AI&apos;s architecture. All customer data, connected asset tokens, and lead records are securely stored using industry-leading infrastructure standards:
              </p>

              <div className="privacy-grid-2col">
                <div className="privacy-item-card">
                  <div className="privacy-item-title">
                    <Database size={16} /> PostgreSQL Relational Storage
                  </div>
                  <div className="privacy-item-desc">
                    Enterprise PostgreSQL database clusters with automated snapshot backups, point-in-time recovery, and strict database connection pooling.
                  </div>
                </div>

                <div className="privacy-item-card">
                  <div className="privacy-item-title">
                    <Key size={16} /> Encrypted Access Tokens (AES-256)
                  </div>
                  <div className="privacy-item-desc">
                    All Meta Page Access Tokens, User Access Tokens, and Google OAuth Refresh Tokens are encrypted at rest using AES-256 military-grade encryption.
                  </div>
                </div>

                <div className="privacy-item-card">
                  <div className="privacy-item-title">
                    <Lock size={16} /> HTTPS TLS 1.3 / 1.2 Transit Security
                  </div>
                  <div className="privacy-item-desc">
                    Every API payload, webhook event, and user session is transmitted strictly over TLS 1.3 encrypted HTTPS channels. HTTP connections are automatically upgraded.
                  </div>
                </div>

                <div className="privacy-item-card">
                  <div className="privacy-item-title">
                    <ShieldCheck size={16} /> Secure Authentication Protocols
                  </div>
                  <div className="privacy-item-desc">
                    Stateless JWT tokens, secure HTTP-only cookies, password hashing with bcrypt, and session revocation capabilities.
                  </div>
                </div>
              </div>
            </section>

            {/* 7. Data Security */}
            <section id="section-7" className="privacy-section-card">
              <div className="privacy-section-header">
                <div className="privacy-section-icon">
                  <ShieldCheck size={20} />
                </div>
                <h2 className="privacy-section-title">7. Enterprise Data Security & Isolation</h2>
              </div>
              <p className="privacy-p">
                LeadPilot AI enforces rigorous logical and physical security controls to guarantee enterprise tenant isolation:
              </p>

              <ul className="privacy-feature-list">
                <li className="privacy-feature-item">
                  <CheckCircle2 className="privacy-feature-icon" size={18} />
                  <div>
                    <strong>Workspace & Company Isolation:</strong> Logical database boundary segregation prevents any cross-workspace or cross-tenant data leakage. Users access only authorized workspace data.
                  </div>
                </li>
                <li className="privacy-feature-item">
                  <CheckCircle2 className="privacy-feature-icon" size={18} />
                  <div>
                    <strong>Role-Based Access Control (RBAC):</strong> Fine-grained permissions (Owner, Admin, Manager, Agent) restricting user actions and visibility within each enterprise workspace.
                  </div>
                </li>
                <li className="privacy-feature-item">
                  <CheckCircle2 className="privacy-feature-icon" size={18} />
                  <div>
                    <strong>System Audit Logs:</strong> Immutable log records tracking user logins, Meta token updates, lead data modifications, and deletion requests for compliance auditing.
                  </div>
                </li>
                <li className="privacy-feature-item">
                  <CheckCircle2 className="privacy-feature-icon" size={18} />
                  <div>
                    <strong>Continuous Vulnerability Monitoring:</strong> Regular dependency scans, automated security patches, and network intrusion prevention systems.
                  </div>
                </li>
              </ul>
            </section>

            {/* 8. Cookies */}
            <section id="section-8" className="privacy-section-card">
              <div className="privacy-section-header">
                <div className="privacy-section-icon">
                  <Cookie size={20} />
                </div>
                <h2 className="privacy-section-title">8. Cookies & Tracking Technologies</h2>
              </div>
              <p className="privacy-p">
                LeadPilot AI uses essential and functional cookies to deliver a seamless web experience. Cookies are small text files stored on your browser when visiting our platform.
              </p>
              <div className="privacy-grid-3col">
                <div className="privacy-item-card">
                  <div className="privacy-item-title">Essential Session Cookies</div>
                  <div className="privacy-item-desc">Required to maintain secure user authentication sessions and preserve active workspace context.</div>
                </div>
                <div className="privacy-item-card">
                  <div className="privacy-item-title">Security & Anti-CSRF Tokens</div>
                  <div className="privacy-item-desc">Prevents cross-site request forgery attacks and validates authorized API form submissions.</div>
                </div>
                <div className="privacy-item-card">
                  <div className="privacy-item-title">Preference Cookies</div>
                  <div className="privacy-item-desc">Stores user theme preferences (Dark Mode / Light Mode), sidebar state, and language settings.</div>
                </div>
              </div>
              <p className="privacy-p">
                You can manage or disable non-essential cookies via your browser settings. Note that disabling essential cookies may impact platform functionality.
              </p>
            </section>

            {/* 9. User Rights */}
            <section id="section-9" className="privacy-section-card">
              <div className="privacy-section-header">
                <div className="privacy-section-icon">
                  <Users size={20} />
                </div>
                <h2 className="privacy-section-title">9. User Data Rights & Controls</h2>
              </div>
              <p className="privacy-p">
                In compliance with global data privacy regulations (GDPR, CCPA, CPRA), LeadPilot AI grants users full control over their personal and enterprise data:
              </p>

              <div className="privacy-grid-2col">
                <div className="privacy-item-card">
                  <div className="privacy-item-title">Right to View & Access</div>
                  <div className="privacy-item-desc">Request a complete copy of all lead records, connected accounts, and user information stored in your account.</div>
                </div>
                <div className="privacy-item-card">
                  <div className="privacy-item-title">Right to Rectify & Update</div>
                  <div className="privacy-item-desc">Edit, update, or correct inaccurate user account details, workspace profiles, or mapped lead fields anytime.</div>
                </div>
                <div className="privacy-item-card">
                  <div className="privacy-item-title">Right to Disconnect Accounts</div>
                  <div className="privacy-item-desc">Revoke connected Meta Facebook Pages, Instagram Business Accounts, or Google Ads accounts instantly in Settings.</div>
                </div>
                <div className="privacy-item-card">
                  <div className="privacy-item-title">Right to Erasure (Delete Data)</div>
                  <div className="privacy-item-desc">Request permanent deletion of your LeadPilot AI workspace, associated lead records, and stored tokens.</div>
                </div>
              </div>
            </section>

            {/* 10. Facebook Data Deletion */}
            <section id="section-10" className="privacy-section-card">
              <div className="privacy-section-header">
                <div className="privacy-section-icon">
                  <Shield size={20} />
                </div>
                <h2 className="privacy-section-title">10. Facebook Data Deletion Instructions</h2>
              </div>
              <p className="privacy-p">
                In compliance with Meta Platform Terms, LeadPilot AI provides a dedicated, direct self-service process for requesting the complete removal of connected Facebook and Meta user data.
              </p>
              <p className="privacy-p">
                If you wish to delete your connected Meta asset data, Page tokens, or lead form submissions retrieved from Facebook, you can initiate the request in two simple ways:
              </p>

              <ul className="privacy-feature-list">
                <li className="privacy-feature-item">
                  <CheckCircle2 className="privacy-feature-icon" size={18} />
                  <div>
                    <strong>Option 1: Direct In-App & Self-Service Deletion Page:</strong> Visit our official Data Deletion Portal at <Link href="/data-deletion" className="privacy-contact-link">/data-deletion</Link> and enter your email or workspace ID to trigger an instant deletion workflow.
                  </div>
                </li>
                <li className="privacy-feature-item">
                  <CheckCircle2 className="privacy-feature-icon" size={18} />
                  <div>
                    <strong>Option 2: Meta App Settings Removal:</strong> Go to your Facebook Profile &rarr; <em>Settings &amp; Privacy</em> &rarr; <em>Settings</em> &rarr; <em>Apps and Websites</em> &rarr; Find <strong>LeadPilot AI</strong> &rarr; Click <strong>Remove</strong>. You can also click <em>View Removed Apps</em> and click <em>Send Request</em> to request data deletion.
                  </div>
                </li>
              </ul>

              <div className="privacy-deletion-box">
                <div className="privacy-deletion-header">
                  <AlertTriangle size={24} className="privacy-deletion-title" />
                  <div className="privacy-deletion-title">Request Facebook Data Removal</div>
                </div>
                <div className="privacy-deletion-text">
                  To view step-by-step instructions, check deletion request status, or submit a manual Meta data wipe request, access our dedicated Data Deletion callback page below.
                </div>
                <div className="privacy-deletion-actions">
                  <Link href="/data-deletion" className="privacy-deletion-btn">
                    Go to Data Deletion Page <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </section>

            {/* 11. Children's Privacy */}
            <section id="section-11" className="privacy-section-card">
              <div className="privacy-section-header">
                <div className="privacy-section-icon">
                  <Users size={20} />
                </div>
                <h2 className="privacy-section-title">11. Children&apos;s Privacy Compliance</h2>
              </div>
              <p className="privacy-p">
                LeadPilot AI is an enterprise B2B SaaS platform intended solely for business professionals and commercial organizations. Our service is not directed to individuals under the age of 18 (or 16 in certain jurisdictions).
              </p>
              <p className="privacy-p">
                We do not knowingly collect or solicit personal data from children. If we become aware that a child under 18 has provided us with personal information, we will take immediate steps to delete such data from our databases and revoke active account access.
              </p>
            </section>

            {/* 12. Policy Updates */}
            <section id="section-12" className="privacy-section-card">
              <div className="privacy-section-header">
                <div className="privacy-section-icon">
                  <FileText size={20} />
                </div>
                <h2 className="privacy-section-title">12. Changes & Updates to This Policy</h2>
              </div>
              <p className="privacy-p">
                We may update this Privacy Policy periodically to reflect enhancements to our AI CRM capabilities, changes in Meta or Google platform requirements, or evolving legal standards.
              </p>
              <p className="privacy-p">
                When material changes are made to this policy, we will update the &quot;Last Updated&quot; date at the top of this page and notify registered workspace administrators via email or an in-app system notification at least 30 days prior to effective implementation.
              </p>
            </section>

            {/* 13. Contact Information */}
            <section id="section-13" className="privacy-section-card">
              <div className="privacy-section-header">
                <div className="privacy-section-icon">
                  <Mail size={20} />
                </div>
                <h2 className="privacy-section-title">13. Contact Information</h2>
              </div>
              <p className="privacy-p">
                If you have any questions, concerns, or legal inquiries regarding this Privacy Policy, your data rights, or Meta App Review compliance, please contact our dedicated Data Protection & Legal team:
              </p>

              <div className="privacy-contact-grid">
                <div className="privacy-contact-card">
                  <div className="privacy-contact-icon">
                    <Building2 size={20} />
                  </div>
                  <div className="privacy-contact-info">
                    <div className="privacy-contact-label">Company Entity</div>
                    <div className="privacy-contact-val">LeadPilot AI Inc.</div>
                  </div>
                </div>

                <div className="privacy-contact-card">
                  <div className="privacy-contact-icon">
                    <Mail size={20} />
                  </div>
                  <div className="privacy-contact-info">
                    <div className="privacy-contact-label">Legal & Privacy Email</div>
                    <a href="mailto:entecmedia@gmail.com" className="privacy-contact-val privacy-contact-link">
                      entecmedia@gmail.com
                    </a>
                  </div>
                </div>

                <div className="privacy-contact-card">
                  <div className="privacy-contact-icon">
                    <Globe size={20} />
                  </div>
                  <div className="privacy-contact-info">
                    <div className="privacy-contact-label">Official Website</div>
                    <a href="https://leadpilotai-rust.vercel.app" target="_blank" rel="noopener noreferrer" className="privacy-contact-val privacy-contact-link">
                      leadpilotai-rust.vercel.app
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="privacy-site-footer">
        <div className="privacy-footer-container">
          <div className="privacy-footer-top">
            <div className="privacy-footer-brand">
              <Link href="/" className="privacy-footer-logo">
                <div className="privacy-logo-box">LP</div>
                <span>LeadPilot AI</span>
              </Link>
              <p className="privacy-footer-desc">
                AI-Powered Real Estate CRM, Lead Qualification & Multi-Channel Automation Engine for Enterprise Sales Teams.
              </p>
            </div>

            <div className="privacy-footer-nav">
              <div className="privacy-footer-col">
                <div className="privacy-footer-heading">Legal & Privacy</div>
                <div className="privacy-footer-links">
                  <Link href="/privacy-policy" className="privacy-footer-link">Privacy Policy</Link>
                  <Link href="/data-deletion" className="privacy-footer-link">Data Deletion</Link>
                  <a href="#" className="privacy-footer-link">Terms of Service</a>
                  <a href="#" className="privacy-footer-link">Security Overview</a>
                </div>
              </div>

              <div className="privacy-footer-col">
                <div className="privacy-footer-heading">Platform</div>
                <div className="privacy-footer-links">
                  <Link href="/" className="privacy-footer-link">Dashboard</Link>
                  <a href="mailto:entecmedia@gmail.com" className="privacy-footer-link">Contact Sales</a>
                  <a href="mailto:entecmedia@gmail.com" className="privacy-footer-link">Support</a>
                </div>
              </div>
            </div>
          </div>

          <div className="privacy-footer-bottom">
            <div>&copy; {new Date().getFullYear()} LeadPilot AI Inc. All rights reserved.</div>
            <div>Meta Developer Partner &amp; Google API Compliant</div>
          </div>
        </div>
      </footer>
    </div>
  );
};
