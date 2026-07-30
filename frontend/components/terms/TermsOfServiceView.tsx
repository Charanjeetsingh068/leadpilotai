'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  FileText,
  ExternalLink,
  Database,
  Key,
  Users,
  CheckCircle2,
  Share2,
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
  Server,
  Scale,
  CreditCard,
  UserCheck,
  Bot,
  AlertCircle,
  HelpCircle,
  FileCheck,
  Ban
} from 'lucide-react';

interface TOCItem {
  id: string;
  number: string;
  title: string;
}

const TOC_ITEMS: TOCItem[] = [
  { id: 'section-1', number: '01', title: 'Acceptance of Terms' },
  { id: 'section-2', number: '02', title: 'About LeadPilot AI' },
  { id: 'section-3', number: '03', title: 'User Eligibility' },
  { id: 'section-4', number: '04', title: 'Account Registration' },
  { id: 'section-5', number: '05', title: 'Third-Party Integrations' },
  { id: 'section-6', number: '06', title: 'Facebook & Meta Services' },
  { id: 'section-7', number: '07', title: 'Acceptable Use Policy' },
  { id: 'section-8', number: '08', title: 'AI Services & Automation' },
  { id: 'section-9', number: '09', title: 'Data Ownership' },
  { id: 'section-10', number: '10', title: 'Subscription & Billing' },
  { id: 'section-11', number: '11', title: 'Service Availability' },
  { id: 'section-12', number: '12', title: 'Security Architecture' },
  { id: 'section-13', number: '13', title: 'Privacy Compliance' },
  { id: 'section-14', number: '14', title: 'Data Deletion Rights' },
  { id: 'section-15', number: '15', title: 'Account Termination' },
  { id: 'section-16', number: '16', title: 'Limitation of Liability' },
  { id: 'section-17', number: '17', title: 'Indemnification' },
  { id: 'section-18', number: '18', title: 'Changes to Terms' },
  { id: 'section-19', number: '19', title: 'Governing Law' },
  { id: 'section-20', number: '20', title: 'Contact Information' },
];

export const TermsOfServiceView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('section-1');
  const [lastUpdatedDate, setLastUpdatedDate] = useState<string>('');
  const [effectiveDate, setEffectiveDate] = useState<string>('');

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

    // IntersectionObserver for TOC highlight on desktop
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
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="terms-page-wrapper">
      {/* Header */}
      <header className="terms-site-header">
        <div className="terms-header-container">
          <Link href="/" className="terms-logo-link">
            <div className="terms-logo-box">LP</div>
            <span className="terms-logo-text">LeadPilot AI</span>
          </Link>
          <nav className="terms-header-nav">
            <span className="terms-header-badge">
              <ShieldCheck className="terms-feature-icon" /> Meta & Google Compliant
            </span>
            <Link href="/" className="terms-header-link">Home</Link>
            <Link href="/privacy-policy" className="terms-header-link">Privacy Policy</Link>
            <Link href="/data-deletion" className="terms-header-link">Data Deletion</Link>
            <a href="mailto:entecmedia@gmail.com" className="terms-header-link">Legal Support</a>
          </nav>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="terms-hero-section">
        <div className="terms-hero-container">
          <div className="terms-hero-pill-group">
            <span className="terms-pill-item">
              <Scale className="terms-feature-icon" /> Enterprise Terms of Service
            </span>
            <span className="terms-pill-item">
              <CheckCircle2 className="terms-feature-icon" /> Platform Developer Verified
            </span>
          </div>
          <h1 className="terms-hero-title">Terms of Service</h1>
          <p className="terms-hero-subtitle">
            Please read these Terms of Service carefully before accessing or utilizing LeadPilot AI&apos;s AI-powered CRM, lead qualification, and sales automation platform.
          </p>
          <div className="terms-dates-bar">
            <div className="terms-date-item">
              <span>Last Updated:</span>
              <strong>{lastUpdatedDate || 'July 30, 2026'}</strong>
            </div>
            <div className="terms-date-divider" />
            <div className="terms-date-item">
              <span>Effective Date:</span>
              <strong>{effectiveDate || 'January 1, 2026'}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="terms-main-container">
        <div className="terms-layout-grid">
          {/* Table of Contents Sidebar (Sticky on Desktop) */}
          <aside className="terms-toc-sidebar">
            <div className="terms-toc-title">
              <FileText className="terms-feature-icon" /> Table of Contents
            </div>
            <nav className="terms-toc-nav">
              {TOC_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => scrollToSection(e, item.id)}
                  className={`terms-toc-link ${activeSection === item.id ? 'active' : ''}`}
                >
                  <span className="terms-toc-num">{item.number}</span>
                  <span>{item.title}</span>
                </a>
              ))}
            </nav>
          </aside>

          {/* Document Content Body */}
          <div className="terms-content-body">
            {/* 1. Acceptance of Terms */}
            <section id="section-1" className="terms-section-card">
              <div className="terms-section-header">
                <div className="terms-section-icon">
                  <FileCheck size={20} />
                </div>
                <h2 className="terms-section-title">1. Acceptance of Terms</h2>
              </div>
              <p className="terms-p">
                These Terms of Service (&quot;Terms&quot;, &quot;Agreement&quot;) constitute a legally binding agreement between you (&quot;User&quot;, &quot;Customer&quot;, &quot;you&quot;, or &quot;your&quot;) and <strong>LeadPilot AI Inc.</strong> (&quot;Company&quot;, &quot;LeadPilot AI&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) governing your access to and use of our website at <a href="https://leadpilotai-rust.vercel.app" target="_blank" rel="noopener noreferrer" className="terms-contact-link">https://leadpilotai-rust.vercel.app</a>, our cloud-based Software-as-a-Service (SaaS) application, API endpoints, mobile interfaces, and associated AI automated lead management tools.
              </p>
              <p className="terms-p">
                By registering an account, creating an enterprise workspace, connecting your Meta (Facebook/Instagram) or Google Business accounts, or utilizing any feature of LeadPilot AI, you explicitly accept and agree to be bound by these Terms, our <Link href="/privacy-policy" className="terms-contact-link">Privacy Policy</Link>, and applicable third-party platform policies. If you do not agree to these Terms, you must immediately cease accessing or using our services.
              </p>
              <div className="terms-callout-box">
                <ShieldCheck className="terms-callout-icon" size={24} />
                <div className="terms-callout-content">
                  <div className="terms-callout-title">Enterprise Binding Agreement</div>
                  <div className="terms-callout-text">
                    If you are accepting these Terms on behalf of a company, corporate entity, or sales organization, you represent and warrant that you possess full legal authority to bind such entity to these Terms.
                  </div>
                </div>
              </div>
            </section>

            {/* 2. About LeadPilot AI */}
            <section id="section-2" className="terms-section-card">
              <div className="terms-section-header">
                <div className="terms-section-icon">
                  <Sparkles size={20} />
                </div>
                <h2 className="terms-section-title">2. About LeadPilot AI Services</h2>
              </div>
              <p className="terms-p">
                LeadPilot AI provides a premier AI-driven Lead Management, Automated Qualification, and Multi-Channel CRM Orchestration platform built specifically for real estate developers, agencies, sales teams, and commercial enterprises.
              </p>

              <h3 className="terms-subheading">
                <Layers size={18} /> Core Capabilities & Integrations
              </h3>
              <div className="terms-grid-2col">
                <div className="terms-item-card">
                  <div className="terms-item-title">
                    <Share2 size={16} /> Meta & Facebook Lead Ads Sync
                  </div>
                  <div className="terms-item-desc">Real-time webhook ingestion of Facebook Lead Ads, Page lead submissions, and Instagram Lead Forms.</div>
                </div>
                <div className="terms-item-card">
                  <div className="terms-item-title">
                    <Bot size={16} /> WhatsApp Business Automation
                  </div>
                  <div className="terms-item-desc">Automated WhatsApp Cloud API messaging, drip campaigns, welcome auto-responders, and interactive chatbot qualification.</div>
                </div>
                <div className="terms-item-card">
                  <div className="terms-item-title">
                    <Cpu size={16} /> Google Ads Conversion Tracking
                  </div>
                  <div className="terms-item-desc">Automated sync of Google Ads conversion events, lead form extensions, and campaign performance attribution.</div>
                </div>
                <div className="terms-item-card">
                  <div className="terms-item-title">
                    <Users size={16} /> Multi-Tenant CRM & AI Agents
                  </div>
                  <div className="terms-item-desc">Intelligent lead scoring, automated agent assignment, calendar scheduling, and team pipeline management.</div>
                </div>
              </div>
            </section>

            {/* 3. Eligibility */}
            <section id="section-3" className="terms-section-card">
              <div className="terms-section-header">
                <div className="terms-section-icon">
                  <UserCheck size={20} />
                </div>
                <h2 className="terms-section-title">3. User Eligibility & Authority</h2>
              </div>
              <p className="terms-p">
                To register for an account and use LeadPilot AI, you must satisfy the following eligibility requirements:
              </p>

              <ul className="terms-feature-list">
                <li className="terms-feature-item">
                  <CheckCircle2 className="terms-feature-icon" size={18} />
                  <div>
                    <strong>Age Requirement:</strong> You must be at least 18 years of age (or the legal age of majority in your jurisdiction) to form a binding contract.
                  </div>
                </li>
                <li className="terms-feature-item">
                  <CheckCircle2 className="terms-feature-icon" size={18} />
                  <div>
                    <strong>Account Authority:</strong> You must possess verified administrative rights to connect company Facebook Pages, Meta Business Managers, Instagram Professional Accounts, and Google Ads accounts.
                  </div>
                </li>
                <li className="terms-feature-item">
                  <CheckCircle2 className="terms-feature-icon" size={18} />
                  <div>
                    <strong>Third-Party Compliance:</strong> You must comply continuously with Meta Platform Terms, Facebook Commercial Terms, WhatsApp Business Terms of Service, and Google API Services User Data Policy.
                  </div>
                </li>
              </ul>
            </section>

            {/* 4. Account Registration */}
            <section id="section-4" className="terms-section-card">
              <div className="terms-section-header">
                <div className="terms-section-icon">
                  <Lock size={20} />
                </div>
                <h2 className="terms-section-title">4. Account Registration & Workspace Security</h2>
              </div>
              <p className="terms-p">
                Users must register an account to access LeadPilot AI. When creating an account or workspace, you agree to:
              </p>
              <div className="terms-grid-2col">
                <div className="terms-item-card">
                  <div className="terms-item-title">Accurate Account Details</div>
                  <div className="terms-item-desc">Provide truthful, complete, and updated business email addresses, contact numbers, and corporate credentials.</div>
                </div>
                <div className="terms-item-card">
                  <div className="terms-item-title">Password & Token Security</div>
                  <div className="terms-item-desc">Maintain strict confidentiality of user passwords, API keys, and workspace authentication tokens.</div>
                </div>
                <div className="terms-item-card">
                  <div className="terms-item-title">Workspace Responsibility</div>
                  <div className="terms-item-desc">Accept full responsibility for all lead processing, team activities, and automated workflows executed within your workspace.</div>
                </div>
                <div className="terms-item-card">
                  <div className="terms-item-title">Account Ownership</div>
                  <div className="terms-item-desc">Workspace ownership belongs to the registered enterprise entity associated with the primary administrative email.</div>
                </div>
              </div>
            </section>

            {/* 5. Third-Party Integrations */}
            <section id="section-5" className="terms-section-card">
              <div className="terms-section-header">
                <div className="terms-section-icon">
                  <Globe size={20} />
                </div>
                <h2 className="terms-section-title">5. Third-Party Platform Integrations</h2>
              </div>
              <p className="terms-p">
                LeadPilot AI allows you to connect supported third-party platforms, including Meta Platforms (Facebook & Instagram), WhatsApp Business, Google Ads, and Google Analytics.
              </p>
              <p className="terms-p">
                You acknowledge and agree that LeadPilot AI accesses and processes data from connected third-party accounts <strong>ONLY</strong> to the extent explicitly authorized by your OAuth permissions and configured lead form settings. LeadPilot AI is not responsible for third-party platform downtime, API deprecations, or policy changes enacted by Meta or Google.
              </p>
            </section>

            {/* 6. Facebook & Meta Services */}
            <section id="section-6" className="terms-section-card">
              <div className="terms-section-header">
                <div className="terms-section-icon">
                  <Share2 size={20} />
                </div>
                <h2 className="terms-section-title">6. Facebook & Meta Developer Services Compliance</h2>
              </div>
              <p className="terms-p">
                LeadPilot AI incorporates Meta Developer APIs to enable automated Facebook Lead Ads synchronization. In accordance with Meta Platform Terms, we explicitly disclose requested Graph API permissions and their usage scope:
              </p>

              <div className="terms-perm-list">
                <div className="terms-perm-card">
                  <div className="terms-perm-header">
                    <span className="terms-perm-code">business_management</span>
                    <span className="terms-perm-badge">Meta Graph API Scope</span>
                  </div>
                  <p className="terms-perm-desc">
                    Used exclusively to enumerate connected Meta Business Manager assets, Facebook Pages, and associated Lead Gen Forms.
                  </p>
                </div>

                <div className="terms-perm-card">
                  <div className="terms-perm-header">
                    <span className="terms-perm-code">pages_show_list</span>
                    <span className="terms-perm-badge">Meta Graph API Scope</span>
                  </div>
                  <p className="terms-perm-desc">
                    Allows workspace administrators to view and select managed Facebook Pages for lead synchronization.
                  </p>
                </div>

                <div className="terms-perm-card">
                  <div className="terms-perm-header">
                    <span className="terms-perm-code">pages_read_engagement</span>
                    <span className="terms-perm-badge">Meta Graph API Scope</span>
                  </div>
                  <p className="terms-perm-desc">
                    Enables real-time webhook subscriptions for lead form submission alerts and Page engagement metrics.
                  </p>
                </div>

                <div className="terms-perm-card">
                  <div className="terms-perm-header">
                    <span className="terms-perm-code">leads_retrieval</span>
                    <span className="terms-perm-badge">Meta Graph API Scope</span>
                  </div>
                  <p className="terms-perm-desc">
                    Retrieves submitted lead records (name, email, phone, custom questions) directly into LeadPilot AI for instant automated CRM entry.
                  </p>
                </div>
              </div>

              <div className="terms-callout-box">
                <ShieldCheck className="terms-callout-icon" size={24} />
                <div className="terms-callout-content">
                  <div className="terms-callout-title">Strict Unauthorized Action Guarantee</div>
                  <div className="terms-callout-text">
                    <strong>LeadPilot AI NEVER posts content, publishes status updates, creates ads, or alters Page settings on your Facebook or Instagram accounts without your explicit, manual authorization.</strong>
                  </div>
                </div>
              </div>
            </section>

            {/* 7. Acceptable Use Policy */}
            <section id="section-7" className="terms-section-card">
              <div className="terms-section-header">
                <div className="terms-section-icon">
                  <Ban size={20} />
                </div>
                <h2 className="terms-section-title">7. Acceptable Use Policy</h2>
              </div>
              <p className="terms-p">
                You agree to use LeadPilot AI strictly for lawful commercial purposes. You agree NOT to:
              </p>

              <ul className="terms-feature-list">
                <li className="terms-feature-item">
                  <AlertTriangle className="privacy-feature-icon" size={18} style={{ color: '#ef4444' }} />
                  <div>
                    <strong>System Abuse & Security Probes:</strong> Attempt to reverse engineer, decompile, breach security controls, or probe system vulnerabilities.
                  </div>
                </li>
                <li className="terms-feature-item">
                  <AlertTriangle className="privacy-feature-icon" size={18} style={{ color: '#ef4444' }} />
                  <div>
                    <strong>Unsolicited Messaging (Spam):</strong> Use WhatsApp API or email integrations to distribute unsolicited spam, illegal content, or violating promotional material.
                  </div>
                </li>
                <li className="terms-feature-item">
                  <AlertTriangle className="privacy-feature-icon" size={18} style={{ color: '#ef4444' }} />
                  <div>
                    <strong>Unauthorized Data Harvesting:</strong> Scrape, harvest, or store unauthorized third-party user data in violation of Meta, Google, or GDPR regulations.
                  </div>
                </li>
              </ul>
            </section>

            {/* 8. AI Services & Automation */}
            <section id="section-8" className="terms-section-card">
              <div className="terms-section-header">
                <div className="terms-section-icon">
                  <Bot size={20} />
                </div>
                <h2 className="terms-section-title">8. AI Services & Automated Decision Disclaimer</h2>
              </div>
              <p className="terms-p">
                LeadPilot AI employs artificial intelligence algorithms to score lead purchase intent, suggest follow-up actions, and automate customer message responses.
              </p>
              <p className="terms-p">
                AI recommendations and automated chatbot responses are designed to assist sales representatives. <strong>Final business decisions, contract executions, and customer sales agreements remain the sole responsibility of the User.</strong> LeadPilot AI is not liable for business decisions made based on AI qualification scores.
              </p>
            </section>

            {/* 9. Data Ownership */}
            <section id="section-9" className="terms-section-card">
              <div className="terms-section-header">
                <div className="terms-section-icon">
                  <Database size={20} />
                </div>
                <h2 className="terms-section-title">9. Customer Data Ownership & Processing</h2>
              </div>
              <p className="privacy-p">
                <strong>You retain complete, exclusive ownership of all lead records, business data, and customer information ingested into your LeadPilot AI workspace.</strong>
              </p>
              <p className="terms-p">
                LeadPilot AI acts strictly as a Data Processor under applicable privacy laws (GDPR/CCPA). We process your data solely to execute requested lead synchronization, qualification workflows, and SaaS platform features as governed by our <Link href="/privacy-policy" className="terms-contact-link">Privacy Policy</Link>.
              </p>
            </section>

            {/* 10. Subscription & Billing */}
            <section id="section-10" className="terms-section-card">
              <div className="terms-section-header">
                <div className="terms-section-icon">
                  <CreditCard size={20} />
                </div>
                <h2 className="terms-section-title">10. Subscription & Billing Terms</h2>
              </div>
              <p className="terms-p">
                LeadPilot AI is offered on a subscription plan basis (Monthly or Annual enterprise tiers).
              </p>
              <div className="terms-grid-2col">
                <div className="terms-item-card">
                  <div className="terms-item-title">Subscription Fees</div>
                  <div className="terms-item-desc">Plan pricing is billed in advance at the start of each billing cycle according to selected workspace tiers.</div>
                </div>
                <div className="terms-item-card">
                  <div className="terms-item-title">Automatic Renewal</div>
                  <div className="terms-item-desc">Subscriptions automatically renew at the end of each billing term unless canceled prior to the renewal date.</div>
                </div>
                <div className="terms-item-card">
                  <div className="terms-item-title">Taxes & Charges</div>
                  <div className="terms-item-desc">Customers are responsible for applicable sales, value-added (VAT), or local commercial taxes.</div>
                </div>
                <div className="terms-item-card">
                  <div className="terms-item-title">Refund Policy</div>
                  <div className="terms-item-desc">Subscription fees are non-refundable except where explicitly required by applicable law or written agreement.</div>
                </div>
              </div>
            </section>

            {/* 11. Service Availability */}
            <section id="section-11" className="terms-section-card">
              <div className="terms-section-header">
                <div className="terms-section-icon">
                  <Activity size={20} />
                </div>
                <h2 className="terms-section-title">11. Service Availability & SLA</h2>
              </div>
              <p className="terms-p">
                We strive to achieve 99.9% uptime across our cloud infrastructure. However, LeadPilot AI does not guarantee uninterrupted, error-free service availability. Scheduled maintenance, emergency security patches, or third-party cloud outages may cause temporary service interruptions.
              </p>
            </section>

            {/* 12. Security Architecture */}
            <section id="section-12" className="terms-section-card">
              <div className="terms-section-header">
                <div className="terms-section-icon">
                  <Server size={20} />
                </div>
                <h2 className="terms-section-title">12. Security Architecture & Isolation</h2>
              </div>
              <p className="terms-p">
                LeadPilot AI implements enterprise-grade technical and organizational security controls:
              </p>

              <div className="terms-grid-2col">
                <div className="terms-item-card">
                  <div className="terms-item-title">
                    <Lock size={16} /> HTTPS TLS 1.3 Encryption
                  </div>
                  <div className="terms-item-desc">All API payloads, webhooks, and browser interactions are encrypted in transit using TLS 1.3.</div>
                </div>

                <div className="terms-item-card">
                  <div className="terms-item-title">
                    <Key size={16} /> Encrypted Tokens (AES-256)
                  </div>
                  <div className="terms-item-desc">Meta Page Access Tokens and OAuth credentials are encrypted at rest using AES-256 encryption.</div>
                </div>

                <div className="terms-item-card">
                  <div className="terms-item-title">
                    <ShieldCheck size={16} /> Workspace & Company Isolation
                  </div>
                  <div className="terms-item-desc">Logical database boundary enforcement prevents cross-tenant data leakage between accounts.</div>
                </div>

                <div className="terms-item-card">
                  <div className="terms-item-title">
                    <FileCheck size={16} /> Audit Logging & RBAC
                  </div>
                  <div className="terms-item-desc">Fine-grained Role-Based Access Control and immutable audit logs tracking user activity.</div>
                </div>
              </div>
            </section>

            {/* 13. Privacy Compliance */}
            <section id="section-13" className="terms-section-card">
              <div className="terms-section-header">
                <div className="terms-section-icon">
                  <Shield size={20} />
                </div>
                <h2 className="terms-section-title">13. Privacy Policy Compliance</h2>
              </div>
              <p className="terms-p">
                Our collection, storage, and processing of personal data are governed strictly by our comprehensive Privacy Policy. For full details on data collection categories, third-party disclosures, and user rights, please review our official <Link href="/privacy-policy" className="terms-contact-link">Privacy Policy</Link>.
              </p>
            </section>

            {/* 14. Data Deletion Rights */}
            <section id="section-14" className="terms-section-card">
              <div className="terms-section-header">
                <div className="terms-section-icon">
                  <AlertCircle size={20} />
                </div>
                <h2 className="terms-section-title">14. Facebook Data Deletion & Erasure Rights</h2>
              </div>
              <p className="terms-p">
                In compliance with Meta Platform Terms, LeadPilot AI provides direct self-service tools allowing users to disconnect Meta accounts and request complete deletion of stored Facebook lead data.
              </p>
              <p className="terms-p">
                To initiate a Meta data removal request, visit our dedicated Data Deletion portal at <Link href="/data-deletion" className="terms-contact-link">/data-deletion</Link>.
              </p>
            </section>

            {/* 15. Account Termination */}
            <section id="section-15" className="terms-section-card">
              <div className="terms-section-header">
                <div className="terms-section-icon">
                  <Ban size={20} />
                </div>
                <h2 className="terms-section-title">15. Suspension & Account Termination</h2>
              </div>
              <p className="terms-p">
                LeadPilot AI reserves the right to suspend or terminate account access, revoke workspace tokens, or block platform usage immediately if a User:
              </p>
              <ul className="terms-feature-list">
                <li className="terms-feature-item">
                  <CheckCircle2 className="terms-feature-icon" size={18} />
                  <div>Violates any provision of these Terms or the Acceptable Use Policy.</div>
                </li>
                <li className="terms-feature-item">
                  <CheckCircle2 className="terms-feature-icon" size={18} />
                  <div>Breaches Meta Platform Policies, WhatsApp Terms, or Google API Policies.</div>
                </li>
                <li className="terms-feature-item">
                  <CheckCircle2 className="terms-feature-icon" size={18} />
                  <div>Fails to pay accrued subscription fees following billing grace periods.</div>
                </li>
              </ul>
            </section>

            {/* 16. Limitation of Liability */}
            <section id="section-16" className="terms-section-card">
              <div className="terms-section-header">
                <div className="terms-section-icon">
                  <Scale size={20} />
                </div>
                <h2 className="terms-section-title">16. Limitation of Liability</h2>
              </div>
              <p className="terms-p">
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL LEADPILOT AI INC., ITS OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA LOSS, BUSINESS INTERRUPTION, OR THIRD-PARTY PLATFORM REVOCATION, ARISING FROM OR RELATED TO YOUR USE OF THE PLATFORM.
              </p>
              <p className="terms-p">
                LEADPILOT AI&apos;S TOTAL AGGREGATE LIABILITY FOR ALL CLAIMS ARISING UNDER THESE TERMS SHALL NOT EXCEED THE TOTAL AMOUNT PAID BY YOU TO LEADPILOT AI DURING THE TWELVE (12) MONTH PERIOD PRECEDING THE CLAIM.
              </p>
            </section>

            {/* 17. Indemnification */}
            <section id="section-17" className="terms-section-card">
              <div className="terms-section-header">
                <div className="terms-section-icon">
                  <ShieldCheck size={20} />
                </div>
                <h2 className="terms-section-title">17. User Indemnification</h2>
              </div>
              <p className="terms-p">
                You agree to defend, indemnify, and hold harmless LeadPilot AI Inc. and its officers, directors, and employees from and against any third-party claims, damages, liabilities, costs, or expenses (including reasonable legal fees) arising out of or related to:
              </p>
              <ul className="terms-feature-list">
                <li className="terms-feature-item">
                  <CheckCircle2 className="terms-feature-icon" size={18} />
                  <div>Your misuse of LeadPilot AI or violation of these Terms of Service.</div>
                </li>
                <li className="terms-feature-item">
                  <CheckCircle2 className="terms-feature-icon" size={18} />
                  <div>Your breach of Meta, WhatsApp, or Google developer terms and policies.</div>
                </li>
                <li className="terms-feature-item">
                  <CheckCircle2 className="terms-feature-icon" size={18} />
                  <div>Any unauthorized messages, spam, or unlawful lead data processed in your workspace.</div>
                </li>
              </ul>
            </section>

            {/* 18. Changes to Terms */}
            <section id="section-18" className="terms-section-card">
              <div className="terms-section-header">
                <div className="terms-section-icon">
                  <FileText size={20} />
                </div>
                <h2 className="terms-section-title">18. Modifications to Terms of Service</h2>
              </div>
              <p className="terms-p">
                LeadPilot AI reserves the right to modify or update these Terms at any time. When material changes are made, we will update the &quot;Last Updated&quot; date at the top of this page and notify workspace administrators via email or in-app notification at least 30 days prior to effective implementation.
              </p>
            </section>

            {/* 19. Governing Law */}
            <section id="section-19" className="terms-section-card">
              <div className="terms-section-header">
                <div className="terms-section-icon">
                  <Globe size={20} />
                </div>
                <h2 className="terms-section-title">19. Governing Law & Jurisdiction</h2>
              </div>
              <p className="terms-p">
                These Terms of Service and any disputes or claims arising out of or in connection with them shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles. Any legal suit, action, or proceeding shall be instituted exclusively in competent courts of jurisdiction.
              </p>
            </section>

            {/* 20. Contact Information */}
            <section id="section-20" className="terms-section-card">
              <div className="terms-section-header">
                <div className="terms-section-icon">
                  <Mail size={20} />
                </div>
                <h2 className="terms-section-title">20. Contact Information</h2>
              </div>
              <p className="terms-p">
                If you have any questions, legal inquiries, or compliance concerns regarding these Terms of Service, please contact our Legal & Protection team:
              </p>

              <div className="terms-contact-grid">
                <div className="terms-contact-card">
                  <div className="terms-contact-icon">
                    <Building2 size={20} />
                  </div>
                  <div className="terms-contact-info">
                    <div className="terms-contact-label">Corporate Entity</div>
                    <div className="terms-contact-val">LeadPilot AI Inc.</div>
                  </div>
                </div>

                <div className="terms-contact-card">
                  <div className="terms-contact-icon">
                    <Mail size={20} />
                  </div>
                  <div className="terms-contact-info">
                    <div className="terms-contact-label">Legal Support Email</div>
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
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="terms-site-footer">
        <div className="terms-footer-container">
          <div className="terms-footer-top">
            <div className="terms-footer-brand">
              <Link href="/" className="terms-footer-logo">
                <div className="terms-logo-box">LP</div>
                <span>LeadPilot AI</span>
              </Link>
              <p className="terms-footer-desc">
                AI-Powered Real Estate CRM, Lead Qualification & Multi-Channel Automation Engine for Enterprise Sales Teams.
              </p>
            </div>

            <div className="terms-footer-nav">
              <div className="terms-footer-col">
                <div className="terms-footer-heading">Legal & Privacy</div>
                <div className="terms-footer-links">
                  <Link href="/privacy-policy" className="terms-footer-link">Privacy Policy</Link>
                  <Link href="/terms-of-service" className="terms-footer-link">Terms of Service</Link>
                  <Link href="/data-deletion" className="terms-footer-link">Data Deletion</Link>
                  <a href="mailto:entecmedia@gmail.com" className="terms-footer-link">Security Overview</a>
                </div>
              </div>

              <div className="terms-footer-col">
                <div className="terms-footer-heading">Platform</div>
                <div className="terms-footer-links">
                  <Link href="/" className="terms-footer-link">Dashboard</Link>
                  <a href="mailto:entecmedia@gmail.com" className="terms-footer-link">Contact Sales</a>
                  <a href="mailto:entecmedia@gmail.com" className="terms-footer-link">Support</a>
                </div>
              </div>
            </div>
          </div>

          <div className="terms-footer-bottom">
            <div>&copy; {new Date().getFullYear()} LeadPilot AI Inc. All rights reserved.</div>
            <div>Meta Developer Partner &amp; Google API Compliant</div>
          </div>
        </div>
      </footer>
    </div>
  );
};
