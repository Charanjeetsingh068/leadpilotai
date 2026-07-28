import React, { useState } from 'react';
import { UserPlus, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface LeadAssignModalProps {
  isOpen: boolean;
  leadIds: string[];
  onClose: () => void;
  onSuccess: () => void;
}

export const LeadAssignModal: React.FC<LeadAssignModalProps> = ({
  isOpen,
  leadIds,
  onClose,
  onSuccess,
}) => {
  const [selectedUser, setSelectedUser] = useState<string>('Neha Singh');
  const [reason, setReason] = useState<string>('');
  const [isAssigning, setIsAssigning] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAssigning(true);
    setTimeout(() => {
      setIsAssigning(false);
      toast.success(`Assigned ${leadIds.length || 1} lead(s) to ${selectedUser}`);
      onSuccess();
      onClose();
    }, 800);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="lead-details-header">
          <h3 className="lead-details-title">Assign Lead to Executive</h3>
          <button type="button" className="lead-details-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="lead-details-tab-content">
          <div className="lead-detail-field-group">
            <label className="lead-detail-label">Sales Executive</label>
            <select
              className="lead-search-input"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="Neha Singh">Neha Singh (Senior Executive)</option>
              <option value="Amit Kumar">Amit Kumar (Property Consultant)</option>
              <option value="Raj Mehta">Raj Mehta (Account Manager)</option>
              <option value="Rohit Tiwari">Rohit Tiwari (Sales Associate)</option>
            </select>
          </div>

          <div className="lead-detail-field-group">
            <label className="lead-detail-label">Assignment Reason / Note</label>
            <textarea
              className="lead-note-textarea"
              placeholder="e.g. High budget lead requiring immediate call back..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <div className="lead-actions-right modal-footer-top">
            <button type="button" className="lead-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="lead-btn-primary-dropdown" disabled={isAssigning}>
              <UserPlus size={14} /> {isAssigning ? 'Assigning...' : 'Confirm Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
