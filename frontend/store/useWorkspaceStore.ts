import { create } from 'zustand';

export interface WorkspaceItem {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
}

interface WorkspaceState {
  currentWorkspace: WorkspaceItem;
  workspaces: WorkspaceItem[];
  isDropdownOpen: boolean;
  setWorkspaces: (workspaces: WorkspaceItem[]) => void;
  switchWorkspace: (workspaceId: string) => void;
  toggleDropdown: () => void;
  closeDropdown: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  currentWorkspace: {
    id: 'ws-acme-01',
    name: 'Acme Real Estate',
    role: 'Client Admin',
  },
  workspaces: [
    { id: 'ws-acme-01', name: 'Acme Real Estate', role: 'Client Admin' },
    { id: 'ws-skyline-02', name: 'Skyline Ventures', role: 'Client Admin' },
    { id: 'ws-urban-03', name: 'Urban Living Group', role: 'Sales Lead' },
  ],
  isDropdownOpen: false,

  setWorkspaces: (workspaces) => set({ workspaces }),

  switchWorkspace: (workspaceId) => {
    const selected = get().workspaces.find((w) => w.id === workspaceId);
    if (selected) {
      set({ currentWorkspace: selected, isDropdownOpen: false });
    }
  },

  toggleDropdown: () => set((state) => ({ isDropdownOpen: !state.isDropdownOpen })),
  closeDropdown: () => set({ isDropdownOpen: false }),
}));
