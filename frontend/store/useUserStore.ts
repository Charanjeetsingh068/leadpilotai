import { create } from 'zustand';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  avatarUrl: string;
  status: 'ONLINE' | 'AWAY' | 'OFFLINE';
}

interface UserState {
  profile: UserProfile;
  isProfileMenuOpen: boolean;
  toggleProfileMenu: () => void;
  closeProfileMenu: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: {
    id: 'user-arjun-01',
    name: 'Arjun Mehta',
    email: 'arjun.mehta@acmerealty.com',
    role: 'Client Admin',
    phone: '+91 98765 43210',
    avatarUrl: '/images/settings/profile-avatar.svg',
    status: 'ONLINE',
  },
  isProfileMenuOpen: false,

  toggleProfileMenu: () => set((state) => ({ isProfileMenuOpen: !state.isProfileMenuOpen })),
  closeProfileMenu: () => set({ isProfileMenuOpen: false }),

  updateProfile: (data) =>
    set((state) => ({
      profile: { ...state.profile, ...data },
    })),
}));
