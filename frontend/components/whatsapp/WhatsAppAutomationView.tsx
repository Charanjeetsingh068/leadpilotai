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
  Sparkles,
  GitBranch,
  Bot,
  Trash2,
  Edit,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import {
  WhatsAppClientService,
  WhatsAppConnectionData,
  WhatsAppTemplateItem,
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
  const [followupSeq, setFollowupSeq] = useState<any>(null);
  const [automations, setAutomations] = useState<any[]>([]);
  const [usage, setUsage] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isTesting, setIsTesting] = useState<boolean>(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'connection' | 'templates' | 'welcome' | 'followup' | 'automations' | 'hours' | 'takeover' | 'media' | 'logs'
  >('connection');

  // Modal: Create Template
  const [showTemplateModal, setShowTemplateModal] = useState<boolean>(false);
  const [newTmplName, setNewTmplName] = useState<string>('');
  const [newTmplCategory, setNewTmplCategory] = useState<string>('Marketing');
  const [newTmplBody, setNewTmplBody] = useState<string>('');

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [
        agentRes,
        connRes,
        tmplRes,
        seqRes,
        autoRes,
        usageRes,
        logsRes,
      ] = await Promise.all([
        agentId ? AgentClientService.getAgentById(agentId) : Promise.resolve(null),
        WhatsAppClientService.getConnection({ agentId }),
        WhatsAppClientService.getTemplates({ agentId }),
        WhatsAppClientService.getFollowupSequence({ agentId }),
        WhatsAppClientService.getAutomationRules({ agentId }),
        WhatsAppClientService.getUsageMetrics({ agentId }),
        WhatsAppClientService.getLogs({ agentId }),
      ]);

      if (agentRes && agentRes.success && agentRes.data) setAgent(agentRes.data);
      if (connRes.success && connRes.data) setConnection(connRes.data);
      if (tmplRes.success && Array.isArray(tmplRes.data)) setTemplates(tmplRes.data);
      if (seqRes.success && seqRes.data) setFollowupSeq(seqRes.data);
      if (autoRes.success && Array.isArray(autoRes.data)) setAutomations(autoRes.data);
      if (usageRes.success && usageRes.data) setUsage(usageRes.data);
      if (logsRes.success && Array.isArray(logsRes.data)) setLogs(logsRes.data);
    } catch {
      toast.error('Failed to load WhatsApp Automation data');
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

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTmplName.trim()) return;
    try {
      const res = await WhatsAppClientService.createTemplate({
        name: newTmplName.toLowerCase().replace(/\s+/g, '_'),
        category: newTmplCategory,
        bodyText: newTmplBody,
        aiAgentId: agentId,
      });
      if (res.success) {
        toast.success('Message Template submitted for Meta approval!');
        setShowTemplateModal(false);
        setNewTmplName('');
        setNewTmplBody('');
        loadData();
      }
    } catch {
      toast.error('Failed to create template');
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="agent-page-workspace">
      
      {/* Top Breadcrumb Navigation */}
      <div className="agent-breadcrumb-row">
        <span onClick={() => router.push('/ai-agents')} className="agent-breadcrumb-link">
          AI Agents
        </span>
        <span className="agent-breadcrumb-sep">&gt;</span>
        <span
          onClick={() => agentId && router.push(`/ai-agents/${agentId}`)}
          className="agent-breadcrumb-link text-blue-600 font-medium cursor-pointer"
        >
          {agent ? agent.name : 'Property Advisor AI'}
        </span>
        <span className="agent-breadcrumb-sep">&gt;</span>
        <span className="agent-breadcrumb-current">WhatsApp Automation</span>
      </div>

      {/* Page Header */}
      <div className="agent-header-row mb-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="agent-page-title text-2xl font-bold text-slate-900">WhatsApp Automation</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1">
              Connected
            </span>
          </div>
          <p className="agent-page-subtitle text-xs text-slate-500 mt-0.5">Connect WhatsApp and automate conversations, templates, and follow-ups.</p>
        </div>

        <div className="agent-header-actions flex items-center gap-2">
          <button
            type="button"
            onClick={handleTestConnection}
            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-50 shadow-sm"
          >
            <PhoneCall size={14} className="text-emerald-600" />
            <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
          </button>

          <button
            type="button"
            onClick={() => toast.success('WhatsApp configuration saved!')}
            className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-blue-700 shadow-sm"
          >
            <Save size={14} />
            <span>Save Changes</span>
          </button>

          <button
            type="button"
            className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
          >
            <span className="font-bold text-xs">•••</span>
          </button>
        </div>
      </div>

      {/* Tabs Header Bar */}
      <div className="flex items-center gap-6 border-b border-slate-200 mb-5 text-xs font-medium overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('connection')}
          className={`py-2.5 px-1 border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'connection'
              ? 'border-blue-600 text-blue-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <PhoneCall size={14} />
          <span>Connection</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('templates')}
          className={`py-2.5 px-1 border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'templates'
              ? 'border-blue-600 text-blue-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText size={14} />
          <span>Templates</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('welcome')}
          className={`py-2.5 px-1 border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'welcome'
              ? 'border-blue-600 text-blue-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageCircle size={14} />
          <span>Welcome Message</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('followup')}
          className={`py-2.5 px-1 border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'followup'
              ? 'border-blue-600 text-blue-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <GitBranch size={14} />
          <span>Follow-up Flow</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('automations')}
          className={`py-2.5 px-1 border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'automations'
              ? 'border-blue-600 text-blue-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Zap size={14} />
          <span>Automation Rules</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('hours')}
          className={`py-2.5 px-1 border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'hours'
              ? 'border-blue-600 text-blue-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock size={14} />
          <span>Business Hours</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('takeover')}
          className={`py-2.5 px-1 border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'takeover'
              ? 'border-blue-600 text-blue-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserCheck size={14} />
          <span>Human Takeover</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('media')}
          className={`py-2.5 px-1 border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'media'
              ? 'border-blue-600 text-blue-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText size={14} />
          <span>Media &amp; Files</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('logs')}
          className={`py-2.5 px-1 border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'logs'
              ? 'border-blue-600 text-blue-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText size={14} />
          <span>Logs</span>
        </button>
      </div>

      {/* TAB 1: CONNECTION TAB (100% Exact Match to Screenshot) */}
      {activeTab === 'connection' && (
        <div className="flex flex-col gap-5">
          
          {/* Top 2-Column Grid */}
          <div className="grid grid-cols-12 gap-5">
            
            {/* Left 8 Cols: WhatsApp Business Connection Container */}
            <div className="col-span-12 lg:col-span-8">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <h3 className="font-bold text-sm text-slate-900 mb-4 border-b border-slate-100 pb-3">WhatsApp Business Connection</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  
                  {/* Sub-card 1: WhatsApp Business API */}
                  <div className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-xl flex flex-col gap-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center font-bold shadow-sm">
                        <MessageCircle size={22} />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-900 flex items-center gap-2">
                          WhatsApp Business API
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">Connected</span>
                        </h4>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs pt-2 border-t border-slate-200/60">
                      <div>
                        <span className="text-slate-400 font-medium block text-[11px]">Phone Number</span>
                        <span className="font-bold text-slate-800">{connection?.phoneNumber || '+91 98765 43210'}</span>
                      </div>

                      <div>
                        <span className="text-slate-400 font-medium block text-[11px]">Business Account</span>
                        <span className="font-bold text-slate-800">{connection?.businessAccount || 'Acme Real Estate'}</span>
                      </div>

                      <div>
                        <span className="text-slate-400 font-medium block text-[11px]">WABA ID</span>
                        <span className="font-mono font-bold text-slate-800">{connection?.wabaId || '1029384756'}</span>
                      </div>

                      <div>
                        <span className="text-slate-400 font-medium block text-[11px]">Status</span>
                        <span className="font-bold text-emerald-600">{connection?.status || 'Connected and Active'}</span>
                      </div>

                      <div>
                        <span className="text-slate-400 font-medium block text-[11px]">Quality Rating</span>
                        <span className="font-bold text-emerald-600 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> High
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Sub-card 2: Webhook Configuration */}
                  <div className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-xl flex flex-col justify-between gap-3">
                    <h4 className="font-bold text-xs text-slate-900">Webhook Configuration</h4>

                    <div className="flex flex-col gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">Webhook URL</label>
                        <div className="relative flex items-center">
                          <input
                            type="text"
                            value={connection?.webhookUrl || 'https://app.leadpilotai.com/api/whatsapp/webhook/1029384756'}
                            className="w-full px-2.5 py-1.5 text-[11px] font-mono border border-slate-200 rounded-lg bg-white pr-8 text-slate-700"
                            readOnly
                          />
                          <button
                            type="button"
                            onClick={() => copyToClipboard(connection?.webhookUrl || 'https://app.leadpilotai.com/api/whatsapp/webhook/1029384756')}
                            className="absolute right-2 text-slate-400 hover:text-blue-600"
                            title="Copy URL"
                          >
                            <Copy size={13} />
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">Verify Token</label>
                        <div className="relative flex items-center">
                          <input
                            type="password"
                            value={connection?.verifyToken || 'leadpilot_verify_secret_102938'}
                            className="w-full px-2.5 py-1.5 text-[11px] font-mono border border-slate-200 rounded-lg bg-white pr-8 text-slate-700"
                            readOnly
                          />
                          <button type="button" className="absolute right-2 text-slate-400 hover:text-blue-600" title="Toggle token">
                            <Eye size={13} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-200/60 pt-2 text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Webhook Status:</span>
                        <span className="font-bold text-emerald-600">&bull; Active</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Last Received:</span>
                        <span className="font-medium text-slate-700">May 26, 2025 10:28 AM</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => toast.success('Webhook Resubscribed!')}
                        className="px-2.5 py-1 rounded-lg border border-blue-200 bg-white text-blue-600 font-semibold text-[11px] hover:bg-blue-50 flex items-center gap-1"
                      >
                        <RefreshCw size={12} /> Resubscribe Webhook
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Right 4 Cols: WhatsApp Connection Status Box */}
            <div className="col-span-12 lg:col-span-4">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm h-full flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 mb-4 border-b border-slate-100 pb-2">WhatsApp Connection Status</h3>
                  
                  <div className="flex flex-col gap-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-500" /> API Connection
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">Connected</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-500" /> Phone Number
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">Verified</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-500" /> Webhook
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">Active</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-500" /> Message Sending
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">Enabled</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-500" /> Message Receiving
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">Enabled</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-500" /> Quality Rating
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">High</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> Rate Limit
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[11px]">95% available</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setActiveTab('logs')}
                    className="w-full py-2 rounded-lg border border-blue-200 bg-white text-blue-600 font-semibold text-xs hover:bg-blue-50 flex items-center justify-center gap-1.5"
                  >
                    <FileText size={14} /> View Full Logs
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Middle 2-Column Grid */}
          <div className="grid grid-cols-12 gap-5">
            
            {/* Left 8 Cols: Message Templates Table */}
            <div className="col-span-12 lg:col-span-8">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-bold text-sm text-slate-900">Message Templates</h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold">12 Active Templates</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setShowTemplateModal(true)}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold flex items-center gap-1 hover:bg-blue-700"
                    >
                      <Plus size={13} /> Create Template
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('templates')}
                      className="text-xs font-bold text-blue-600 hover:underline"
                    >
                      View All Templates
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-semibold text-[11px]">
                        <th className="py-2.5 px-2">Template Name</th>
                        <th className="py-2.5 px-2">Category</th>
                        <th className="py-2.5 px-2">Language</th>
                        <th className="py-2.5 px-2">Status</th>
                        <th className="py-2.5 px-2">Quality Rating</th>
                        <th className="py-2.5 px-2">Last Approved</th>
                        <th className="py-2.5 px-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {templates.map((tmpl) => (
                        <tr key={tmpl.id} className="hover:bg-slate-50/80">
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                                <MessageCircle size={14} />
                              </div>
                              <div>
                                <div className="font-bold text-slate-900">{tmpl.name}</div>
                                <div className="text-[11px] text-slate-400 truncate max-w-xs">{tmpl.bodyText}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-2"><span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium">{tmpl.category}</span></td>
                          <td className="py-3 px-2 font-medium text-slate-700">{tmpl.language}</td>
                          <td className="py-3 px-2"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold">{tmpl.status}</span></td>
                          <td className="py-3 px-2"><span className="font-bold text-emerald-600">&bull; {tmpl.qualityRating}</span></td>
                          <td className="py-3 px-2 text-slate-500">May 20, 2025</td>
                          <td className="py-3 px-2 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button type="button" className="p-1 text-slate-400 hover:text-blue-600"><Eye size={14} /></button>
                              <button type="button" onClick={() => handleDeleteTemplate(tmpl.id)} className="p-1 text-slate-400 hover:text-red-600"><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Daily Message Usage & Automation Summary */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-5">
              
              {/* Daily Message Usage Box */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                  <h3 className="font-bold text-xs text-slate-900">Daily Message Usage</h3>
                  <span className="text-[11px] text-slate-500 font-semibold cursor-pointer">Today ▼</span>
                </div>

                <div className="flex items-center gap-5 py-2">
                  {/* Circular Donut Metric */}
                  <div className="relative w-16 h-16 rounded-full border-4 border-blue-600 border-t-blue-100 flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-xs font-black text-slate-900">32%</span>
                    <span className="text-[9px] text-slate-400">Used</span>
                  </div>

                  <div className="flex flex-col gap-1 text-xs flex-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Used</span>
                      <span className="font-bold text-slate-900">3,210</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Limit</span>
                      <span className="font-bold text-slate-900">10,000</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-100 pt-1">
                      <span className="text-slate-400">Remaining</span>
                      <span className="font-bold text-blue-600">6,790</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mb-1">
                    <div className="bg-emerald-500 h-full w-[95%]" />
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600">95% rate limit available</span>
                </div>

                <div className="mt-3 text-center border-t border-slate-100 pt-2">
                  <button type="button" onClick={() => toast.success('Viewing Usage Analytics...')} className="text-xs font-bold text-blue-600 hover:underline">
                    View Usage Analytics
                  </button>
                </div>
              </div>

              {/* Automation Summary Box */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <h3 className="font-bold text-xs text-slate-900 mb-3 border-b border-slate-100 pb-2">Automation Summary</h3>
                
                <div className="flex flex-col gap-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 flex items-center gap-2"><Zap size={14} className="text-blue-500" /> Active Workflows</span>
                    <span className="font-bold text-slate-900">4</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 flex items-center gap-2"><FileText size={14} className="text-blue-500" /> Templates</span>
                    <span className="font-bold text-slate-900">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 flex items-center gap-2"><MessageCircle size={14} className="text-blue-500" /> Messages Sent (Today)</span>
                    <span className="font-bold text-slate-900">3,210</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Messages Delivered</span>
                    <span className="font-bold text-emerald-600">98.7%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 flex items-center gap-2"><Bot size={14} className="text-purple-500" /> Auto Responses</span>
                    <span className="font-bold text-slate-900">2,856</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 flex items-center gap-2"><UserCheck size={14} className="text-orange-500" /> Human Takeovers</span>
                    <span className="font-bold text-slate-900">128</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 flex items-center gap-2"><AlertCircle size={14} className="text-red-500" /> Blocked Messages</span>
                    <span className="font-bold text-slate-900">12</span>
                  </div>
                </div>

                <div className="mt-4 text-center border-t border-slate-100 pt-2">
                  <button type="button" onClick={() => toast.success('Viewing Automation Reports...')} className="text-xs font-bold text-blue-600 hover:underline">
                    View Automation Reports
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Bottom Card: Active Follow-up Sequence */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-sm text-slate-900">Active Follow-up Sequence</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold">Real Estate Follow-up Flow</span>
              </div>
              <button type="button" onClick={() => setActiveTab('followup')} className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                <Edit size={13} /> Edit Flow
              </button>
            </div>

            {/* Horizontal Timeline Steps */}
            <div className="grid grid-cols-6 gap-3 py-2">
              
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center mb-1.5 shadow-sm">
                  <MessageCircle size={15} />
                </div>
                <span className="text-[10px] font-bold text-slate-400">Step 1</span>
                <h4 className="text-xs font-bold text-slate-900">Welcome Message</h4>
                <span className="text-[10px] text-slate-400 mt-0.5">Immediately</span>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mb-1.5 shadow-sm">
                  <Bot size={15} />
                </div>
                <span className="text-[10px] font-bold text-slate-400">Step 2</span>
                <h4 className="text-xs font-bold text-slate-900">Ask Requirement</h4>
                <span className="text-[10px] text-slate-400 mt-0.5">After 10 minutes</span>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center mb-1.5 shadow-sm">
                  <FileText size={15} />
                </div>
                <span className="text-[10px] font-bold text-slate-400">Step 3</span>
                <h4 className="text-xs font-bold text-slate-900">Send Property Options</h4>
                <span className="text-[10px] text-slate-400 mt-0.5">After 2 hours</span>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center mb-1.5 shadow-sm">
                  <Calendar size={15} />
                </div>
                <span className="text-[10px] font-bold text-slate-400">Step 4</span>
                <h4 className="text-xs font-bold text-slate-900">Site Visit Invite</h4>
                <span className="text-[10px] text-slate-400 mt-0.5">After 1 day</span>
              </div>

              {/* Step 5 */}
              <div className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center mb-1.5 shadow-sm">
                  <MessageCircle size={15} />
                </div>
                <span className="text-[10px] font-bold text-slate-400">Step 5</span>
                <h4 className="text-xs font-bold text-slate-900">Follow-up Message</h4>
                <span className="text-[10px] text-slate-400 mt-0.5">After 2 days</span>
              </div>

              {/* Step 6 */}
              <div className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center mb-1.5 shadow-sm">
                  <UserCheck size={15} />
                </div>
                <span className="text-[10px] font-bold text-slate-400">Step 6</span>
                <h4 className="text-xs font-bold text-slate-900">Human Takeover</h4>
                <span className="text-[10px] text-slate-400 mt-0.5">If no reply 3 days</span>
              </div>

            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-2 text-xs text-slate-500">
              <div className="flex gap-4">
                <span>Total Steps: <strong className="text-slate-800">6</strong></span>
                <span>Duration: <strong className="text-slate-800">3 Days</strong></span>
                <span>Active Leads in Flow: <strong className="text-blue-600">1,248</strong></span>
              </div>
              <button type="button" onClick={() => setActiveTab('followup')} className="text-blue-600 font-bold hover:underline">
                View Full Flow &rarr;
              </button>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: TEMPLATES TAB */}
      {activeTab === 'templates' && (
        <div className="agent-card-section">
          <div className="flex justify-between items-center mb-3">
            <h3 className="agent-section-title mb-0">WhatsApp Message Templates CRUD</h3>
            <button type="button" onClick={() => setShowTemplateModal(true)} className="btn-agent-create-primary text-xs py-1">
              <Plus size={14} /> Create Template
            </button>
          </div>

          <div className="kb-documents-table-wrapper">
            <table className="kb-documents-table">
              <thead>
                <tr>
                  <th>Template Name</th>
                  <th>Category</th>
                  <th>Language</th>
                  <th>Status</th>
                  <th>Quality Rating</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {templates.map((t) => (
                  <tr key={t.id}>
                    <td className="font-bold text-slate-800">{t.name}</td>
                    <td><span className="kb-type-badge pdf">{t.category}</span></td>
                    <td className="text-xs">{t.language}</td>
                    <td><span className="kb-status-badge indexed">{t.status}</span></td>
                    <td className="font-bold text-green-600">&bull; {t.qualityRating}</td>
                    <td className="text-right">
                      <button type="button" onClick={() => handleDeleteTemplate(t.id)} className="kb-action-icon-btn text-red-500">
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
        <div className="agent-card-section">
          <h3 className="agent-section-title mb-2">WhatsApp Welcome Message</h3>
          <p className="text-xs text-slate-500 mb-3">Automated greeting sent to every new incoming WhatsApp lead.</p>
          <div className="agent-form-group">
            <label className="agent-form-label">Welcome Text</label>
            <textarea rows={4} defaultValue="Hi {{lead_name}} 👋, thanks for contacting Acme Real Estate! I am your AI Property Advisor. How can I assist you today?" className="agent-form-textarea" />
          </div>
          <button type="button" onClick={() => toast.success('Welcome Message Saved!')} className="btn-agent-create-primary">
            Save Welcome Message
          </button>
        </div>
      )}

      {/* TAB 4: FOLLOWUP FLOW TAB */}
      {activeTab === 'followup' && (
        <div className="agent-card-section">
          <h3 className="agent-section-title mb-2">Follow-up Sequence Automation</h3>
          <p className="text-xs text-slate-500 mb-3">Timeline sequence for leads that do not respond immediately.</p>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 border rounded-lg flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-800 block">Step 1: Welcome Message</span>
                <span className="text-slate-500">Trigger: Immediate on first message</span>
              </div>
              <span className="kb-status-badge indexed">Active</span>
            </div>
            <div className="p-3 bg-slate-50 border rounded-lg flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-800 block">Step 2: Ask Requirement &amp; Budget</span>
                <span className="text-slate-500">Trigger: 10 minutes delay if no reply</span>
              </div>
              <span className="kb-status-badge indexed">Active</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: AUTOMATION RULES TAB */}
      {activeTab === 'automations' && (
        <div className="agent-card-section">
          <h3 className="agent-section-title mb-3">Automation Rules</h3>
          <div className="kb-documents-table-wrapper">
            <table className="kb-documents-table">
              <thead>
                <tr>
                  <th>Rule Name</th>
                  <th>Trigger Condition</th>
                  <th>Automated Action</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {automations.map((a) => (
                  <tr key={a.id}>
                    <td className="font-bold text-slate-800">{a.ruleName}</td>
                    <td className="text-xs text-purple-700 font-medium">{a.triggerCondition}</td>
                    <td className="text-xs text-blue-600 font-semibold">{a.action}</td>
                    <td><span className="kb-status-badge indexed">{a.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: BUSINESS HOURS TAB */}
      {activeTab === 'hours' && (
        <div className="agent-card-section">
          <h3 className="agent-section-title mb-3">WhatsApp Business Hours</h3>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="agent-form-group">
              <label className="agent-form-label">Working Hours</label>
              <input type="text" defaultValue="09:00 AM - 08:00 PM" className="agent-form-input" />
            </div>
            <div className="agent-form-group">
              <label className="agent-form-label">Timezone</label>
              <input type="text" defaultValue="Asia/Kolkata (GMT +05:30)" className="agent-form-input" />
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: HUMAN TAKEOVER TAB */}
      {activeTab === 'takeover' && (
        <div className="agent-card-section">
          <h3 className="agent-section-title mb-3">Human Takeover &amp; Escalation Rules</h3>
          <p className="text-xs text-slate-500 mb-3">Automatically pause AI and notify sales team when lead requests human support or negative sentiment occurs.</p>
        </div>
      )}

      {/* TAB 8: MEDIA & FILES TAB */}
      {activeTab === 'media' && (
        <div className="agent-card-section">
          <h3 className="agent-section-title mb-3">Media Library &amp; WhatsApp Collaterals</h3>
          <p className="text-xs text-slate-500 mb-3">PDF Brochures, Pricelists, and 3D Floor Plans linked directly with AI Knowledge Base.</p>
        </div>
      )}

      {/* TAB 9: LOGS TAB */}
      {activeTab === 'logs' && (
        <div className="agent-card-section">
          <h3 className="agent-section-title mb-3">WhatsApp Webhook &amp; Message Logs</h3>
          <div className="kb-documents-table-wrapper">
            <table className="kb-documents-table">
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
                    <td><span className="kb-type-badge pdf">{l.direction}</span></td>
                    <td className="font-mono text-xs">{l.senderNumber}</td>
                    <td className="text-xs text-slate-800 font-medium">{l.messageContent}</td>
                    <td><span className="kb-status-badge indexed">{l.deliveryStatus}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Create Template */}
      {showTemplateModal && (
        <div className="agent-modal-overlay" onClick={() => setShowTemplateModal(false)}>
          <div className="agent-modal-container max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="agent-modal-header">
              <h3 className="agent-modal-title">Create WhatsApp Message Template</h3>
              <button type="button" onClick={() => setShowTemplateModal(false)} className="agent-modal-close-btn">&times;</button>
            </div>
            <form onSubmit={handleCreateTemplate} className="p-4 flex flex-col gap-3">
              <div className="agent-form-group">
                <label className="agent-form-label">Template Name *</label>
                <input
                  type="text"
                  placeholder="e.g. site_visit_invite"
                  value={newTmplName}
                  onChange={(e) => setNewTmplName(e.target.value)}
                  className="agent-form-input text-xs"
                  required
                />
              </div>

              <div className="agent-form-group">
                <label className="agent-form-label">Category</label>
                <select value={newTmplCategory} onChange={(e) => setNewTmplCategory(e.target.value)} className="agent-form-select">
                  <option value="Marketing">Marketing</option>
                  <option value="Utility">Utility</option>
                  <option value="Authentication">Authentication</option>
                </select>
              </div>

              <div className="agent-form-group">
                <label className="agent-form-label">Body Text *</label>
                <textarea
                  rows={4}
                  placeholder="Hi {{1}}, thanks for reaching out..."
                  value={newTmplBody}
                  onChange={(e) => setNewTmplBody(e.target.value)}
                  className="agent-form-textarea text-xs"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 mt-3">
                <button type="button" onClick={() => setShowTemplateModal(false)} className="btn-agent-secondary-action">Cancel</button>
                <button type="submit" className="btn-agent-create-primary">Submit Template</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
