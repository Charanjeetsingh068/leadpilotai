import { create } from 'zustand';

interface UIState {
  isSidebarCollapsed: boolean;
  activeModal: string | null;
  activeDrawer: string | null;

  toggleSidebar: () => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
  openDrawer: (drawerId: string) => void;
  closeDrawer: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarCollapsed: false,
  activeModal: null,
  activeDrawer: null,

  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  openModal: (activeModal) => set({ activeModal }),
  closeModal: () => set({ activeModal: null }),
  openDrawer: (activeDrawer) => set({ activeDrawer }),
  closeDrawer: () => set({ activeDrawer: null }),
}));
