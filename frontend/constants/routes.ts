export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  LEAD_INBOX: '/lead-inbox',
  LEAD_DETAIL: (id: string) => `/lead/${id}`,
  CONVERSATION_DETAIL: (id: string) => `/conversation/${id}`,
  APPROVALS: '/approvals',
  SITE_VISITS: '/site-visits',
  KNOWLEDGE_BASE: '/knowledge-base',
  REPORTS: '/reports',
  SETTINGS: '/settings',
} as const;
