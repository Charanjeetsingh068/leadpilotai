'use client';

import React, { useState } from 'react';
import { X, XCircle, AlertTriangle } from 'lucide-react';
import { useLeadDetailsStore } from '@/store/useLeadDetailsStore';
import toast from 'react-hot-toast';

export const RejectLeadModal: React.FC = () => {
  const { isRejectModalOpen, closeRejectModal, lead, updateLeadStatus } = useLeadDetailsStore();
  const [reason, setReason] = useState<string>('Out of Budget');
  const [comment, setComment] = useState<string>('');

  if (!isRejectModalOpen || !lead) return null;

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    updateLeadStatus('LOST', `Lead rejected/lost. Reason: ${reason}. Comment: ${comment || 'N/A'}`);
    toast.error(`${lead.name} marked as Lost (${reason})`);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card modal-md">
        <div className="modal-header-row">
          <div className="modal-title-group">
            <XCircle size={20} className="text-danger-red" />
            <h3 className="modal-title">Reject Lead Record</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={closeRejectModal}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleConfirmReject}>
          <div className="modal-body-content">
            <p className="modal-sub-text">
              Please specify the primary reason for marking <strong>{lead.name}</strong> as lost/rejected.
            </p>

            <div className="form-group-field">
              <label className="form-label-sm">Rejection Reason</label>
              <select
                className="lead-pagination-select full-width-select"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              >
                <option value="Out of Budget">Out of Budget</option>
                <option value="Location Mismatch">Location Mismatch</option>
                <option value="Purchased Competitor Project">Purchased Competitor Project</option>
                <option value="Invalid Phone / Junk Contact">Invalid Phone / Junk Contact</option>
                <option value="Not Interested">Not Interested</option>
                <option value="Delayed Buying Decision">Delayed Buying Decision</option>
              </select>
            </div>

            <div className="form-group-field">
              <label className="form-label-sm">Additional Comments</label>
              <textarea
                className="notes-textarea"
                rows={2}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Optional explanation for audit timeline..."
              />
            </div>
          </div>

          <div className="modal-footer-row">
            <button type="button" className="modal-btn-cancel" onClick={closeRejectModal}>
              Cancel
            </button>
            <button type="submit" className="modal-btn-confirm btn-danger-primary">
              Confirm Rejection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
