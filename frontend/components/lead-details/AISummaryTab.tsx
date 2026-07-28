'use client';

import React from 'react';
import { Sparkles, DollarSign, Home, Target, Calendar, Landmark, Users, MapPin, AlertCircle, TrendingUp, Flame, CheckCircle, Zap } from 'lucide-react';
import { useLeadDetailsStore } from '@/store/useLeadDetailsStore';

export const AISummaryTab: React.FC = () => {
  const { aiSummary } = useLeadDetailsStore();

  return (
    <div className="ai-summary-tab-container">
      {/* AI Header Card */}
      <div className="ai-summary-banner-card">
        <div className="ai-banner-icon-bg">
          <Sparkles size={20} />
        </div>
        <div>
          <h3 className="ai-banner-title">AI Qualification & Intelligence Briefing</h3>
          <p className="ai-banner-subtitle">
            Automatically synthesized from 6 WhatsApp conversations and lead interaction signals with {aiSummary.aiConfidence}% AI Confidence.
          </p>
        </div>
      </div>

      {/* AI Metrics Grid */}
      <div className="ai-metrics-grid">
        <div className="ai-metric-box">
          <div className="metric-box-header">
            <DollarSign size={16} className="text-blue" />
            <span className="metric-title">Budget</span>
          </div>
          <span className="metric-value-bold">{aiSummary.budget}</span>
        </div>

        <div className="ai-metric-box">
          <div className="metric-box-header">
            <Home size={16} className="text-purple" />
            <span className="metric-title">Preferred Property</span>
          </div>
          <span className="metric-value-bold">{aiSummary.preferredProperty}</span>
        </div>

        <div className="ai-metric-box">
          <div className="metric-box-header">
            <Target size={16} className="text-green" />
            <span className="metric-title">Buying Intent</span>
          </div>
          <span className="metric-value-bold">{aiSummary.buyingIntent}</span>
        </div>

        <div className="ai-metric-box">
          <div className="metric-box-header">
            <Calendar size={16} className="text-orange" />
            <span className="metric-title">Possession Timeline</span>
          </div>
          <span className="metric-value-bold">{aiSummary.timeline}</span>
        </div>

        <div className="ai-metric-box">
          <div className="metric-box-header">
            <Landmark size={16} className="text-blue" />
            <span className="metric-title">Loan Requirement</span>
          </div>
          <span className="metric-value-bold">{aiSummary.loanRequirement}</span>
        </div>

        <div className="ai-metric-box">
          <div className="metric-box-header">
            <Users size={16} className="text-teal" />
            <span className="metric-title">Family Size</span>
          </div>
          <span className="metric-value-bold">{aiSummary.familySize}</span>
        </div>

        <div className="ai-metric-box">
          <div className="metric-box-header">
            <MapPin size={16} className="text-red" />
            <span className="metric-title">Preferred Location</span>
          </div>
          <span className="metric-value-bold">{aiSummary.preferredLocation}</span>
        </div>

        <div className="ai-metric-box">
          <div className="metric-box-header">
            <AlertCircle size={16} className="text-orange" />
            <span className="metric-title">Primary Objections</span>
          </div>
          <span className="metric-value-bold">{aiSummary.objections}</span>
        </div>
      </div>

      {/* Advanced Intelligence Indicators */}
      <div className="ai-advanced-indicators-row">
        <div className="indicator-card indicator-probability">
          <TrendingUp size={18} />
          <div>
            <span className="indicator-label">Buying Probability</span>
            <span className="indicator-val">{aiSummary.buyingProbability}%</span>
          </div>
        </div>

        <div className="indicator-card indicator-temp">
          <Flame size={18} className="text-red" />
          <div>
            <span className="indicator-label">Lead Temperature</span>
            <span className="indicator-val text-red">{aiSummary.leadTemperature}</span>
          </div>
        </div>

        <div className="indicator-card indicator-action">
          <Zap size={18} className="text-blue" />
          <div>
            <span className="indicator-label">Next Suggested Action</span>
            <span className="indicator-val">{aiSummary.nextSuggestedAction}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
