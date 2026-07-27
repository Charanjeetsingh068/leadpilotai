import React from 'react';
import { Users, Bot, FileText, ChevronRight } from 'lucide-react';
import { WorkspaceSummary } from '@/types/dashboard.types';

export interface WorkspaceSummaryWidgetProps {
  summary?: WorkspaceSummary;
}

export const WorkspaceSummaryWidget: React.FC<WorkspaceSummaryWidgetProps> = ({ summary }) => {
  return (
    <div className="card recent-leads-card-padding">
      <h3 className="summary-widget-title">
        Workspace Summary
      </h3>
      <div className="summary-rows-stack">
        {/* Total Leads */}
        <div className="summary-row-item">
          <div className="summary-item-left">
            <div className="summary-icon-blue">
              <Users size={14} />
            </div>
            <span className="summary-label-text">Total Leads</span>
          </div>
          <div className="summary-item-right">
            <span>{summary?.totalLeads.toLocaleString() || '1,248'}</span>
            <ChevronRight size={14} className="text-muted" />
          </div>
        </div>

        {/* Active AI Agents */}
        <div className="summary-row-item">
          <div className="summary-item-left">
            <div className="summary-icon-purple">
              <Bot size={14} />
            </div>
            <span className="summary-label-text">Active AI Agents</span>
          </div>
          <div className="summary-item-right">
            <span>{summary?.activeAiAgents || 4}</span>
            <ChevronRight size={14} className="text-muted" />
          </div>
        </div>

        {/* Knowledge Base */}
        <div className="summary-row-item">
          <div className="summary-item-left">
            <div className="summary-icon-cyan">
              <FileText size={14} />
            </div>
            <span className="summary-label-text">Knowledge Base</span>
          </div>
          <div className="summary-item-right">
            <span>{summary?.knowledgeBaseDocs || 23} Docs</span>
            <ChevronRight size={14} className="text-muted" />
          </div>
        </div>

        {/* Team Members */}
        <div className="summary-row-item">
          <div className="summary-item-left">
            <div className="summary-icon-slate">
              <Users size={14} />
            </div>
            <span className="summary-label-text">Team Members</span>
          </div>
          <div className="summary-item-right">
            <span>{summary?.teamMembers || 12}</span>
            <ChevronRight size={14} className="text-muted" />
          </div>
        </div>
      </div>
    </div>
  );
};
