'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  PhoneCall,
  Save,
  Plus,
  Copy,
  Eye,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  FileText,
  Clock,
  UserCheck,
  Calendar,
  GitBranch,
  Bot,
  Trash2,
  Edit,
  Zap,
} from 'lucide-react';
import {
  WhatsAppClientService,
  WhatsAppConnectionData,
  WhatsAppTemplateItem,
  WhatsAppAutomationRuleItem,
  WhatsAppBusinessHoursData,
  WhatsAppHumanTakeoverData,
  WhatsAppMediaItem,
} from '@/services/whatsapp.service';
import { AgentClientService, AIAgentItem } from '@/services/agent.service';
import toast from 'react-hot-toast';

interface Props {
  agentId?: string;
}

export const WhatsAppAutomationView: React.FC<Props> = ({ agentId }) => {
  const router = useRouter();
  const [agent, setAgent] = useState<AIAgentItem | null>(null);
  const [connection, setConnection] = useState<WhatsAppConnectionData | null>(null);
  const [templates, setTemplates] = useState<WhatsAppTemplateItem[]>([]);
  const [welcomeMessage, setWelcomeMessage] = useState<string>('Hi {{lead_name}} 👋, thanks for contacting Acme Real Estate! I am your AI Property Advisor. How can I assist you today?');
  const [followupSeq, setFollowupSeq] = useState<any>(null);
  const [automations, setAutomations] = useState<WhatsAppAutomationRuleItem[]>([]);
  const [businessHours, setBusinessHours] = useState<WhatsAppBusinessHoursData | null>(null);
  const [humanTakeover, setHumanTakeover] = useState<WhatsAppHumanTakeoverData | null>(null);
  const [mediaList, setMediaList] = useState<WhatsAppMediaItem[]>([]);
  const [usageMetrics, setUsageMetrics] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isTesting, setIsTesting] = useState<boolean>(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'connection' | 'templates' | 'welcome' | 'followup' | 'automations' | 'hours' | 'takeover' | 'media' | 'logs'
  >('connection');

  // Modal: Create Template State
  const [showTemplateModal, setShowTemplateModal] = useState<boolean>(false);
  const [newTmplName, setNewTmplName] = useState<string>('');
  const [newTmplCategory, setNewTmplCategory] = useState<string>('Marketing');
  const [newTmplLanguage, setNewTmplLanguage] = useState<string>('English');
  const [newTmplBody, setNewTmplBody] = useState<string>('');
  const [isSubmittingTemplate, setIsSubmittingTemplate] = useState<boolean>(false);
  const [templateErrors, setTemplateErrors] = useState<{ name?: string; body?: string }>({});

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [
        agentRes,
        connRes,
        tmplRes,
        welcomeRes,
        seqRes,
        autoRes,
        hoursRes,
        takeoverRes,
        mediaRes,
        usageRes,
        logsRes,
      ] = await Promise.all([
        agentId ? AgentClientService.getAgentById(agentId) : Promise.resolve(null),
        WhatsAppClientService.getConnection({ agentId }),
        WhatsAppClientService.getTemplates({ agentId }),
        WhatsAppClientService.getWelcomeMessage({ agentId }),
        WhatsAppClientService.getFollowupSequence({ agentId }),
        WhatsAppClientService.getAutomationRules({ agentId }),
        WhatsAppClientService.getBusinessHours({ agentId }),
        WhatsAppClientService.getHumanTakeover({ agentId }),
        WhatsAppClientService.getMedia({ agentId }),
        WhatsAppClientService.getUsageMetrics({ agentId }),
        WhatsAppClientService.getLogs({ agentId }),
      ]);

      if (agentRes && agentRes.success && agentRes.data) setAgent(agentRes.data);
      if (connRes && connRes.success && connRes.data) setConnection(connRes.data);
      if (tmplRes && tmplRes.success && Array.isArray(tmplRes.data)) setTemplates(tmplRes.data);
      if (welcomeRes && welcomeRes.success && welcomeRes.data) setWelcomeMessage(welcomeRes.data.welcomeMessage || '');
      if (seqRes && seqRes.success && seqRes.data) setFollowupSeq(seqRes.data);
      if (autoRes && autoRes.success && Array.isArray(autoRes.data)) setAutomations(autoRes.data);
      if (hoursRes && hoursRes.success && hoursRes.data) setBusinessHours(hoursRes.data);
      if (takeoverRes && takeoverRes.success && takeoverRes.data) setHumanTakeover(takeoverRes.data);
      if (mediaRes && mediaRes.success && Array.isArray(mediaRes.data)) setMediaList(mediaRes.data);
      if (usageRes && usageRes.success && usageRes.data) setUsageMetrics(usageRes.data);
      if (logsRes && logsRes.success && Array.isArray(logsRes.data)) setLogs(logsRes.data);
    } catch {
      toast.error('Failed to load WhatsApp Automation data from PostgreSQL');
    } finally {
      setIsLoading(false);
    }
  }, [agentId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      const res = await WhatsAppClientService.testConnection({ agentId });
      if (res.success) {
        toast.success('WhatsApp API connection verified live!');
        loadData();
      }
    } catch {
      toast.error('Failed to test WhatsApp connection');
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveConnection = async () => {
    try {
      const res = await WhatsAppClientService.connect({
        phoneNumber: connection?.phoneNumber,
        businessAccount: connection?.businessAccount,
        wabaId: connection?.wabaId,
      }, { agentId });

      if (res.success) {
        toast.success('WhatsApp configuration saved to PostgreSQL!');
        loadData();
      }
    } catch {
      toast.error('Failed to save WhatsApp configuration');
    }
  };

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    setTemplateErrors({});

    const sanitizedName = newTmplName.trim().toLowerCase().replace(/\s+/g, '_');
    const errors: { name?: string; body?: string } = {};

    if (!sanitizedName) {
      errors.name = 'Template name is required';
    }
    if (!newTmplBody.trim()) {
      errors.body = 'Body text is required';
    }

    if (Object.keys(errors).length > 0) {
      setTemplateErrors(errors);
      toast.error('Please fill in all required template fields');
      return;
    }

    setIsSubmittingTemplate(true);
    try {
      const res = await WhatsAppClientService.createTemplate({
        name: sanitizedName,
        templateName: sanitizedName,
        category: newTmplCategory || 'Marketing',
        language: newTmplLanguage || 'English',
        bodyText: newTmplBody,
        body: newTmplBody,
        aiAgentId: agentId,
        agentId: agentId,
      });

      if (res && res.success) {
        toast.success('Template Created Successfully');
        setShowTemplateModal(false);
        setNewTmplName('');
        setNewTmplBody('');
        setNewTmplCategory('Marketing');
        setNewTmplLanguage('English');
        setTemplateErrors({});
        await loadData();
      } else {
        toast.error(res?.message || 'Failed to create template');
      }
    } catch (err: any) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message || err?.message;

      if (status === 400) {
        toast.error(msg || '400 Validation Error: Please check form values');
      } else if (status === 401) {
        toast.error('401 Unauthorized: Please log in again');
      } else if (status === 403) {
        toast.error('403 Forbidden: Insufficient permissions');
      } else if (status === 404) {
        toast.error('404 API Endpoint missing');
      } else if (status === 409) {
        toast.error(`Template "${sanitizedName}" already exists!`);
      } else if (status === 500) {
        toast.error('500 Server Error: Internal server error');
      } else {
        toast.error(msg || 'Error creating template');
      }
    } finally {
      setIsSubmittingTemplate(false);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    try {
      const res = await WhatsAppClientService.deleteTemplate(id);
      if (res.success) {
        toast.success('Message Template deleted');
        loadData();
      }
    } catch {
      toast.error('Failed to delete template');
    }
  };

  const handleSaveWelcomeMessage = async () => {
    try {
      const res = await WhatsAppClientService.saveWelcomeMessage(welcomeMessage, { agentId });
      if (res.success) {
        toast.success('Welcome message saved!');
        loadData();
      }
    } catch {
      toast.error('Failed to save welcome message');
    }
  };

  const handleSaveBusinessHours = async () => {
    if (!businessHours) return;
    try {
      const res = await WhatsAppClientService.saveBusinessHours(businessHours, { agentId });
      if (res.success) {
        toast.success('Business hours saved!');
        loadData();
      }
    } catch {
      toast.error('Failed to save business hours');
    }
  };

  const handleSaveHumanTakeover = async () => {
    if (!humanTakeover) return;
    try {
      const res = await WhatsAppClientService.saveHumanTakeover(humanTakeover, { agentId });
      if (res.success) {
        toast.success('Human takeover rules saved!');
        loadData();
      }
    } catch {
      toast.error('Failed to save human takeover rules');
    }
  };

  const handleDeleteMedia = async (id: string) => {
    try {
      const res = await WhatsAppClientService.deleteMedia(id);
      if (res.success) {
        toast.success('Media file removed from knowledge base');
        loadData();
      }
    } catch {
      toast.error('Failed to delete media file');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="wa-page-container">
      
      {/* Top Breadcrumb Navigation */}
      <div className="wa-breadcrumb-row">
        <span onClick={() => router.push('/ai-agents')} className="wa-breadcrumb-link">
          AI Agents
        </span>
        <span className="wa-breadcrumb-sep">&gt;</span>
        <span
          onClick={() => agentId && router.push(`/ai-agents/${agentId}`)}
          className="wa-breadcrumb-link"
        >
          {agent ? agent.name : 'Property Advisor AI'}
        </span>
        <span className="wa-breadcrumb-sep">&gt;</span>
        <span className="wa-breadcrumb-current">WhatsApp Automation</span>
      </div>

      {/* Page Header */}
      <div className="wa-header-row">
        <div>
          <div className="wa-header-title-group">
            <h1 className="wa-page-title">WhatsApp Automation</h1>
            <span className="wa-status-badge-green">
              {connection?.status || 'Connected'}
            </span>
          </div>
          <p className="wa-page-subtitle">Connect WhatsApp and automate conversations, templates, and follow-ups.</p>
        </div>

        <div className="wa-header-actions">
          <button
            type="button"
            onClick={handleTestConnection}
            className="wa-btn-secondary"
          >
            <PhoneCall size={14} className="wa-kv-val green" />
            <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
          </button>

          <button
            type="button"
            onClick={handleSaveConnection}
            className="wa-btn-primary"
          >
            <Save size={14} />
            <span>Save Changes</span>
          </button>

          <button
            type="button"
            className="wa-btn-more"
          >
            •••
          </button>
        </div>
      </div>

      {/* Tabs Header Bar */}
      <div className="wa-tabs-bar">
        <button
          type="button"
          onClick={() => setActiveTab('connection')}
          className={`wa-tab-item ${activeTab === 'connection' ? 'active' : ''}`}
        >
          <PhoneCall size={14} />
          <span>Connection</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('templates')}
          className={`wa-tab-item ${activeTab === 'templates' ? 'active' : ''}`}
        >
          <FileText size={14} />
          <span>Templates</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('welcome')}
          className={`wa-tab-item ${activeTab === 'welcome' ? 'active' : ''}`}
        >
          <MessageCircle size={14} />
          <span>Welcome Message</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('followup')}
          className={`wa-tab-item ${activeTab === 'followup' ? 'active' : ''}`}
        >
          <GitBranch size={14} />
          <span>Follow-up Flow</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('automations')}
          className={`wa-tab-item ${activeTab === 'automations' ? 'active' : ''}`}
        >
          <Zap size={14} />
          <span>Automation Rules</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('hours')}
          className={`wa-tab-item ${activeTab === 'hours' ? 'active' : ''}`}
        >
          <Clock size={14} />
          <span>Business Hours</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('takeover')}
          className={`wa-tab-item ${activeTab === 'takeover' ? 'active' : ''}`}
        >
          <UserCheck size={14} />
          <span>Human Takeover</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('media')}
          className={`wa-tab-item ${activeTab === 'media' ? 'active' : ''}`}
        >
          <FileText size={14} />
          <span>Media &amp; Files</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('logs')}
          className={`wa-tab-item ${activeTab === 'logs' ? 'active' : ''}`}
        >
          <FileText size={14} />
          <span>Logs</span>
        </button>
      </div>

      {/* TAB 1: CONNECTION TAB */}
      {activeTab === 'connection' && (
        <div className="wa-tab-content">
          
          {/* Top 2-Column Grid */}
          <div className="wa-grid-layout">
            
            {/* Left 8 Cols: WhatsApp Business Connection Container */}
            <div className="wa-col-8">
              <div className="wa-card">
                <div className="wa-card-title-bar">
                  <h3 className="wa-card-title">WhatsApp Business Connection</h3>
                </div>

                <div className="wa-subgrid-2">
                  
                  {/* Sub-card 1: WhatsApp Business API */}
                  <div className="wa-subpanel">
                    <div className="wa-subpanel-header">
                      <div className="wa-whatsapp-icon-wrapper">
                        <MessageCircle size={22} />
                      </div>
                      <div>
                        <h4 className="wa-subpanel-title">
                          WhatsApp Business API
                          <span className="wa-pill-green">{connection?.status === 'Disconnected' ? 'Disconnected' : 'Connected'}</span>
                        </h4>
                      </div>
                    </div>

                    <div className="wa-kv-grid">
                      <div>
                        <span className="wa-kv-label">Phone Number</span>
                        <span className="wa-kv-val">{connection?.phoneNumber || '+91 98765 43210'}</span>
                      </div>

                      <div>
                        <span className="wa-kv-label">Business Account</span>
                        <span className="wa-kv-val">{connection?.businessAccount || 'Acme Real Estate'}</span>
                      </div>

                      <div>
                        <span className="wa-kv-label">WABA ID</span>
                        <span className="wa-kv-val mono">{connection?.wabaId || '1029384756'}</span>
                      </div>

                      <div>
                        <span className="wa-kv-label">Status</span>
                        <span className="wa-kv-val green">{connection?.status || 'Connected and Active'}</span>
                      </div>

                      <div>
                        <span className="wa-kv-label">Quality Rating</span>
                        <span className="wa-kv-val green">&bull; {connection?.qualityRating || 'High'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Sub-card 2: Webhook Configuration */}
                  <div className="wa-subpanel">
                    <h4 className="wa-subpanel-title">Webhook Configuration</h4>

                    <div className="wa-input-group">
                      <label className="wa-input-label">Webhook URL</label>
                      <div className="wa-input-field-wrap">
                        <input
                          type="text"
                          value={connection?.webhookUrl || 'https://app.leadpilotai.com/api/whatsapp/webhook/1029384756'}
                          className="wa-input-field"
                          readOnly
                        />
                        <button
                          type="button"
                          onClick={() => copyToClipboard(connection?.webhookUrl || 'https://app.leadpilotai.com/api/whatsapp/webhook/1029384756')}
                          className="wa-input-icon-btn"
                          title="Copy URL"
                        >
                          <Copy size={13} />
                        </button>
                      </div>
                    </div>

                    <div className="wa-input-group">
                      <label className="wa-input-label">Verify Token</label>
                      <div className="wa-input-field-wrap">
                        <input
                          type="password"
                          value={connection?.verifyToken || 'leadpilot_verify_secret_102938'}
                          className="wa-input-field"
                          readOnly
                        />
                        <button type="button" className="wa-input-icon-btn" title="Toggle token">
                          <Eye size={13} />
                        </button>
                      </div>
                    </div>

                    <div className="wa-webhook-footer">
                      <div>
                        <span className="wa-kv-label">Webhook Status:</span>
                        <span className="wa-kv-val green"> &bull; {connection?.webhookStatus || 'Active'}</span>
                      </div>
                      <div>
                        <span className="wa-kv-label">Last Received:</span>
                        <span className="wa-kv-val">May 26, 2025 10:28 AM</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => toast.success('Webhook Resubscribed!')}
                        className="wa-btn-secondary"
                      >
                        <RefreshCw size={12} /> Resubscribe Webhook
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Right 4 Cols: WhatsApp Connection Status Box */}
            <div className="wa-col-4">
              <div className="wa-card wa-full-height">
                <div>
                  <div className="wa-card-title-bar">
                    <h3 className="wa-card-title">WhatsApp Connection Status</h3>
                  </div>
                  
                  <div className="wa-status-list">
                    <div className="wa-status-item">
                      <span className="wa-status-left">
                        <CheckCircle2 size={14} className="wa-kv-val green" /> API Connection
                      </span>
                      <span className="wa-pill-green">Connected</span>
                    </div>

                    <div className="wa-status-item">
                      <span className="wa-status-left">
                        <CheckCircle2 size={14} className="wa-kv-val green" /> Phone Number
                      </span>
                      <span className="wa-pill-green">Verified</span>
                    </div>

                    <div className="wa-status-item">
                      <span className="wa-status-left">
                        <CheckCircle2 size={14} className="wa-kv-val green" /> Webhook
                      </span>
                      <span className="wa-pill-green">Active</span>
                    </div>

                    <div className="wa-status-item">
                      <span className="wa-status-left">
                        <CheckCircle2 size={14} className="wa-kv-val green" /> Message Sending
                      </span>
                      <span className="wa-pill-green">Enabled</span>
                    </div>

                    <div className="wa-status-item">
                      <span className="wa-status-left">
                        <CheckCircle2 size={14} className="wa-kv-val green" /> Message Receiving
                      </span>
                      <span className="wa-pill-green">Enabled</span>
                    </div>

                    <div className="wa-status-item">
                      <span className="wa-status-left">
                        <CheckCircle2 size={14} className="wa-kv-val green" /> Quality Rating
                      </span>
                      <span className="wa-pill-green">{connection?.qualityRating || 'High'}</span>
                    </div>

                    <div className="wa-status-item">
                      <span className="wa-status-left">
                        &bull; Rate Limit
                      </span>
                      <span className="wa-pill-blue">{connection?.rateLimit || '95% available'}</span>
                    </div>
                  </div>
                </div>

                <div className="wa-card-footer-link">
                  <button
                    type="button"
                    onClick={() => setActiveTab('logs')}
                    className="wa-btn-secondary"
                  >
                    <FileText size={14} /> View Full Logs
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Middle 2-Column Grid */}
          <div className="wa-grid-layout">
            
            {/* Left 8 Cols: Message Templates Table */}
            <div className="wa-col-8">
              <div className="wa-card">
                <div className="wa-card-title-bar">
                  <div className="wa-card-header-actions">
                    <h3 className="wa-card-title">Message Templates</h3>
                    <span className="wa-pill-blue">{templates.length} Active Templates</span>
                  </div>
                  <div className="wa-card-header-actions">
                    <button
                      type="button"
                      onClick={() => setShowTemplateModal(true)}
                      className="wa-btn-primary"
                    >
                      <Plus size={13} /> Create Template
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('templates')}
                      className="wa-link-btn"
                    >
                      View All Templates
                    </button>
                  </div>
                </div>

                <div className="kb-documents-table-wrapper">
                  <table className="wa-table">
                    <thead>
                      <tr>
                        <th>Template Name</th>
                        <th>Category</th>
                        <th>Language</th>
                        <th>Status</th>
                        <th>Quality Rating</th>
                        <th>Last Approved</th>
                        <th className="wa-text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {templates.map((tmpl) => (
                        <tr key={tmpl.id}>
                          <td>
                            <div className="wa-tmpl-name-wrap">
                              <div className="wa-tmpl-icon">
                                <MessageCircle size={14} />
                              </div>
                              <div>
                                <div className="wa-kv-val">{tmpl.name}</div>
                                <div className="wa-kv-label">{tmpl.bodyText}</div>
                              </div>
                            </div>
                          </td>
                          <td><span className="wa-tmpl-badge">{tmpl.category}</span></td>
                          <td><span className="wa-kv-val">{tmpl.language}</span></td>
                          <td><span className="wa-pill-green">{tmpl.status}</span></td>
                          <td><span className="wa-kv-val green">&bull; {tmpl.qualityRating}</span></td>
                          <td><span className="wa-kv-label">May 20, 2025</span></td>
                          <td className="wa-text-right">
                            <button type="button" className="wa-action-icon-btn"><Eye size={14} /></button>
                            <button type="button" onClick={() => handleDeleteTemplate(tmpl.id)} className="wa-action-icon-btn danger"><Trash2 size={14} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Daily Message Usage & Automation Summary */}
            <div className="wa-col-4">
              
              {/* Daily Message Usage Box */}
              <div className="wa-card">
                <div className="wa-card-title-bar">
                  <h3 className="wa-card-title">Daily Message Usage</h3>
                  <span className="wa-kv-label">Today ▼</span>
                </div>

                <div className="wa-donut-flex">
                  {/* Circular Donut Metric */}
                  <div className="wa-donut-ring">
                    <span className="wa-donut-val">{usageMetrics?.usedPercentage || 32}%</span>
                    <span className="wa-donut-sub">Used</span>
                  </div>

                  <div className="wa-donut-stats">
                    <div className="wa-donut-row">
                      <span className="wa-kv-label">Used</span>
                      <span className="wa-kv-val">{usageMetrics?.dailyUsed ? usageMetrics.dailyUsed.toLocaleString() : '3,210'}</span>
                    </div>
                    <div className="wa-donut-row">
                      <span className="wa-kv-label">Limit</span>
                      <span className="wa-kv-val">{usageMetrics?.dailyLimit ? usageMetrics.dailyLimit.toLocaleString() : '10,000'}</span>
                    </div>
                    <div className="wa-donut-row total">
                      <span className="wa-kv-label">Remaining</span>
                      <span className="wa-kv-val green">{usageMetrics?.remaining ? usageMetrics.remaining.toLocaleString() : '6,790'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="wa-progress-track">
                    <div className="wa-progress-fill" />
                  </div>
                  <span className="wa-kv-val green">{usageMetrics?.rateLimitAvailablePercentage || 95}% rate limit available</span>
                </div>

                <div className="wa-card-footer-link">
                  <button type="button" onClick={() => toast.success('Viewing Usage Analytics...')} className="wa-link-btn">
                    View Usage Analytics
                  </button>
                </div>
              </div>

              {/* Automation Summary Box */}
              <div className="wa-card">
                <div className="wa-card-title-bar">
                  <h3 className="wa-card-title">Automation Summary</h3>
                </div>
                
                <div className="wa-summary-list">
                  <div className="wa-summary-item">
                    <span className="wa-summary-label"><Zap size={14} /> Active Workflows</span>
                    <span className="wa-summary-val">{usageMetrics?.activeWorkflowsCount || 4}</span>
                  </div>
                  <div className="wa-summary-item">
                    <span className="wa-summary-label"><FileText size={14} /> Templates</span>
                    <span className="wa-summary-val">{templates.length || 12}</span>
                  </div>
                  <div className="wa-summary-item">
                    <span className="wa-summary-label"><MessageCircle size={14} /> Messages Sent (Today)</span>
                    <span className="wa-summary-val">{usageMetrics?.messagesSentToday ? usageMetrics.messagesSentToday.toLocaleString() : '3,210'}</span>
                  </div>
                  <div className="wa-summary-item">
                    <span className="wa-summary-label"><CheckCircle2 size={14} className="wa-kv-val green" /> Messages Delivered</span>
                    <span className="wa-summary-val green">{usageMetrics?.messagesDeliveredPercentage || 98.7}%</span>
                  </div>
                  <div className="wa-summary-item">
                    <span className="wa-summary-label"><Bot size={14} /> Auto Responses</span>
                    <span className="wa-summary-val">{usageMetrics?.autoResponsesCount ? usageMetrics.autoResponsesCount.toLocaleString() : '2,856'}</span>
                  </div>
                  <div className="wa-summary-item">
                    <span className="wa-summary-label"><UserCheck size={14} /> Human Takeovers</span>
                    <span className="wa-summary-val">{usageMetrics?.humanTakeoversCount || 128}</span>
                  </div>
                  <div className="wa-summary-item">
                    <span className="wa-summary-label"><AlertCircle size={14} /> Blocked Messages</span>
                    <span className="wa-summary-val">{usageMetrics?.blockedMessagesCount || 12}</span>
                  </div>
                </div>

                <div className="wa-card-footer-link">
                  <button type="button" onClick={() => toast.success('Viewing Automation Reports...')} className="wa-link-btn">
                    View Automation Reports
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Bottom Card: Active Follow-up Sequence */}
          <div className="wa-card">
            <div className="wa-card-title-bar">
              <div className="wa-card-header-actions">
                <h3 className="wa-card-title">Active Follow-up Sequence</h3>
                <span className="wa-pill-blue">{followupSeq?.title || 'Real Estate Follow-up Flow'}</span>
              </div>
              <button type="button" onClick={() => setActiveTab('followup')} className="wa-link-btn">
                <Edit size={13} /> Edit Flow
              </button>
            </div>

            {/* Horizontal Timeline Steps */}
            <div className="wa-timeline-grid">
              
              {/* Step 1 */}
              <div className="wa-step-box">
                <div className="wa-step-icon-circle whatsapp">
                  <MessageCircle size={15} />
                </div>
                <span className="wa-step-num">Step 1</span>
                <h4 className="wa-step-title">Welcome Message</h4>
                <span className="wa-step-timing">Immediately</span>
              </div>

              {/* Step 2 */}
              <div className="wa-step-box">
                <div className="wa-step-icon-circle blue">
                  <Bot size={15} />
                </div>
                <span className="wa-step-num">Step 2</span>
                <h4 className="wa-step-title">Ask Requirement</h4>
                <span className="wa-step-timing">After 10 minutes</span>
              </div>

              {/* Step 3 */}
              <div className="wa-step-box">
                <div className="wa-step-icon-circle purple">
                  <FileText size={15} />
                </div>
                <span className="wa-step-num">Step 3</span>
                <h4 className="wa-step-title">Send Property Options</h4>
                <span className="wa-step-timing">After 2 hours</span>
              </div>

              {/* Step 4 */}
              <div className="wa-step-box">
                <div className="wa-step-icon-circle amber">
                  <Calendar size={15} />
                </div>
                <span className="wa-step-num">Step 4</span>
                <h4 className="wa-step-title">Site Visit Invite</h4>
                <span className="wa-step-timing">After 1 day</span>
              </div>

              {/* Step 5 */}
              <div className="wa-step-box">
                <div className="wa-step-icon-circle whatsapp">
                  <MessageCircle size={15} />
                </div>
                <span className="wa-step-num">Step 5</span>
                <h4 className="wa-step-title">Follow-up Message</h4>
                <span className="wa-step-timing">After 2 days</span>
              </div>

              {/* Step 6 */}
              <div className="wa-step-box">
                <div className="wa-step-icon-circle rose">
                  <UserCheck size={15} />
                </div>
                <span className="wa-step-num">Step 6</span>
                <h4 className="wa-step-title">Human Takeover</h4>
                <span className="wa-step-timing">If no reply 3 days</span>
              </div>

            </div>

            <div className="wa-timeline-footer">
              <div className="wa-timeline-meta">
                <span>Total Steps: <strong className="wa-kv-val">{followupSeq?.totalSteps || 6}</strong></span>
                <span>Duration: <strong className="wa-kv-val">{followupSeq?.durationDays || 3} Days</strong></span>
                <span>Active Leads in Flow: <strong className="wa-kv-val green">{followupSeq?.activeLeadsCount ? followupSeq.activeLeadsCount.toLocaleString() : '1,248'}</strong></span>
              </div>
              <button type="button" onClick={() => setActiveTab('followup')} className="wa-link-btn">
                View Full Flow &rarr;
              </button>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: TEMPLATES TAB */}
      {activeTab === 'templates' && (
        <div className="wa-card">
          <div className="wa-card-title-bar">
            <h3 className="wa-card-title">WhatsApp Message Templates CRUD</h3>
            <button type="button" onClick={() => setShowTemplateModal(true)} className="wa-btn-primary">
              <Plus size={14} /> Create Template
            </button>
          </div>

          <div className="kb-documents-table-wrapper">
            <table className="wa-table">
              <thead>
                <tr>
                  <th>Template Name</th>
                  <th>Category</th>
                  <th>Language</th>
                  <th>Status</th>
                  <th>Quality Rating</th>
                  <th className="wa-text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {templates.map((t) => (
                  <tr key={t.id}>
                    <td><span className="wa-kv-val">{t.name}</span></td>
                    <td><span className="wa-tmpl-badge">{t.category}</span></td>
                    <td><span className="wa-kv-label">{t.language}</span></td>
                    <td><span className="wa-pill-green">{t.status}</span></td>
                    <td><span className="wa-kv-val green">&bull; {t.qualityRating}</span></td>
                    <td className="wa-text-right">
                      <button type="button" onClick={() => handleDeleteTemplate(t.id)} className="wa-action-icon-btn danger">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: WELCOME MESSAGE TAB */}
      {activeTab === 'welcome' && (
        <div className="wa-card">
          <h3 className="wa-card-title">WhatsApp Welcome Message</h3>
          <p className="wa-page-subtitle">Automated greeting sent to every new incoming WhatsApp lead.</p>
          <div className="wa-input-group">
            <label className="wa-input-label">Welcome Text</label>
            <textarea
              rows={4}
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
              className="wa-input-field"
            />
          </div>
          <button type="button" onClick={handleSaveWelcomeMessage} className="wa-btn-primary">
            Save Welcome Message
          </button>
        </div>
      )}

      {/* TAB 4: FOLLOWUP FLOW TAB */}
      {activeTab === 'followup' && (
        <div className="wa-card">
          <h3 className="wa-card-title">Follow-up Sequence Automation</h3>
          <p className="wa-page-subtitle">Timeline sequence for leads that do not respond immediately.</p>
          <div className="wa-tab-content">
            <div className="wa-step-row">
              <div>
                <span className="wa-kv-val">Step 1: Welcome Message</span>
                <span className="wa-kv-label">Trigger: Immediate on first message</span>
              </div>
              <span className="wa-pill-green">Active</span>
            </div>
            <div className="wa-step-row">
              <div>
                <span className="wa-kv-val">Step 2: Ask Requirement &amp; Budget</span>
                <span className="wa-kv-label">Trigger: 10 minutes delay if no reply</span>
              </div>
              <span className="wa-pill-green">Active</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: AUTOMATION RULES TAB */}
      {activeTab === 'automations' && (
        <div className="wa-card">
          <h3 className="wa-card-title">Automation Rules</h3>
          <div className="kb-documents-table-wrapper">
            <table className="wa-table">
              <thead>
                <tr>
                  <th>Rule Name</th>
                  <th>Priority</th>
                  <th>Trigger Condition</th>
                  <th>Automated Action</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {automations.map((a) => (
                  <tr key={a.id}>
                    <td><span className="wa-kv-val">{a.ruleName}</span></td>
                    <td><span className="wa-kv-val">{a.priority}</span></td>
                    <td><span className="wa-kv-val purple">{a.triggerCondition}</span></td>
                    <td><span className="wa-kv-val green">{a.action}</span></td>
                    <td><span className="wa-pill-green">{a.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: BUSINESS HOURS TAB */}
      {activeTab === 'hours' && (
        <div className="wa-card">
          <h3 className="wa-card-title">WhatsApp Business Hours</h3>
          <div className="wa-subgrid-2">
            <div className="wa-input-group">
              <label className="wa-input-label">Working Hours</label>
              <input
                type="text"
                value={businessHours?.workingHours || '09:00 AM - 08:00 PM'}
                onChange={(e) => setBusinessHours({ ...businessHours!, workingHours: e.target.value })}
                className="wa-input-field"
              />
            </div>
            <div className="wa-input-group">
              <label className="wa-input-label">Timezone</label>
              <input
                type="text"
                value={businessHours?.timeZone || 'Asia/Kolkata (GMT +05:30)'}
                onChange={(e) => setBusinessHours({ ...businessHours!, timeZone: e.target.value })}
                className="wa-input-field"
              />
            </div>
          </div>
          <button type="button" onClick={handleSaveBusinessHours} className="wa-btn-primary">
            Save Business Hours
          </button>
        </div>
      )}

      {/* TAB 7: HUMAN TAKEOVER TAB */}
      {activeTab === 'takeover' && (
        <div className="wa-card">
          <h3 className="wa-card-title">Human Takeover &amp; Escalation Rules</h3>
          <p className="wa-page-subtitle">Automatically pause AI and notify sales team when lead requests human support or negative sentiment occurs.</p>
          <div className="wa-subgrid-2">
            <div className="wa-input-group">
              <label className="wa-input-label">Assign Sales Team</label>
              <input
                type="text"
                value={humanTakeover?.assignTeam || 'Sales Team Alpha'}
                onChange={(e) => setHumanTakeover({ ...humanTakeover!, assignTeam: e.target.value })}
                className="wa-input-field"
              />
            </div>
            <div className="wa-input-group">
              <label className="wa-input-label">Escalation Timeout</label>
              <input
                type="text"
                value={humanTakeover?.escalationTime || '15 minutes'}
                onChange={(e) => setHumanTakeover({ ...humanTakeover!, escalationTime: e.target.value })}
                className="wa-input-field"
              />
            </div>
          </div>
          <button type="button" onClick={handleSaveHumanTakeover} className="wa-btn-primary">
            Save Escalation Rules
          </button>
        </div>
      )}

      {/* TAB 8: MEDIA & FILES TAB */}
      {activeTab === 'media' && (
        <div className="wa-card">
          <h3 className="wa-card-title">Media Library &amp; WhatsApp Collaterals</h3>
          <p className="wa-page-subtitle">PDF Brochures, Pricelists, and 3D Floor Plans linked directly with AI Knowledge Base.</p>
          <div className="kb-documents-table-wrapper">
            <table className="wa-table">
              <thead>
                <tr>
                  <th>Media Name</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>File Size</th>
                  <th>Version</th>
                  <th className="wa-text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {mediaList.map((m) => (
                  <tr key={m.id}>
                    <td><span className="wa-kv-val">{m.name}</span></td>
                    <td><span className="wa-tmpl-badge">{m.type}</span></td>
                    <td><span className="wa-kv-label">{m.category}</span></td>
                    <td><span className="wa-kv-label">{m.fileSize}</span></td>
                    <td><span className="wa-pill-blue">{m.version}</span></td>
                    <td className="wa-text-right">
                      <button type="button" onClick={() => handleDeleteMedia(m.id)} className="wa-action-icon-btn danger">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 9: LOGS TAB */}
      {activeTab === 'logs' && (
        <div className="wa-card">
          <h3 className="wa-card-title">WhatsApp Webhook &amp; Message Logs</h3>
          <div className="kb-documents-table-wrapper">
            <table className="wa-table">
              <thead>
                <tr>
                  <th>Direction</th>
                  <th>Sender</th>
                  <th>Message Content</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((l) => (
                  <tr key={l.id}>
                    <td><span className="wa-tmpl-badge">{l.direction}</span></td>
                    <td><span className="wa-kv-val mono">{l.senderNumber}</span></td>
                    <td><span className="wa-kv-val">{l.messageContent}</span></td>
                    <td><span className="wa-pill-green">{l.deliveryStatus}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Create Template */}
      {showTemplateModal && (
        <div className="agent-modal-overlay" onClick={() => !isSubmittingTemplate && setShowTemplateModal(false)}>
          <div className="agent-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="agent-modal-header">
              <h3 className="agent-modal-title">Create WhatsApp Message Template</h3>
              <button type="button" onClick={() => !isSubmittingTemplate && setShowTemplateModal(false)} className="agent-modal-close-btn" disabled={isSubmittingTemplate}>&times;</button>
            </div>
            <form onSubmit={handleCreateTemplate} className="wa-modal-body">
              <div className="wa-input-group">
                <label className="wa-input-label">Template Name *</label>
                <input
                  type="text"
                  placeholder="e.g. site_visit_invite"
                  value={newTmplName}
                  onChange={(e) => {
                    setNewTmplName(e.target.value);
                    if (templateErrors.name) setTemplateErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  className="wa-input-field"
                  disabled={isSubmittingTemplate}
                  required
                />
                {templateErrors.name && (
                  <span className="wa-error-text">{templateErrors.name}</span>
                )}
              </div>

              <div className="wa-input-group">
                <label className="wa-input-label">Category *</label>
                <select
                  value={newTmplCategory}
                  onChange={(e) => setNewTmplCategory(e.target.value)}
                  className="wa-input-field"
                  disabled={isSubmittingTemplate}
                >
                  <option value="Marketing">Marketing</option>
                  <option value="Utility">Utility</option>
                  <option value="Authentication">Authentication</option>
                </select>
              </div>

              <div className="wa-input-group">
                <label className="wa-input-label">Language *</label>
                <select
                  value={newTmplLanguage}
                  onChange={(e) => setNewTmplLanguage(e.target.value)}
                  className="wa-input-field"
                  disabled={isSubmittingTemplate}
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="Hindi">Hindi</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                </select>
              </div>

              <div className="wa-input-group">
                <label className="wa-input-label">Body Text *</label>
                <textarea
                  rows={4}
                  placeholder="Hi {{1}}, thanks for reaching out..."
                  value={newTmplBody}
                  onChange={(e) => {
                    setNewTmplBody(e.target.value);
                    if (templateErrors.body) setTemplateErrors((prev) => ({ ...prev, body: undefined }));
                  }}
                  className="wa-input-field"
                  disabled={isSubmittingTemplate}
                  required
                />
                {templateErrors.body && (
                  <span className="wa-error-text">{templateErrors.body}</span>
                )}
              </div>

              <div className="wa-card-header-actions wa-justify-end">
                <button
                  type="button"
                  onClick={() => setShowTemplateModal(false)}
                  className="wa-btn-secondary"
                  disabled={isSubmittingTemplate}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="wa-btn-primary"
                  disabled={isSubmittingTemplate}
                >
                  {isSubmittingTemplate ? 'Submitting...' : 'Submit Template'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
