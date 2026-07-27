import { create } from 'zustand';
import { Lead, LeadFilterParams, TimelineEvent, LeadNote } from '@/types/lead.types';

interface LeadState {
  leads: Lead[];
  activeLead: Lead | null;
  activeTimeline: TimelineEvent[];
  activeNotes: LeadNote[];
  filters: LeadFilterParams;
  isLoading: boolean;

  setLeads: (leads: Lead[]) => void;
  setActiveLead: (lead: Lead | null) => void;
  setActiveTimeline: (timeline: TimelineEvent[]) => void;
  setActiveNotes: (notes: LeadNote[]) => void;
  appendNote: (note: LeadNote) => void;
  setFilters: (filters: Partial<LeadFilterParams>) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useLeadStore = create<LeadState>((set) => ({
  leads: [],
  activeLead: null,
  activeTimeline: [],
  activeNotes: [],
  filters: { page: 1, limit: 20 },
  isLoading: false,

  setLeads: (leads) => set({ leads }),
  setActiveLead: (activeLead) => set({ activeLead }),
  setActiveTimeline: (activeTimeline) => set({ activeTimeline }),
  setActiveNotes: (activeNotes) => set({ activeNotes }),
  appendNote: (note) => set((state) => ({ activeNotes: [note, ...state.activeNotes] })),
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
  setLoading: (isLoading) => set({ isLoading }),
}));
