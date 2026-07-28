'use client';

import React from 'react';
import { Edit3, Plus, Download, FileText, Home, DollarSign, Target, MapPin, Landmark, Sparkles, Bot, Calendar } from 'lucide-react';
import { useLeadDetailsStore } from '@/store/useLeadDetailsStore';

export const RightWidgetsPanel: React.FC = () => {
  const { lead, documents, notes, setActiveTab, openEditLeadModal } = useLeadDetailsStore();

  if (!lead) return null;

  return (
    <div className="right-widgets-stack">
      {/* Widget 1: Lead Information Card */}
      <div className="lead-detail-card widget-lead-info-card">
        <div className="widget-header-row">
          <h3 className="widget-title">Lead Information</h3>
          <button type="button" className="widget-edit-link" onClick={openEditLeadModal}>
            <Edit3 size={14} /> Edit
          </button>
        </div>

        <div className="widget-info-list">
          <div className="widget-info-item">
            <div className="info-icon-box bg-blue-subtle">
              <Home size={15} className="text-blue" />
            </div>
            <div className="info-content-col">
              <span className="info-label-sm">Interested Project</span>
              <span className="info-val-bold">{lead.project || 'Sunshine Villas - 2 BHK'}</span>
            </div>
          </div>

          <div className="widget-info-item">
            <div className="info-icon-box bg-purple-subtle">
              <DollarSign size={15} className="text-purple" />
            </div>
            <div className="info-content-col">
              <span className="info-label-sm">Budget</span>
              <span className="info-val-bold">{lead.budget || '₹50 - ₹70 Lakhs'}</span>
            </div>
          </div>

          <div className="widget-info-item">
            <div className="info-icon-box bg-green-subtle">
              <Target size={15} className="text-green" />
            </div>
            <div className="info-content-col">
              <span className="info-label-sm">Intent</span>
              <span className="info-val-bold">Ready to buy in 1 - 3 months</span>
            </div>
          </div>

          <div className="widget-info-item">
            <div className="info-icon-box bg-orange-subtle">
              <MapPin size={15} className="text-orange" />
            </div>
            <div className="info-content-col">
              <span className="info-label-sm">Location</span>
              <span className="info-val-bold">{lead.location || 'Indore, Madhya Pradesh'}</span>
            </div>
          </div>

          <div className="widget-info-item">
            <div className="info-icon-box bg-blue-subtle">
              <Landmark size={15} className="text-blue" />
            </div>
            <div className="info-content-col">
              <span className="info-label-sm">Loan Requirement</span>
              <span className="info-val-bold">Yes, Home Loan Required</span>
            </div>
          </div>
        </div>
      </div>

      {/* Widget 2: Documents Widget */}
      <div className="lead-detail-card widget-docs-card">
        <div className="widget-header-row">
          <h3 className="widget-title">Documents</h3>
          <button type="button" className="widget-icon-btn" onClick={() => setActiveTab('documents')} title="Add Document">
            <Plus size={16} />
          </button>
        </div>

        <div className="widget-docs-list">
          {documents.slice(0, 3).map((doc) => (
            <div key={doc.id} className="widget-doc-row">
              <FileText size={16} className="text-muted" />
              <div className="widget-doc-info">
                <span className="widget-doc-name">{doc.name}</span>
                <span className="widget-doc-meta">{doc.uploadedAt}</span>
              </div>
              <a href={doc.downloadUrl} className="widget-doc-dl" title="Download">
                <Download size={14} />
              </a>
            </div>
          ))}
        </div>

        <button type="button" className="widget-footer-link-btn" onClick={() => setActiveTab('documents')}>
          View all documents
        </button>
      </div>

      {/* Widget 3: Notes Widget */}
      <div className="lead-detail-card widget-notes-card">
        <div className="widget-header-row">
          <h3 className="widget-title">Notes</h3>
          <button type="button" className="widget-icon-btn" onClick={() => setActiveTab('notes')} title="Add Note">
            <Plus size={16} />
          </button>
        </div>

        {notes.length > 0 ? (
          <div className="widget-note-preview-box">
            <p className="widget-note-body">{notes[0].content}</p>
            <span className="widget-note-meta">{notes[0].createdAt}</span>
          </div>
        ) : (
          <p className="text-muted text-sm">No internal notes added yet.</p>
        )}
      </div>

      {/* Widget 4: Recent Activities Widget */}
      <div className="lead-detail-card widget-activity-card">
        <div className="widget-header-row">
          <h3 className="widget-title">Recent Activities</h3>
          <button type="button" className="widget-footer-link-btn inline-link" onClick={() => setActiveTab('timeline')}>
            View all
          </button>
        </div>

        <div className="widget-activity-list">
          <div className="widget-act-item">
            <div className="act-icon-circle bg-blue-subtle">
              <Sparkles size={13} className="text-blue" />
            </div>
            <div className="act-content-row">
              <span className="act-title-text">AI Summary Generated</span>
              <span className="act-time-text">2m ago</span>
            </div>
          </div>

          <div className="widget-act-item">
            <div className="act-icon-circle bg-green-subtle">
              <Bot size={13} className="text-green" />
            </div>
            <div className="act-content-row">
              <span className="act-title-text">Lead Score Updated to 85</span>
              <span className="act-time-text">4m ago</span>
            </div>
          </div>

          <div className="widget-act-item">
            <div className="act-icon-circle bg-purple-subtle">
              <FileText size={13} className="text-purple" />
            </div>
            <div className="act-content-row">
              <span className="act-title-text">Brochure Shared</span>
              <span className="act-time-text">12m ago</span>
            </div>
          </div>

          <div className="widget-act-item">
            <div className="act-icon-circle bg-orange-subtle">
              <Calendar size={13} className="text-orange" />
            </div>
            <div className="act-content-row">
              <span className="act-title-text">Site Visit Requested</span>
              <span className="act-time-text">18m ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
