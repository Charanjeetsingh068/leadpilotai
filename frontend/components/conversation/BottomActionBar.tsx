'use client';

import React from 'react';
import {
  PauseCircle,
  PlayCircle,
  UserCheck,
  CheckCircle,
  UserPlus,
  Calendar,
  Download,
  MoreVertical,
} from 'lucide-react';
import { Conversation } from '@/types/conversation.types';

interface BottomActionBarProps {
  activeConv: Conversation;
  onPauseAi: () => void;
  onResumeAi: () => void;
  onTakeOver: () => void;
  onApproveReply: () => void;
  onAssignSalesperson: () => void;
  onBookSiteVisit: () => void;
  onExport: () => void;
}

export const BottomActionBar: React.FC<BottomActionBarProps> = ({
  activeConv,
  onPauseAi,
  onResumeAi,
  onTakeOver,
  onApproveReply,
  onAssignSalesperson,
  onBookSiteVisit,
  onExport,
}) => {
  const isAiActive = activeConv?.isAiAutomated ?? true;

  return (
    <div className="conv-bottom-actions-card">
      <div className="conv-actions-bar-inner">
        {isAiActive ? (
          <button type="button" onClick={onPauseAi} className="conv-action-btn btn-orange font-bold">
            <PauseCircle size={16} />
            <span>Pause AI</span>
          </button>
        ) : (
          <button type="button" onClick={onResumeAi} className="conv-action-btn btn-green font-bold">
            <PlayCircle size={16} />
            <span>Resume AI</span>
          </button>
        )}

        <button type="button" onClick={onTakeOver} className="conv-action-btn btn-blue">
          <UserCheck size={16} />
          <span>Take Over</span>
        </button>

        <button type="button" onClick={onApproveReply} className="conv-action-btn btn-green">
          <CheckCircle size={16} />
          <span>Approve AI Reply</span>
        </button>

        <button type="button" onClick={onAssignSalesperson} className="conv-action-btn btn-dark">
          <UserPlus size={16} />
          <span>Assign Salesperson</span>
        </button>

        <button type="button" onClick={onBookSiteVisit} className="conv-action-btn btn-purple">
          <Calendar size={16} />
          <span>Book Site Visit</span>
        </button>

        <button type="button" onClick={onExport} className="conv-action-btn btn-dark">
          <Download size={16} />
          <span>Export Conversation</span>
        </button>

        <button type="button" className="conv-action-more-btn" title="More Actions">
          <MoreVertical size={16} />
        </button>
      </div>
    </div>
  );
};
