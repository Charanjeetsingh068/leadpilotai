export interface FacebookConnectionStatus {
  status: 'NOT_CONNECTED' | 'CONNECTING' | 'CONNECTED' | 'TOKEN_EXPIRED' | 'PERMISSION_MISSING' | 'SYNC_FAILED' | 'RECONNECT_REQUIRED' | 'Connected' | 'Warning' | 'Disconnected' | 'Active';
  isConnected?: boolean;
  connectedBy?: string | null;
  email?: string | null;
  user?: {
    id?: string;
    name?: string;
    email?: string;
    picture?: string;
  } | null;
  connectedTime?: string | null;
  tokenExpiry?: string | null;
  lastRefresh?: string | null;
  isExpired?: boolean;
}

export interface FacebookAccountItem {
  id: string;
  accountName?: string;
  name?: string;
  fbUserId: string;
  fbUserEmail?: string;
  email?: string;
  avatarUrl?: string;
  status?: string;
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
  tokenStatus?: string;
  lastSync?: string;
  lastSyncAt?: string;
  tokenExpiry?: string;
  tokenExpiresAt?: string;
  pagesCount?: number;
  formsCount?: number;
}

export interface FacebookBusinessItem {
  id: string;
  businessId?: string;
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
  pageId?: string;
  name: string;
  pageName?: string;
  category?: string;
  pictureUrl?: string;
  followersCount?: number;
  followers?: number;
  fanCount?: number;
  leadFormsCount?: number;
  status?: 'Active' | 'Inactive' | 'Disconnected' | string;
  syncStatus?: 'Synced' | 'Syncing' | 'Pending' | 'Error' | string;
  webhookStatus?: 'Active' | 'Inactive' | 'Error' | 'SUBSCRIBED' | 'UNSUBSCRIBED' | string;
  assignedAiAgent?: {
    id: string;
    name: string;
    agentCode?: string;
  };
  ownerName?: string;
  lastSync?: string;
  isConnected?: boolean;
  connected?: boolean;
  isSelected?: boolean;
  instagramId?: string;
}

export interface InstagramAccountItem {
  id: string;
  instagramId?: string;
  username: string;
  name?: string;
  profilePictureUrl?: string;
  profilePicture?: string;
  followersCount?: number;
  followers?: number;
  mediaCount?: number;
  businessConnected?: boolean;
  messagingEnabled?: boolean;
  webhookEnabled?: boolean;
  status?: 'Active' | 'Inactive' | string;
}

export interface WhatsAppAccountItem {
  id: string;
  wabaId?: string;
  name: string;
  displayName?: string;
  currency?: string;
  phoneNumber?: string;
  phoneNumberId?: string;
  phoneNumbers?: any[];
  qualityRating?: 'High' | 'Medium' | 'Low' | 'GREEN' | 'YELLOW' | 'RED' | string;
  webhookActive?: boolean;
  templatesCount?: number;
  messagingStatus?: 'Active' | 'Inactive' | 'Connected' | string;
  status?: 'Connected' | 'Disconnected' | string;
}

export interface FacebookFormItem {
  id: string;
  formId?: string;
  name: string;
  formName?: string;
  pageName?: string;
  facebookPageName?: string;
  associatedPage?: string;
  pageId?: string;
  facebookPage?: {
    id?: string;
    name?: string;
    pageId?: string;
  };
  campaign?: string;
  leadCount?: number;
  leadsCount?: number;
  leadsToday?: number;
  leadsTotal?: number;
  status?: 'Active' | 'Inactive' | 'ACTIVE' | string;
  isActive?: boolean;
  isSelected?: boolean;
  webhookActive?: boolean;
  lastSync?: string;
  questionsCount?: number;
  questions?: any[];
  assignedAiAgentId?: string;
  assignedAiAgent?: {
    id: string;
    name: string;
  };
}

export interface FacebookPermissionItem {
  id?: string;
  name?: string;
  permission?: string;
  description?: string;
  status: 'Granted' | 'Missing' | 'Expired' | 'Reconnect Required' | 'Admin Required' | 'GRANTED' | 'MISSING' | 'EXPIRED' | 'RECONNECT_REQUIRED' | 'ADMIN_REQUIRED' | string;
}

export interface WebhookHealthData {
  id?: string;
  webhookUrl?: string;
  verifyToken?: string;
  status: 'Active' | 'Inactive' | 'Degraded' | 'HEALTHY' | 'WARNING' | string;
  leadgenStatus?: 'Active' | 'Inactive' | string;
  messagesStatus?: 'Active' | 'Inactive' | string;
  instagramStatus?: 'Active' | 'Inactive' | string;
  commentsStatus?: 'Active' | 'Inactive' | string;
  whatsappStatus?: 'Active' | 'Inactive' | string;
  verificationStatus?: 'Verified' | 'Pending' | 'Failed' | string;
  lastEventTime?: string;
  lastEvent?: string;
  successRate7d?: number;
  failedEvents7d?: number;
  failures?: number;
  retryQueueCount?: number;
  activeSubscriptionsCount?: number;
  failedCount?: number;
}

export interface LiveActivityItem {
  id: string;
  title: string;
  description: string;
  timeAgo?: string;
  timestamp: string;
  type?: 'lead' | 'form' | 'page' | 'account' | 'webhook' | 'token' | 'instagram' | 'whatsapp' | 'ai' | 'crm' | string;
  eventType?: string;
}

export interface DashboardMetrics {
  totalAccounts?: number;
  connectedAccounts?: number;
  activeAccounts?: number;
  totalBusinesses?: number;
  totalPages?: number;
  connectedPages?: number;
  activePages?: number;
  totalInstagram?: number;
  totalWhatsApp?: number;
  totalForms?: number;
  connectedForms?: number;
  activeForms?: number;
  totalLeads?: number;
  todayLeads?: number;
  leadsTrendPercentage?: number;
  syncSuccessRate?: number;
  syncSuccessTrend?: number;
  apiUsageCalls?: number;
  apiUsageLimit?: number;
  apiUsagePercentage?: number;
  webhookSuccessRate?: number;
  duplicateLeadsCount?: number;
  syncErrorsCount?: number;
  failedEventsCount?: number;
}

export interface DashboardData {
  connection: FacebookConnectionStatus;
  accounts: FacebookAccountItem[];
  totalAccounts?: number;
  connectedAccounts?: number;
  businesses: FacebookBusinessItem[];
  selectedBusinessId?: string;
  pages: FacebookPageItem[];
  totalPages?: number;
  connectedPages?: number;
  instagramAccounts?: InstagramAccountItem[];
  whatsAppAccounts?: WhatsAppAccountItem[];
  adAccounts?: any[];
  forms: FacebookFormItem[];
  totalForms?: number;
  permissions: FacebookPermissionItem[];
  webhookHealth: WebhookHealthData;
  webhook?: any;
  recentEvents: LiveActivityItem[];
  metrics: DashboardMetrics;
  leads?: any[];
  campaigns?: any[];
}
