'use client';

import React from 'react';
import { X, CheckCircle2, Award, Zap } from 'lucide-react';
import { useLeadDetailsStore } from '@/store/useLeadDetailsStore';
import toast from 'react-hot-toast';

export const MarkQualifiedModal: React.FC = () => {
  const { isMarkQualifiedModalOpen, closeMarkQualifiedModal, lead, updateLeadStatus } = useLeadDetailsStore();

  if (!isMarkQualifiedModalOpen || !lead) return null;

  const handleConfirmQualified = () => {
    updateLeadStatus('QUALIFIED', 'Manually marked qualified by Sales Executive.');
    toast.success(`${lead.name} has been marked as QUALIFIED!`);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card modal-md">
        <div className="modal-header-row">
          <div className="modal-title-group">
            <CheckCircle2 size={20} className="text-success-green" />
            <h3 className="modal-title">Confirm Lead Qualification</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={closeMarkQualifiedModal}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body-content">
          <div className="qualification-score-preview-card">
            <div className="metric-box-val metric-val-green large-score">
              {lead.qualificationScore || 85}
            </div>
            <div>
              <h4 className="modal-bold-heading">High AI Qualification Score</h4>
              <p className="modal-sub-text">
                Budget matched with 2BHK Sunshine Villas criteria. Site visit interest confirmed over WhatsApp.
              </p>
            </div>
          </div>

          <p className="modal-sub-text">
            Marking <strong>{lead.name}</strong> as qualified will notify the senior sales team and trigger automatic proposal follow-up engine.
          </p>
        </div>

        <div className="modal-footer-row">
          <button type="button" className="modal-btn-cancel" onClick={closeMarkQualifiedModal}>
            Cancel
          </button>
          <button type="button" className="modal-btn-confirm btn-success-primary" onClick={handleConfirmQualified}>
            Mark Qualified
          </button>
        </div>
      </div>
    </div>
  );
};
