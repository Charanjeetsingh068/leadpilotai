'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, MoreVertical, ChevronDown } from 'lucide-react';
import { Conversation } from '@/types/conversation.types';

interface ConversationTopHeaderProps {
  activeConv: Conversation;
  onMobileBack?: () => void;
}

export const ConversationTopHeader: React.FC<ConversationTopHeaderProps> = ({
  activeConv,
  onMobileBack,
}) => {
  const leadName = activeConv?.leadName || 'Rohit Sharma';
  const phone = activeConv?.leadPhone || '+91 98765 43210';
  const source = activeConv?.leadSource || 'Facebook Lead';
  const score = activeConv?.leadScore || 85;
  const status = activeConv?.status || 'In Progress';
  const salespersonName = activeConv?.assignedSalesperson?.name || 'Neha Singh';

  const initials = leadName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="conv-top-header">
      <div className="conv-header-left">
        <div className="conv-header-back-wrap">
          {onMobileBack ? (
            <button type="button" onClick={onMobileBack} className="conv-back-link-btn" title="Back to List">
              <ArrowLeft size={16} />
              <span>Back to Conversations</span>
            </button>
          ) : (
            <Link href="/conversations" className="conv-back-link">
              <ArrowLeft size={16} />
              <span>Back to Conversations</span>
            </Link>
          )}
        </div>

        <div className="conv-lead-main-meta">
          <div className="conv-lead-avatar-circle">
            {initials}
          </div>

          <div className="conv-lead-titles-group">
            <div className="conv-lead-name-row">
              <h2 className="conv-lead-name">{leadName}</h2>
              <div className="conv-whatsapp-badge">
                <span className="conv-status-green-dot" />
                <span className="conv-whatsapp-text">Active on WhatsApp</span>
              </div>
            </div>

            <div className="conv-lead-sub-details">
              <span>{phone}</span>
              <span className="conv-meta-dot">•</span>
              <span>{source}</span>
              <span className="conv-meta-dot">•</span>
              <span>2m ago</span>
            </div>
          </div>
        </div>
      </div>

      <div className="conv-header-right">
        {/* Lead Score Card */}
        <div className="conv-header-score-card">
          <span className="conv-score-number">{score}</span>
          <span className="conv-score-label">Lead Score</span>
        </div>

        {/* AI Status Card */}
        <div className="conv-header-status-card">
          <span className="conv-status-pill-blue">{status || 'In Progress'}</span>
          <span className="conv-status-label">AI Status</span>
        </div>

        {/* Assigned Salesperson Dropdown */}
        <div className="conv-header-assigned-card">
          <div className="conv-assigned-avatar-wrap">
            <Image
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
              alt={salespersonName}
              width={28}
              height={28}
              className="conv-assigned-avatar"
            />
          </div>
          <div className="conv-assigned-text-group">
            <span className="conv-assigned-name">{salespersonName}</span>
            <span className="conv-assigned-label">Assigned To</span>
          </div>
          <ChevronDown size={14} className="conv-assigned-chevron" />
        </div>

        {/* Options icon */}
        <button type="button" className="conv-header-more-btn" title="More Options">
          <MoreVertical size={18} />
        </button>
      </div>
    </div>
  );
};
