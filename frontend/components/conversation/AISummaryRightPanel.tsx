'use client';

import React from 'react';
import {
  Sparkles,
  MoreVertical,
  CheckSquare,
  DollarSign,
  Building,
  Clock,
  CreditCard,
  Smile,
  BarChart2,
  Share2,
  Bot,
  Circle,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import { Conversation } from '@/types/conversation.types';

interface AISummaryRightPanelProps {
  activeConv: Conversation;
}

export const AISummaryRightPanel: React.FC<AISummaryRightPanelProps> = ({ activeConv }) => {
  const summary = activeConv?.aiSummary || {
    intent: 'Buy a 2BHK Apartment',
    budget: '₹50 - ₹70 Lakhs',
    project: 'Sunshine Villas',
    timeline: 'Ready to buy in 1 - 3 months',
    loan: 'Yes, Home Loan Required',
    sentiment: 'Positive',
    leadScore: 85,
    recommendedAction: 'Share matching properties and schedule site visit',
  };

  const agent = activeConv?.aiAgent || {
    name: 'Property Advisor Agent',
    industry: 'Real Estate',
    model: 'GPT-4o',
    status: 'Running',
  };

  const actions = activeConv?.recentAiActions || [
    { id: '1', action: 'Asked about preferred location', timestamp: '10:26 AM', iconType: 'question' },
    { id: '2', action: 'Shared price range', timestamp: '10:27 AM', iconType: 'document' },
    { id: '3', action: 'Checking availability', timestamp: '10:27 AM', iconType: 'check' },
  ];

  return (
    <div className="conv-right-panel">
      {/* Section 1: AI Summary */}
      <div className="conv-right-section">
        <div className="conv-right-section-header">
          <div className="conv-section-title-group">
            <Sparkles size={16} className="conv-icon-sparkle" />
            <h3 className="conv-right-section-title">AI Summary</h3>
          </div>
          <button type="button" className="conv-right-more-btn" title="Options">
            <MoreVertical size={16} />
          </button>
        </div>

        <div className="conv-summary-fields-list">
          {/* Intent */}
          <div className="conv-summary-row">
            <div className="conv-field-label-wrap">
              <CheckSquare size={14} className="conv-field-icon" />
              <span className="conv-field-label">Intent</span>
            </div>
            <span className="conv-field-value font-bold">{summary.intent}</span>
          </div>

          {/* Budget */}
          <div className="conv-summary-row">
            <div className="conv-field-label-wrap">
              <DollarSign size={14} className="conv-field-icon" />
              <span className="conv-field-label">Budget</span>
            </div>
            <span className="conv-field-value font-bold">{summary.budget}</span>
          </div>

          {/* Project */}
          <div className="conv-summary-row">
            <div className="conv-field-label-wrap">
              <Building size={14} className="conv-field-icon" />
              <span className="conv-field-label">Project</span>
            </div>
            <span className="conv-field-value">{summary.project}</span>
          </div>

          {/* Timeline */}
          <div className="conv-summary-row">
            <div className="conv-field-label-wrap">
              <Clock size={14} className="conv-field-icon" />
              <span className="conv-field-label">Timeline</span>
            </div>
            <span className="conv-field-value">{summary.timeline}</span>
          </div>

          {/* Loan */}
          <div className="conv-summary-row">
            <div className="conv-field-label-wrap">
              <CreditCard size={14} className="conv-field-icon" />
              <span className="conv-field-label">Loan</span>
            </div>
            <span className="conv-field-value">{summary.loan}</span>
          </div>

          {/* Sentiment */}
          <div className="conv-summary-row">
            <div className="conv-field-label-wrap">
              <Smile size={14} className="conv-field-icon" />
              <span className="conv-field-label">Sentiment</span>
            </div>
            <span className="conv-field-value text-green font-bold">{summary.sentiment}</span>
          </div>

          {/* Lead Score */}
          <div className="conv-summary-row">
            <div className="conv-field-label-wrap">
              <BarChart2 size={14} className="conv-field-icon" />
              <span className="conv-field-label">Lead Score</span>
            </div>
            <span className="conv-field-value text-green font-bold">{summary.leadScore} / 100</span>
          </div>

          {/* Recommended Action */}
          <div className="conv-summary-row flex-col-start">
            <div className="conv-field-label-wrap">
              <Share2 size={14} className="conv-field-icon" />
              <span className="conv-field-label">Recommended Action</span>
            </div>
            <div className="conv-recommended-action-box">
              <p className="conv-recommended-text">{summary.recommendedAction}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: AI Agent Card */}
      <div className="conv-right-section">
        <div className="conv-right-section-header">
          <div className="conv-section-title-group">
            <Bot size={16} className="conv-icon-bot" />
            <h3 className="conv-right-section-title">AI Agent</h3>
          </div>
        </div>

        <div className="conv-agent-card">
          <div className="conv-agent-top-line">
            <span className="conv-agent-name">{agent.name}</span>
            <div className="conv-agent-status-pill">
              <span className="conv-status-green-dot" />
              <span>Active</span>
            </div>
          </div>
          <span className="conv-card-snippet">Model: {agent.model}</span>
        </div>
      </div>

      {/* Section 3: Recent AI Actions */}
      <div className="conv-right-section border-none">
        <div className="conv-right-section-header">
          <h3 className="conv-right-section-title">Recent AI Actions</h3>
        </div>

        <div className="conv-summary-fields-list">
          {actions.map((act) => (
            <div key={act.id} className="conv-summary-row">
              <div className="conv-field-label-wrap">
                {act.iconType === 'question' && <Circle size={12} className="conv-field-icon" />}
                {act.iconType === 'document' && <FileText size={12} className="conv-field-icon" />}
                {act.iconType === 'check' && <CheckCircle2 size={12} className="conv-field-icon" />}
                <span className="conv-field-label">{act.action}</span>
              </div>
              <span className="conv-card-time">{act.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
