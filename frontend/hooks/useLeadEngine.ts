import { useCallback } from 'react';
import { useLeadStore } from '@/store/useLeadStore';
import { LeadService } from '@/services/lead.service';
import { LeadStatus, LeadFilterParams } from '@/types/lead.types';
import toast from 'react-hot-toast';

export const useLeadEngine = () => {
  const {
    leads,
    activeLead,
    activeTimeline,
    activeNotes,
    filters,
    isLoading,
    setLeads,
    setActiveLead,
    setActiveTimeline,
    setActiveNotes,
    appendNote,
    setFilters,
    setLoading,
  } = useLeadStore();

  const fetchLeads = useCallback(
    async (params?: Partial<LeadFilterParams>) => {
      setLoading(true);
      const combinedParams = { ...filters, ...params };
      try {
        const res = await LeadService.getLeads(combinedParams);
        if (res.success && res.data) {
          setLeads(res.data);
        }
      } catch {
        toast.error('Failed to fetch leads.');
      } finally {
        setLoading(false);
      }
    },
    [filters, setLeads, setLoading]
  );

  const fetchLeadDetails = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        const res = await LeadService.getLeadById(id);
        if (res.success && res.data) {
          setActiveLead(res.data);
          if (res.data.timeline) setActiveTimeline(res.data.timeline);
          if (res.data.notes) setActiveNotes(res.data.notes);
        }
      } catch {
        toast.error('Failed to load lead details.');
      } finally {
        setLoading(false);
      }
    },
    [setActiveLead, setActiveNotes, setActiveTimeline, setLoading]
  );

  const updateStatus = async (id: string, status: LeadStatus) => {
    try {
      await LeadService.updateLeadStatus(id, status);
      toast.success(`Status updated to ${status}`);
      fetchLeads();
    } catch {
      toast.error('Failed to update status.');
    }
  };

  const assignLead = async (id: string, salesUserId: string, reason?: string) => {
    try {
      await LeadService.assignLead(id, salesUserId, reason);
      toast.success('Lead assigned successfully!');
      fetchLeads();
    } catch {
      toast.error('Failed to assign lead.');
    }
  };

  const addNote = async (id: string, noteText: string) => {
    try {
      const res = await LeadService.addNote(id, noteText);
      if (res.success && res.data) {
        appendNote(res.data);
        toast.success('Note added!');
      }
    } catch {
      toast.error('Failed to add note.');
    }
  };

  const softDelete = async (id: string) => {
    try {
      await LeadService.softDeleteLead(id);
      toast.success('Lead archived/deleted.');
      fetchLeads();
    } catch {
      toast.error('Failed to delete lead.');
    }
  };

  return {
    leads,
    activeLead,
    activeTimeline,
    activeNotes,
    filters,
    isLoading,
    fetchLeads,
    fetchLeadDetails,
    updateStatus,
    assignLead,
    addNote,
    softDelete,
    setFilters,
  };
};
