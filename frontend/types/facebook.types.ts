export interface FacebookConnectionStatus {
  status: 'NOT_CONNECTED' | 'CONNECTING' | 'CONNECTED' | 'TOKEN_EXPIRED' | 'PERMISSION_MISSING' | 'SYNC_FAILED' | 'RECONNECT_REQUIRED' | 'Connected' | 'Warning' | 'Disconnected' | 'Active';
  isConnected?: boolean;
  connectedBy: string | null;
  email?: string | null;
  connectedTime?: string | null;
  tokenExpiry?: string | null;
  lastRefresh?: string | null;
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
  businesses?: any[];
  user?: {
    id: string;
    name: string;
    email: string;
    role?: { name: string };
  };
  connectedByUser?: {
    id: string;
    name: string;
    email: string;
    roleName?: string;
  };
  tokenStatus: string;
  lastSync?: string;
  lastSyncAt?: string;
  tokenExpiry?: string;
  tokenExpiresAt?: string;
  pagesCount?: number;
  formsCount?: number;
}

export interface FacebookBusinessItem {
  id: string;
  businessId: string;
  name: string;
  verificationStatus?: string;
  verification?: string;
  accessLevel?: string;
  hasFullAccess?: boolean;
  ownedPagesCount?: number;
  ownedInstagramCount?: number;
  ownedWhatsAppCount?: number;
}

export interface FacebookPageItem {
  id: string;
  pageId: string;
  name: string;
  category?: string;
  pictureUrl?: string;
  followersCount: number;
  leadFormsCount?: number;
  status: 'Active' | 'Inactive' | 'Disconnected';
  syncStatus?: 'Synced' | 'Syncing' | 'Pending' | 'Error';
  webhookStatus: 'Active' | 'Inactive' | 'Error';
  assignedAiAgent?: {
    id: string;
    name: string;
    agentCode?: string;
  };
  ownerName?: string;
  lastSync?: string;
}

export interface InstagramAccountItem {
  id: string;
  instagramId: string;
  username: string;
  name?: string;
  profilePictureUrl?: string;
  followersCount: number;
  businessConnected: boolean;
  messagingEnabled: boolean;
  webhookEnabled: boolean;
  status: 'Active' | 'Inactive';
}

export interface WhatsAppAccountItem {
  id: string;
  wabaId: string;
  name: string;
  phoneNumber: string;
  phoneNumberId?: string;
  qualityRating: 'High' | 'Medium' | 'Low' | 'GREEN' | 'YELLOW' | 'RED';
  webhookActive: boolean;
  templatesCount: number;
  messagingStatus: 'Active' | 'Inactive' | 'Connected';
  status: 'Connected' | 'Disconnected';
}

export interface FacebookFormItem {
  id: string;
  formId: string;
  name: string;
  pageName?: string;
  associatedPage?: string;
  pageId?: string;
  facebookPage?: {
    id?: string;
    name?: string;
    pageId?: string;
  };
  campaign?: string;
  leadCount: number;
  leadsToday?: number;
  leadsTotal?: number;
  status: 'Active' | 'Inactive';
  isActive: boolean;
  webhookActive?: boolean;
  lastSync?: string;
  assignedAiAgent?: {
    id: string;
    name: string;
  };
}

export interface FacebookPermissionItem {
  id: string;
  permission: string;
  description: string;
  status: 'Granted' | 'Missing' | 'Warning' | 'Expired' | 'Needs Review';
}

export interface WebhookHealthData {
  id: string;
  webhookUrl: string;
  verifyToken: string;
  status: 'Active' | 'Inactive' | 'Degraded';
  leadgenStatus?: 'Active' | 'Inactive';
  messagesStatus?: 'Active' | 'Inactive';
  instagramStatus?: 'Active' | 'Inactive';
  commentsStatus?: 'Active' | 'Inactive';
  whatsappStatus?: 'Active' | 'Inactive';
  verificationStatus?: 'Verified' | 'Pending' | 'Failed';
  lastEventTime: string;
  lastEvent?: string;
  successRate7d: number;
  failedEvents7d: number;
  failures?: number;
  retryQueueCount: number;
}

export interface LiveActivityItem {
  id: string;
  title: string;
  description: string;
  timeAgo: string;
  timestamp: string;
  type: 'lead' | 'form' | 'page' | 'account' | 'webhook' | 'token' | 'instagram' | 'whatsapp' | 'ai' | 'crm';
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
  instagramAccounts?: InstagramAccountItem[];
  whatsAppAccounts?: WhatsAppAccountItem[];
  forms: FacebookFormItem[];
  totalForms: number;
  permissions: FacebookPermissionItem[];
  webhookHealth: WebhookHealthData;
  recentEvents: LiveActivityItem[];
  metrics: DashboardMetrics;
}
