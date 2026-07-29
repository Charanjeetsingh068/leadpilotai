'use client';

import React, { useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { useApproval } from '@/context/ApprovalContext';
import { ApprovalItem } from '@/services/approval.service';
import Image from 'next/image';
import {
  Search,
  Filter,
  Check,
  X,
  Clock,
  PlayCircle,
  PauseCircle,
  UserCheck,
  CheckCircle,
  UserPlus,
  Calendar,
  Download,
  MoreVertical,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  AlertTriangle,
  XCircle,
} from 'lucide-react';

export const ApprovalsView: React.FC = () => {
  const {
    approvals,
    activities,
    selectedApproval,
    isLoading,
    stats,
    selectApproval,
    approveApproval,
    rejectApproval,
    editAndSendApproval,
    assignSalesperson,
    pauseAiAgent,
  } = useApproval();

  // Filter and Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [reasonFilter, setReasonFilter] = useState('All Reasons');
  const [sortOrder, setSortOrder] = useState('Newest First');
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [activityTab, setActivityTab] = useState<'Today' | 'Yesterday' | 'This Week'>('Today');

  // Modal States
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editText, setEditText] = useState('');
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isPauseOpen, setIsPauseOpen] = useState(false);
  const [isApproveConfirmOpen, setIsApproveConfirmOpen] = useState(false);

  // Pagination logic
  const filteredApprovals = approvals.filter((item) => {
    const matchesSearch =
      item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.aiRecommendation.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesReason =
      reasonFilter === 'All Reasons' || item.reason === reasonFilter;

    return matchesSearch && matchesReason;
  });

  // Sorting
  const sortedApprovals = [...filteredApprovals].sort((a, b) => {
    if (sortOrder === 'Newest First') {
      return a.id.localeCompare(b.id); // Mock order matching mock data ID sorting
    } else if (sortOrder === 'Oldest First') {
      return b.id.localeCompare(a.id);
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedApprovals.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedApprovals.slice(indexOfFirstItem, indexOfLastItem);

  const handleRowSelect = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedRowIds.length === currentItems.length) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(currentItems.map((item) => item.id));
    }
  };

  const handleBulkApprove = () => {
    if (selectedRowIds.length === 0) return;
    selectedRowIds.forEach((id) => approveApproval(id));
    setSelectedRowIds([]);
  };

  const handleBulkReject = () => {
    if (selectedRowIds.length === 0) return;
    selectedRowIds.forEach((id) => rejectApproval(id, 'Bulk reject action'));
    setSelectedRowIds([]);
  };

  // Right Panel Detail Updates
  const currentDetails = selectedApproval;

  // Edit Reply Template Injection Helper
  const handleInsertVariable = (variable: string) => {
    setEditText((prev) => `${prev} ${variable}`);
  };

  return (
    <PageContainer fluid>
      <div className="appr-workspace-container">
        
        {/* LEFT COLUMN */}
        <div className="appr-left-section">
          {/* Header row */}
          <div className="appr-header-bar">
            <div className="appr-title-group">
              <h1 className="appr-title">Human Approval Queue</h1>
              <p className="appr-subtitle">Review only the conversations that require human attention.</p>
            </div>
            
            <div className="appr-filter-actions">
              <div className="appr-dropdown-wrap">
                <button type="button" className="btn-appr-filter">
                  <Filter size={15} />
                  <span>{reasonFilter}</span>
                  <ChevronDown size={14} />
                </button>
                <div className="appr-dropdown-menu">
                  <button type="button" onClick={() => setReasonFilter('All Reasons')}>All Reasons</button>
                  <button type="button" onClick={() => setReasonFilter('Pricing shared by AI')}>Pricing shared by AI</button>
                  <button type="button" onClick={() => setReasonFilter('Brochure request detected')}>Brochure request detected</button>
                  <button type="button" onClick={() => setReasonFilter('Budget mentioned needs confirmation')}>Budget needs confirmation</button>
                </div>
              </div>

              <div className="appr-dropdown-wrap">
                <button type="button" className="btn-appr-filter">
                  <span>{sortOrder}</span>
                  <ChevronDown size={14} />
                </button>
                <div className="appr-dropdown-menu">
                  <button type="button" onClick={() => setSortOrder('Newest First')}>Newest First</button>
                  <button type="button" onClick={() => setSortOrder('Oldest First')}>Oldest First</button>
                </div>
              </div>
            </div>
          </div>

          {/* TOP SUMMARY CARDS */}
          <div className="appr-stats-cards-grid">
            <div className="appr-stat-card">
              <div className="appr-stat-icon-circle icon-pending">
                <Clock size={20} />
              </div>
              <div className="appr-stat-content">
                <span className="appr-stat-label">Pending Approvals</span>
                <span className="appr-stat-number">{stats.pendingCount}</span>
                <span className="appr-stat-desc">Requires your action</span>
              </div>
            </div>

            <div className="appr-stat-card">
              <div className="appr-stat-icon-circle icon-approved">
                <CheckCircle size={20} />
              </div>
              <div className="appr-stat-content">
                <span className="appr-stat-label">Approved Today</span>
                <span className="appr-stat-number">{stats.approvedCount}</span>
                <span className="appr-stat-desc text-green-bold">↑ 12% vs yesterday</span>
              </div>
            </div>

            <div className="appr-stat-card">
              <div className="appr-stat-icon-circle icon-rejected">
                <XCircle size={20} />
              </div>
              <div className="appr-stat-content">
                <span className="appr-stat-label">Rejected</span>
                <span className="appr-stat-number">{stats.rejectedCount}</span>
                <span className="appr-stat-desc text-green-bold">↑ 4% vs yesterday</span>
              </div>
            </div>

            <div className="appr-stat-card">
              <div className="appr-stat-icon-circle icon-avgtime">
                <Clock size={20} />
              </div>
              <div className="appr-stat-content">
                <span className="appr-stat-label">Average Approval Time</span>
                <span className="appr-stat-number">{stats.avgTime}</span>
                <span className="appr-stat-desc text-blue-bold">- 8m vs yesterday</span>
              </div>
            </div>
          </div>

          {/* TABLE CONTAINER CARD */}
          <div className="appr-table-card">
            {/* Table Search & Bulk Actions Bar */}
            <div className="appr-table-top-toolbar">
              <div className="appr-search-container">
                <Search size={16} className="appr-search-icon" />
                <input
                  type="text"
                  placeholder="Search leads..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="appr-search-input"
                />
              </div>

              {selectedRowIds.length > 0 && (
                <div className="appr-bulk-actions">
                  <span className="appr-bulk-count">{selectedRowIds.length} Selected</span>
                  <button type="button" onClick={handleBulkApprove} className="btn-bulk btn-bulk-approve">
                    <Check size={14} />
                    <span>Approve Selected</span>
                  </button>
                  <button type="button" onClick={handleBulkReject} className="btn-bulk btn-bulk-reject">
                    <X size={14} />
                    <span>Reject Selected</span>
                  </button>
                </div>
              )}
            </div>

            {/* Approval Table */}
            <div className="appr-table-scroll-wrap">
              <table className="appr-data-table">
                <thead>
                  <tr>
                    <th className="th-checkbox">
                      <input
                        type="checkbox"
                        checked={currentItems.length > 0 && selectedRowIds.length === currentItems.length}
                        onChange={handleSelectAll}
                        className="appr-checkbox"
                      />
                    </th>
                    <th>Customer</th>
                    <th>WhatsApp</th>
                    <th>Industry</th>
                    <th>AI Recommendation</th>
                    <th>Reason</th>
                    <th>Priority</th>
                    <th>Waiting Time</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={10} className="td-loader">
                        <div className="appr-table-spinner" />
                        <span>Loading approval queue...</span>
                      </td>
                    </tr>
                  ) : currentItems.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="td-empty">
                        <AlertTriangle size={24} />
                        <span>No pending approvals found.</span>
                      </td>
                    </tr>
                  ) : (
                    currentItems.map((item) => {
                      const isSelected = selectedApproval?.id === item.id;
                      const isRowChecked = selectedRowIds.includes(item.id);
                      
                      let priorityClass = 'badge-priority-medium';
                      if (item.priority === 'High') {
                        priorityClass = 'badge-priority-high';
                      } else if (item.priority === 'Low') {
                        priorityClass = 'badge-priority-low';
                      }

                      return (
                        <tr
                          key={item.id}
                          onClick={() => selectApproval(item.id)}
                          className={`${isSelected ? 'active-row' : ''} ${isRowChecked ? 'checked-row' : ''}`}
                        >
                          <td className="td-checkbox" onClick={(e) => handleRowSelect(e, item.id)}>
                            <input
                              type="checkbox"
                              checked={isRowChecked}
                              onChange={() => {}}
                              className="appr-checkbox"
                            />
                          </td>
                          <td>
                            <div className="appr-customer-cell">
                              <div className={`appr-initials-badge ${item.avatarColorClass}`}>
                                {item.initials}
                              </div>
                              <div className="appr-customer-info">
                                <span className="appr-customer-name">{item.customerName}</span>
                                <span className="appr-customer-phone">{item.phone}</span>
                              </div>
                            </div>
                          </td>
                          <td className="appr-td-text">{item.whatsapp}</td>
                          <td className="appr-td-text">{item.industry}</td>
                          <td className="appr-td-bold">{item.aiRecommendation}</td>
                          <td className="appr-td-text">{item.reason}</td>
                          <td>
                            <span className={`appr-priority-badge ${priorityClass}`}>
                              {item.priority}
                            </span>
                          </td>
                          <td className="appr-td-text">{item.waitingTime}</td>
                          <td>
                            <span className="appr-status-badge badge-pending">
                              {item.status}
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                selectApproval(item.id);
                              }}
                              className="btn-table-review"
                            >
                              Review
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="appr-table-pagination">
              <span className="appr-showing-text">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, sortedApprovals.length)} of {sortedApprovals.length} approvals
              </span>
              <div className="appr-pagination-nav">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="btn-paginate"
                  title="Previous Page"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrentPage(i + 1)}
                    className={`btn-paginate-num ${currentPage === i + 1 ? 'active' : ''}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="btn-paginate"
                  title="Next Page"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
              <div className="appr-per-page">
                <button type="button" className="btn-per-page-select">
                  <span>10 / page</span>
                  <ChevronDown size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* BOTTOM TIMELINE PANEL */}
          <div className="appr-timeline-card">
            <div className="appr-timeline-header">
              <h3 className="appr-timeline-title">Approval Activity</h3>
              <div className="appr-timeline-tabs">
                <button
                  type="button"
                  className={`appr-timeline-tab ${activityTab === 'Today' ? 'active' : ''}`}
                  onClick={() => setActivityTab('Today')}
                >
                  Today
                </button>
                <button
                  type="button"
                  className={`appr-timeline-tab ${activityTab === 'Yesterday' ? 'active' : ''}`}
                  onClick={() => setActivityTab('Yesterday')}
                >
                  Yesterday
                </button>
                <button
                  type="button"
                  className={`appr-timeline-tab ${activityTab === 'This Week' ? 'active' : ''}`}
                  onClick={() => setActivityTab('This Week')}
                >
                  This Week
                </button>
              </div>
            </div>

            <div className="appr-timeline-body">
              {activities
                .filter((act) => act.timestamp === activityTab)
                .map((act) => {
                  let timelineIcon = <Clock size={15} className="text-orange" />;
                  let timelineClass = 'timeline-circle-orange';
                  if (act.action === 'approved') {
                    timelineIcon = <Check size={14} className="text-green" />;
                    timelineClass = 'timeline-circle-green';
                  } else if (act.action === 'rejected') {
                    timelineIcon = <X size={14} className="text-red" />;
                    timelineClass = 'timeline-circle-red';
                  }

                  return (
                    <div key={act.id} className="appr-timeline-row">
                      <div className={`appr-timeline-icon-wrap ${timelineClass}`}>
                        {timelineIcon}
                      </div>
                      <div className="appr-timeline-content">
                        <div className="appr-timeline-meta-row">
                          <span className="appr-timeline-meta-title">
                            <strong>{act.customerName}</strong> approval request {act.action}
                          </span>
                          <span className="appr-timeline-meta-time">
                            {act.time}
                          </span>
                        </div>
                        <p className="appr-timeline-desc">{act.details}</p>
                        <span className="appr-timeline-actor">by {act.actorName}</span>
                      </div>
                    </div>
                  );
                })}
            </div>
            
            <div className="appr-timeline-footer">
              <button type="button" className="btn-view-all-activity">View all activity</button>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL (APPROVAL DETAILS) */}
        {currentDetails && (
          <div className="appr-right-panel">
            <div className="appr-right-header">
              <h3 className="appr-right-title">Approval Details</h3>
              <button type="button" className="btn-close-right" title="Close Panel">
                <X size={18} />
              </button>
            </div>

            <div className="appr-right-body">
              {/* Profile card */}
              <div className="appr-profile-widget">
                <div className="appr-profile-top-row">
                  <div className={`appr-profile-avatar ${currentDetails.avatarColorClass}`}>
                    {currentDetails.initials}
                  </div>
                  <div className="appr-profile-name-group">
                    <div className="appr-profile-name-row">
                      <h4 className="appr-profile-name">{currentDetails.customerName}</h4>
                      <span className="appr-profile-active-pill">
                        <span className="conv-status-green-dot" />
                        <span>Active</span>
                      </span>
                    </div>
                    <span className="appr-profile-phone">{currentDetails.phone}</span>
                  </div>
                </div>

                <div className="appr-profile-details-grid">
                  <div className="appr-profile-grid-cell">
                    <span className="appr-profile-grid-label">Lead Score</span>
                    <span className="appr-profile-grid-score">{currentDetails.leadScore}</span>
                  </div>
                  <div className="appr-profile-grid-cell">
                    <span className="appr-profile-grid-label">Source</span>
                    <span className="appr-profile-grid-text">{currentDetails.source}</span>
                  </div>
                  <div className="appr-profile-grid-cell col-span-2">
                    <span className="appr-profile-grid-label">Assigned To</span>
                    <div className="appr-profile-assigned">
                      <div className="appr-profile-assigned-img-wrap">
                        <Image
                          src={currentDetails.assignedTo.avatarUrl}
                          alt={currentDetails.assignedTo.name}
                          width={20}
                          height={20}
                          className="appr-profile-assigned-img"
                        />
                      </div>
                      <span className="appr-profile-assigned-name">{currentDetails.assignedTo.name}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conversation Summary */}
              <div className="appr-section-block">
                <h4 className="appr-section-title">Conversation Summary</h4>
                <div className="appr-summary-text-box">
                  {currentDetails.conversationSummary.map((sentence, idx) => (
                    <p key={idx} className="appr-summary-sentence">{sentence}</p>
                  ))}
                </div>
              </div>

              {/* AI Generated Reply */}
              <div className="appr-section-block">
                <h4 className="appr-section-title">AI Generated Reply</h4>
                <div className="appr-reply-speech-bubble">
                  <p className="appr-bubble-content">{currentDetails.aiGeneratedReply}</p>
                </div>
              </div>

              {/* Reason for Approval */}
              <div className="appr-section-block">
                <div className="appr-section-title-row">
                  <h4 className="appr-section-title font-bold">Reason for Approval</h4>
                  <span className={`appr-priority-badge ${currentDetails.priority === 'High' ? 'badge-priority-high' : 'badge-priority-medium'}`}>
                    {currentDetails.priority}
                  </span>
                </div>
                <p className="appr-reason-desc-text">
                  {currentDetails.reason === 'Pricing shared by AI' 
                    ? 'Pricing shared by AI requires human approval as it contains sensitive information.'
                    : currentDetails.reason === 'Brochure request detected'
                    ? 'AI wants to send project brochures which requires marketing clearance.'
                    : 'AI recommended scheduling site visit outside normal office hours.'
                  }
                </p>
              </div>

              {/* Knowledge Used */}
              <div className="appr-section-block">
                <h4 className="appr-section-title">Knowledge Used</h4>
                <div className="appr-knowledge-links-list">
                  {currentDetails.knowledgeUsed.map((doc, idx) => (
                    <div key={idx} className="appr-knowledge-doc-row">
                      <FileText size={16} className="appr-doc-icon" />
                      <span className="appr-doc-name">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Confidence Score progress bar */}
              <div className="appr-section-block">
                <div className="appr-section-title-row">
                  <h4 className="appr-section-title">Confidence Score</h4>
                  <span className="appr-score-ratio-text">{currentDetails.confidenceScore} / 100</span>
                </div>
                <div className="appr-progress-bar-track">
                  <div
                    className="appr-progress-bar-fill fill-green"
                    style={{ width: `${currentDetails.confidenceScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons Footer */}
            <div className="appr-right-footer">
              <div className="appr-footer-buttons-row">
                <button
                  type="button"
                  onClick={() => setIsApproveConfirmOpen(true)}
                  className="btn-right-action btn-approve-solid"
                >
                  <CheckCircle size={15} />
                  <span>Approve</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRejectReason('');
                    setIsRejectOpen(true);
                  }}
                  className="btn-right-action btn-reject-outline"
                >
                  <XCircle size={15} />
                  <span>Reject</span>
                </button>
              </div>

              <div className="appr-footer-buttons-row">
                <button
                  type="button"
                  onClick={() => {
                    setEditText(currentDetails.aiGeneratedReply);
                    setIsEditOpen(true);
                  }}
                  className="btn-right-action btn-white-action"
                >
                  <FileText size={15} />
                  <span>Edit & Send</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsAssignOpen(true)}
                  className="btn-right-action btn-white-action"
                >
                  <UserPlus size={15} />
                  <span>Assign to Sales</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsPauseOpen(true)}
                className="btn-right-action btn-white-action btn-full-width"
              >
                <PauseCircle size={15} />
                <span>Pause AI</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* ==============================================
          MODALS & DIALOGS
          ============================================== */}

      {/* 1. APPROVE CONFIRMATION MODAL */}
      {isApproveConfirmOpen && currentDetails && (
        <div className="appr-modal-overlay">
          <div className="appr-modal-card">
            <div className="appr-modal-header">
              <h3 className="appr-modal-title">Approve AI Message</h3>
              <button type="button" onClick={() => setIsApproveConfirmOpen(false)} className="btn-close-modal">
                <X size={18} />
              </button>
            </div>
            <div className="appr-modal-body">
              <p>Are you sure you want to approve and send this reply to <strong>{currentDetails.customerName}</strong> via WhatsApp?</p>
              <div className="appr-modal-preview-box">
                <p className="appr-preview-box-text">{currentDetails.aiGeneratedReply}</p>
              </div>
            </div>
            <div className="appr-modal-footer">
              <button
                type="button"
                onClick={async () => {
                  await approveApproval(currentDetails.id);
                  setIsApproveConfirmOpen(false);
                }}
                className="btn-modal-primary"
              >
                Approve & Send
              </button>
              <button type="button" onClick={() => setIsApproveConfirmOpen(false)} className="btn-modal-cancel">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. REJECT MODAL */}
      {isRejectOpen && currentDetails && (
        <div className="appr-modal-overlay">
          <div className="appr-modal-card">
            <div className="appr-modal-header">
              <h3 className="appr-modal-title">Reject AI Message</h3>
              <button type="button" onClick={() => setIsRejectOpen(false)} className="btn-close-modal">
                <X size={18} />
              </button>
            </div>
            <div className="appr-modal-body">
              <p>Please provide a reason for rejecting the AI generated response for <strong>{currentDetails.customerName}</strong>. This is required and will pause the AI autopilot.</p>
              <textarea
                placeholder="Type rejection reason (e.g. Information already provided, Incorrect pricing, etc.)..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="appr-modal-textarea"
                rows={3}
              />
            </div>
            <div className="appr-modal-footer">
              <button
                type="button"
                disabled={!rejectReason.trim()}
                onClick={async () => {
                  await rejectApproval(currentDetails.id, rejectReason);
                  setIsRejectOpen(false);
                }}
                className="btn-modal-danger"
              >
                Reject Response
              </button>
              <button type="button" onClick={() => setIsRejectOpen(false)} className="btn-modal-cancel">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. EDIT REPLY MODAL */}
      {isEditOpen && currentDetails && (
        <div className="appr-modal-overlay">
          <div className="appr-modal-card modal-large">
            <div className="appr-modal-header">
              <h3 className="appr-modal-title">Edit Reply</h3>
              <button type="button" onClick={() => setIsEditOpen(false)} className="btn-close-modal">
                <X size={18} />
              </button>
            </div>
            <div className="appr-modal-body">
              <p>Customize the reply message before sending it to <strong>{currentDetails.customerName}</strong> via WhatsApp. You can insert template variables.</p>
              
              <div className="appr-variable-chips-row">
                <button type="button" onClick={() => handleInsertVariable('{{LeadName}}')} className="btn-variable-chip">
                  {"{{LeadName}}"}
                </button>
                <button type="button" onClick={() => handleInsertVariable('{{Project}}')} className="btn-variable-chip">
                  {"{{Project}}"}
                </button>
                <button type="button" onClick={() => handleInsertVariable('{{Budget}}')} className="btn-variable-chip">
                  {"{{Budget}}"}
                </button>
                <button type="button" onClick={() => handleInsertVariable('{{SalesName}}')} className="btn-variable-chip">
                  {"{{SalesName}}"}
                </button>
              </div>

              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="appr-modal-textarea font-mono"
                rows={8}
              />
            </div>
            <div className="appr-modal-footer">
              <button
                type="button"
                onClick={async () => {
                  await editAndSendApproval(currentDetails.id, editText);
                  setIsEditOpen(false);
                }}
                className="btn-modal-primary"
              >
                Send Message
              </button>
              <button type="button" onClick={() => setIsEditOpen(false)} className="btn-modal-cancel">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. ASSIGN SALES MODAL */}
      {isAssignOpen && currentDetails && (
        <div className="appr-modal-overlay">
          <div className="appr-modal-card">
            <div className="appr-modal-header">
              <h3 className="appr-modal-title">Assign to Sales Executive</h3>
              <button type="button" onClick={() => setIsAssignOpen(false)} className="btn-close-modal">
                <X size={18} />
              </button>
            </div>
            <div className="appr-modal-body">
              <p>Re-assign this lead and conversation review to a sales salesperson.</p>
              <div className="appr-sales-list">
                <div
                  onClick={async () => {
                    await assignSalesperson(currentDetails.id, 'sales-1', 'Neha Singh');
                    setIsAssignOpen(false);
                  }}
                  className="appr-sales-item"
                >
                  <div className="appr-sales-avatar">
                    <Image
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
                      alt="Neha"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  </div>
                  <div className="appr-sales-meta">
                    <span className="appr-sales-name">Neha Singh</span>
                    <span className="appr-sales-workload">4 active leads • Available</span>
                  </div>
                </div>

                <div
                  onClick={async () => {
                    await assignSalesperson(currentDetails.id, 'sales-2', 'Amit Kumar');
                    setIsAssignOpen(false);
                  }}
                  className="appr-sales-item"
                >
                  <div className="appr-sales-avatar">
                    <Image
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&auto=format&fit=crop&q=80"
                      alt="Amit"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  </div>
                  <div className="appr-sales-meta">
                    <span className="appr-sales-name">Amit Kumar</span>
                    <span className="appr-sales-workload">6 active leads • Busy</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="appr-modal-footer">
              <button type="button" onClick={() => setIsAssignOpen(false)} className="btn-modal-cancel btn-full-width">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. PAUSE AI AGENT CONFIRMATION MODAL */}
      {isPauseOpen && currentDetails && (
        <div className="appr-modal-overlay">
          <div className="appr-modal-card">
            <div className="appr-modal-header">
              <h3 className="appr-modal-title">Pause AI Agent</h3>
              <button type="button" onClick={() => setIsPauseOpen(false)} className="btn-close-modal">
                <X size={18} />
              </button>
            </div>
            <div className="appr-modal-body">
              <p>Are you sure you want to pause the AI autopilot agent for <strong>{currentDetails.customerName}</strong>? The agent will stop responding and you will need to manually handle all messages.</p>
            </div>
            <div className="appr-modal-footer">
              <button
                type="button"
                onClick={async () => {
                  await pauseAiAgent(currentDetails.id);
                  setIsPauseOpen(false);
                }}
                className="btn-modal-danger"
              >
                Pause AI Agent
              </button>
              <button type="button" onClick={() => setIsPauseOpen(false)} className="btn-modal-cancel">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </PageContainer>
  );
};
