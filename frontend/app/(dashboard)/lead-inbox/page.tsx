'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { LeadInboxHeaderActions } from '@/components/lead-inbox/LeadInboxHeaderActions';
import { LeadFiltersBar } from '@/components/lead-inbox/LeadFiltersBar';
import { LeadInboxTable } from '@/components/lead-inbox/LeadInboxTable';
import { LeadPreviewDrawer } from '@/components/lead-inbox/LeadPreviewDrawer';
import { ManualLeadModal } from '@/components/lead-inbox/ManualLeadModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { Pagination } from '@/components/ui/Pagination';
import { useLeadEngine } from '@/hooks/useLeadEngine';
import { Lead, LeadStatus } from '@/types/lead.types';
import { Inbox, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LeadInboxPage() {
  const {
    leads,
    isLoading,
    fetchLeads,
    updateStatus,
    assignLead,
    softDelete,
  } = useLeadEngine();

  const [hasError, setHasError] = useState<boolean>(false);

  // Selection & Modal States
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Filter & Pagination States
  const [search, setSearch] = useState<string>('');
  const [source, setSource] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [project, setProject] = useState<string>('');
  const [salesUser, setSalesUser] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const loadData = useCallback(async () => {
    setHasError(false);
    try {
      await fetchLeads({
        search: search || undefined,
        source: (source as Lead['source']) || undefined,
        status: (status as Lead['status']) || undefined,
        project: project || undefined,
        assignedSalesUser: salesUser || undefined,
        page,
        limit: 15,
      });
    } catch {
      setHasError(true);
    }
  }, [fetchLeads, search, source, status, project, salesUser, page]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSelectLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsPreviewOpen(true);
  };

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    await updateStatus(leadId, newStatus);
    loadData();
  };

  const handleDelete = async (leadId: string) => {
    if (confirm('Are you sure you want to archive/delete this lead?')) {
      await softDelete(leadId);
      if (selectedLead?.id === leadId) {
        setIsPreviewOpen(false);
      }
      loadData();
    }
  };

  const handleAssign = async (leadId: string) => {
    const salesUserId = prompt('Enter Sales Executive User ID to assign:');
    if (salesUserId) {
      await assignLead(leadId, salesUserId);
      loadData();
    }
  };

  return (
    <PageContainer
      title="Lead Inbox"
      subtitle="Monitor all incoming AI-powered leads from every connected source."
      action={
        <LeadInboxHeaderActions
          onAddLead={() => setIsModalOpen(true)}
          onImportCSV={() => toast.success('CSV Import modal triggered')}
          onExport={() => toast.success('Lead export generated!')}
          onRefresh={loadData}
          isRefreshing={isLoading}
        />
      }
    >
      {/* Top Multi-Filter Bar */}
      <LeadFiltersBar
        search={search}
        source={source}
        status={status}
        project={project}
        salesUser={salesUser}
        onSearchChange={(val) => { setSearch(val); setPage(1); }}
        onSourceChange={(val) => { setSource(val); setPage(1); }}
        onStatusChange={(val) => { setStatus(val); setPage(1); }}
        onProjectChange={(val) => { setProject(val); setPage(1); }}
        onSalesUserChange={(val) => { setSalesUser(val); setPage(1); }}
        onReset={() => {
          setSearch('');
          setSource('');
          setStatus('');
          setProject('');
          setSalesUser('');
          setPage(1);
        }}
      />

      {/* Error Alert State */}
      {hasError ? (
        <ErrorBanner
          title="Lead Fetch Failure"
          message="Failed to connect to lead service. Please verify your connection."
          onRetry={loadData}
        />
      ) : null}

      {/* Main Content Table / Empty State */}
      {!isLoading && leads.length === 0 && !hasError ? (
        <EmptyState
          icon={<Inbox size={48} className="text-muted" />}
          title="No Ingested Leads Found"
          description="Your connected lead sources will appear here as soon as leads are ingested."
          action={
            <button className="btn btn-primary" onClick={() => toast.success('Redirecting to Meta Lead Ads connection...')}>
              <Share2 size={16} />
              Connect Facebook Lead Ads
            </button>
          }
        />
      ) : (
        <>
          <LeadInboxTable
            leads={leads}
            selectedLeadId={selectedLead?.id}
            isLoading={isLoading}
            onSelectLead={handleSelectLead}
            onStatusChange={handleStatusChange}
            onAssign={handleAssign}
            onToggleAi={(id) => toast.success(`Toggled AI automation for lead ${id}`)}
            onDelete={handleDelete}
          />

          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} />
          </div>
        </>
      )}

      {/* Slide-Over Right Preview Drawer */}
      <LeadPreviewDrawer
        lead={selectedLead}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onAssign={handleAssign}
      />

      {/* Add Manual Lead Modal */}
      <ManualLeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadData}
      />
    </PageContainer>
  );
}
