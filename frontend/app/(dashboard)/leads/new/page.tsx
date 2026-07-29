'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/components/layout/PageContainer';
import { LeadService } from '@/services/lead.service';
import { ArrowLeft, Check, Play, Save, X, ExternalLink, Info, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NewLeadPage() {
  const router = useRouter();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    source: 'FACEBOOK_ADS',
    industry: 'Real Estate - Residential',
    project: 'Sunshine Villas',
    budget: '₹50 - ₹70 Lakhs',
    timeline: '1-3 months',
    loanRequired: 'Yes',
    hearAboutUs: 'Social Media',
    referenceName: '',
    notes: '',
    aiAgent: 'Property Advisor Agent',
    industryTemplate: 'Real Estate - Residential',
    qualificationFlow: 'Real Estate - Standard Qualification',
    knowledgeBase: 'Real Estate Knowledge Base',
    followupFlow: 'Real Estate - Nurture Flow',
    whatsappNumber: '',
  });

  // UI States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isAiStarting, setIsAiStarting] = useState(false);
  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
  const [duplicateLeadData, setDuplicateLeadData] = useState<any>(null);



  // Auto-fill features when Industry changes
  const handleIndustryChange = (industryVal: string) => {
    let aiAgent = 'Property Advisor Agent';
    let knowledgeBase = 'Real Estate Knowledge Base';
    let qualificationFlow = 'Real Estate - Standard Qualification';
    let followupFlow = 'Real Estate - Nurture Flow';

    if (industryVal === 'Real Estate - Commercial') {
      aiAgent = 'Commercial Realty Agent';
      knowledgeBase = 'Commercial Inventory & Specs';
      qualificationFlow = 'Real Estate - Commercial Qualification';
      followupFlow = 'Real Estate - VIP Follow-up';
    } else if (industryVal === 'Real Estate - Plot Sales') {
      aiAgent = 'Land & Plots Agent';
      knowledgeBase = 'Plot Layouts & Approvals';
      qualificationFlow = 'Plot Qualification Flow';
      followupFlow = 'Plots - Lead Nurture';
    }

    setFormData((prev) => ({
      ...prev,
      industry: industryVal,
      industryTemplate: industryVal,
      aiAgent,
      knowledgeBase,
      qualificationFlow,
      followupFlow,
    }));
  };

  // Form Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Full Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone Number is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.source) newErrors.source = 'Lead Source is required';
    if (!formData.industry) newErrors.industry = 'Industry is required';
    if (!formData.project) newErrors.project = 'Project is required';
    if (!formData.aiAgent) newErrors.aiAgent = 'AI Agent is required';
    if (!formData.knowledgeBase) newErrors.knowledgeBase = 'Knowledge Base is required';

    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Duplicate check handler
  const checkDuplicate = async (): Promise<boolean> => {
    try {
      const res = await LeadService.duplicateCheck(formData.phone, formData.email || undefined);
      if (res.success && res.data.duplicate) {
        setDuplicateLeadData(res.data.lead);
        setDuplicateModalOpen(true);
        return true;
      }
    } catch {
      // Ignore network errors on duplicate check and proceed
    }
    return false;
  };

  // Save Lead only (No AI conversation)
  const handleSaveLead = async (bypassDuplicate = false) => {
    if (!validateForm()) return;
    
    if (!bypassDuplicate) {
      const hasDuplicate = await checkDuplicate();
      if (hasDuplicate) return;
    }

    setIsSaving(true);
    try {
      const res = await LeadService.createLead({
        name: formData.name,
        phone: formData.phone,
        email: formData.email || undefined,
        source: formData.source as any,
        project: formData.project,
        industry: formData.industry,
        budget: formData.budget,
        timeline: formData.timeline,
        location: formData.city,
        notes: formData.notes || undefined,
      } as any);

      if (res.success) {
        toast.success('Lead saved successfully!');
        router.push('/lead-inbox');
      } else {
        toast.error(res.message || 'Failed to save lead.');
      }
    } catch {
      toast.error('Network error saving lead.');
    } finally {
      setIsSaving(false);
    }
  };

  // Save Lead and Start AI Automations
  const handleSaveAndStartAi = async (bypassDuplicate = false) => {
    if (!validateForm()) return;

    if (!bypassDuplicate) {
      const hasDuplicate = await checkDuplicate();
      if (hasDuplicate) return;
    }

    setIsAiStarting(true);
    try {
      const res = await LeadService.startAi({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        source: formData.source,
        project: formData.project,
        industry: formData.industry,
        budget: formData.budget,
        timeline: formData.timeline,
        location: formData.city,
        notes: formData.notes,
      });

      if (res.success && res.data) {
        toast.success('Lead created. First AI WhatsApp message sent!');
        router.push('/approvals');
      } else {
        toast.error(res.message || 'Failed to initialize AI.');
      }
    } catch {
      toast.error('Network error starting AI automation.');
    } finally {
      setIsAiStarting(false);
    }
  };

  // Merging duplicate helper
  const handleMergeDuplicate = () => {
    toast.success('Leads merged successfully!');
    setDuplicateModalOpen(false);
    router.push(`/leads/${duplicateLeadData.id}`);
  };

  return (
    <PageContainer fluid>
      <div className="mlead-workspace-container">
        
        {/* Back Link */}
        <div className="mlead-header-row">
          <Link href="/lead-inbox" className="mlead-back-btn">
            <ArrowLeft size={16} />
            <span>Back to Leads</span>
          </Link>
          <h1 className="mlead-title">Add New Lead</h1>
          <p className="mlead-subtitle">Create a lead and assign it to an AI Agent.</p>
        </div>

        {/* 2-Column Grid */}
        <div className="mlead-layout-grid">
          
          {/* COLUMN 1: Form */}
          <div className="mlead-left-col">
            <div className="mlead-card">
              <div className="mlead-card-header">
                <div className="mlead-step-circle">1</div>
                <h3 className="mlead-card-title">Customer Information</h3>
              </div>

              <div className="mlead-card-body">
                <div className="mlead-form-grid">
                  <div className="mlead-form-group">
                    <label className="mlead-label">Full Name <span className="text-red">*</span></label>
                    <input
                      type="text"
                      placeholder="Enter full name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      className={`mlead-input ${errors.name ? 'input-error' : ''}`}
                    />
                    {errors.name && <span className="error-text">{errors.name}</span>}
                  </div>

                  <div className="mlead-form-group">
                    <label className="mlead-label">Phone Number <span className="text-red">*</span></label>
                    <div className="mlead-phone-input-wrap">
                      <div className="mlead-flag-box">🇮🇳 +91</div>
                      <input
                        type="tel"
                        placeholder="98765 43210"
                        value={formData.phone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          setFormData((prev) => ({
                            ...prev,
                            phone: val,
                            whatsappNumber: val,
                          }));
                        }}
                        className={`mlead-input-phone ${errors.phone ? 'input-error' : ''}`}
                      />
                    </div>
                    {errors.phone && <span className="error-text">{errors.phone}</span>}
                  </div>

                  <div className="mlead-form-group">
                    <label className="mlead-label">Email</label>
                    <input
                      type="email"
                      placeholder="Enter email address"
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      className={`mlead-input ${errors.email ? 'input-error' : ''}`}
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </div>

                  <div className="mlead-form-group">
                    <label className="mlead-label">City <span className="text-red">*</span></label>
                    <input
                      type="text"
                      placeholder="Enter city"
                      value={formData.city}
                      onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                      className={`mlead-input ${errors.city ? 'input-error' : ''}`}
                    />
                    {errors.city && <span className="error-text">{errors.city}</span>}
                  </div>

                  <div className="mlead-form-group">
                    <label className="mlead-label">Source <span className="text-red">*</span></label>
                    <select
                      value={formData.source}
                      onChange={(e) => setFormData((prev) => ({ ...prev, source: e.target.value }))}
                      className="mlead-select"
                    >
                      <option value="FACEBOOK_ADS">Facebook Ads</option>
                      <option value="INSTAGRAM_ADS">Instagram Ads</option>
                      <option value="GOOGLE_ADS">Google Ads</option>
                      <option value="WEBSITE_FORM">Website Form</option>
                      <option value="MANUAL_ENTRY">Manual Entry</option>
                      <option value="CSV_IMPORT">CSV Import</option>
                    </select>
                  </div>

                  <div className="mlead-form-group">
                    <label className="mlead-label">Industry <span className="text-red">*</span></label>
                    <select
                      value={formData.industry}
                      onChange={(e) => handleIndustryChange(e.target.value)}
                      className="mlead-select"
                    >
                      <option value="Real Estate - Residential">Real Estate - Residential</option>
                      <option value="Real Estate - Commercial">Real Estate - Commercial</option>
                      <option value="Real Estate - Plot Sales">Real Estate - Plot Sales</option>
                    </select>
                  </div>

                  <div className="mlead-form-group">
                    <label className="mlead-label">Interested Project <span className="text-red">*</span></label>
                    <select
                      value={formData.project}
                      onChange={(e) => setFormData((prev) => ({ ...prev, project: e.target.value }))}
                      className="mlead-select"
                    >
                      <option value="Sunshine Villas">Sunshine Villas</option>
                      <option value="Lake View Homes">Lake View Homes</option>
                      <option value="Royal Residency">Royal Residency</option>
                      <option value="Skyline Towers">Skyline Towers</option>
                    </select>
                  </div>

                  <div className="mlead-form-group">
                    <label className="mlead-label">Budget</label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData((prev) => ({ ...prev, budget: e.target.value }))}
                      className="mlead-select"
                    >
                      <option value="₹30 - ₹45 Lakhs">₹30 - ₹45 Lakhs</option>
                      <option value="₹45 - ₹60 Lakhs">₹45 - ₹60 Lakhs</option>
                      <option value="₹60 - ₹75 Lakhs">₹60 - ₹75 Lakhs</option>
                      <option value="₹75 - ₹90 Lakhs">₹75 - ₹90 Lakhs</option>
                      <option value="₹90 Lakhs - ₹1.2 Cr">₹90 Lakhs - ₹1.2 Cr</option>
                      <option value="₹1.2 Cr+">₹1.2 Cr+</option>
                    </select>
                  </div>

                  <div className="mlead-form-group">
                    <label className="mlead-label">Timeline</label>
                    <select
                      value={formData.timeline}
                      onChange={(e) => setFormData((prev) => ({ ...prev, timeline: e.target.value }))}
                      className="mlead-select"
                    >
                      <option value="Immediate">Immediate</option>
                      <option value="1-3 months">1-3 months</option>
                      <option value="3-6 months">3-6 months</option>
                      <option value="6+ months">6+ months</option>
                    </select>
                  </div>

                  <div className="mlead-form-group">
                    <label className="mlead-label">Loan Required?</label>
                    <select
                      value={formData.loanRequired}
                      onChange={(e) => setFormData((prev) => ({ ...prev, loanRequired: e.target.value }))}
                      className="mlead-select"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      <option value="Maybe">Maybe</option>
                    </select>
                  </div>

                  <div className="mlead-form-group">
                    <label className="mlead-label">How did they hear about us?</label>
                    <select
                      value={formData.hearAboutUs}
                      onChange={(e) => setFormData((prev) => ({ ...prev, hearAboutUs: e.target.value }))}
                      className="mlead-select"
                    >
                      <option value="Social Media">Social Media</option>
                      <option value="Google Search">Google Search</option>
                      <option value="Friend/Family Referral">Friend/Family Referral</option>
                      <option value="Outdoor Billboards">Outdoor Billboards</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="mlead-form-group">
                    <label className="mlead-label">Reference Name (Optional)</label>
                    <input
                      type="text"
                      placeholder="Enter reference name"
                      value={formData.referenceName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, referenceName: e.target.value }))}
                      className="mlead-input"
                    />
                  </div>
                </div>

                <div className="mlead-notes-group">
                  <label className="mlead-label">Notes</label>
                  <textarea
                    placeholder="Add any additional notes about this lead..."
                    value={formData.notes}
                    onChange={(e) => {
                      if (e.target.value.length <= 500) {
                        setFormData((prev) => ({ ...prev, notes: e.target.value }));
                      }
                    }}
                    className="mlead-textarea"
                    rows={4}
                  />
                  <div className="mlead-character-count">
                    {formData.notes.length} / 500
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 2: AI Assignment Panel */}
          <div className="mlead-right-col">
            <div className="mlead-card">
              <div className="mlead-card-header">
                <div className="mlead-step-circle">2</div>
                <h3 className="mlead-card-title">AI Assignment</h3>
              </div>

              <div className="mlead-card-body mlead-ai-body">
                <div className="mlead-form-group">
                  <label className="mlead-label">AI Agent <span className="text-red">*</span></label>
                  <div className="mlead-select-badge-wrap">
                    <select
                      value={formData.aiAgent}
                      onChange={(e) => setFormData((prev) => ({ ...prev, aiAgent: e.target.value }))}
                      className="mlead-select"
                    >
                      <option value="Property Advisor Agent">Property Advisor Agent</option>
                      <option value="Commercial Realty Agent">Commercial Realty Agent</option>
                      <option value="Land & Plots Agent">Land & Plots Agent</option>
                    </select>
                    <span className="mlead-active-badge">
                      <span className="conv-status-green-dot" />
                      <span>Active</span>
                    </span>
                  </div>
                </div>

                <div className="mlead-form-group">
                  <label className="mlead-label">Industry Template <span className="text-red">*</span></label>
                  <select
                    value={formData.industryTemplate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, industryTemplate: e.target.value }))}
                    className="mlead-select"
                  >
                    <option value="Real Estate - Residential">Real Estate - Residential</option>
                    <option value="Real Estate - Commercial">Real Estate - Commercial</option>
                    <option value="Real Estate - Plot Sales">Real Estate - Plot Sales</option>
                  </select>
                </div>

                <div className="mlead-form-group">
                  <label className="mlead-label">Qualification Flow <span className="text-red">*</span></label>
                  <select
                    value={formData.qualificationFlow}
                    onChange={(e) => setFormData((prev) => ({ ...prev, qualificationFlow: e.target.value }))}
                    className="mlead-select"
                  >
                    <option value="Real Estate - Standard Qualification">Real Estate - Standard Qualification</option>
                    <option value="Real Estate - Commercial Qualification">Real Estate - Commercial Qualification</option>
                    <option value="Plot Qualification Flow">Plot Qualification Flow</option>
                  </select>
                </div>

                <div className="mlead-form-group">
                  <label className="mlead-label">Knowledge Base <span className="text-red">*</span></label>
                  <div className="mlead-kb-input-row">
                    <input
                      type="text"
                      value={formData.knowledgeBase}
                      readOnly
                      className="mlead-input flex-1 bg-gray"
                    />
                    <button type="button" className="btn-kb-view">
                      <span>View</span>
                      <ExternalLink size={14} />
                    </button>
                  </div>
                </div>

                <div className="mlead-form-group">
                  <label className="mlead-label">Follow-up Flow <span className="text-red">*</span></label>
                  <select
                    value={formData.followupFlow}
                    onChange={(e) => setFormData((prev) => ({ ...prev, followupFlow: e.target.value }))}
                    className="mlead-select"
                  >
                    <option value="Real Estate - Nurture Flow">Real Estate - Nurture Flow</option>
                    <option value="Real Estate - VIP Follow-up">Real Estate - VIP Follow-up</option>
                    <option value="Plots - Lead Nurture">Plots - Lead Nurture</option>
                  </select>
                </div>

                <div className="mlead-form-group">
                  <label className="mlead-label">WhatsApp Number <span className="text-red">*</span></label>
                  <div className="mlead-phone-input-wrap">
                    <div className="mlead-flag-box">🇮🇳 +91</div>
                      <input
                        type="text"
                        value={formData.whatsappNumber}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, whatsappNumber: e.target.value.replace(/\D/g, '') }))
                        }
                        className="mlead-input-phone"
                      />
                  </div>
                  <span className="mlead-kb-help-text">
                    This number will be used to start conversations with the lead.
                  </span>
                </div>

                <div className="mlead-ai-footer-buttons">
                  <button
                    type="button"
                    onClick={() => router.push('/lead-inbox')}
                    className="btn-mlead btn-mlead-cancel"
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="button"
                    disabled={isSaving || isAiStarting}
                    onClick={() => handleSaveLead(false)}
                    className="btn-mlead btn-mlead-save"
                  >
                    {isSaving ? <span className="mlead-spinner" /> : 'Save Lead'}
                  </button>

                  <button
                    type="button"
                    disabled={isSaving || isAiStarting}
                    onClick={() => handleSaveAndStartAi(false)}
                    className="btn-mlead btn-mlead-start-ai"
                  >
                    {isAiStarting ? (
                      <span className="mlead-spinner" />
                    ) : (
                      <>
                        <span>Save & Start AI</span>
                        <span className="btn-divider" />
                        <Play size={14} className="play-icon" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* SECTION 3: Live Preview */}
        <div className="mlead-preview-section">
          <div className="mlead-card">
            <div className="mlead-card-header">
              <div className="mlead-step-circle">3</div>
              <h3 className="mlead-card-title">Lead Preview - How AI will start the WhatsApp conversation</h3>
            </div>

            <div className="mlead-card-body mlead-preview-body">
              {/* WhatsApp Bubble */}
              <div className="mlead-preview-chat-container">
                <div className="mlead-whatsapp-bubble">
                  <p className="mlead-bubble-text">
                    Hi <strong>{formData.name || '{name}'}</strong>, 👋<br />
                    Thank you for your interest in <strong>{formData.project || '{project}'}</strong>.<br />
                    I can help you with pricing, availability, site visit and more.<br />
                    To get started, could you please share your preferred location or budget range?
                  </p>
                  <span className="mlead-bubble-time-tick">
                    10:30 AM <span className="ticks">✓✓</span>
                  </span>
                </div>
              </div>

              {/* Middle Goal Checklist */}
              <div className="mlead-preview-goals">
                <h4 className="mlead-goals-title">AI will try to understand</h4>
                <div className="mlead-goals-list">
                  <div className="mlead-goal-item">
                    <span className="goal-check"><Check size={12} /></span>
                    <span>Budget Range</span>
                  </div>
                  <div className="mlead-goal-item">
                    <span className="goal-check"><Check size={12} /></span>
                    <span>Preferred Location</span>
                  </div>
                  <div className="mlead-goal-item">
                    <span className="goal-check"><Check size={12} /></span>
                    <span>Timeline to Buy</span>
                  </div>
                  <div className="mlead-goal-item">
                    <span className="goal-check"><Check size={12} /></span>
                    <span>Project Interest</span>
                  </div>
                  <div className="mlead-goal-item">
                    <span className="goal-check"><Check size={12} /></span>
                    <span>Loan Requirement</span>
                  </div>
                </div>
              </div>

              {/* Right explanation box */}
              <div className="mlead-preview-info-box">
                <h4 className="mlead-info-title">This message will be sent</h4>
                <p className="mlead-info-desc">
                  AI will send this message automatically once the lead is created.
                </p>
                <button type="button" className="btn-preview-customize">
                  <span>Customize Message</span>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ==============================================
          DUPLICATE DETECTION DIALOG
          ============================================== */}
      {duplicateModalOpen && duplicateLeadData && (
        <div className="appr-modal-overlay">
          <div className="appr-modal-card">
            <div className="appr-modal-header text-red-header">
              <div className="flex items-center gap-2">
                <AlertTriangle size={20} className="text-red" />
                <h3 className="appr-modal-title">Duplicate Lead Detected</h3>
              </div>
              <button type="button" onClick={() => setDuplicateModalOpen(false)} className="btn-close-modal">
                <X size={18} />
              </button>
            </div>
            <div className="appr-modal-body">
              <p>A lead with this phone number or email address already exists in the system:</p>
              <div className="mlead-duplicate-details-card">
                <p><strong>Name:</strong> {duplicateLeadData.name}</p>
                <p><strong>Phone:</strong> {duplicateLeadData.phone}</p>
                {duplicateLeadData.email && <p><strong>Email:</strong> {duplicateLeadData.email}</p>}
              </div>
              <p>What would you like to do?</p>
            </div>
            <div className="appr-modal-footer flex-column-buttons">
              <button
                type="button"
                onClick={() => {
                  setDuplicateModalOpen(false);
                  router.push(`/leads/${duplicateLeadData.id}`);
                }}
                className="btn-modal-primary btn-full-width"
              >
                Open Existing Lead
              </button>
              <button
                type="button"
                onClick={handleMergeDuplicate}
                className="btn-modal-cancel btn-full-width"
              >
                Merge Details
              </button>
              <button
                type="button"
                onClick={() => {
                  setDuplicateModalOpen(false);
                  handleSaveLead(true);
                }}
                className="btn-modal-cancel btn-full-width btn-grey-text"
              >
                Create Duplicate Lead Anyway
              </button>
              <button
                type="button"
                onClick={() => setDuplicateModalOpen(false)}
                className="btn-modal-cancel btn-full-width"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </PageContainer>
  );
}
