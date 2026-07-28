import { create } from 'zustand';
import { Lead, LeadFilterParams, TimelineEvent, LeadNote } from '@/types/lead.types';

export type DrawerTabType = 'details' | 'conversation' | 'activity' | 'notes';

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface LeadState {
  leads: Lead[];
  activeLead: Lead | null;
  selectedLeadIds: string[];
  activeTimeline: TimelineEvent[];
  activeNotes: LeadNote[];
  activeConversation: any[];
  filters: LeadFilterParams;
  pagination: PaginationMeta;
  isLoading: boolean;
  isDrawerLoading: boolean;
  isDrawerOpen: boolean;
  activeDrawerTab: DrawerTabType;

  setLeads: (leads: Lead[]) => void;
  setActiveLead: (lead: Lead | null) => void;
  setSelectedLeadIds: (ids: string[]) => void;
  toggleSelectLead: (id: string) => void;
  selectAllLeads: (allIds: string[]) => void;
  clearSelection: () => void;
  setActiveTimeline: (timeline: TimelineEvent[]) => void;
  setActiveNotes: (notes: LeadNote[]) => void;
  setActiveConversation: (conversation: any[]) => void;
  appendNote: (note: LeadNote) => void;
  setFilters: (filters: Partial<LeadFilterParams>) => void;
  resetFilters: () => void;
  setPagination: (meta: Partial<PaginationMeta>) => void;
  setLoading: (isLoading: boolean) => void;
  setDrawerLoading: (isLoading: boolean) => void;
  setDrawerOpen: (isOpen: boolean) => void;
  setActiveDrawerTab: (tab: DrawerTabType) => void;
}

const initialFilters: LeadFilterParams = {
  page: 1,
  limit: 10,
  search: '',
  source: undefined,
  status: undefined,
  project: undefined,
  assignedSalesUser: undefined,
};

export const useLeadStore = create<LeadState>((set) => ({
  leads: [],
  activeLead: null,
  selectedLeadIds: [],
  activeTimeline: [],
  activeNotes: [],
  activeConversation: [],
  filters: initialFilters,
  pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
  isLoading: false,
  isDrawerLoading: false,
  isDrawerOpen: false,
  activeDrawerTab: 'details',

  setLeads: (leads) => set({ leads }),
  setActiveLead: (activeLead) => set({ activeLead }),
  setSelectedLeadIds: (selectedLeadIds) => set({ selectedLeadIds }),
  toggleSelectLead: (id) =>
    set((state) => ({
      selectedLeadIds: state.selectedLeadIds.includes(id)
        ? state.selectedLeadIds.filter((item) => item !== id)
        : [...state.selectedLeadIds, id],
    })),
  selectAllLeads: (allIds) =>
    set((state) => ({
      selectedLeadIds: state.selectedLeadIds.length === allIds.length ? [] : allIds,
    })),
  clearSelection: () => set({ selectedLeadIds: [] }),

  setActiveTimeline: (activeTimeline) => set({ activeTimeline }),
  setActiveNotes: (activeNotes) => set({ activeNotes }),
  setActiveConversation: (activeConversation) => set({ activeConversation }),
  appendNote: (note) => set((state) => ({ activeNotes: [note, ...state.activeNotes] })),

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters, page: newFilters.page ?? 1 },
    })),
  resetFilters: () => set({ filters: initialFilters }),
  setPagination: (meta) => set((state) => ({ pagination: { ...state.pagination, ...meta } })),

  setLoading: (isLoading) => set({ isLoading }),
  setDrawerLoading: (isDrawerLoading) => set({ isDrawerLoading }),
  setDrawerOpen: (isDrawerOpen) => set({ isDrawerOpen }),
  setActiveDrawerTab: (activeDrawerTab) => set({ activeDrawerTab }),
}));
