'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MoreVertical, ChevronLeft, ChevronRight, Edit3, Copy, Archive, Trash2, Download, Share2 } from 'lucide-react';
import { useLeadDetailsStore } from '@/store/useLeadDetailsStore';

const LEAD_IDS = ['lead_1', 'lead_2', 'lead_3', 'lead_4', 'lead_5'];

export const LeadDetailsHeader: React.FC = () => {
  const router = useRouter();
  const { lead, openEditLeadModal } = useLeadDetailsStore();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  if (!lead) return null;

  const currentIndex = LEAD_IDS.indexOf(lead.id);
  const prevLeadId = currentIndex > 0 ? LEAD_IDS[currentIndex - 1] : LEAD_IDS[LEAD_IDS.length - 1];
  const nextLeadId = currentIndex >= 0 && currentIndex < LEAD_IDS.length - 1 ? LEAD_IDS[currentIndex + 1] : LEAD_IDS[0];

  const handlePrevClick = () => {
    router.push(`/lead/${prevLeadId}`);
  };

  const handleNextClick = () => {
    router.push(`/lead/${nextLeadId}`);
  };

  return (
    <div className="lead-detail-page-header">
      {/* Top Back Navigation Link */}
      <Link href="/lead-inbox" className="back-to-leads-link">
        <ArrowLeft size={16} /> Back to Leads
      </Link>

      <div className="lead-detail-header-main-row">
        {/* Title & Customer Primary Identifier */}
        <div className="lead-detail-title-group">
          <h1 className="lead-detail-page-title">Lead Details</h1>

          <div className="lead-header-profile-badge">
            <div className="lead-avatar-circle avatar-green lead-avatar-lg">
              {lead.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()}
            </div>
            <div className="lead-header-meta-col">
              <div className="lead-header-name-status-row">
                <span className="lead-header-name-text">{lead.name}</span>
                <span className="lead-header-status-pill">
                  • {lead.status}
                </span>
              </div>
              <span className="lead-header-source-text">
                {lead.source?.replace('_', ' ') || 'Facebook Lead'} • 2m ago
              </span>
            </div>
          </div>
        </div>

        {/* Right Metric Badges & Action Buttons */}
        <div className="lead-detail-header-widgets-group">
          {/* Score Badge Widget */}
          <div className="lead-metric-card-box">
            <div className="metric-box-val metric-val-green">
              {lead.qualificationScore || 85}
            </div>
            <span className="metric-box-label">Lead Score</span>
          </div>

          {/* Status Badge Widget */}
          <div className="lead-metric-card-box">
            <div className="metric-box-val metric-val-blue">
              {lead.status === 'NEW' ? 'New' : lead.status}
            </div>
            <span className="metric-box-label">Status</span>
          </div>

          {/* Assigned Executive Widget */}
          <div className="lead-assigned-user-widget">
            <div className="assigned-user-avatar-circle">
              <Image
                unoptimized
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
                alt={lead.assignedSalesUser?.name || 'Neha Singh'}
                width={36}
                height={36}
                className="assigned-user-img"
              />
            </div>
            <div className="assigned-user-info">
              <span className="assigned-user-name">
                {lead.assignedSalesUser?.name || 'Neha Singh'}
              </span>
              <span className="assigned-user-sub">Assigned To</span>
            </div>
          </div>

          {/* Header Action Tools */}
          <div className="lead-header-nav-actions">
            <div className="pos-relative">
              <button
                type="button"
                className="lead-header-icon-btn"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                title="More Actions"
              >
                <MoreVertical size={18} />
              </button>

              {isMenuOpen && (
                <div
                  className="dropdown-menu shadow-dropdown text-left dropdown-menu-right"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <button type="button" className="dropdown-item" onClick={openEditLeadModal}>
                    <Edit3 size={14} /> Edit Lead Information
                  </button>
                  <button type="button" className="dropdown-item">
                    <Copy size={14} /> Duplicate Lead Record
                  </button>
                  <button type="button" className="dropdown-item">
                    <Download size={14} /> Export Lead (PDF)
                  </button>
                  <button type="button" className="dropdown-item">
                    <Share2 size={14} /> Share Profile Link
                  </button>
                  <button type="button" className="dropdown-item">
                    <Archive size={14} /> Archive Record
                  </button>
                  <button type="button" className="dropdown-item dropdown-item-danger">
                    <Trash2 size={14} /> Delete Lead
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              className="lead-header-icon-btn"
              title="Previous Lead"
              onClick={handlePrevClick}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              className="lead-header-icon-btn"
              title="Next Lead"
              onClick={handleNextClick}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
