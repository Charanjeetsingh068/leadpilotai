import { create } from 'zustand';
import { User, UserRole } from '@/types/user.types';
import { AuthService } from '@/services/auth.service';
import { LoginCredentials } from '@/types/auth.types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  role: UserRole | null;
  permissions: string[];
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;

  setAuth: (user: User, accessToken: string, permissions?: string[]) => void;
  setAccessToken: (accessToken: string) => void;
  clearAuth: () => void;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
  hasRole: (allowedRoles: UserRole[]) => boolean;
  hasPermission: (requiredPermission: string) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  role: null,
  permissions: [],
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,

  setAuth: (user, accessToken, permissions = []) =>
    set({
      user,
      accessToken,
      role: user.role,
      permissions,
      isAuthenticated: true,
      isLoading: false,
      isInitialized: true,
    }),

  setAccessToken: (accessToken) => set({ accessToken }),

  clearAuth: () =>
    set({
      user: null,
      accessToken: null,
      role: null,
      permissions: [],
      isAuthenticated: false,
      isLoading: false,
      isInitialized: true,
    }),

  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const res = await AuthService.login(credentials);
      if (res.success && res.data) {
        set({
          user: res.data.user,
          accessToken: res.data.accessToken,
          role: res.data.user.role,
          isAuthenticated: true,
          isLoading: false,
          isInitialized: true,
        });
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await AuthService.logout();
    } catch {
      // Ignore errors on logout
    } finally {
      get().clearAuth();
    }
  },

  fetchCurrentUser: async () => {
    set({ isLoading: true });
    try {
      const res = await AuthService.getCurrentUser();
      if (res.success && res.data) {
        set({
          user: res.data,
          role: res.data.role,
          isAuthenticated: true,
          isLoading: false,
          isInitialized: true,
        });
      }
    } catch {
      get().clearAuth();
    }
  },

  hasRole: (allowedRoles) => {
    const currentRole = get().role;
    return currentRole ? allowedRoles.includes(currentRole) : false;
  },

  hasPermission: (requiredPermission) => {
    return get().permissions.includes(requiredPermission);
  },
}));
