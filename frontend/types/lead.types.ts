export type LeadSource =
  | 'FACEBOOK_ADS'
  | 'INSTAGRAM_ADS'
  | 'GOOGLE_ADS'
  | 'WEBSITE_FORM'
  | 'MANUAL_ENTRY'
  | 'CSV_IMPORT';

export type LeadStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'AI_STARTED'
  | 'AI_IN_PROGRESS'
  | 'QUALIFIED'
  | 'HUMAN_APPROVAL_REQUIRED'
  | 'SITE_VISIT_SCHEDULED'
  | 'CONVERTED'
  | 'LOST'
  | 'ARCHIVED';


export interface TimelineEvent {
  id: string;
  leadId: string;
  eventType: string;
  title: string;
  description: string;
  actorType: 'AI' | 'AGENT' | 'SYSTEM' | 'CUSTOMER';
  actorId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface LeadNote {
  id: string;
  leadId: string;
  authorId: {
    id: string;
    name: string;
    email: string;
  };
  noteText: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  source: LeadSource;
  campaign?: string;
  project?: string;
  industry?: string;
  budget?: string;
  purchaseTimeline?: string;
  location?: string;
  status: LeadStatus;
  aiStatus?: string;
  humanStatus?: string;
  qualificationScore: number;
  assignedSalesUser?: {
    id: string;
    name: string;
    email: string;
  };
  organizationId: string;
  timeline?: TimelineEvent[];
  notes?: LeadNote[];
  createdAt: string;
  updatedAt: string;
}

export interface LeadFilterParams {
  source?: LeadSource;
  status?: LeadStatus;
  industry?: string;
  project?: string;
  assignedSalesUser?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
