'use client';

import React from 'react';
import { X, User, Phone, Mail, MapPin, Target, Smartphone, Globe, MessageSquare, PhoneCall, Tag, FileText } from 'lucide-react';
import { LeadRowData } from './FacebookLeadInboxTable';

interface LeadDetailsDrawerProps {
  lead: LeadRowData | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FacebookLeadDetailsDrawer: React.FC<LeadDetailsDrawerProps> = ({ lead, isOpen, onClose }) => {
  if (!isOpen || !lead) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.5)',
        backdropFilter: 'blur(4px)',
        zIndex: 50,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '540px',
          height: '100%',
          backgroundColor: '#ffffff',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}
      >
        {/* DRAWER HEADER */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#f8fafc',
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a' }}>
              Lead Details: {lead.name}
            </h3>
            <span className={`fb-status-pill ${lead.status.toLowerCase()}`}>
              {lead.status}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="fb-btn-outline"
            style={{ padding: '0.375rem' }}
          >
            <X width={18} height={18} />
          </button>
        </div>

        {/* DRAWER BODY */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* CONTACT INFO */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
              Contact Details
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.8125rem' }}>
              <div>
                <span style={{ color: '#64748b', display: 'block' }}>Full Name</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{lead.name}</span>
              </div>

              <div>
                <span style={{ color: '#64748b', display: 'block' }}>Phone Number</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{lead.phone}</span>
              </div>

              <div>
                <span style={{ color: '#64748b', display: 'block' }}>Email Address</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{lead.email || 'N/A'}</span>
              </div>

              <div>
                <span style={{ color: '#64748b', display: 'block' }}>Location</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{lead.city ? `${lead.city}, ${lead.country || ''}` : 'Not Specified'}</span>
              </div>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0' }} />

          {/* META ADS ATTRIBUTION */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
              Meta Ad Attribution
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8125rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Campaign:</span>
                <span style={{ fontWeight: 600, color: '#2563eb' }}>{lead.campaign || 'Meta Performance Campaign'}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Ad Set:</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{lead.adSet || 'Target Audience Set'}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Ad Creative:</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{lead.adName || 'Meta Ad Creative'}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Form Name:</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{lead.formName || 'Meta Lead Form'}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>UTM Source:</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>facebook_lead_ads</span>
              </div>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0' }} />

          {/* AI CONVERSATION TRANSCRIPT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
              AI Conversation History
            </h4>
            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '0.875rem', fontSize: '0.8125rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ color: '#6b21a8', fontWeight: 600 }}>{lead.assignedName || 'AI Sales Agent'}</div>
              <div style={{ color: '#334155', fontStyle: 'italic' }}>
                "Hello {lead.name}! Thank you for reaching out to us. How can I assist you with your enquiry today?"
              </div>
              <div style={{ color: '#2563eb', alignSelf: 'flex-end', fontWeight: 600 }}>{lead.name}</div>
              <div style={{ color: '#0f172a', alignSelf: 'flex-end', backgroundColor: '#eff6ff', padding: '0.375rem 0.625rem', borderRadius: '0.375rem' }}>
                "I submitted my details via Facebook Lead Form and would like more information."
              </div>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0' }} />

          {/* NOTES & TAGS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
              Notes & Tags
            </h4>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="fb-pill-btn">Meta Lead</span>
              <span className="fb-pill-btn">{lead.status}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
