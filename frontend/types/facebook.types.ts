export interface FacebookConnectionStatus {
  status: 'Connected' | 'Warning' | 'Disconnected';
  connectedBy: string;
  connectedTime: string;
  tokenExpiry: string;
  lastRefresh: string;
  isExpired: boolean;
}

export interface FacebookAccountItem {
  id: string;
  accountName: string;
  fbUserId: string;
  fbUserEmail?: string;
  avatarUrl?: string;
  businessManagerName?: string;
  businessManagerId?: string;
  connectedByUser: {
    id: string;
    name: string;
    email: string;
    roleName?: string;
  };
  tokenStatus: 'Active' | 'Expired' | 'Revoked' | 'Warning';
  lastSync: string;
  tokenExpiry: string;
  pagesCount: number;
  formsCount: number;
}

export interface FacebookBusinessItem {
  id: string;
  businessId: string;
  name: string;
  verificationStatus?: string;
  accessLevel?: string;
  hasFullAccess: boolean;
}

export interface FacebookPageItem {
  id: string;
  pageId: string;
  name: string;
  category?: string;
  pictureUrl?: string;
  followersCount: number;
  status: 'Active' | 'Inactive' | 'Disconnected';
  webhookStatus: 'Active' | 'Inactive' | 'Error';
  assignedAiAgent?: {
    id: string;
    name: string;
    agentCode?: string;
  };
  ownerName?: string;
}

export interface FacebookFormItem {
  id: string;
  formId: string;
  name: string;
  pageName: string;
  pageId: string;
  facebookPage?: {
    id?: string;
    name?: string;
    pageId?: string;
  };
  campaign?: string;
  leadCount: number;
  status: 'Active' | 'Inactive';
  isActive: boolean;
  lastSync: string;
  assignedAiAgent?: {
    id: string;
    name: string;
  };
}

export interface FacebookPermissionItem {
  id: string;
  permission: string;
  description: string;
  status: 'Granted' | 'Missing' | 'Expired' | 'Needs Review';
}

export interface WebhookHealthData {
  id: string;
  webhookUrl: string;
  verifyToken: string;
  status: 'Active' | 'Inactive' | 'Degraded';
  lastEventTime: string;
  successRate7d: number;
  failedEvents7d: number;
  retryQueueCount: number;
}

export interface LiveActivityItem {
  id: string;
  title: string;
  description: string;
  timeAgo: string;
  timestamp: string;
  type: 'lead' | 'form' | 'page' | 'account' | 'webhook' | 'token';
}

export interface DashboardMetrics {
  connectedAccounts: number;
  activeAccounts: number;
  connectedPages: number;
  activePages: number;
  connectedForms: number;
  activeForms: number;
  todayLeads: number;
  leadsTrendPercentage: number;
  syncSuccessRate: number;
  syncSuccessTrend: number;
  apiUsageCalls: number;
  apiUsageLimit: number;
  apiUsagePercentage: number;
  webhookSuccessRate: number;
  duplicateLeadsCount: number;
  syncErrorsCount: number;
  failedEventsCount: number;
}

export interface DashboardData {
  connection: FacebookConnectionStatus;
  accounts: FacebookAccountItem[];
  totalAccounts: number;
  businesses: FacebookBusinessItem[];
  selectedBusinessId: string;
  pages: FacebookPageItem[];
  totalPages: number;
  forms: FacebookFormItem[];
  totalForms: number;
  permissions: FacebookPermissionItem[];
  webhookHealth: WebhookHealthData;
  recentEvents: LiveActivityItem[];
  metrics: DashboardMetrics;
}
