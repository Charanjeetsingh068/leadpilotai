'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Bot, ChevronDown, Sparkles, BookOpen, Sliders, MessageSquare, Zap, BarChart3, ExternalLink } from 'lucide-react';
import { useAgent } from '@/context/AgentContext';

interface Props {
  activeModule?: 'configuration' | 'knowledge-base' | 'qualification-flow' | 'whatsapp' | 'playground' | 'analytics';
}

export const AgentHeaderBar: React.FC<Props> = ({ activeModule }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { currentAgent, agentsList, selectAgent } = useAgent();

  if (!currentAgent) return null;

  const handleAgentSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    if (newId && newId !== currentAgent.id) {
      selectAgent(newId);
      // Route to current active module for new agent
      const subPath = activeModule || 'configuration';
      router.push(`/ai-agents/${newId}/${subPath}`);
    }
  };

  const navToModule = (mod: string) => {
    router.push(`/ai-agents/${currentAgent.id}/${mod}`);
  };

  return (
    <div className="agent-header-bar-container">
      {/* Top Banner Row */}
      <div className="agent-header-banner">
        <div className="agent-header-identity">
          <div className="agent-header-avatar">
            <Bot size={22} />
          </div>
          <div>
            <div className="agent-header-name-row">
              <h2 className="agent-header-name">{currentAgent.name}</h2>
              <span className={`agent-status-badge ${currentAgent.status === 'Active' ? 'active' : 'paused'}`}>
                {currentAgent.status}
              </span>
              <span className="wa-pill-blue">{currentAgent.industry}</span>
            </div>
            <div className="agent-header-meta-row">
              <span className="wa-kv-label">Model: <strong className="wa-kv-val">{currentAgent.model || 'GPT-4o'}</strong></span>
              <span className="wa-kv-label">&bull;</span>
              <span className="wa-kv-label">Knowledge: <strong className="wa-kv-val blue">{currentAgent.knowledgeVersion || 'v2.4.1'}</strong></span>
              <span className="wa-kv-label">&bull;</span>
              <span className="wa-kv-label">Active Leads: <strong className="wa-kv-val">{currentAgent.activeLeadsCount || 248}</strong></span>
            </div>
          </div>
        </div>

        {/* Quick Switch Agent Dropdown */}
        <div className="agent-header-switcher-wrap">
          <span className="wa-kv-label">Switch Agent:</span>
          <select
            value={currentAgent.id}
            onChange={handleAgentSelect}
            className="agent-switcher-select"
          >
            {agentsList.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.name} ({agent.industry})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="agent-module-tabs-row">
        <button
          type="button"
          onClick={() => navToModule('configuration')}
          className={`agent-module-tab ${activeModule === 'configuration' ? 'active' : ''}`}
        >
          <Sliders size={14} />
          <span>Configuration</span>
        </button>

        <button
          type="button"
          onClick={() => navToModule('knowledge-base')}
          className={`agent-module-tab ${activeModule === 'knowledge-base' ? 'active' : ''}`}
        >
          <BookOpen size={14} />
          <span>Knowledge Base</span>
        </button>

        <button
          type="button"
          onClick={() => navToModule('qualification-flow')}
          className={`agent-module-tab ${activeModule === 'qualification-flow' ? 'active' : ''}`}
        >
          <Sparkles size={14} />
          <span>Qualification Flow</span>
        </button>

        <button
          type="button"
          onClick={() => navToModule('whatsapp')}
          className={`agent-module-tab ${activeModule === 'whatsapp' ? 'active' : ''}`}
        >
          <MessageSquare size={14} />
          <span>WhatsApp Automation</span>
        </button>

        <button
          type="button"
          onClick={() => navToModule('playground')}
          className={`agent-module-tab ${activeModule === 'playground' ? 'active' : ''}`}
        >
          <Zap size={14} />
          <span>Testing Playground</span>
        </button>

        <button
          type="button"
          onClick={() => navToModule('analytics')}
          className={`agent-module-tab ${activeModule === 'analytics' ? 'active' : ''}`}
        >
          <BarChart3 size={14} />
          <span>AI Analytics</span>
        </button>
      </div>
    </div>
  );
};
