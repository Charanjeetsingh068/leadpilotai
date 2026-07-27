export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    LOGOUT: '/auth/logout',
  },
  LEADS: {
    BASE: '/leads',
    BY_ID: (id: string) => `/leads/${id}`,
    STATUS: (id: string) => `/leads/${id}/status`,
  },
  CONVERSATIONS: {
    BASE: '/conversations',
    MESSAGES: (id: string) => `/conversations/${id}/messages`,
    AI_TOGGLE: (id: string) => `/conversations/${id}/ai-toggle`,
  },
  KNOWLEDGE: {
    BASE: '/knowledge',
    UPLOAD: '/knowledge/upload',
    BY_ID: (id: string) => `/knowledge/${id}`,
  },
  SETTINGS: {
    BASE: '/settings',
  },
} as const;
