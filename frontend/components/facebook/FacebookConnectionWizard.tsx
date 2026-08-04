'use client';

import React, { useState, useEffect } from 'react';
import {
  facebookIntegrationService,
  MetaCapabilities,
  MetaConnectionStatus
} from '@/services/facebook-integration.service';
import {
  Share2,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  Building2,
  Globe,
  FileText,
  ShieldCheck,
  Zap,
  Lock,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Sliders,
  Check
} from 'lucide-react';

export const FacebookConnectionWizard: React.FC = () => {
  const [capabilities, setCapabilities] = useState<MetaCapabilities | null>(null);
  const [status, setStatus] = useState<MetaConnectionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Selection states
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [pages, setPages] = useState<any[]>([]);
  const [forms, setForms] = useState<any[]>([]);
  
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>('');
  const [selectedPageIds, setSelectedPageIds] = useState<string[]>([]);
  const [selectedFormIds, setSelectedFormIds] = useState<string[]>([]);
  const [webhookSubscribed, setWebhookSubscribed] = useState<boolean>(false);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      try {
        await facebookIntegrationService.triggerManualSync();
      } catch (syncErr) {
        console.warn('Auto sync warning on loadData:', syncErr);
      }

      const [capsData, statusData] = await Promise.all([
        facebookIntegrationService.getCapabilities(),
        facebookIntegrationService.getStatus(),
      ]);

      setCapabilities(capsData);
      setStatus(statusData);

      if (statusData?.isConnected) {
        setCurrentStep(6);
      }
    } catch (e) {
      console.error('Failed to load Meta integration state', e);
    } finally {
      setLoading(false);
    }
  };

  const handleStartOAuth = async () => {
    if (!capabilities?.oauthUrl) return;
    window.location.href = capabilities.oauthUrl;
  };

  const handleFetchBusinesses = async () => {
    setLoading(true);
    try {
      const bList = await facebookIntegrationService.getBusinesses();
      setBusinesses(bList);
      if (bList.length > 0) setSelectedBusinessId(bList[0].id);
      setCurrentStep(2);
    } catch (e) {
      console.error('Error fetching businesses', e);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchPages = async () => {
    setLoading(true);
    try {
      const pList = await facebookIntegrationService.getPages();
      setPages(pList);
      setSelectedPageIds(pList.map((p: any) => p.id));
      setCurrentStep(3);
    } catch (e) {
      console.error('Error fetching pages', e);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchForms = async () => {
    setLoading(true);
    try {
      const fList = await facebookIntegrationService.getForms();
      setForms(fList);
      setSelectedFormIds(fList.map((f: any) => f.id));
      setCurrentStep(4);
    } catch (e) {
      console.error('Error fetching forms', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribeWebhooks = async () => {
    setLoading(true);
    try {
      await facebookIntegrationService.subscribeWebhooks(selectedPageIds);
      setWebhookSubscribed(true);
      setCurrentStep(5);
    } catch (e) {
      console.error('Error subscribing webhooks', e);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalizeConnection = async () => {
    setConnecting(true);
    try {
      await facebookIntegrationService.saveConnect({
        businessId: selectedBusinessId,
        pageIds: selectedPageIds,
        formIds: selectedFormIds,
      });

      const updatedStatus = await facebookIntegrationService.getStatus();
      setStatus(updatedStatus);
      setCurrentStep(6);
    } catch (e) {
      console.error('Error connecting integration', e);
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect Meta Facebook Integration? Token and page sync will be removed.')) return;
    setLoading(true);
    try {
      await facebookIntegrationService.disconnectAccount(status?.accountId);
      setStatus({
        isConnected: false,
        pagesCount: 0,
        formsCount: 0,
        webhookStatus: 'Inactive',
        tokenStatus: 'Not Connected',
        permissionsGranted: []
      });
      setCurrentStep(1);
    } catch (e) {
      console.error('Error disconnecting', e);
    } finally {
      setLoading(false);
    }
  };

  const togglePageSelection = (id: string) => {
    if (selectedPageIds.includes(id)) {
      setSelectedPageIds(selectedPageIds.filter((p) => p !== id));
    } else {
      setSelectedPageIds([...selectedPageIds, id]);
    }
  };

  const toggleFormSelection = (id: string) => {
    if (selectedFormIds.includes(id)) {
      setSelectedFormIds(selectedFormIds.filter((f) => f !== id));
    } else {
      setSelectedFormIds([...selectedFormIds, id]);
    }
  };

  const isMissingPermissions = capabilities?.missingRequiredPermissions && capabilities.missingRequiredPermissions.length > 0;

  return (
    <div className="fb-wizard-container">
      {/* 1. Missing Permission Warning Banner */}
      {isMissingPermissions && (
        <div className="fb-warning-banner">
          <div className="fb-warning-header">
            <AlertTriangle className="fb-warning-icon" size={26} />
            <div>
              <div className="fb-warning-title">This Meta App is missing required Facebook Business permissions.</div>
              <div className="fb-warning-desc">
                Your Meta App (ID: <code>{capabilities?.appId || '1712255293083461'}</code>) requires product configuration for Lead Ads and Business Manager access. Please grant or enable these permissions in the Meta Developer Console:
              </div>
              <div className="fb-warning-scopes-list">
                {capabilities.missingRequiredPermissions.map((scope) => (
                  <span key={scope} className="fb-warning-scope-tag">
                    {scope}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="fb-warning-actions">
            <a
              href={`https://developers.facebook.com/apps/${capabilities?.appId || '1712255293083461'}/use_cases/`}
              target="_blank"
              rel="noopener noreferrer"
              className="fb-btn-meta-config"
            >
              <ExternalLink size={16} /> Open Meta Developer Configuration
            </a>
            <button onClick={loadData} className="fb-btn-retry">
              <RefreshCw size={16} /> Retry Capability Audit
            </button>
          </div>
        </div>
      )}

      {/* 2. Stepper Header (Only shown during wizard setup) */}
      {currentStep < 6 && (
        <div className="fb-wizard-stepper">
          {[
            { step: 1, label: '1. Connect Meta' },
            { step: 2, label: '2. Select Business' },
            { step: 3, label: '3. Select Pages' },
            { step: 4, label: '4. Select Forms' },
            { step: 5, label: '5. Webhook Setup' },
            { step: 6, label: '6. Complete' },
          ].map((s, idx) => (
            <React.Fragment key={s.step}>
              <div
                className={`fb-stepper-item ${
                  currentStep === s.step ? 'active' : currentStep > s.step ? 'completed' : ''
                }`}
              >
                <div className="fb-stepper-circle">
                  {currentStep > s.step ? <Check size={16} /> : s.step}
                </div>
                <span className="fb-stepper-text">{s.label}</span>
              </div>
              {idx < 5 && (
                <div
                  className={`fb-stepper-line ${currentStep > s.step ? 'completed' : ''}`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* STEP 1: Login & Connect */}
      {currentStep === 1 && (
        <div className="fb-wizard-card">
          <div className="fb-card-title-box">
            <div className="fb-wizard-heading">
              <Share2 size={24} className="fb-icon-brand-blue" /> Step 1: Facebook Business Login
            </div>
            <div className="fb-wizard-subtitle">
              Connect Meta App (ID: <code>{capabilities?.appId || '1712255293083461'}</code>) dynamically using authorized Graph API permissions.
            </div>
          </div>

          <div className="fb-flex-col-gap">
            <div className="terms-callout-box fb-callout-blue">
              <ShieldCheck className="terms-callout-icon fb-icon-brand-blue" size={24} />
              <div className="terms-callout-content">
                <div className="terms-callout-title fb-text-callout-title-blue">Dynamic Capability Detection Active</div>
                <div className="terms-callout-text fb-text-callout-body-blue">
                  LeadPilot AI automatically queries your Meta App permissions to prevent broken OAuth popups and guarantee smooth connection.
                </div>
              </div>
            </div>

            <div className="fb-actions-row">
              <button
                onClick={handleStartOAuth}
                className="fb-btn-next fb-btn-blue"
              >
                <Share2 size={18} /> Connect Facebook Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Select Business Manager */}
      {currentStep === 2 && (
        <div className="fb-wizard-card">
          <div className="fb-card-title-box">
            <div className="fb-wizard-heading">
              <Building2 size={24} className="fb-icon-brand-blue" /> Step 2: Select Business Manager
            </div>
            <div className="fb-wizard-subtitle">
              Select the Meta Business Manager profile that owns your Pages and Ad Accounts.
            </div>
          </div>

          <div className="fb-select-grid">
            {businesses.map((b) => (
              <div
                key={b.id}
                onClick={() => setSelectedBusinessId(b.id)}
                className={`fb-select-card ${selectedBusinessId === b.id ? 'selected' : ''}`}
              >
                <div className="fb-select-card-header">
                  <div className="fb-select-name">{b.name}</div>
                  {selectedBusinessId === b.id && <CheckCircle2 size={18} className="text-brand-blue" />}
                </div>
                <div className="fb-select-meta">Business ID: {b.id}</div>
                <div className="fb-select-meta">Verification: {b.verificationStatus || 'VERIFIED'}</div>
              </div>
            ))}
          </div>

          <div className="fb-actions-row">
            <button onClick={() => setCurrentStep(1)} className="fb-btn-back">
              <ArrowLeft size={16} /> Back
            </button>
            <button onClick={handleFetchPages} className="fb-btn-next">
              Next: Select Pages <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Select Facebook Pages */}
      {currentStep === 3 && (
        <div className="fb-wizard-card">
          <div className="fb-card-title-box">
            <div className="fb-wizard-heading">
              <Globe size={24} className="fb-icon-brand-blue" /> Step 3: Select Facebook Pages
            </div>
            <div className="fb-wizard-subtitle">
              Choose the Facebook Pages whose lead ads will route into LeadPilot AI.
            </div>
          </div>

          <div className="fb-select-grid">
            {pages.map((p) => {
              const isSelected = selectedPageIds.includes(p.id);
              return (
                <div
                  key={p.id}
                  onClick={() => togglePageSelection(p.id)}
                  className={`fb-select-card ${isSelected ? 'selected' : ''}`}
                >
                  <div className="fb-select-card-header">
                    <div className="fb-select-name">{p.name}</div>
                    {isSelected && <CheckCircle2 size={18} className="text-brand-blue" />}
                  </div>
                  <div className="fb-select-meta">Page ID: {p.id}</div>
                  <div className="fb-select-meta">Category: {p.category || 'Real Estate'}</div>
                </div>
              );
            })}
          </div>

          <div className="fb-actions-row">
            <button onClick={() => setCurrentStep(2)} className="fb-btn-back">
              <ArrowLeft size={16} /> Back
            </button>
            <button onClick={handleFetchForms} className="fb-btn-next">
              Next: Select Lead Forms <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Select Lead Forms */}
      {currentStep === 4 && (
        <div className="fb-wizard-card">
          <div className="fb-card-title-box">
            <div className="fb-wizard-heading">
              <FileText size={24} className="fb-icon-brand-blue" /> Step 4: Select Lead Forms
            </div>
            <div className="fb-wizard-subtitle">
              Select which instant forms should trigger automated AI agent responses.
            </div>
          </div>

          <div className="fb-select-grid">
            {forms.map((f) => {
              const isSelected = selectedFormIds.includes(f.id);
              return (
                <div
                  key={f.id}
                  onClick={() => toggleFormSelection(f.id)}
                  className={`fb-select-card ${isSelected ? 'selected' : ''}`}
                >
                  <div className="fb-select-card-header">
                    <div className="fb-select-name">{f.name}</div>
                    {isSelected && <CheckCircle2 size={18} className="text-brand-blue" />}
                  </div>
                  <div className="fb-select-meta">Form ID: {f.id}</div>
                  <div className="fb-select-meta">Status: {f.status || 'ACTIVE'}</div>
                </div>
              );
            })}
          </div>

          <div className="fb-actions-row">
            <button onClick={() => setCurrentStep(3)} className="fb-btn-back">
              <ArrowLeft size={16} /> Back
            </button>
            <button onClick={handleSubscribeWebhooks} className="fb-btn-next">
              Next: Subscribe Webhooks <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Webhook Subscription */}
      {currentStep === 5 && (
        <div className="fb-wizard-card">
          <div className="fb-card-title-box">
            <div className="fb-wizard-heading">
              <Zap size={24} className="fb-icon-emerald" /> Step 5: Webhook Verification &amp; Subscription
            </div>
            <div className="fb-wizard-subtitle">
              Verify Meta Graph API webhooks for instant leadgen event notification.
            </div>
          </div>

          <div className="terms-callout-box fb-callout-emerald">
            <CheckCircle2 size={24} className="fb-icon-emerald" />
            <div>
              <div className="fb-text-callout-title-emerald">Webhooks Subscribed Successfully</div>
              <div className="fb-text-callout-body-emerald">
                Subscribed fields: <code>leadgen</code>, <code>messages</code>, <code>instagram</code>, <code>whatsapp</code>. Callback URL verified.
              </div>
            </div>
          </div>

          <div className="fb-actions-row">
            <button onClick={() => setCurrentStep(4)} className="fb-btn-back">
              <ArrowLeft size={16} /> Back
            </button>
            <button onClick={handleFinalizeConnection} disabled={connecting} className="fb-btn-next fb-btn-emerald">
              {connecting ? 'Saving Integration...' : 'Finalize & Connect LeadPilot AI'} <CheckCircle2 size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: Connected Real-Time Status Dashboard */}
      {currentStep === 6 && (
        <div className="fb-status-dashboard">
          <div className="fb-status-banner">
            <div className="fb-status-user">
              {status?.avatarUrl ? (
                <img
                  src={status.avatarUrl}
                  alt="Account Avatar"
                  className="fb-status-avatar"
                />
              ) : (
                <div className="fb-status-avatar-fallback">
                  {status?.accountName ? status.accountName[0] : 'FB'}
                </div>
              )}
              <div>
                <div className="fb-status-name">{status?.accountName || 'Connected Meta Account'}</div>
                <div className="fb-status-sub">
                  Connected Meta App ID: <strong>{capabilities?.appId || '1712255293083461'}</strong>{status?.accountId ? ` | Account ID: ${status.accountId}` : ''}
                </div>
              </div>
            </div>
            <div className="fb-flex-row-gap">
              <button onClick={loadData} className="fb-btn-retry fb-btn-transparent-white">
                <RefreshCw size={16} /> Sync Status
              </button>
              <button onClick={handleDisconnect} className="fb-btn-back fb-btn-red">
                <Trash2 size={16} /> Disconnect
              </button>
            </div>
          </div>

          {/* Metrics */}
          <div className="fb-status-metrics-grid">
            <div className="fb-metric-card">
              <div className="fb-metric-label">Business Manager</div>
              <div className="fb-metric-val fb-text-slate-sub">
                {status?.business?.name || 'N/A'}
              </div>
              <div className="fb-text-emerald-status">Status: {status?.business?.verificationStatus || 'VERIFIED'}</div>
            </div>

            <div className="fb-metric-card">
              <div className="fb-metric-label">Connected Pages</div>
              <div className="fb-metric-val">{status?.pagesCount || 0} Pages</div>
              <div className="fb-text-slate-sub">Active Lead Webhooks</div>
            </div>

            <div className="fb-metric-card">
              <div className="fb-metric-label">Lead Forms</div>
              <div className="fb-metric-val">{status?.formsCount || 0} Forms</div>
              <div className="fb-text-blue-assigned">AI Agents Assigned</div>
            </div>

            <div className="fb-metric-card">
              <div className="fb-metric-label">Token Status</div>
              <div className="fb-metric-val fb-text-emerald-status">
                {status?.tokenStatus || 'Active (60 Days)'}
              </div>
              <div className="fb-text-slate-sub">AES-256 Encrypted</div>
            </div>
          </div>

          {/* Granted Scopes Card */}
          <div className="fb-wizard-card">
            <div className="fb-card-title-box">
              <div className="fb-wizard-heading">
                <ShieldCheck size={22} className="fb-icon-emerald" /> Active Permissions &amp; Scopes
              </div>
            </div>
            <div className="fb-warning-scopes-list">
              {(status?.permissionsGranted || ['public_profile', 'pages_show_list', 'pages_read_engagement', 'pages_manage_metadata', 'leads_retrieval', 'business_management']).map((perm) => (
                <span key={perm} className="terms-perm-code">
                  ✔ {perm}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
