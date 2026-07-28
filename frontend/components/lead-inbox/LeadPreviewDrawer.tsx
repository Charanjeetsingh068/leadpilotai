import React, { useState } from 'react';
import Link from 'next/link';
import { Lead } from '@/types/lead.types';
import { StatusBadge } from '@/components/leads/StatusBadge';
import { ScoreBadge } from '@/components/leads/ScoreBadge';
import { DrawerTabType, useLeadStore } from '@/store/useLeadStore';
import {
  X,
  Shield,
  MessageSquare,
  Clock,
  FileText,
  Phone,
  Mail,
  ArrowRight,
  Send,
  Pin,
  CheckCheck,
} from 'lucide-react';

interface LeadPreviewDrawerProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onAssign?: (leadId: string) => void;
}

const getAvatarClass = (name: string) => {
  const charCode = name.charCodeAt(0) || 0;
  const classes = [
    'avatar-green',
    'avatar-purple',
    'avatar-pink',
    'avatar-coral',
    'avatar-teal',
    'avatar-blue',
    'avatar-yellow',
    'avatar-cyan',
  ];
  return classes[charCode % classes.length];
};

const getInitials = (name: string) => {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

export const LeadPreviewDrawer: React.FC<LeadPreviewDrawerProps> = ({
  lead,
  isOpen,
  onClose,
}) => {
  const {
    activeDrawerTab,
    setActiveDrawerTab,
    activeNotes,
    activeTimeline,
    activeConversation,
    appendNote,
  } = useLeadStore();

  const [newNoteText, setNewNoteText] = useState<string>('');

  if (!isOpen || !lead) {
    return null;
  }

  const avatarColorClass = getAvatarClass(lead.name);
  const initials = getInitials(lead.name);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    appendNote({
      id: `note_${Date.now()}`,
      leadId: lead.id,
      authorId: { id: 'usr_1', name: 'Arjun Mehta', email: 'arjun@leadpilot.ai' },
      noteText: newNoteText.trim(),
      createdAt: new Date().toISOString(),
    });

    setNewNoteText('');
  };

  return (
    <aside className={`lead-details-panel ${isOpen ? 'drawer-open' : ''}`}>
      {/* Header */}
      <div className="lead-details-header">
        <h3 className="lead-details-title">Lead Details</h3>
        <button type="button" className="lead-details-close-btn" onClick={onClose} title="Close drawer">
          <X size={18} />
        </button>
      </div>

      {/* Profile Card */}
      <div className="lead-details-profile-card">
        <div className={`lead-details-profile-avatar ${avatarColorClass}`}>{initials}</div>
        <div className="lead-details-profile-info">
          <div className="lead-details-profile-name-row">
            <span className="lead-details-profile-name">{lead.name}</span>
            <span className="lead-details-profile-dot-status">
              • <StatusBadge status={lead.status} />
            </span>
          </div>
          <span className="lead-details-profile-meta">
            Facebook Lead • 2m ago
          </span>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="lead-details-tabs-bar">
        <button
          type="button"
          className={`lead-details-tab-btn ${activeDrawerTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveDrawerTab('details')}
        >
          <Shield size={16} />
          Details
        </button>
        <button
          type="button"
          className={`lead-details-tab-btn ${activeDrawerTab === 'conversation' ? 'active' : ''}`}
          onClick={() => setActiveDrawerTab('conversation')}
        >
          <MessageSquare size={16} />
          Conversation
        </button>
        <button
          type="button"
          className={`lead-details-tab-btn ${activeDrawerTab === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveDrawerTab('activity')}
        >
          <Clock size={16} />
          Activity
        </button>
        <button
          type="button"
          className={`lead-details-tab-btn ${activeDrawerTab === 'notes' ? 'active' : ''}`}
          onClick={() => setActiveDrawerTab('notes')}
        >
          <FileText size={16} />
          Notes
        </button>
      </div>

      {/* Tab Content Container */}
      <div className="lead-details-tab-content">
        {/* DETAILS TAB */}
        {activeDrawerTab === 'details' && (
          <div className="lead-detail-field-group">
            <div className="lead-detail-row">
              <span className="lead-detail-label">Phone</span>
              <div className="lead-detail-value-group">
                <span className="lead-phone-text">{lead.phone || '+91 98765 43210'}</span>
                <a
                  href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="lead-quick-icon-btn lead-whatsapp-icon-btn"
                  title="Open WhatsApp"
                >
                  <Phone size={12} />
                </a>
              </div>
            </div>

            <div className="lead-detail-row">
              <span className="lead-detail-label">Email</span>
              <div className="lead-detail-value-group">
                <span className="lead-created-text">{lead.email || 'rohit.sharma@example.com'}</span>
                <a
                  href={`mailto:${lead.email || 'rohit.sharma@example.com'}`}
                  className="lead-quick-icon-btn lead-email-icon-btn"
                  title="Send Email"
                >
                  <Mail size={12} />
                </a>
              </div>
            </div>

            <div className="lead-detail-row">
              <span className="lead-detail-label">Project</span>
              <span className="lead-project-text">{lead.project || 'Sunshine Villas'}</span>
            </div>

            <div className="lead-detail-row">
              <span className="lead-detail-label">Budget</span>
              <span className="lead-project-text">{lead.budget || '₹50 - ₹70 Lakhs'}</span>
            </div>

            <div className="lead-detail-row">
              <span className="lead-detail-label">Location</span>
              <span className="lead-project-text">{lead.location || 'Indore, MP'}</span>
            </div>

            <div className="lead-detail-row">
              <span className="lead-detail-label">Lead Score</span>
              <ScoreBadge score={lead.qualificationScore || 85} />
            </div>

            <div className="lead-detail-row">
              <span className="lead-detail-label">Assigned To</span>
              <div className="lead-assigned-cell">
                <div className="lead-avatar-circle avatar-purple lead-user-avatar-sm">
                  NS
                </div>
                <span className="lead-user-name">{lead.assignedSalesUser?.name || 'Neha Singh'}</span>
              </div>
            </div>

            <div className="lead-detail-row">
              <span className="lead-detail-label">Status</span>
              <StatusBadge status={lead.status} />
            </div>

            <div className="lead-detail-row">
              <span className="lead-detail-label">Source</span>
              <span className="lead-project-text">Facebook Lead</span>
            </div>

            <div className="lead-detail-row">
              <span className="lead-detail-label">Created Time</span>
              <span className="text-muted lead-created-text">May 26, 2025 10:24 AM</span>
            </div>

            {/* Latest WhatsApp Message Box */}
            <div className="lead-latest-message-section">
              <span className="lead-latest-message-title">Latest Message</span>
              <div className="lead-latest-message-box">
                <p className="lead-latest-message-text">
                  {"Yes, I'm interested in 3BHK. Please share more details."}
                </p>
                <div className="lead-latest-message-footer">
                  <span>2m ago</span>
                  <a
                    href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="lead-quick-icon-btn lead-whatsapp-icon-btn"
                  >
                    <MessageSquare size={12} />
                  </a>
                </div>
              </div>
            </div>

            {/* Primary Action CTA */}
            <Link href={`/lead/${lead.id}`} className="lead-view-full-btn">
              View Full Details <ArrowRight size={16} />
            </Link>
          </div>
        )}

        {/* CONVERSATION TAB */}
        {activeDrawerTab === 'conversation' && (
          <div className="lead-chat-feed">
            {activeConversation.length === 0 ? (
              <>
                <div className="lead-chat-bubble lead-chat-bubble-customer">
                  Hi, I am interested in 3BHK apartment in Sunshine Villas project. Can you send brochure?
                  <div className="lead-chat-meta">
                    <span>10:22 AM</span>
                    <CheckCheck size={12} className="lead-source-icon-facebook" />
                  </div>
                </div>

                <div className="lead-chat-bubble lead-chat-bubble-ai">
                  Hello Rohit! 👋 Thanks for reaching out to LeadPilot AI. Here is the brochure link for Sunshine Villas 3BHK. What is your preferred budget range?
                  <div className="lead-chat-meta">
                    <span>10:23 AM</span>
                    <CheckCheck size={12} />
                  </div>
                </div>

                <div className="lead-chat-bubble lead-chat-bubble-customer">
                  {"Yes, I'm interested in 3BHK. Please share more details. My budget is 50-70 Lakhs."}
                  <div className="lead-chat-meta">
                    <span>10:24 AM</span>
                    <CheckCheck size={12} className="lead-source-icon-facebook" />
                  </div>
                </div>
              </>
            ) : (
              activeConversation.map((msg: any) => (
                <div
                  key={msg.id || msg._id}
                  className={`lead-chat-bubble ${
                    msg.sender === 'LEAD' ? 'lead-chat-bubble-customer' : 'lead-chat-bubble-ai'
                  }`}
                >
                  {msg.content}
                  <div className="lead-chat-meta">
                    <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <CheckCheck size={12} />
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ACTIVITY / TIMELINE TAB */}
        {activeDrawerTab === 'activity' && (
          <div className="lead-timeline-feed">
            {activeTimeline.length === 0 ? (
              <>
                <div className="lead-timeline-item">
                  <div className="lead-timeline-dot" />
                  <span className="lead-timeline-title">Lead Created</span>
                  <span className="lead-timeline-desc">Ingested via Facebook Lead Form</span>
                  <span className="lead-timeline-time">May 26, 2025 10:24 AM</span>
                </div>
                <div className="lead-timeline-item">
                  <div className="lead-timeline-dot" />
                  <span className="lead-timeline-title">AI Started</span>
                  <span className="lead-timeline-desc">WhatsApp Bot auto-qualification triggered</span>
                  <span className="lead-timeline-time">May 26, 2025 10:24 AM</span>
                </div>
                <div className="lead-timeline-item">
                  <div className="lead-timeline-dot" />
                  <span className="lead-timeline-title">Customer Replied</span>
                  <span className="lead-timeline-desc">Confirmed 3BHK interest & budget ₹50-70L</span>
                  <span className="lead-timeline-time">May 26, 2025 10:25 AM</span>
                </div>
                <div className="lead-timeline-item">
                  <div className="lead-timeline-dot" />
                  <span className="lead-timeline-title">Lead Qualified</span>
                  <span className="lead-timeline-desc">AI Score calculated: 85/100</span>
                  <span className="lead-timeline-time">May 26, 2025 10:25 AM</span>
                </div>
                <div className="lead-timeline-item">
                  <div className="lead-timeline-dot" />
                  <span className="lead-timeline-title">Assigned to Sales Executive</span>
                  <span className="lead-timeline-desc">Assigned to Neha Singh</span>
                  <span className="lead-timeline-time">May 26, 2025 10:26 AM</span>
                </div>
              </>
            ) : (
              activeTimeline.map((evt) => (
                <div key={evt.id} className="lead-timeline-item">
                  <div className="lead-timeline-dot" />
                  <span className="lead-timeline-title">{evt.title}</span>
                  <span className="lead-timeline-desc">{evt.description}</span>
                  <span className="lead-timeline-time">{new Date(evt.createdAt).toLocaleString()}</span>
                </div>
              ))
            )}
          </div>
        )}

        {/* NOTES TAB */}
        {activeDrawerTab === 'notes' && (
          <div className="lead-notes-feed">
            <form onSubmit={handleAddNote} className="lead-note-input-container">
              <textarea
                className="lead-note-textarea"
                placeholder="Type internal sales note or follow-up details..."
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
              />
              <button type="submit" className="lead-btn-secondary note-submit-btn">
                <Send size={14} /> Add Note
              </button>
            </form>

            {activeNotes.length === 0 ? (
              <>
                <div className="lead-note-card">
                  <div className="lead-note-header">
                    <span>Neha Singh (Sales)</span>
                    <Pin size={12} className="lead-note-pinned" />
                  </div>
                  <p className="lead-note-body">
                    Customer is looking for possession within 6 months. High budget priority lead.
                  </p>
                </div>
                <div className="lead-note-card">
                  <div className="lead-note-header">
                    <span>System AI Agent</span>
                  </div>
                  <p className="lead-note-body">
                    Auto-qualified via WhatsApp AI Assistant. Preference matched for Sunshine Villas 3BHK.
                  </p>
                </div>
              </>
            ) : (
              activeNotes.map((note) => (
                <div key={note.id} className="lead-note-card">
                  <div className="lead-note-header">
                    <span>{note.authorId?.name || 'Agent'}</span>
                    <span className="text-muted">{new Date(note.createdAt).toLocaleTimeString()}</span>
                  </div>
                  <p className="lead-note-body">{note.noteText}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
