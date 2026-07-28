'use client';

import React, { useState } from 'react';
import { X, Search, Check, UserPlus } from 'lucide-react';
import { useLeadDetailsStore } from '@/store/useLeadDetailsStore';
import toast from 'react-hot-toast';

export const AssignLeadModal: React.FC = () => {
  const { isAssignModalOpen, closeAssignModal, assignSalesRep, lead } = useLeadDetailsStore();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedRep, setSelectedRep] = useState<string>('Neha Singh');

  if (!isAssignModalOpen || !lead) return null;

  const salesReps = [
    { name: 'Neha Singh', role: 'Senior Sales Executive', activeLeads: 14, avatar: 'NS' },
    { name: 'Amit Kumar', role: 'Sales Specialist', activeLeads: 22, avatar: 'AK' },
    { name: 'Raj Mehta', role: 'Account Manager', activeLeads: 18, avatar: 'RM' },
    { name: 'Rohit Tiwari', role: 'Lead Executive', activeLeads: 9, avatar: 'RT' },
    { name: 'Priya Sharma', role: 'Property Consultant', activeLeads: 12, avatar: 'PS' },
  ];

  const filteredReps = salesReps.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssign = () => {
    assignSalesRep(selectedRep);
    toast.success(`Assigned lead to ${selectedRep}`);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card modal-md">
        <div className="modal-header-row">
          <div className="modal-title-group">
            <UserPlus size={18} className="text-primary" />
            <h3 className="modal-title">Assign Sales Executive</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={closeAssignModal}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body-content">
          <p className="modal-sub-text">
            Reassigning <strong>{lead.name}</strong> to a different sales team member will update lead ownership and dispatch WhatsApp notifications.
          </p>

          <div className="lead-search-box modal-search-wrap">
            <Search size={16} className="lead-search-icon" />
            <input
              type="text"
              className="lead-search-input"
              placeholder="Search executive name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="modal-exec-list">
            {filteredReps.map((rep) => {
              const isSelected = selectedRep === rep.name;
              return (
                <div
                  key={rep.name}
                  className={`modal-exec-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedRep(rep.name)}
                >
                  <div className="lead-avatar-circle avatar-purple">{rep.avatar}</div>
                  <div className="exec-info">
                    <span className="exec-name">{rep.name}</span>
                    <span className="exec-role">{rep.role} • {rep.activeLeads} active leads</span>
                  </div>
                  {isSelected && <Check size={16} className="text-primary" />}
                </div>
              );
            })}
          </div>
        </div>

        <div className="modal-footer-row">
          <button type="button" className="modal-btn-cancel" onClick={closeAssignModal}>
            Cancel
          </button>
          <button type="button" className="modal-btn-confirm" onClick={handleAssign}>
            Confirm Assignment
          </button>
        </div>
      </div>
    </div>
  );
};
