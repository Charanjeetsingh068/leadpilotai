'use client';

import React, { useState } from 'react';
import { UserPlus, MessageSquare, Calendar, CheckCircle2, XCircle, MoreVertical, Edit3, Copy, Archive, Trash2 } from 'lucide-react';
import { useLeadDetailsStore } from '@/store/useLeadDetailsStore';

export const StickyActionBar: React.FC = () => {
  const {
    lead,
    openAssignModal,
    openBookVisitModal,
    openMarkQualifiedModal,
    openRejectModal,
    setActiveTab,
  } = useLeadDetailsStore();

  const [isMoreOpen, setIsMoreOpen] = useState<boolean>(false);

  if (!lead) return null;

  return (
    <div className="lead-sticky-bottom-bar">
      <div className="sticky-bar-actions-container">
        {/* Assign Lead Button */}
        <button
          type="button"
          className="sticky-action-btn btn-white"
          onClick={openAssignModal}
        >
          <UserPlus size={16} />
          <span>Assign Lead</span>
        </button>

        {/* Open WhatsApp Button */}
        <button
          type="button"
          className="sticky-action-btn btn-white btn-whatsapp-hover"
          onClick={() => {
            setActiveTab('conversation');
            window.open(`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`, '_blank');
          }}
        >
          <MessageSquare size={16} className="text-whatsapp-green" />
          <span>Open WhatsApp</span>
        </button>

        {/* Book Site Visit Button */}
        <button
          type="button"
          className="sticky-action-btn btn-white"
          onClick={openBookVisitModal}
        >
          <Calendar size={16} className="text-purple" />
          <span>Book Site Visit</span>
        </button>

        {/* Mark as Qualified Button */}
        <button
          type="button"
          className="sticky-action-btn btn-white btn-green-hover"
          onClick={openMarkQualifiedModal}
        >
          <CheckCircle2 size={16} className="text-success-green" />
          <span>Mark as Qualified</span>
        </button>

        {/* Reject Lead Button */}
        <button
          type="button"
          className="sticky-action-btn btn-white btn-red-hover"
          onClick={openRejectModal}
        >
          <XCircle size={16} className="text-danger-red" />
          <span>Reject Lead</span>
        </button>

        {/* More Actions Menu Button */}
        <div className="pos-relative">
          <button
            type="button"
            className="sticky-action-btn btn-white btn-icon-only"
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            title="More Options"
          >
            <MoreVertical size={18} />
          </button>

          {isMoreOpen && (
            <div
              className="dropdown-menu shadow-dropdown text-left dropdown-menu-up"
              onClick={() => setIsMoreOpen(false)}
            >
              <button type="button" className="dropdown-item" onClick={() => setActiveTab('notes')}>
                <Edit3 size={14} /> Add Internal Note
              </button>
              <button type="button" className="dropdown-item">
                <Copy size={14} /> Copy Lead Data
              </button>
              <button type="button" className="dropdown-item">
                <Archive size={14} /> Archive Lead
              </button>
              <button type="button" className="dropdown-item dropdown-item-danger">
                <Trash2 size={14} /> Soft Delete Lead
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
