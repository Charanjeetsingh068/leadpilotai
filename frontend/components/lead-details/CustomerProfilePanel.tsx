'use client';

import React from 'react';
import Image from 'next/image';
import { Phone, Mail, Plus, Edit2, MessageSquare } from 'lucide-react';
import { useLeadDetailsStore } from '@/store/useLeadDetailsStore';

export const CustomerProfilePanel: React.FC = () => {
  const { lead, openAssignModal } = useLeadDetailsStore();

  if (!lead) return null;

  return (
    <div className="lead-detail-card customer-profile-card">
      <h3 className="card-section-title">Customer Profile</h3>

      {/* Customer Avatar & Primary Contacts */}
      <div className="customer-profile-center-header">
        <div className="customer-avatar-wrapper">
          <Image
            unoptimized
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
            alt={lead.name}
            width={72}
            height={72}
            className="customer-avatar-img"
          />
        </div>
        <h2 className="customer-profile-name">{lead.name}</h2>

        {/* Contact Quick Buttons */}
        <div className="customer-contact-link-row">
          <span className="customer-contact-text">{lead.phone}</span>
          <a
            href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="quick-circle-btn btn-whatsapp"
            title="Open WhatsApp Chat"
          >
            <MessageSquare size={13} />
          </a>
        </div>

        <div className="customer-contact-link-row">
          <span className="customer-contact-email">{lead.email}</span>
          <a
            href={`mailto:${lead.email}`}
            className="quick-circle-btn btn-email"
            title="Send Email"
          >
            <Mail size={13} />
          </a>
        </div>
      </div>

      {/* Metadata Key-Value List */}
      <div className="profile-meta-list">
        <div className="profile-meta-row">
          <span className="meta-label-text">First Contact</span>
          <span className="meta-val-bold">May 26, 2025</span>
        </div>

        <div className="profile-meta-row">
          <span className="meta-label-text">Total Conversations</span>
          <span className="meta-val-bold">6</span>
        </div>

        <div className="profile-meta-row">
          <span className="meta-label-text">Last Interaction</span>
          <span className="meta-val-bold">2m ago</span>
        </div>

        <div className="profile-meta-row">
          <span className="meta-label-text">Preferred Time</span>
          <span className="meta-val-bold">Evening (6PM - 9PM)</span>
        </div>

        <div className="profile-meta-row">
          <span className="meta-label-text">Language</span>
          <span className="meta-val-bold">English, Hindi</span>
        </div>
      </div>

      <hr className="profile-divider" />

      {/* Tags Section */}
      <div className="profile-tags-section">
        <div className="section-header-row">
          <span className="section-sub-title">Tags</span>
          <button type="button" className="icon-text-link-btn" title="Add Tag">
            <Plus size={14} />
          </button>
        </div>

        <div className="tags-pills-wrap">
          <span className="tag-pill tag-blue">2BHK Interested</span>
          <span className="tag-pill tag-green">High Intent</span>
          <span className="tag-pill tag-purple">WhatsApp Engaged</span>
          <span className="tag-pill tag-yellow">Budget 50L-70L</span>
        </div>
      </div>

      <hr className="profile-divider" />

      {/* Assigned Executive Section */}
      <div className="profile-assigned-section">
        <div className="section-header-row">
          <span className="section-sub-title">Assigned To</span>
          <button
            type="button"
            className="icon-text-link-btn"
            onClick={openAssignModal}
            title="Edit Assigned Executive"
          >
            <Edit2 size={13} />
          </button>
        </div>

        <div className="assigned-user-card-sm">
          <Image
            unoptimized
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
            alt={lead.assignedSalesUser?.name || 'Neha Singh'}
            width={34}
            height={34}
            className="assigned-user-img-sm"
          />
          <div>
            <div className="user-bold-name">{lead.assignedSalesUser?.name || 'Neha Singh'}</div>
            <div className="user-sub-role">Sales Executive</div>
          </div>
        </div>
      </div>

      <hr className="profile-divider" />

      {/* Sales Team Section */}
      <div className="profile-team-section">
        <span className="section-sub-title">Team</span>
        <div className="team-name-text">Indore Sales Team</div>
      </div>
    </div>
  );
};
