export interface DashboardMetricItem {
  value: number | string;
  trend: string;
  isPositive: boolean;
}

export interface DashboardMetrics {
  todaysLeads: DashboardMetricItem;
  qualifiedLeads: DashboardMetricItem;
  pendingReply: DashboardMetricItem;
  siteVisits: DashboardMetricItem;
  bookings: DashboardMetricItem;
  revenue: DashboardMetricItem;
}

export interface RecentLeadItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: 'FACEBOOK' | 'INSTAGRAM' | 'GOOGLE_ADS' | 'WEBSITE' | 'MANUAL';
  status: 'NEW' | 'AI_IN_PROGRESS' | 'QUALIFIED' | 'SITE_VISIT_SCHEDULED' | 'CONVERTED' | 'LOST';
  lastMessage: string;
  timeAgo: string;
  avatarInitials: string;
}

export interface RecentActivityItem {
  id: string;
  type: string;
  description: string;
  timeAgo: string;
  iconType: 'whatsapp' | 'robot' | 'calendar' | 'document';
}

export interface WorkspaceSummary {
  totalLeads: number;
  activeAiAgents: number;
  knowledgeBaseDocs: number;
  teamMembers: number;
}

export interface SourceDistribution {
  source: string;
  count: number;
  percentage: number;
}

export interface DashboardOverviewResponse {
  metrics: DashboardMetrics;
  recentLeads: RecentLeadItem[];
  recentActivities: RecentActivityItem[];
  workspaceSummary: WorkspaceSummary;
}
