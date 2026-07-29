'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Play,
  Save,
  Send,
  Plus,
  Minus,
  Maximize2,
  Grid,
  X,
  Trash2,
  GripVertical,
  CheckCircle2,
  MessageSquare,
  HelpCircle,
  Sparkles,
  GitBranch,
  Clock,
  UserCheck,
  Tag,
  Zap,
  CheckSquare,
  ChevronRight,
  Sliders,
  ChevronDown,
  RotateCw,
} from 'lucide-react';
import { FlowClientService, QualificationFlowData, FlowNodeItem } from '@/services/flow.service';
import { AgentClientService, AIAgentItem } from '@/services/agent.service';
import toast from 'react-hot-toast';

interface Props {
  agentId?: string;
}

export const QualificationFlowBuilderView: React.FC<Props> = ({ agentId }) => {
  const router = useRouter();
  const [agent, setAgent] = useState<AIAgentItem | null>(null);
  const [flow, setFlow] = useState<QualificationFlowData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'builder' | 'questions' | 'scoring' | 'conditions' | 'automation' | 'settings'>('builder');

  // Active Selected Node for Inspector
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-budget-q');
  
  // Test Modal
  const [showTestModal, setShowTestModal] = useState<boolean>(false);
  const [testLogs, setTestLogs] = useState<string[]>([]);
  const [testScore, setTestScore] = useState<number>(75);

  // Inspector Form State for Selected Node
  const [questionText, setQuestionText] = useState<string>('What is your budget range?');
  const [questionType, setQuestionType] = useState<string>('Single Choice');
  const [options, setOptions] = useState<Array<{ text: string; scorePct: string }>>([
    { text: '₹50 Lakh or less', scorePct: '25%' },
    { text: '₹50 Lakh - ₹1 Cr', scorePct: '50%' },
    { text: '₹1 Cr - ₹2 Cr', scorePct: '75%' },
    { text: 'Above ₹2 Cr', scorePct: '100%' },
  ]);
  const [saveAnswerTo, setSaveAnswerTo] = useState<string>('Budget Range');
  const [leadScoreImpact, setLeadScoreImpact] = useState<number>(10);

  // Tab Data States
  const [questionsList, setQuestionsList] = useState<any[]>([]);
  const [scoreRulesList, setScoreRulesList] = useState<any[]>([]);
  const [conditionsList, setConditionsList] = useState<any[]>([]);
  const [automationsList, setAutomationsList] = useState<any[]>([]);
  const [flowSettings, setFlowSettings] = useState<any>({
    defaultLanguage: 'English (India)',
    fallbackLanguage: 'Hindi',
    timeoutSeconds: 300,
    maxRetries: 3,
    typingDelay: 'Natural (1.5s - 3s)',
    businessHours: '09:00 AM - 08:00 PM',
    autoQualification: true,
    maxQuestions: 5,
    minQualificationScore: 50,
    aiConfidenceThreshold: 80,
  });

  const [showQuestionModal, setShowQuestionModal] = useState<boolean>(false);
  const [newQText, setNewQText] = useState<string>('');
  const [newQType, setNewQType] = useState<string>('Single Choice');
  const [newQSaveTo, setNewQSaveTo] = useState<string>('Budget Range');

  const loadFlowData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [
        flowRes,
        agentRes,
        qRes,
        scoreRes,
        condRes,
        autoRes,
        settRes,
      ] = await Promise.all([
        FlowClientService.getFlow({ agentId }),
        agentId ? AgentClientService.getAgentById(agentId) : Promise.resolve(null),
        FlowClientService.getQuestions({ agentId }),
        FlowClientService.getScoreRules({ agentId }),
        FlowClientService.getConditions({ agentId }),
        FlowClientService.getAutomations({ agentId }),
        FlowClientService.getSettings({ agentId }),
      ]);

      if (flowRes.success && flowRes.data) setFlow(flowRes.data);
      if (agentRes && agentRes.success && agentRes.data) setAgent(agentRes.data);
      if (qRes.success && Array.isArray(qRes.data)) setQuestionsList(qRes.data);
      if (scoreRes.success && Array.isArray(scoreRes.data)) setScoreRulesList(scoreRes.data);
      if (condRes.success && Array.isArray(condRes.data)) setConditionsList(condRes.data);
      if (autoRes.success && Array.isArray(autoRes.data)) setAutomationsList(autoRes.data);
      if (settRes.success && settRes.data) setFlowSettings(settRes.data);
    } catch {
      toast.error('Failed to load Qualification Flow data');
    } finally {
      setIsLoading(false);
    }
  }, [agentId]);

  useEffect(() => {
    loadFlowData();
  }, [loadFlowData]);

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQText.trim()) return;
    try {
      const res = await FlowClientService.createQuestion({
        agentId,
        questionText: newQText,
        questionType: newQType,
        saveAnswerTo: newQSaveTo,
        scoreImpact: 10,
      });
      if (res.success) {
        toast.success('Question added to Qualification Flow!');
        setShowQuestionModal(false);
        setNewQText('');
        loadFlowData();
      }
    } catch {
      toast.error('Failed to add question');
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    try {
      const res = await FlowClientService.deleteQuestion(id);
      if (res.success) {
        toast.success('Question deleted');
        loadFlowData();
      }
    } catch {
      toast.error('Failed to delete question');
    }
  };

  const handleSaveDraft = async () => {
    if (!flow) return;
    setIsSaving(true);
    try {
      const res = await FlowClientService.saveFlow(flow.id, {
        nodes: flow.nodes || [],
        edges: flow.edges || [],
      });
      if (res.success) {
        toast.success('Qualification Flow draft saved to database!');
        loadFlowData();
      }
    } catch {
      toast.error('Failed to save draft');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!flow) return;
    setIsPublishing(true);
    try {
      const res = await FlowClientService.publishFlow(flow.id);
      if (res.success) {
        toast.success('Qualification Flow published live to AI Agent!');
        loadFlowData();
      }
    } catch {
      toast.error('Failed to publish flow');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleRunTest = async () => {
    setShowTestModal(true);
    try {
      const res = await FlowClientService.testFlow({ agentId, flowId: flow?.id });
      if (res.success && res.data) {
        setTestLogs(res.data.executionLogs || []);
        setTestScore(res.data.leadScore || 75);
      }
    } catch {
      toast.error('Failed to execute simulation');
    }
  };

  const handleAddOption = () => {
    setOptions([...options, { text: 'New Option', scorePct: '50%' }]);
  };

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
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
          className="agent-breadcrumb-link"
        >
          {agent ? agent.name : 'Property Advisor AI'}
        </span>
        <span className="agent-breadcrumb-sep">&gt;</span>
        <span className="agent-breadcrumb-current">Qualification Flow Builder</span>
      </div>

      {/* Module Quick Launcher Bar */}
      <div className="agent-launcher-bar mb-3">
        <button
          type="button"
          onClick={() => agentId ? router.push(`/ai-agents/${agentId}`) : router.push('/ai-agents')}
          className="agent-launcher-btn"
        >
          <Sparkles size={14} />
          <span>Agent Configuration</span>
        </button>

        <button
          type="button"
          onClick={() => agentId ? router.push(`/ai-agents/${agentId}/knowledge-base`) : router.push('/knowledge-base')}
          className="agent-launcher-btn"
        >
          <HelpCircle size={14} />
          <span>Knowledge Base &amp; Training</span>
        </button>

        <button
          type="button"
          className="agent-launcher-btn active"
        >
          <GitBranch size={14} />
          <span>Qualification Flow Builder</span>
        </button>

        <button
          type="button"
          onClick={() => router.push('/ai-whatsapp-conversation')}
          className="agent-launcher-btn"
        >
          <MessageSquare size={14} />
          <span>WhatsApp Automation</span>
        </button>
      </div>

      {/* Page Header */}
      <div className="agent-header-row">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="agent-page-title">Qualification Flow Builder</h1>
            <span className="agent-status-badge active">
              <span className="kb-cat-dot bg-green-500 inline-block mr-1" /> Published
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Last published: {flow?.lastPublishedAt ? new Date(flow.lastPublishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'May 25, 2025 04:30 PM'}
            </span>
          </div>
          <p className="agent-page-subtitle">Design the conversation flow to qualify leads and capture the right information.</p>
        </div>

        <div className="agent-header-actions">
          <button type="button" onClick={handleRunTest} className="btn-agent-secondary-action">
            <Play size={15} />
            <span>Test Flow</span>
          </button>

          <button type="button" onClick={handleSaveDraft} className="btn-agent-secondary-action">
            <Save size={15} />
            <span>{isSaving ? 'Saving...' : 'Save Draft'}</span>
          </button>

          <button type="button" onClick={handlePublish} className="btn-agent-create-primary">
            <Send size={15} />
            <span>{isPublishing ? 'Publishing...' : 'Publish Flow'}</span>
          </button>
        </div>
      </div>

      {/* Sub Navigation Tabs */}
      <div className="agent-tabs-header-bar">
        <button
          type="button"
          onClick={() => setActiveTab('builder')}
          className={`agent-tab-item ${activeTab === 'builder' ? 'active' : ''}`}
        >
          <Sparkles size={15} />
          <span>Flow Builder</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('questions')}
          className={`agent-tab-item ${activeTab === 'questions' ? 'active' : ''}`}
        >
          <HelpCircle size={15} />
          <span>Questions</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('scoring')}
          className={`agent-tab-item ${activeTab === 'scoring' ? 'active' : ''}`}
        >
          <Sliders size={15} />
          <span>Lead Scoring</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('conditions')}
          className={`agent-tab-item ${activeTab === 'conditions' ? 'active' : ''}`}
        >
          <GitBranch size={15} />
          <span>Conditions</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('automation')}
          className={`agent-tab-item ${activeTab === 'automation' ? 'active' : ''}`}
        >
          <Zap size={15} />
          <span>Automation</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`agent-tab-item ${activeTab === 'settings' ? 'active' : ''}`}
        >
          <Sliders size={15} />
          <span>Settings</span>
        </button>
      </div>

      {/* Main 3-Panel Workspace */}
      {activeTab === 'builder' && (
        <div className="flow-builder-3col-workspace">
          
          {/* PANEL 1: Drag & Drop Node Palette (Left Column) */}
          <div className="flow-palette-panel">
            <div className="flow-palette-header">
              <h3 className="flow-palette-title">Drag &amp; Drop Nodes</h3>
              <p className="flow-palette-sub">Drag nodes to the canvas to build your flow</p>
            </div>

            <div className="flow-palette-content">
              
              {/* Category: Message Nodes */}
              <div className="flow-node-group">
                <span className="flow-group-label">Message Nodes</span>
                
                <div className="flow-drag-item">
                  <div className="flow-drag-icon-box bg-purple-100 text-purple-600">
                    <MessageSquare size={16} />
                  </div>
                  <div>
                    <div className="flow-drag-name">Send Message</div>
                    <div className="flow-drag-desc">Send text or media message</div>
                  </div>
                  <GripVertical size={14} className="flow-drag-grip" />
                </div>

                <div className="flow-drag-item">
                  <div className="flow-drag-icon-box bg-blue-100 text-blue-600">
                    <HelpCircle size={16} />
                  </div>
                  <div>
                    <div className="flow-drag-name">Ask Question</div>
                    <div className="flow-drag-desc">Ask a question to user</div>
                  </div>
                  <GripVertical size={14} className="flow-drag-grip" />
                </div>

                <div className="flow-drag-item">
                  <div className="flow-drag-icon-box bg-cyan-100 text-cyan-600">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <div className="flow-drag-name">Smart Reply</div>
                    <div className="flow-drag-desc">AI smart response</div>
                  </div>
                  <GripVertical size={14} className="flow-drag-grip" />
                </div>
              </div>

              {/* Category: Logic Nodes */}
              <div className="flow-node-group">
                <span className="flow-group-label">Logic Nodes</span>

                <div className="flow-drag-item">
                  <div className="flow-drag-icon-box bg-green-100 text-green-600">
                    <GitBranch size={16} />
                  </div>
                  <div>
                    <div className="flow-drag-name">Condition</div>
                    <div className="flow-drag-desc">Add conditions/filters</div>
                  </div>
                  <GripVertical size={14} className="flow-drag-grip" />
                </div>

                <div className="flow-drag-item">
                  <div className="flow-drag-icon-box bg-indigo-100 text-indigo-600">
                    <GitBranch size={16} />
                  </div>
                  <div>
                    <div className="flow-drag-name">Branch</div>
                    <div className="flow-drag-desc">Split flow into branches</div>
                  </div>
                  <GripVertical size={14} className="flow-drag-grip" />
                </div>

                <div className="flow-drag-item">
                  <div className="flow-drag-icon-box bg-purple-100 text-purple-600">
                    <Clock size={16} />
                  </div>
                  <div>
                    <div className="flow-drag-name">Wait / Delay</div>
                    <div className="flow-drag-desc">Add time delay</div>
                  </div>
                  <GripVertical size={14} className="flow-drag-grip" />
                </div>
              </div>

              {/* Category: Action Nodes */}
              <div className="flow-node-group">
                <span className="flow-group-label">Action Nodes</span>

                <div className="flow-drag-item">
                  <div className="flow-drag-icon-box bg-emerald-100 text-emerald-600">
                    <UserCheck size={16} />
                  </div>
                  <div>
                    <div className="flow-drag-name">Update Lead Field</div>
                    <div className="flow-drag-desc">Update lead information</div>
                  </div>
                  <GripVertical size={14} className="flow-drag-grip" />
                </div>

                <div className="flow-drag-item">
                  <div className="flow-drag-icon-box bg-amber-100 text-amber-600">
                    <Tag size={16} />
                  </div>
                  <div>
                    <div className="flow-drag-name">Add Tag</div>
                    <div className="flow-drag-desc">Add tag to lead</div>
                  </div>
                  <GripVertical size={14} className="flow-drag-grip" />
                </div>

                <div className="flow-drag-item">
                  <div className="flow-drag-icon-box bg-orange-100 text-orange-600">
                    <UserCheck size={16} />
                  </div>
                  <div>
                    <div className="flow-drag-name">Assign To</div>
                    <div className="flow-drag-desc">Assign to team member</div>
                  </div>
                  <GripVertical size={14} className="flow-drag-grip" />
                </div>

                <div className="flow-drag-item">
                  <div className="flow-drag-icon-box bg-blue-100 text-blue-600">
                    <Zap size={16} />
                  </div>
                  <div>
                    <div className="flow-drag-name">Trigger Automation</div>
                    <div className="flow-drag-desc">Trigger automation/workflow</div>
                  </div>
                  <GripVertical size={14} className="flow-drag-grip" />
                </div>
              </div>

              {/* Category: End Node */}
              <div className="flow-node-group">
                <span className="flow-group-label">End Node</span>

                <div className="flow-drag-item">
                  <div className="flow-drag-icon-box bg-red-100 text-red-600">
                    <CheckSquare size={16} />
                  </div>
                  <div>
                    <div className="flow-drag-name">End Flow</div>
                    <div className="flow-drag-desc">End this conversation flow</div>
                  </div>
                  <GripVertical size={14} className="flow-drag-grip" />
                </div>
              </div>

            </div>

            {/* Bottom Mini-Map Thumbnail Box */}
            <div className="flow-minimap-box">
              <div className="flow-minimap-preview">
                <div className="flow-minimap-wireframe" />
              </div>
              <div className="flow-minimap-toolbar">
                <button type="button" className="flow-zoom-btn"><Maximize2 size={13} /></button>
                <button type="button" className="flow-zoom-btn"><Plus size={13} /></button>
                <button type="button" className="flow-zoom-btn"><Minus size={13} /></button>
              </div>
            </div>
          </div>

          {/* PANEL 2: Interactive Flowchart Canvas (Middle Column) */}
          <div className="flow-canvas-panel">
            
            {/* Canvas Toolbar Controls */}
            <div className="flow-canvas-toolbar">
              <div className="flex items-center gap-1">
                <button type="button" className="flow-zoom-btn"><Minus size={14} /></button>
                <span className="text-xs font-bold text-slate-700 px-2">100%</span>
                <button type="button" className="flow-zoom-btn"><Plus size={14} /></button>
              </div>
              <div className="flex items-center gap-1">
                <button type="button" className="flow-zoom-btn"><Maximize2 size={14} /></button>
                <button type="button" className="flow-zoom-btn active"><Grid size={14} /></button>
              </div>
            </div>

            {/* Flow Canvas Content Grid */}
            <div className="flow-canvas-viewport">
              
              {/* NODE 1: START */}
              <div className="flow-canvas-node-card node-green" onClick={() => setSelectedNodeId('node-start')}>
                <div className="flow-node-icon-bg bg-green-100 text-green-600">
                  <Play size={16} />
                </div>
                <div>
                  <span className="flow-node-type text-green-700">Start</span>
                  <h4 className="flow-node-title">Conversation Start</h4>
                </div>
              </div>

              <div className="flow-connector-line" />

              {/* NODE 2: SEND MESSAGE */}
              <div className="flow-canvas-node-card node-purple" onClick={() => setSelectedNodeId('node-welcome')}>
                <div className="flow-node-icon-bg bg-purple-100 text-purple-600">
                  <MessageSquare size={16} />
                </div>
                <div>
                  <span className="flow-node-type text-purple-700">Send Message</span>
                  <h4 className="flow-node-title">Welcome Message</h4>
                  <p className="flow-node-sub">Hello &#123;&#123;lead_name&#125;&#125; 👋</p>
                </div>
              </div>

              <div className="flow-connector-line" />

              {/* NODE 3: ASK QUESTION (Selected) */}
              <div
                className={`flow-canvas-node-card node-blue ${selectedNodeId === 'node-budget-q' ? 'active-selected' : ''}`}
                onClick={() => setSelectedNodeId('node-budget-q')}
              >
                <div className="flow-node-icon-bg bg-blue-100 text-blue-600">
                  <HelpCircle size={16} />
                </div>
                <div>
                  <span className="flow-node-type text-blue-700">Ask Question</span>
                  <h4 className="flow-node-title">What is your budget range?</h4>
                </div>
              </div>

              <div className="flow-connector-line" />

              {/* 4 BRANCH CONDITIONS ROW */}
              <div className="flow-branch-row-grid">
                
                <div className="flow-branch-col">
                  <div className="flow-canvas-node-card pill-green" onClick={() => setSelectedNodeId('cond-50l')}>
                    <span className="flow-node-type text-green-700">Condition</span>
                    <h4 className="flow-node-title">₹50 Lakh or less</h4>
                  </div>
                  <div className="flow-connector-line-sm" />
                  <div className="flow-canvas-node-card node-blue-sm" onClick={() => setSelectedNodeId('q-loc')}>
                    <span className="flow-node-type text-blue-600">Ask Question</span>
                    <h4 className="flow-node-title">Preferred location?</h4>
                  </div>
                </div>

                <div className="flow-branch-col">
                  <div className="flow-canvas-node-card pill-yellow" onClick={() => setSelectedNodeId('cond-1cr')}>
                    <span className="flow-node-type text-amber-700">Condition</span>
                    <h4 className="flow-node-title">₹50 Lakh - ₹1 Cr</h4>
                  </div>
                  <div className="flow-connector-line-sm" />
                  <div className="flow-canvas-node-card node-blue-sm" onClick={() => setSelectedNodeId('q-prop-type')}>
                    <span className="flow-node-type text-blue-600">Ask Question</span>
                    <h4 className="flow-node-title">Type of property?</h4>
                  </div>
                </div>

                <div className="flow-branch-col">
                  <div className="flow-canvas-node-card pill-orange" onClick={() => setSelectedNodeId('cond-2cr')}>
                    <span className="flow-node-type text-orange-700">Condition</span>
                    <h4 className="flow-node-title">₹1 Cr - ₹2 Cr</h4>
                  </div>
                  <div className="flow-connector-line-sm" />
                  <div className="flow-canvas-node-card node-blue-sm" onClick={() => setSelectedNodeId('q-timeline')}>
                    <span className="flow-node-type text-blue-600">Ask Question</span>
                    <h4 className="flow-node-title">When are you planning to buy?</h4>
                  </div>
                </div>

                <div className="flow-branch-col">
                  <div className="flow-canvas-node-card pill-red" onClick={() => setSelectedNodeId('cond-above2cr')}>
                    <span className="flow-node-type text-red-700">Condition</span>
                    <h4 className="flow-node-title">Above ₹2 Cr</h4>
                  </div>
                  <div className="flow-connector-line-sm" />
                  <div className="flow-canvas-node-card node-blue-sm" onClick={() => setSelectedNodeId('q-amenities')}>
                    <span className="flow-node-type text-blue-600">Ask Question</span>
                    <h4 className="flow-node-title">Are you looking for premium amenities?</h4>
                  </div>
                </div>

              </div>

              <div className="flow-connector-line" />

              {/* NODE 5: UPDATE LEAD FIELD */}
              <div className="flow-canvas-node-card node-purple" onClick={() => setSelectedNodeId('node-update-field')}>
                <div className="flow-node-icon-bg bg-purple-100 text-purple-600">
                  <UserCheck size={16} />
                </div>
                <div>
                  <span className="flow-node-type text-purple-700">Update Lead Field</span>
                  <h4 className="flow-node-title">Update Budget &amp; Preferences</h4>
                </div>
              </div>

              <div className="flow-connector-line" />

              {/* NODE 6: ADD TAG */}
              <div className="flow-canvas-node-card node-yellow" onClick={() => setSelectedNodeId('node-add-tag')}>
                <div className="flow-node-icon-bg bg-amber-100 text-amber-600">
                  <Tag size={16} />
                </div>
                <div>
                  <span className="flow-node-type text-amber-700">Add Tag</span>
                  <h4 className="flow-node-title">Add Qualified Lead Tag</h4>
                </div>
              </div>

              <div className="flow-connector-line" />

              {/* NODE 7: TRIGGER AUTOMATION */}
              <div className="flow-canvas-node-card node-blue" onClick={() => setSelectedNodeId('node-trigger-auto')}>
                <div className="flow-node-icon-bg bg-blue-100 text-blue-600">
                  <Zap size={16} />
                </div>
                <div>
                  <span className="flow-node-type text-blue-700">Trigger Automation</span>
                  <h4 className="flow-node-title">Send Brochure &amp; Pricelist</h4>
                </div>
              </div>

              <div className="flow-connector-line" />

              {/* NODE 8: END FLOW */}
              <div className="flow-canvas-node-card node-red" onClick={() => setSelectedNodeId('node-end')}>
                <div className="flow-node-icon-bg bg-red-100 text-red-600">
                  <CheckSquare size={16} />
                </div>
                <div>
                  <span className="flow-node-type text-red-700">End Flow</span>
                  <h4 className="flow-node-title">Thank You Message</h4>
                </div>
              </div>

            </div>
          </div>

          {/* PANEL 3: Right Node Inspector (Edit Node Column) */}
          <div className="flow-inspector-panel">
            <div className="flow-inspector-header">
              <h3 className="flow-inspector-title">Edit Node</h3>
              <button type="button" className="flow-close-btn">&times;</button>
            </div>

            <div className="flow-inspector-banner bg-blue-50 border-blue-200">
              <div className="flex items-center gap-2">
                <HelpCircle size={16} className="text-blue-600" />
                <h4 className="font-bold text-xs text-blue-900">Ask Question</h4>
              </div>
              <p className="text-[11px] text-blue-700 mt-1">Configure the question to ask the user</p>
            </div>

            <div className="flow-inspector-form">
              
              {/* Question Text */}
              <div className="agent-form-group">
                <div className="flex justify-between items-center mb-1">
                  <label className="agent-form-label mb-0">Question Text *</label>
                  <span className="text-[10px] text-slate-400">28 / 500</span>
                </div>
                <textarea
                  rows={3}
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  className="agent-form-textarea"
                />
              </div>

              {/* Question Type */}
              <div className="agent-form-group">
                <label className="agent-form-label">Question Type *</label>
                <select
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value)}
                  className="agent-form-select"
                >
                  <option value="Single Choice">Single Choice</option>
                  <option value="Multiple Choice">Multiple Choice</option>
                  <option value="Short Text">Short Text</option>
                  <option value="Number">Number / Currency</option>
                  <option value="Phone">Phone / Email</option>
                  <option value="Date">Date / Time</option>
                </select>
              </div>

              {/* Options List */}
              <div className="agent-form-group">
                <label className="agent-form-label">Options *</label>
                
                <div className="flex flex-col gap-2 mb-2">
                  {options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <GripVertical size={14} className="text-slate-400 cursor-grab" />
                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) => {
                          const next = [...options];
                          next[i].text = e.target.value;
                          setOptions(next);
                        }}
                        className="agent-form-input flex-1 text-xs"
                      />
                      <select
                        value={opt.scorePct}
                        onChange={(e) => {
                          const next = [...options];
                          next[i].scorePct = e.target.value;
                          setOptions(next);
                        }}
                        className="agent-form-select w-20 text-xs py-1"
                      >
                        <option value="25%">25%</option>
                        <option value="50%">50%</option>
                        <option value="75%">75%</option>
                        <option value="100%">100%</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(i)}
                        className="text-slate-400 hover:text-red-500 p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleAddOption}
                  className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline mt-1"
                >
                  <Plus size={14} /> Add Option
                </button>
              </div>

              {/* Save Answer To */}
              <div className="agent-form-group">
                <label className="agent-form-label">Save Answer To *</label>
                <select
                  value={saveAnswerTo}
                  onChange={(e) => setSaveAnswerTo(e.target.value)}
                  className="agent-form-select"
                >
                  <option value="Budget Range">Budget Range</option>
                  <option value="Preferred Location">Preferred Location</option>
                  <option value="Property Type">Property Type</option>
                  <option value="Buying Timeline">Buying Timeline</option>
                </select>
              </div>

              {/* Next Step Mapping */}
              <div className="agent-form-group">
                <label className="agent-form-label">Next Step Mapping</label>
                <p className="text-[11px] text-slate-500 mb-2">Define next step for each answer</p>

                <div className="flow-mapping-list">
                  <div className="flow-mapping-row">
                    <span className="flow-mapping-opt">₹50 Lakh or less</span>
                    <span className="flow-mapping-arr">&rarr;</span>
                    <span className="flow-mapping-target">Preferred location?</span>
                  </div>
                  <div className="flow-mapping-row">
                    <span className="flow-mapping-opt">₹50 Lakh - ₹1 Cr</span>
                    <span className="flow-mapping-arr">&rarr;</span>
                    <span className="flow-mapping-target">Type of property?</span>
                  </div>
                  <div className="flow-mapping-row">
                    <span className="flow-mapping-opt">₹1 Cr - ₹2 Cr</span>
                    <span className="flow-mapping-arr">&rarr;</span>
                    <span className="flow-mapping-target">When are you planning t...</span>
                  </div>
                  <div className="flow-mapping-row">
                    <span className="flow-mapping-opt">Above ₹2 Cr</span>
                    <span className="flow-mapping-arr">&rarr;</span>
                    <span className="flow-mapping-target">Are you looking for premi...</span>
                  </div>
                </div>
              </div>

              {/* Lead Score Impact */}
              <div className="agent-form-group">
                <label className="agent-form-label">Lead Score Impact</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={leadScoreImpact}
                    onChange={(e) => setLeadScoreImpact(Number(e.target.value))}
                    className="agent-form-input w-24 text-center font-bold"
                  />
                  <span className="text-xs text-slate-500 font-semibold">points</span>
                </div>
              </div>

              {/* Advanced Settings */}
              <div className="flow-inspector-accordion">
                <div className="flex items-center justify-between cursor-pointer py-2 border-t text-xs font-bold text-slate-700">
                  <span>Advanced Settings</span>
                  <ChevronDown size={14} />
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* TAB 2: QUESTIONS TAB */}
      {activeTab === 'questions' && (
        <div className="agent-card-section">
          <div className="agent-toolbar-row mb-3">
            <div>
              <h3 className="agent-section-title mb-0">AI Agent Questions Manager</h3>
              <p className="text-xs text-slate-500">Configure questions, response types, score weights, and profile target variables.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowQuestionModal(true)}
              className="btn-agent-create-primary"
            >
              <Plus size={15} />
              <span>Add Question</span>
            </button>
          </div>

          <div className="kb-documents-table-wrapper">
            <table className="kb-documents-table">
              <thead>
                <tr>
                  <th>Question Text</th>
                  <th>Type</th>
                  <th>Save Answer To</th>
                  <th>Score Impact</th>
                  <th>Status</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {questionsList.map((q) => (
                  <tr key={q.id}>
                    <td className="font-bold text-slate-800">{q.questionText}</td>
                    <td><span className="kb-type-badge pdf">{q.questionType}</span></td>
                    <td className="text-xs text-blue font-semibold">{q.saveAnswerTo}</td>
                    <td><span className="font-bold text-xs text-green">+{q.scoreImpact} pts</span></td>
                    <td><span className="kb-status-badge indexed">Active</span></td>
                    <td className="text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="kb-action-icon-btn text-red-500"
                        title="Delete Question"
                      >
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

      {/* TAB 3: LEAD SCORING TAB */}
      {activeTab === 'scoring' && (
        <div className="agent-card-section">
          <h3 className="agent-section-title mb-2">Lead Scoring Engine Rules</h3>
          <p className="text-xs text-slate-500 mb-3">Configure lead score weights for budget, timeline, site visits, and loan requirements.</p>

          <div className="kb-documents-table-wrapper">
            <table className="kb-documents-table">
              <thead>
                <tr>
                  <th>Condition Rule</th>
                  <th>Points Impact</th>
                  <th>Category</th>
                  <th>Lead Threshold Status</th>
                </tr>
              </thead>
              <tbody>
                {scoreRulesList.map((r) => (
                  <tr key={r.id}>
                    <td className="font-semibold text-slate-800">{r.conditionText}</td>
                    <td className="font-bold text-green">+{r.points} Points</td>
                    <td><span className="kb-type-badge excel">{r.category}</span></td>
                    <td>
                      <span className={`agent-status-badge ${r.points >= 20 ? 'active' : 'paused'}`}>
                        {r.points >= 20 ? 'Hot Lead' : 'Warm Lead'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: CONDITIONS TAB */}
      {activeTab === 'conditions' && (
        <div className="agent-card-section">
          <h3 className="agent-section-title mb-2">Business Qualification Conditions</h3>
          <p className="text-xs text-slate-500 mb-3">Define decision rules, budget filters, and branch triggers.</p>

          <div className="kb-documents-table-wrapper">
            <table className="kb-documents-table">
              <thead>
                <tr>
                  <th>Field Name</th>
                  <th>Operator</th>
                  <th>Value</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {conditionsList.map((c) => (
                  <tr key={c.id}>
                    <td className="font-bold text-slate-800">{c.field}</td>
                    <td className="text-xs text-purple font-semibold">{c.operator}</td>
                    <td className="font-semibold text-blue">{c.value}</td>
                    <td><span className="kb-status-badge indexed">{c.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: AUTOMATION TAB */}
      {activeTab === 'automation' && (
        <div className="agent-card-section">
          <h3 className="agent-section-title mb-2">Qualification Automation Triggers</h3>
          <p className="text-xs text-slate-500 mb-3">Automated CRM updates, salesperson assignment, WhatsApp collateral delivery, and escalations.</p>

          <div className="kb-documents-table-wrapper">
            <table className="kb-documents-table">
              <thead>
                <tr>
                  <th>Trigger Condition</th>
                  <th>Automated Action</th>
                  <th>Channel</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {automationsList.map((a) => (
                  <tr key={a.id}>
                    <td className="font-semibold text-slate-800">{a.trigger}</td>
                    <td className="text-slate-700 font-medium">{a.action}</td>
                    <td><span className="kb-type-badge video">{a.channel}</span></td>
                    <td><span className="kb-status-badge indexed">{a.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div className="agent-card-section">
          <h3 className="agent-section-title mb-3">Qualification Flow Settings &amp; Rules</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="agent-form-group">
              <label className="agent-form-label">Default Language</label>
              <input type="text" value={flowSettings.defaultLanguage} className="agent-form-input" readOnly />
            </div>

            <div className="agent-form-group">
              <label className="agent-form-label">Fallback Language</label>
              <input type="text" value={flowSettings.fallbackLanguage} className="agent-form-input" readOnly />
            </div>

            <div className="agent-form-group">
              <label className="agent-form-label">Business Hours</label>
              <input type="text" value={flowSettings.businessHours} className="agent-form-input" readOnly />
            </div>

            <div className="agent-form-group">
              <label className="agent-form-label">Typing Delay Style</label>
              <input type="text" value={flowSettings.typingDelay} className="agent-form-input" readOnly />
            </div>

            <div className="agent-form-group">
              <label className="agent-form-label">Minimum Qualification Score</label>
              <input type="number" value={flowSettings.minQualificationScore} className="agent-form-input font-bold" readOnly />
            </div>

            <div className="agent-form-group">
              <label className="agent-form-label">AI Confidence Threshold (%)</label>
              <input type="number" value={flowSettings.aiConfidenceThreshold} className="agent-form-input font-bold" readOnly />
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Question */}
      {showQuestionModal && (
        <div className="agent-modal-overlay" onClick={() => setShowQuestionModal(false)}>
          <div className="agent-modal-container max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="agent-modal-header">
              <h3 className="agent-modal-title">Add New Question</h3>
              <button type="button" onClick={() => setShowQuestionModal(false)} className="agent-modal-close-btn">&times;</button>
            </div>
            <form onSubmit={handleCreateQuestion} className="p-4 flex flex-col gap-3">
              <div className="agent-form-group">
                <label className="agent-form-label">Question Text *</label>
                <input
                  type="text"
                  placeholder="e.g. What is your preferred location?"
                  value={newQText}
                  onChange={(e) => setNewQText(e.target.value)}
                  className="agent-form-input"
                  required
                />
              </div>

              <div className="agent-form-group">
                <label className="agent-form-label">Question Type</label>
                <select
                  value={newQType}
                  onChange={(e) => setNewQType(e.target.value)}
                  className="agent-form-select"
                >
                  <option value="Single Choice">Single Choice</option>
                  <option value="Multiple Choice">Multiple Choice</option>
                  <option value="Short Text">Short Text</option>
                  <option value="Number">Number / Currency</option>
                </select>
              </div>

              <div className="agent-form-group">
                <label className="agent-form-label">Save Answer To (CRM Variable)</label>
                <select
                  value={newQSaveTo}
                  onChange={(e) => setNewQSaveTo(e.target.value)}
                  className="agent-form-select"
                >
                  <option value="Budget Range">Budget Range</option>
                  <option value="Location Preference">Location Preference</option>
                  <option value="Property Type">Property Type</option>
                  <option value="Buying Timeline">Buying Timeline</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 mt-3">
                <button type="button" onClick={() => setShowQuestionModal(false)} className="btn-agent-secondary-action">Cancel</button>
                <button type="submit" className="btn-agent-create-primary">Save Question</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Interactive Flow Test Simulation Modal */}
      {showTestModal && (
        <div className="agent-modal-overlay" onClick={() => setShowTestModal(false)}>
          <div className="agent-modal-container max-w-xl" onClick={(e) => e.stopPropagation()}>
            <div className="agent-modal-header">
              <h3 className="agent-modal-title flex items-center gap-2">
                <Sparkles size={16} className="text-blue" />
                Qualification Flow Interactive Simulator
              </h3>
              <button type="button" onClick={() => setShowTestModal(false)} className="agent-modal-close-btn">&times;</button>
            </div>
            
            <div className="p-4 flex flex-col gap-3">
              <div className="bg-slate-900 text-green-400 font-mono text-xs p-4 rounded-lg flex flex-col gap-2 max-h-60 overflow-y-auto">
                <div className="text-slate-400">[SIMULATION STARTED] Executing Qualification Flow v1.2.0...</div>
                {testLogs.map((log, idx) => (
                  <div key={idx}>&gt; {log}</div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 mt-2">
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <span className="text-xs text-blue-700 font-medium">Calculated Lead Score</span>
                  <div className="text-2xl font-black text-blue-900">{testScore} / 100</div>
                  <span className="text-[10px] text-green-600 font-bold">&bull; Status: Hot Lead</span>
                </div>

                <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                  <span className="text-xs text-purple-700 font-medium">Captured Profile Data</span>
                  <div className="text-xs font-semibold text-purple-900 mt-1">
                    Budget: ₹1 Cr - ₹2 Cr<br />
                    Location: Gurgaon Expressway
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-3">
                <button type="button" onClick={() => setShowTestModal(false)} className="btn-agent-secondary-action">
                  Close Simulator
                </button>
                <button type="button" onClick={handleRunTest} className="btn-agent-create-primary">
                  <RotateCw size={14} /> Re-run Simulation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
