'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Bot,
  Send,
  Plus,
  Clock,
  Globe,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  Edit,
  ExternalLink,
  ChevronDown,
  Settings,
  BookOpen,
  MessageCircle,
  AlertCircle,
  X,
  FileText,
  Sparkles,
} from 'lucide-react';
import { AgentClientService, AIAgentItem } from '@/services/agent.service';
import { KnowledgeBaseView } from '@/components/knowledge-base/KnowledgeBaseView';
import toast from 'react-hot-toast';

export default function AIAgentConfigPage() {
  const params = useParams();
  const router = useRouter();
  const agentId = (params?.id as string) || '';

  const [agent, setAgent] = useState<AIAgentItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'general' | 'model' | 'kb' | 'business' | 'approval' | 'escalation' | 'advanced'>('general');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    industry: 'Real Estate',
    department: 'Sales',
    description: '',
    agentCode: 'PROP_ADVISOR_01',
    defaultLanguage: 'English (India)',
    supportedLanguages: ['English', 'Hindi', 'Hinglish'],
    businessHoursStart: '09:00 AM',
    businessHoursEnd: '08:00 PM',
    timeZone: 'Asia/Kolkata (GMT +05:30)',
    workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    status: 'Active',
    model: 'GPT-4o',
    connectedWhatsapp: '+91 98765 43210',
    responseTone: 'Professional',
    responseStyle: 'Helpful & Consultative',
    temperature: 0.7,
    responseLength: 'Medium',
    maxTokens: 1500,
    typingSpeed: 'Natural',
    systemPrompt:
      'You are Property Advisor AI, a real estate expert assistant for Acme Real Estate. Your goal is to understand customer requirements, share relevant property details, qualify leads, and help them book a site visit.\n\nAlways be professional, polite and helpful.',
  });

  const loadAgentDetails = useCallback(async () => {
    if (!agentId) return;
    setIsLoading(true);
    try {
      const res = await AgentClientService.getAgentById(agentId);
      if (res.success && res.data) {
        setAgent(res.data);
        setFormData({
          name: res.data.name || '',
          industry: res.data.industry || 'Real Estate',
          department: res.data.department || 'Sales',
          description: res.data.description || '',
          agentCode: res.data.agentCode || 'PROP_ADVISOR_01',
          defaultLanguage: res.data.defaultLanguage || 'English (India)',
          supportedLanguages: res.data.supportedLanguages || ['English', 'Hindi', 'Hinglish'],
          businessHoursStart: res.data.businessHours?.split(' - ')[0] || '09:00 AM',
          businessHoursEnd: res.data.businessHours?.split(' - ')[1] || '08:00 PM',
          timeZone: res.data.timeZone || 'Asia/Kolkata (GMT +05:30)',
          workingDays: res.data.workingDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
          status: res.data.status || 'Active',
          model: res.data.model || 'GPT-4o',
          connectedWhatsapp: res.data.connectedWhatsapp || '+91 98765 43210',
          responseTone: res.data.responseTone || 'Professional',
          responseStyle: res.data.responseStyle || 'Helpful & Consultative',
          temperature: res.data.temperature !== undefined ? res.data.temperature : 0.7,
          responseLength: res.data.responseLength || 'Medium',
          maxTokens: res.data.maxTokens || 1500,
          typingSpeed: res.data.typingSpeed || 'Natural',
          systemPrompt:
            res.data.systemPrompt ||
            'You are Property Advisor AI, a real estate expert assistant for Acme Real Estate. Your goal is to understand customer requirements, share relevant property details, qualify leads, and help them book a site visit.\n\nAlways be professional, polite and helpful.',
        });
      }
    } catch {
      toast.error('Failed to load agent configuration');
    } finally {
      setIsLoading(false);
    }
  }, [agentId]);

  useEffect(() => {
    loadAgentDetails();
  }, [loadAgentDetails]);

  const handleDayToggle = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter((d) => d !== day)
        : [...prev.workingDays, day],
    }));
  };

  const handleRemoveLanguage = (lang: string) => {
    setFormData((prev) => ({
      ...prev,
      supportedLanguages: prev.supportedLanguages.filter((l) => l !== lang),
    }));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        businessHours: `${formData.businessHoursStart} - ${formData.businessHoursEnd}`,
      };
      const res = await AgentClientService.updateAgent(agentId, payload);
      if (res.success) {
        toast.success('AI Agent configuration updated successfully!');
        setAgent(res.data);
      }
    } catch {
      toast.error('Failed to save configuration');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="agent-page-workspace">
        <div className="agent-loading-skeleton">Loading AI Agent Configuration...</div>
      </div>
    );
  }

  return (
    <div className="agent-page-workspace">
      
      {/* Top Breadcrumb Navigation */}
      <div className="agent-breadcrumb-row">
        <span onClick={() => router.push('/ai-agents')} className="agent-breadcrumb-link">
          AI Agents
        </span>
        <span className="agent-breadcrumb-sep">&gt;</span>
        <span className="agent-breadcrumb-link">{formData.name || 'Agent'}</span>
        <span className="agent-breadcrumb-sep">&gt;</span>
        <span className="agent-breadcrumb-current">Configuration</span>
      </div>

      {/* Page Header */}
      <div className="agent-header-row">
        <div>
          <div className="agent-title-status-wrap">
            <h1 className="agent-page-title">AI Agent Configuration</h1>
            <span className={`agent-status-badge ${formData.status === 'Active' ? 'active' : 'paused'}`}>
              {formData.status}
            </span>
          </div>
          <p className="agent-page-subtitle">Configure your AI agent behavior, model, tone, and business rules.</p>
        </div>

        <div className="agent-header-actions">
          <button type="button" className="btn-agent-secondary-action">
            <Send size={15} />
            <span>Test Agent</span>
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleSaveChanges}
            className="btn-agent-create-primary"
          >
            <Plus size={16} />
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Module Quick Launcher Bar */}
      <div className="agent-module-launcher-bar">
        <button
          type="button"
          onClick={() => setActiveTab('general')}
          className={`agent-launcher-btn ${activeTab !== 'kb' ? 'active' : ''}`}
        >
          <Settings size={14} />
          <span>Configuration</span>
        </button>

        <button
          type="button"
          onClick={() => router.push(`/ai-agents/${agentId}/knowledge-base`)}
          className={`agent-launcher-btn ${activeTab === 'kb' ? 'active' : ''}`}
        >
          <BookOpen size={14} />
          <span>Knowledge Base</span>
        </button>

        <button
          type="button"
          onClick={() => router.push(`/conversations`)}
          className="agent-launcher-btn"
        >
          <Bot size={14} />
          <span>Qualification Flow</span>
        </button>

        <button
          type="button"
          onClick={() => router.push(`/ai-whatsapp-conversation`)}
          className="agent-launcher-btn"
        >
          <MessageCircle size={14} />
          <span>WhatsApp Automation</span>
        </button>

        <button
          type="button"
          onClick={() => router.push(`/ai-whatsapp-conversation`)}
          className="agent-launcher-btn"
        >
          <Send size={14} />
          <span>AI Testing</span>
        </button>

        <button
          type="button"
          onClick={() => router.push(`/reports`)}
          className="agent-launcher-btn"
        >
          <Sparkles size={14} />
          <span>Analytics</span>
        </button>
      </div>

      {/* Navigation Tabs Bar (7 Tabs) */}
      <div className="agent-tabs-header-bar">
        <button
          type="button"
          onClick={() => setActiveTab('general')}
          className={`agent-tab-item ${activeTab === 'general' ? 'active' : ''}`}
        >
          <Settings size={15} />
          <span>General</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('model')}
          className={`agent-tab-item ${activeTab === 'model' ? 'active' : ''}`}
        >
          <Sliders size={15} />
          <span>Model &amp; Behavior</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('kb')}
          className={`agent-tab-item ${activeTab === 'kb' ? 'active' : ''}`}
        >
          <BookOpen size={15} />
          <span>Knowledge Base</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('business')}
          className={`agent-tab-item ${activeTab === 'business' ? 'active' : ''}`}
        >
          <Clock size={15} />
          <span>Business Rules</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('approval')}
          className={`agent-tab-item ${activeTab === 'approval' ? 'active' : ''}`}
        >
          <ShieldCheck size={15} />
          <span>Approval Rules</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('escalation')}
          className={`agent-tab-item ${activeTab === 'escalation' ? 'active' : ''}`}
        >
          <AlertCircle size={15} />
          <span>Escalation Rules</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('advanced')}
          className={`agent-tab-item ${activeTab === 'advanced' ? 'active' : ''}`}
        >
          <Sparkles size={15} />
          <span>Advanced Settings</span>
        </button>
      </div>

      {/* Conditional View for Knowledge Base Tab */}
      {activeTab === 'kb' ? (
        <KnowledgeBaseView agentId={agentId} />
      ) : (
        <div className="agent-main-layout">
          
          {/* LEFT COLUMN: Configuration Forms */}
          <div className="agent-left-col">
            
            {activeTab === 'general' && (
            <>
              {/* Row 1: Basic Info & Agent Identity Grid */}
              <div className="agent-config-grid-2">
                
                {/* Card 1: Basic Information */}
                <div className="agent-card-section">
                  <h3 className="agent-card-section-title">Basic Information</h3>
                  
                  <div className="agent-form-grid-3">
                    <div className="agent-form-group">
                      <label className="agent-form-label">Agent Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="agent-form-input"
                      />
                    </div>

                    <div className="agent-form-group">
                      <label className="agent-form-label">Industry *</label>
                      <select
                        value={formData.industry}
                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                        className="agent-form-select"
                      >
                        <option value="Real Estate">Real Estate</option>
                        <option value="Pharma">Pharma</option>
                        <option value="Education">Education</option>
                        <option value="Automobile">Automobile</option>
                        <option value="Insurance">Insurance</option>
                        <option value="Healthcare">Healthcare</option>
                      </select>
                    </div>

                    <div className="agent-form-group">
                      <label className="agent-form-label">Department (Optional)</label>
                      <input
                        type="text"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="agent-form-input"
                      />
                    </div>
                  </div>

                  <div className="agent-form-group mb-0">
                    <label className="agent-form-label">Description</label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="agent-form-textarea"
                    />
                    <div className="agent-char-count">{formData.description.length} / 500</div>
                  </div>
                </div>

                {/* Card 2: Agent Identity */}
                <div className="agent-card-section">
                  <h3 className="agent-card-section-title">Agent Identity</h3>
                  
                  <div className="agent-avatar-row">
                    <div className="agent-avatar-box">
                      <Bot size={24} className="text-blue" />
                    </div>
                    <div>
                      <button type="button" className="btn-agent-change-avatar">
                        Change Avatar
                      </button>
                      <span className="agent-avatar-hint">JPG, PNG up to 2MB</span>
                    </div>
                  </div>

                  <div className="agent-form-group">
                    <label className="agent-form-label">Agent Code (Unique) *</label>
                    <input
                      type="text"
                      value={formData.agentCode}
                      onChange={(e) => setFormData({ ...formData, agentCode: e.target.value })}
                      className="agent-form-input"
                    />
                  </div>

                  <div className="agent-form-group">
                    <label className="agent-form-label">Default Language *</label>
                    <select
                      value={formData.defaultLanguage}
                      onChange={(e) => setFormData({ ...formData, defaultLanguage: e.target.value })}
                      className="agent-form-select"
                    >
                      <option value="English (India)">🇮🇳 English (India)</option>
                      <option value="Hindi">🇮🇳 Hindi</option>
                      <option value="English (US)">🇺🇸 English (US)</option>
                    </select>
                  </div>

                  <div className="agent-form-group mb-0">
                    <label className="agent-form-label">Supported Languages</label>
                    <div className="agent-lang-tags-row">
                      {formData.supportedLanguages.map((lang) => (
                        <span key={lang} className="agent-lang-tag">
                          <span>{lang}</span>
                          <X size={12} onClick={() => handleRemoveLanguage(lang)} className="agent-tag-remove" />
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* Row 2: Business Info & Response Behavior Grid */}
              <div className="agent-config-grid-2">
                
                {/* Card 3: Business Information */}
                <div className="agent-card-section">
                  <h3 className="agent-card-section-title">Business Information</h3>
                  
                  <div className="agent-form-grid-2">
                    <div className="agent-form-group">
                      <label className="agent-form-label">Business Hours *</label>
                      <div className="agent-time-range-wrap">
                        <input
                          type="text"
                          value={formData.businessHoursStart}
                          onChange={(e) => setFormData({ ...formData, businessHoursStart: e.target.value })}
                          className="agent-form-input time-input"
                        />
                        <span className="agent-time-dash">-</span>
                        <input
                          type="text"
                          value={formData.businessHoursEnd}
                          onChange={(e) => setFormData({ ...formData, businessHoursEnd: e.target.value })}
                          className="agent-form-input time-input"
                        />
                        <Clock size={16} className="agent-clock-icon" />
                      </div>
                    </div>

                    <div className="agent-form-group">
                      <label className="agent-form-label">Time Zone *</label>
                      <select
                        value={formData.timeZone}
                        onChange={(e) => setFormData({ ...formData, timeZone: e.target.value })}
                        className="agent-form-select"
                      >
                        <option value="Asia/Kolkata (GMT +05:30)">Asia/Kolkata (GMT +05:30)</option>
                        <option value="UTC (GMT +00:00)">UTC (GMT +00:00)</option>
                      </select>
                    </div>
                  </div>

                  <div className="agent-form-group">
                    <label className="agent-form-label">Working Days *</label>
                    <div className="agent-days-pills-row">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => handleDayToggle(day)}
                          className={`agent-day-pill ${formData.workingDays.includes(day) ? 'active' : ''}`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="agent-form-group">
                    <label className="agent-form-label">Holidays</label>
                    <select className="agent-form-select">
                      <option value="">Select holidays calendar</option>
                      <option value="india">Indian National Holidays 2026</option>
                    </select>
                  </div>

                  <div className="agent-toggle-switch-row mb-0">
                    <label className="agent-switch">
                      <input
                        type="checkbox"
                        checked={formData.status === 'Active'}
                        onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'Active' : 'Paused' })}
                      />
                      <span className="agent-slider round" />
                    </label>
                    <div>
                      <div className="agent-switch-label font-bold">Active</div>
                      <div className="agent-switch-sub">Agent will respond to new conversations</div>
                    </div>
                  </div>
                </div>

                {/* Card 4: Response Behavior */}
                <div className="agent-card-section">
                  <h3 className="agent-card-section-title">Response Behavior</h3>

                  <div className="agent-form-grid-2">
                    <div className="agent-form-group">
                      <label className="agent-form-label">Response Tone *</label>
                      <select
                        value={formData.responseTone}
                        onChange={(e) => setFormData({ ...formData, responseTone: e.target.value })}
                        className="agent-form-select"
                      >
                        <option value="Professional">Professional</option>
                        <option value="Friendly">Friendly</option>
                        <option value="Formal">Formal</option>
                      </select>
                    </div>

                    <div className="agent-form-group">
                      <label className="agent-form-label">Response Style *</label>
                      <select
                        value={formData.responseStyle}
                        onChange={(e) => setFormData({ ...formData, responseStyle: e.target.value })}
                        className="agent-form-select"
                      >
                        <option value="Helpful & Consultative">Helpful &amp; Consultative</option>
                        <option value="Direct & Short">Direct &amp; Short</option>
                        <option value="Sales Focused">Sales Focused</option>
                      </select>
                    </div>
                  </div>

                  <div className="agent-form-grid-2">
                    <div className="agent-form-group">
                      <label className="agent-form-label">Creativity (Temperature)</label>
                      <div className="agent-range-val-row">
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={formData.temperature}
                          onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
                          className="agent-form-range"
                        />
                        <span className="agent-range-box">{formData.temperature}</span>
                      </div>
                    </div>

                    <div className="agent-form-group">
                      <label className="agent-form-label">Response Length</label>
                      <select
                        value={formData.responseLength}
                        onChange={(e) => setFormData({ ...formData, responseLength: e.target.value })}
                        className="agent-form-select"
                      >
                        <option value="Short">Short</option>
                        <option value="Medium">Medium</option>
                        <option value="Long">Long</option>
                      </select>
                    </div>
                  </div>

                  <div className="agent-form-grid-2 mb-0">
                    <div className="agent-form-group mb-0">
                      <label className="agent-form-label">Max Tokens</label>
                      <div className="agent-range-val-row">
                        <input
                          type="range"
                          min="500"
                          max="4000"
                          step="100"
                          value={formData.maxTokens}
                          onChange={(e) => setFormData({ ...formData, maxTokens: parseInt(e.target.value) })}
                          className="agent-form-range"
                        />
                        <span className="agent-range-box">{formData.maxTokens}</span>
                      </div>
                    </div>

                    <div className="agent-form-group mb-0">
                      <label className="agent-form-label">Typing Speed</label>
                      <select
                        value={formData.typingSpeed}
                        onChange={(e) => setFormData({ ...formData, typingSpeed: e.target.value })}
                        className="agent-form-select"
                      >
                        <option value="Instant">Instant</option>
                        <option value="Natural">Natural</option>
                        <option value="Human-like Delay">Human-like Delay</option>
                      </select>
                    </div>
                  </div>
                </div>

              </div>

              {/* Card 5: Quick Prompt Preview */}
              <div className="agent-card-section">
                <div className="agent-card-header-flex">
                  <h3 className="agent-card-section-title mb-0">Quick Prompt Preview</h3>
                </div>

                <div className="agent-prompt-preview-box">
                  <pre className="agent-prompt-text">{formData.systemPrompt}</pre>
                  <button type="button" className="btn-agent-edit-prompt">
                    <Edit size={14} />
                    <span>Edit System Prompt</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab !== 'general' && (
            <div className="agent-card-section">
              <h3 className="agent-card-section-title text-capitalize">{activeTab} Settings</h3>
              <p className="agent-page-subtitle">Configure model engine parameters, escalation triggers, and runtime rules.</p>
              <div className="agent-prompt-preview-box mt-3">
                <pre className="agent-prompt-text">
                  {`// ${activeTab.toUpperCase()} CONFIGURATION ENGINE\nStatus: Live & Saved to PostgreSQL Database\nActive Model: ${formData.model}\nConfidence Threshold: 80%`}
                </pre>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Sidebar Cards */}
        <div className="agent-right-col">
          
          {/* Card 1: Agent Summary */}
          <div className="agent-sidebar-card">
            <h3 className="agent-sidebar-title">Agent Summary</h3>
            
            <div className="agent-summary-header-box">
              <div className="agent-summary-bot-icon">
                <Bot size={22} className="text-blue" />
              </div>
              <div>
                <div className="agent-summary-title-row">
                  <h4 className="agent-summary-name">{formData.name}</h4>
                  <span className={`agent-status-badge ${formData.status === 'Active' ? 'active' : 'paused'}`}>
                    {formData.status}
                  </span>
                </div>
                <div className="agent-summary-dept">{formData.industry} • {formData.department}</div>
              </div>
            </div>

            <div className="agent-summary-meta-list">
              <div className="agent-summary-meta-row">
                <span>Agent Code:</span> <strong>{formData.agentCode}</strong>
              </div>
              <div className="agent-summary-meta-row">
                <span>Created On:</span> <strong>May 10, 2025</strong>
              </div>
              <div className="agent-summary-meta-row">
                <span>Last Updated:</span> <strong>May 26, 2025 10:30 AM</strong>
              </div>
            </div>

            <div className="agent-summary-checklist">
              <div className="agent-summary-check-item">
                <CheckCircle2 size={15} className="text-green" />
                <span>WhatsApp Status:</span>
                <strong className="text-green ml-auto">Connected</strong>
              </div>

              <div className="agent-summary-check-item">
                <BookOpen size={15} className="text-blue" />
                <span>Knowledge Base:</span>
                <strong className="ml-auto">Real Estate KB v2.4.1</strong>
              </div>

              <div className="agent-summary-check-item">
                <Sliders size={15} className="text-purple" />
                <span>Model:</span>
                <strong className="ml-auto">{formData.model}</strong>
              </div>

              <div className="agent-summary-check-item">
                <Sparkles size={15} className="text-orange" />
                <span>Temperature:</span>
                <strong className="ml-auto">{formData.temperature}</strong>
              </div>

              <div className="agent-summary-check-item">
                <FileText size={15} className="text-cyan" />
                <span>Max Tokens:</span>
                <strong className="ml-auto">{formData.maxTokens}</strong>
              </div>

              <div className="agent-summary-check-item">
                <Settings size={15} className="text-pink" />
                <span>Response Style:</span>
                <strong className="ml-auto">{formData.responseTone}</strong>
              </div>
            </div>

            <button type="button" className="btn-agent-analytics-dropdown">
              <span>View Agent Analytics</span>
              <ChevronDown size={14} />
            </button>
          </div>

          {/* Card: Connected Knowledge Base Summary */}
          <div className="agent-sidebar-card">
            <div className="agent-sidebar-header-row">
              <h3 className="agent-sidebar-title mb-0">Connected Knowledge Base</h3>
              <span className="agent-status-badge active text-xs">
                <CheckCircle2 size={11} className="inline-icon" /> Up to date
              </span>
            </div>

            <div className="agent-summary-checklist mt-2">
              <div className="agent-summary-check-item">
                <BookOpen size={14} className="text-blue" />
                <span>Knowledge Base:</span>
                <strong className="ml-auto text-blue">Real Estate KB v2.4.1</strong>
              </div>

              <div className="agent-summary-check-item">
                <FileText size={14} className="text-purple" />
                <span>Version:</span>
                <strong className="ml-auto">{agent?.knowledgeVersion || 'v2.4.1'}</strong>
              </div>

              <div className="agent-summary-check-item">
                <FileText size={14} className="text-slate-600" />
                <span>Documents:</span>
                <strong className="ml-auto font-bold">342 docs</strong>
              </div>

              <div className="agent-summary-check-item">
                <Sparkles size={14} className="text-orange" />
                <span>Indexed Chunks:</span>
                <strong className="ml-auto text-orange">24,856 chunks</strong>
              </div>

              <div className="agent-summary-check-item">
                <Clock size={14} className="text-green" />
                <span>Last Training:</span>
                <strong className="ml-auto text-xs text-slate-600">May 26, 2025 10:30 AM</strong>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push(`/ai-agents/${agentId}/knowledge-base`)}
              className="btn-agent-card-action w-full justify-center mt-3"
            >
              <ExternalLink size={13} />
              <span>Open Knowledge Base</span>
            </button>
          </div>

          {/* Card 2: Connected Channels */}
          <div className="agent-sidebar-card">
            <h3 className="agent-sidebar-title">Connected Channels</h3>

            <div className="agent-channels-list">
              <div className="agent-channel-item">
                <div className="agent-channel-icon text-green">
                  <MessageCircle size={18} />
                </div>
                <div className="agent-channel-info">
                  <div className="agent-channel-name">WhatsApp Business</div>
                  <div className="agent-channel-sub">{formData.connectedWhatsapp || '+91 98765 43210'}</div>
                </div>
                <span className="agent-channel-badge connected">Connected</span>
              </div>

              <div className="agent-channel-item">
                <div className="agent-channel-icon text-blue">
                  <Globe size={18} />
                </div>
                <div className="agent-channel-info">
                  <div className="agent-channel-name">Facebook Messenger</div>
                </div>
                <span className="agent-channel-link">Connect</span>
              </div>

              <div className="agent-channel-item">
                <div className="agent-channel-icon text-pink">
                  <Globe size={18} />
                </div>
                <div className="agent-channel-info">
                  <div className="agent-channel-name">Instagram DM</div>
                </div>
                <span className="agent-channel-link">Connect</span>
              </div>
            </div>

            <div className="agent-manage-channels-row">
              <button type="button" className="agent-link-btn">
                Manage Channels &rarr;
              </button>
            </div>
          </div>

          {/* Card 3: Recent Activity */}
          <div className="agent-sidebar-card">
            <div className="agent-sidebar-header-row">
              <h3 className="agent-sidebar-title mb-0">Recent Activity</h3>
              <button type="button" className="agent-link-btn">View all</button>
            </div>

            <div className="agent-activity-list">
              <div className="agent-activity-item">
                <div className="agent-activity-icon-box bg-blue-light">
                  <Edit size={13} className="text-blue" />
                </div>
                <div className="agent-activity-content">
                  <div className="agent-act-desc font-bold">System Prompt Updated</div>
                  <div className="agent-act-sub">by Arjun Mehta</div>
                </div>
                <span className="agent-act-time">2h ago</span>
              </div>

              <div className="agent-activity-item">
                <div className="agent-activity-icon-box bg-purple-light">
                  <BookOpen size={13} className="text-purple" />
                </div>
                <div className="agent-activity-content">
                  <div className="agent-act-desc font-bold">Knowledge Base Re-indexed</div>
                  <div className="agent-act-sub">342 documents processed</div>
                </div>
                <span className="agent-act-time">1d ago</span>
              </div>

              <div className="agent-activity-item">
                <div className="agent-activity-icon-box bg-green-light">
                  <MessageCircle size={13} className="text-green" />
                </div>
                <div className="agent-activity-content">
                  <div className="agent-act-desc font-bold">WhatsApp number connected</div>
                  <div className="agent-act-sub">by Arjun Mehta</div>
                </div>
                <span className="agent-act-time">2d ago</span>
              </div>
            </div>
          </div>

        </div>
      </div>
      )}

    </div>
  );
}
