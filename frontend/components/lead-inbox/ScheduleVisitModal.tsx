import React, { useState } from 'react';
import { Calendar, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface ScheduleVisitModalProps {
  isOpen: boolean;
  leadId: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const ScheduleVisitModal: React.FC<ScheduleVisitModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('11:00');
  const [project, setProject] = useState<string>('Sunshine Villas');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Site visit scheduled for ${date || 'Tomorrow'} at ${time} for ${project}`);
    onSuccess();
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="lead-details-header">
          <h3 className="lead-details-title">Schedule Site Visit</h3>
          <button type="button" className="lead-details-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="lead-details-tab-content">
          <div className="lead-detail-field-group">
            <label className="lead-detail-label">Project Location</label>
            <select
              className="lead-search-input"
              value={project}
              onChange={(e) => setProject(e.target.value)}
            >
              <option value="Sunshine Villas">Sunshine Villas (Indore)</option>
              <option value="Green Heights">Green Heights (Bhopal)</option>
              <option value="Royal Residency">Royal Residency (Ujjain)</option>
            </select>
          </div>

          <div className="lead-detail-field-group">
            <label className="lead-detail-label">Visit Date</label>
            <input
              type="date"
              className="lead-search-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="lead-detail-field-group">
            <label className="lead-detail-label">Preferred Time Slot</label>
            <select
              className="lead-search-input"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            >
              <option value="10:00">10:00 AM - 11:00 AM</option>
              <option value="11:00">11:00 AM - 12:00 PM</option>
              <option value="14:00">02:00 PM - 03:00 PM</option>
              <option value="16:00">04:00 PM - 05:00 PM</option>
            </select>
          </div>

          <div className="lead-actions-right modal-footer-top">
            <button type="button" className="lead-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="lead-btn-primary-dropdown">
              <Calendar size={14} /> Confirm Site Visit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
