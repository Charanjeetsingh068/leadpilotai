'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bot,
  Play,
  RotateCcw,
  Send,
  Plus,
  BookOpen,
  CheckCircle2,
  Paperclip,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Zap,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Search,
  Check,
} from 'lucide-react';
import { AgentClientService, AIAgentItem } from '@/services/agent.service';
import { TestingClientService, AITestingSessionData, AITestingMessageData } from '@/services/testing.service';
import toast from 'react-hot-toast';

interface Props {
  agentId?: string;
}

export const AITestingPlaygroundView: React.FC<Props> = ({ agentId }) => {
  const router = useRouter();
  const [agents, setAgents] = useState<AIAgentItem[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agentId || '');
  const [currentAgent, setCurrentAgent] = useState<AIAgentItem | null>(null);

  const [scenarios, setScenarios] = useState<any[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<string>('Real Estate - General Inquiry');
  const [languages, setLanguages] = useState<any[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');
  const [conversationMode, setConversationMode] = useState<'Chat' | 'Flow'>('Chat');

  const [session, setSession] = useState<AITestingSessionData | null>(null);
  const [messages, setMessages] = useState<AITestingMessageData[]>([]);
  const [customInput, setCustomInput] = useState<string>('');
  const [chatInput, setChatInput] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isStarting, setIsStarting] = useState<boolean>(false);

  // Dynamic Insights State
  const [insights, setInsights] = useState<{
    leadScore: number;
    confidenceScore: number;
    responseTimeSec: number;
    totalTokens: number;
    knowledgeMatchPct: number;
    intentDetected: string;
    entities: string[];
    knowledgeSources: { name: string; similarity: number }[];
    recommendedAction: string;
    conversationStage: string;
  }>({
    leadScore: 85,
    confidenceScore: 92.0,
    responseTimeSec: 2.3,
    totalTokens: 512,
    knowledgeMatchPct: 91.0,
    intentDetected: 'Property Inquiry',
    entities: ['2BHK', 'Wakad', 'Sunrise Residency', 'Price Range', 'Amenities', 'Possession Dec 2026'],
    knowledgeSources: [
      { name: 'Sunrise Residency Brochure.pdf', similarity: 87 },
      { name: 'Wakad Project Price List.xlsx', similarity: 74 },
      { name: 'Amenities & Features.pdf', similarity: 62 },
    ],
    recommendedAction: 'Suggest site visit and share payment plan.',
    conversationStage: 'Proposal',
  });

  const suggestedPrompts = [
    'I am looking for a 2BHK flat in Wakad.',
    'What is the price range of your projects?',
    'Do you have any projects near Hinjewadi?',
    'Tell me about amenities in your project.',
    'What is the possession time?',
    'Can I get a site visit this weekend?',
    'Do you provide home loan assistance?',
    'What is the booking amount?',
  ];

  // Load Initial Configuration and Agent Data
  const initData = useCallback(async () => {
    try {
      const [agentsRes, scenariosRes, langsRes] = await Promise.all([
        AgentClientService.getAgents(),
        TestingClientService.getScenarios(),
        TestingClientService.getLanguages(),
      ]);

      if (agentsRes && agentsRes.success && Array.isArray(agentsRes.data)) {
        setAgents(agentsRes.data);
        if (!selectedAgentId && agentsRes.data.length > 0) {
          setSelectedAgentId(agentsRes.data[0].id);
          setCurrentAgent(agentsRes.data[0]);
        } else if (selectedAgentId) {
          const matched = agentsRes.data.find((a: AIAgentItem) => a.id === selectedAgentId);
          if (matched) setCurrentAgent(matched);
        }
      }

      if (scenariosRes && scenariosRes.success && Array.isArray(scenariosRes.data)) {
        setScenarios(scenariosRes.data);
      }

      if (langsRes && langsRes.success && Array.isArray(langsRes.data)) {
        setLanguages(langsRes.data);
      }

      // Start/load session
      const sessionRes = await TestingClientService.startSession({
        agentId: selectedAgentId,
        scenario: selectedScenario,
        language: selectedLanguage,
        mode: conversationMode,
      });

      if (sessionRes && sessionRes.success && sessionRes.data) {
        setSession(sessionRes.data);
        if (Array.isArray(sessionRes.data.messages)) {
          setMessages(sessionRes.data.messages);
        }
      }
    } catch {
      toast.error('Failed to load AI Testing Playground environment');
    }
  }, [selectedAgentId, selectedScenario, selectedLanguage, conversationMode]);

  useEffect(() => {
    initData();
  }, [initData]);

  const handleRunNewTest = async () => {
    setIsStarting(true);
    try {
      const res = await TestingClientService.startSession({
        agentId: selectedAgentId,
        scenario: selectedScenario,
        language: selectedLanguage,
        mode: conversationMode,
      });
      if (res && res.success && res.data) {
        setSession(res.data);
        setMessages(res.data.messages || []);
        toast.success('New AI Testing Session started');
      }
    } catch {
      toast.error('Failed to start new testing session');
    } finally {
      setIsStarting(false);
    }
  };

  const handleClearChat = async () => {
    if (!session) return;
    try {
      const res = await TestingClientService.clearSession(session.id);
      if (res && res.success && res.data) {
        setSession(res.data);
        setMessages(res.data.messages || []);
        toast.success('Testing Chat history cleared');
      }
    } catch {
      toast.error('Failed to clear chat session');
    }
  };

  const handleSendMessageText = async (textToSend: string) => {
    if (!textToSend || !textToSend.trim() || isSending) return;
    setIsSending(true);

    const userMsgText = textToSend.trim();
    setCustomInput('');
    setChatInput('');

    // Optimistic UI push user message
    const tempUserMsg: AITestingMessageData = {
      id: `temp-${Date.now()}`,
      sessionId: session?.id || 'temp',
      sender: 'user',
      senderName: 'Customer (You)',
      message: userMsgText,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const res = await TestingClientService.sendMessage({
        sessionId: session?.id,
        agentId: selectedAgentId,
        message: userMsgText,
        language: selectedLanguage,
      });

      if (res && res.success && res.data) {
        if (res.data.session && Array.isArray(res.data.session.messages)) {
          setMessages(res.data.session.messages);
        }
        if (res.data.insights) {
          setInsights({
            leadScore: res.data.insights.leadScore || 88,
            confidenceScore: res.data.insights.confidenceScore || 94.0,
            responseTimeSec: res.data.insights.responseTimeSec || 2.1,
            totalTokens: res.data.insights.totalTokens || 480,
            knowledgeMatchPct: res.data.insights.knowledgeMatchPct || 92.0,
            intentDetected: res.data.insights.intentDetected || 'Property Inquiry',
            entities: res.data.insights.entities || ['2BHK', 'Wakad'],
            knowledgeSources: res.data.insights.knowledgeSources || [],
            recommendedAction: res.data.insights.recommendedAction || 'Suggest site visit and share payment plan.',
            conversationStage: res.data.insights.conversationStage || 'Proposal',
          });
        }
      }
    } catch {
      toast.error('Failed to send message to AI Agent');
    } finally {
      setIsSending(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="tp-container">
      
      {/* Top Breadcrumbs */}
      <div className="tp-breadcrumb-row">
        <span onClick={() => router.push('/ai-agents')} className="tp-breadcrumb-link">
          AI Agents
        </span>
        <span className="tp-breadcrumb-sep">&gt;</span>
        <span
          onClick={() => selectedAgentId && router.push(`/ai-agents/${selectedAgentId}`)}
          className="tp-breadcrumb-link"
        >
          {currentAgent ? currentAgent.name : 'Property Advisor AI'}
        </span>
        <span className="tp-breadcrumb-sep">&gt;</span>
        <span className="tp-breadcrumb-current">AI Testing Playground</span>
      </div>

      {/* Page Header */}
      <div className="tp-header-row">
        <div>
          <h1 className="tp-header-title">AI Testing Playground</h1>
          <p className="tp-header-subtitle">
            Test your AI agent in real-time and see how it responds using your knowledge base.
          </p>
        </div>

        <div className="tp-header-actions">
          <button
            type="button"
            onClick={handleClearChat}
            className="tp-btn-secondary"
          >
            <RotateCcw size={14} />
            <span>Clear Chat</span>
          </button>

          <button
            type="button"
            onClick={handleRunNewTest}
            className="tp-btn-primary"
          >
            <Play size={14} />
            <span>{isStarting ? 'Starting...' : 'Run New Test'}</span>
          </button>
        </div>
      </div>

      {/* Top Filter Bar */}
      <div className="tp-filters-card">
        {/* Select Agent */}
        <div className="tp-filter-group">
          <label className="tp-filter-label">Select Agent</label>
          <select
            value={selectedAgentId}
            onChange={(e) => {
              setSelectedAgentId(e.target.value);
              const found = agents.find((a) => a.id === e.target.value);
              if (found) setCurrentAgent(found);
            }}
            className="tp-select"
          >
            {agents.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
            {agents.length === 0 && <option value="">Property Advisor AI</option>}
          </select>
        </div>

        {/* Test Scenario */}
        <div className="tp-filter-group">
          <label className="tp-filter-label">Test Scenario</label>
          <select
            value={selectedScenario}
            onChange={(e) => setSelectedScenario(e.target.value)}
            className="tp-select"
          >
            {scenarios.map((s) => (
              <option key={s.id} value={s.name}>{s.name}</option>
            ))}
            {scenarios.length === 0 && <option value="Real Estate - General Inquiry">Real Estate - General Inquiry</option>}
          </select>
        </div>

        {/* Language */}
        <div className="tp-filter-group">
          <label className="tp-filter-label">Language</label>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="tp-select"
          >
            {languages.map((l) => (
              <option key={l.code} value={l.name}>{l.name}</option>
            ))}
            {languages.length === 0 && <option value="English">English</option>}
          </select>
        </div>

        {/* Knowledge Base Badge */}
        <div className="tp-filter-group">
          <label className="tp-filter-label">Knowledge Base</label>
          <div className="tp-badge-green">
            <BookOpen size={13} />
            <span>Real Estate KB v2.4.1</span>
            <span className="wa-pill-green">&bull; Up to date</span>
          </div>
        </div>

        {/* Conversation Mode Switcher */}
        <div className="tp-filter-group">
          <label className="tp-filter-label">Conversation Mode</label>
          <div className="tp-mode-switcher">
            <button
              type="button"
              onClick={() => setConversationMode('Chat')}
              className={`tp-mode-btn ${conversationMode === 'Chat' ? 'active' : ''}`}
            >
              Chat
            </button>
            <button
              type="button"
              onClick={() => setConversationMode('Flow')}
              className={`tp-mode-btn ${conversationMode === 'Flow' ? 'active' : ''}`}
            >
              Flow
            </button>
          </div>
        </div>
      </div>

      {/* Main 3-Column Grid Layout */}
      <div className="tp-main-grid">

        {/* LEFT COLUMN: Customer Simulator */}
        <div className="tp-card">
          <div>
            <h3 className="tp-card-title">Customer Simulator</h3>
            <p className="tp-card-subtitle">Simulate customer messages to test your AI agent.</p>
          </div>

          <div>
            <span className="tp-filter-label">Suggested Prompts</span>
            <div className="tp-prompt-list">
              {suggestedPrompts.map((promptText, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSendMessageText(promptText)}
                  className="tp-prompt-item"
                >
                  <span>{promptText}</span>
                  <Plus size={14} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <span className="tp-filter-label">Custom Input</span>
            <textarea
              rows={3}
              placeholder="Type your message here..."
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="tp-textarea"
            />
            <div className="wa-card-header-actions wa-justify-end tp-mt-1">
              <span className="wa-kv-label">{customInput.length}/1000</span>
            </div>
            <button
              type="button"
              onClick={() => handleSendMessageText(customInput)}
              disabled={isSending || !customInput.trim()}
              className="tp-btn-primary tp-w-full tp-flex-center tp-mt-1"
            >
              <Send size={14} />
              <span>{isSending ? 'Sending...' : 'Send Message'}</span>
            </button>
            <div className="wa-text-center tp-mt-1">
              <span className="wa-kv-label">or press Enter ↵</span>
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN: Conversation Test Window */}
        <div className="tp-card">
          <div className="tp-chat-header">
            <div>
              <h3 className="tp-card-title">Conversation Test Window</h3>
            </div>
            <div className="wa-card-header-actions">
              <span className="wa-pill-green">Live Test</span>
              <span className="wa-pill-blue">Session: #{session?.sessionId || 'TEST-8452'}</span>
              <span className="wa-badge-green"><Clock size={12} /> 00:04:32</span>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="tp-chat-messages-container">
            {messages.map((m) => (
              <div
                key={m.id}
                className={m.sender === 'user' ? 'tp-chat-bubble-user' : 'tp-chat-bubble-agent'}
              >
                <div className="tp-chat-sender-name">
                  {m.sender === 'user' ? (
                    <>
                      <span className="wa-badge-blue">CU</span> {m.senderName || 'Customer (You)'}
                    </>
                  ) : (
                    <>
                      <Bot size={15} className="wa-kv-val blue" /> {m.senderName || 'AI Agent'}
                    </>
                  )}
                </div>
                <div className="tp-chat-message-text">{m.message}</div>
                <div className="wa-card-header-actions wa-justify-end tp-mt-1">
                  <span className="tp-chat-time">10:30 AM</span>
                  {m.sender === 'agent' && (
                    <div className="wa-card-header-actions">
                      <button type="button" onClick={() => copyToClipboard(m.message)} className="wa-action-icon-btn"><Copy size={12} /></button>
                      <button type="button" onClick={() => toast.success('Feedback recorded')} className="wa-action-icon-btn"><ThumbsUp size={12} /></button>
                      <button type="button" onClick={() => toast.success('Feedback recorded')} className="wa-action-icon-btn"><ThumbsDown size={12} /></button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Chat Input Bar */}
          <div className="tp-chat-input-row">
            <input
              type="text"
              placeholder="Type your message..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessageText(chatInput);
              }}
              className="tp-chat-input"
            />
            <button type="button" className="wa-action-icon-btn"><Paperclip size={14} /></button>
            <button
              type="button"
              onClick={() => handleSendMessageText(chatInput)}
              disabled={isSending || !chatInput.trim()}
              className="tp-btn-primary"
            >
              <Send size={14} />
            </button>
          </div>
          <div className="wa-text-center">
            <span className="wa-kv-label">AI responses are generated based on your knowledge base and configuration.</span>
          </div>
        </div>

        {/* RIGHT COLUMN: AI Response Insights */}
        <div className="tp-card">
          <div className="tp-score-header">
            <h3 className="tp-card-title">AI Response Insights</h3>
            <button type="button" className="wa-link-btn">Hide &gt;</button>
          </div>

          {/* Lead Score Box */}
          <div className="tp-score-box">
            <div className="tp-score-header">
              <span className="wa-kv-label">Lead Score</span>
              <span className="wa-pill-green">Hot Lead</span>
            </div>
            <div className="tp-score-num">{insights.leadScore} <span className="wa-kv-label">/ 100</span></div>
            <div className="wa-progress-track">
              <div className="wa-progress-fill" />
            </div>
            <span className="wa-kv-label">High intent shown. Customer is actively looking for 2BHK in Wakad.</span>
          </div>

          {/* 4 Metric Tiles */}
          <div className="tp-metrics-grid">
            <div className="tp-metric-tile">
              <span className="tp-metric-lbl">Confidence Score</span>
              <span className="tp-metric-val">{insights.confidenceScore}%</span>
              <span className="wa-kv-val green">&bull; High</span>
            </div>

            <div className="tp-metric-tile">
              <span className="tp-metric-lbl">Response Time</span>
              <span className="tp-metric-val">{insights.responseTimeSec}s</span>
              <span className="wa-kv-val green">&bull; Good</span>
            </div>

            <div className="tp-metric-tile">
              <span className="tp-metric-lbl">Tokens Used</span>
              <span className="tp-metric-val">{insights.totalTokens}</span>
              <span className="wa-kv-label">Total</span>
            </div>

            <div className="tp-metric-tile">
              <span className="tp-metric-lbl">Knowledge Match</span>
              <span className="tp-metric-val">{insights.knowledgeMatchPct}%</span>
              <span className="wa-kv-val green">&bull; Excellent</span>
            </div>
          </div>

          {/* Intent Detected */}
          <div className="tp-score-box">
            <span className="wa-kv-label"><Zap size={13} /> Intent Detected</span>
            <div className="wa-kv-val">{insights.intentDetected}</div>
            <span className="wa-kv-label">The customer is inquiring about property options.</span>
          </div>

          {/* Entities Extracted */}
          <div>
            <span className="wa-kv-label">Entities Extracted</span>
            <div className="wa-card-header-actions tp-flex-wrap-gap tp-mt-1">
              {insights.entities.map((ent, idx) => (
                <span key={idx} className="tp-tag-pill">{ent}</span>
              ))}
            </div>
          </div>

          {/* Knowledge Used Top 3 */}
          <div>
            <span className="wa-kv-label">Knowledge Used (Top 3)</span>
            <div className="wa-summary-list tp-mt-1">
              {insights.knowledgeSources.map((src, idx) => (
                <div key={idx} className="wa-summary-item">
                  <span className="wa-summary-label"><BookOpen size={13} /> {src.name}</span>
                  <span className="wa-summary-val green">{src.similarity}%</span>
                </div>
              ))}
            </div>
            <button type="button" className="wa-link-btn tp-mt-1">
              View All Knowledge Sources &rarr;
            </button>
          </div>

          {/* Recommended Next Action */}
          <div className="tp-score-box tp-box-green">
            <span className="wa-kv-label green"><ShieldCheck size={14} /> Recommended Next Action</span>
            <div className="wa-kv-val green">{insights.recommendedAction}</div>
            <span className="wa-kv-label">This will move the customer closer to booking.</span>
          </div>

          {/* Conversation Flow Timeline */}
          <div>
            <div className="tp-score-header">
              <span className="wa-kv-label">Conversation Flow</span>
              <button type="button" className="wa-link-btn">View Flow &rarr;</button>
            </div>
            <div className="tp-flow-timeline tp-mt-1">
              <div className="tp-flow-step">
                <div className="tp-flow-circle completed"><Check size={12} /></div>
                <span>Greeting</span>
              </div>
              <div className="tp-flow-step">
                <div className="tp-flow-circle completed"><Check size={12} /></div>
                <span>Qualification</span>
              </div>
              <div className="tp-flow-step">
                <div className="tp-flow-circle active">3</div>
                <span className="wa-kv-val blue">Proposal</span>
              </div>
              <div className="tp-flow-step">
                <div className="tp-flow-circle">4</div>
                <span>Closing</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
