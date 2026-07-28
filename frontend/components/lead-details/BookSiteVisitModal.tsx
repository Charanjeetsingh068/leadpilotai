'use client';

import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, CheckCircle } from 'lucide-react';
import { useLeadDetailsStore } from '@/store/useLeadDetailsStore';
import toast from 'react-hot-toast';

export const BookSiteVisitModal: React.FC = () => {
  const { isBookVisitModalOpen, closeBookVisitModal, lead, updateLeadStatus } = useLeadDetailsStore();
  const [visitDate, setVisitDate] = useState<string>('2025-05-31');
  const [visitSlot, setVisitSlot] = useState<string>('04:00 PM - 05:30 PM');
  const [notes, setNotes] = useState<string>('Customer requested pickup from Vijay Nagar Square.');

  if (!isBookVisitModalOpen || !lead) return null;

  const handleBookVisit = (e: React.FormEvent) => {
    e.preventDefault();
    updateLeadStatus('SITE_VISIT_SCHEDULED', `Site visit booked for ${visitDate} at ${visitSlot}`);
    toast.success(`Site visit scheduled for ${visitDate} at ${visitSlot}!`);
    closeBookVisitModal();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card modal-md">
        <div className="modal-header-row">
          <div className="modal-title-group">
            <Calendar size={18} className="text-purple" />
            <h3 className="modal-title">Book Site Visit Appointment</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={closeBookVisitModal}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleBookVisit}>
          <div className="modal-body-content">
            <div className="modal-lead-summary-pill">
              <span className="text-muted">Lead:</span>
              <strong className="text-main">{lead.name} ({lead.phone})</strong>
            </div>

            <div className="form-group-field">
              <label className="form-label-sm">Select Project Site</label>
              <input
                type="text"
                className="lead-search-input"
                readOnly
                value={lead.project || 'Sunshine Villas, Vijay Nagar, Indore'}
              />
            </div>

            <div className="form-row-2col">
              <div className="form-group-field">
                <label className="form-label-sm">Visit Date</label>
                <input
                  type="date"
                  className="lead-search-input"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group-field">
                <label className="form-label-sm">Preferred Time Slot</label>
                <select
                  className="lead-pagination-select full-width-select"
                  value={visitSlot}
                  onChange={(e) => setVisitSlot(e.target.value)}
                >
                  <option value="10:00 AM - 11:30 AM">10:00 AM - 11:30 AM</option>
                  <option value="12:00 PM - 01:30 PM">12:00 PM - 01:30 PM</option>
                  <option value="02:30 PM - 04:00 PM">02:30 PM - 04:00 PM</option>
                  <option value="04:00 PM - 05:30 PM">04:00 PM - 05:30 PM</option>
                  <option value="06:00 PM - 07:30 PM">06:00 PM - 07:30 PM</option>
                </select>
              </div>
            </div>

            <div className="form-group-field">
              <label className="form-label-sm">Special Instructions & Pickup Request</label>
              <textarea
                className="notes-textarea"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional notes for site executive..."
              />
            </div>
          </div>

          <div className="modal-footer-row">
            <button type="button" className="modal-btn-cancel" onClick={closeBookVisitModal}>
              Cancel
            </button>
            <button type="submit" className="modal-btn-confirm btn-purple-primary">
              Schedule & Dispatch WhatsApp Calendar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
