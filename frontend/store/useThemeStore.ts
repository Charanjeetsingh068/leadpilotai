import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark';

interface ThemeState {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  initTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'light',

  toggleTheme: () => {
    const nextTheme: ThemeMode = get().theme === 'light' ? 'dark' : 'light';
    get().setTheme(nextTheme);
  },

  setTheme: (theme: ThemeMode) => {
    set({ theme });
    if (typeof window !== 'undefined') {
      localStorage.setItem('leadpilot_theme', theme);
      if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    }
  },

  initTheme: () => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('leadpilot_theme') as ThemeMode | null;
      if (savedTheme === 'dark' || savedTheme === 'light') {
        get().setTheme(savedTheme);
      } else {
        get().setTheme('light');
      }
    }
  },
}));
