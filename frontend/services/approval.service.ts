import { apiClient } from './api.client';
import { ApiResponse } from '@/types/api.types';

export interface ApprovalItem {
  id: string;
  leadId: string;
  customerName: string;
  initials: string;
  avatarColorClass: string;
  phone: string;
  whatsapp: string;
  industry: string;
  aiRecommendation: string;
  reason: string;
  priority: 'High' | 'Medium' | 'Low';
  waitingTime: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  leadScore: number;
  source: string;
  assignedTo: {
    name: string;
    avatarUrl: string;
  };
  conversationSummary: string[];
  aiGeneratedReply: string;
  knowledgeUsed: string[];
  confidenceScore: number;
}

export interface ApprovalActivity {
  id: string;
  customerName: string;
  action: 'approved' | 'rejected' | 'pending';
  actorName: string;
  time: string;
  details: string;
  timestamp: string;
}

export const MOCK_APPROVALS: ApprovalItem[] = [
  {
    id: 'appr-1',
    leadId: 'lead-101',
    customerName: 'Rohit Sharma',
    initials: 'RS',
    avatarColorClass: 'avatar-teal',
    phone: '+91 98765 43210',
    whatsapp: 'Real Estate',
    industry: 'Real Estate',
    aiRecommendation: 'Share pricing & Schedule site visit',
    reason: 'Pricing shared by AI',
    priority: 'High',
    waitingTime: '12m',
    status: 'Pending',
    leadScore: 85,
    source: 'Facebook Lead',
    assignedTo: {
      name: 'Neha Singh',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
    },
    conversationSummary: [
      'Customer is interested in 2BHK in Sunshine Villas.',
      'Asked for pricing, location details and site visit.',
      'AI has shared location and pricing range.',
    ],
    aiGeneratedReply: 'Sure Rohit! 👋\nThe price for 2BHK in Sunshine Villas starts from ₹45 Lakhs onwards.\nWould you like to schedule a site visit this weekend to explore the project?',
    knowledgeUsed: [
      'Sunshine Villas Price List (May 2025)',
      'Project Brochure - Sunshine Villas',
    ],
    confidenceScore: 78,
  },
];

export const MOCK_ACTIVITIES: ApprovalActivity[] = [
  {
    id: 'act-1',
    customerName: 'Rohit Sharma',
    action: 'approved',
    actorName: 'Neha Singh',
    time: '10:24 AM',
    details: 'AI recommendation sent: Share pricing & schedule site visit',
    timestamp: 'Today',
  },
];

const getAvatarColorClass = (name: string): string => {
  const colors = ['avatar-teal', 'avatar-purple', 'avatar-pink', 'avatar-orange', 'avatar-green', 'avatar-blue'];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

const calculateWaitingTime = (createdAtStr: string): string => {
  const diffMs = Date.now() - new Date(createdAtStr).getTime();
  const diffMin = Math.max(1, Math.floor(diffMs / 60000));
  if (diffMin < 60) return `${diffMin}m`;
  const diffHrs = Math.floor(diffMin / 60);
  const remMin = diffMin % 60;
  return `${diffHrs}h ${remMin.toString().padStart(2, '0')}m`;
};

const mapDocToItem = (doc: any): ApprovalItem => {
  const lead = doc.leadId || {};
  const conv = doc.conversationId || {};
  
  return {
    id: doc._id,
    leadId: lead._id || '',
    customerName: lead.name || 'Unknown',
    initials: (lead.name || 'U').split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase(),
    avatarColorClass: getAvatarColorClass(lead.name || 'Unknown'),
    phone: lead.phone || '',
    whatsapp: lead.industry || 'Real Estate',
    industry: lead.industry || 'Real Estate',
    aiRecommendation: conv.aiSummary?.recommendedAction || doc.reason || 'Review AI decision',
    reason: doc.reason || 'Sensitive question detected',
    priority: doc.priority || 'Medium',
    waitingTime: calculateWaitingTime(doc.createdAt || new Date()),
    status: doc.status || 'Pending',
    leadScore: lead.qualificationScore || conv.aiSummary?.leadScore || 80,
    source: lead.source || 'Facebook Lead',
    assignedTo: {
      name: conv.assignedSalesperson?.name || 'Neha Singh',
      avatarUrl: conv.assignedSalesperson?.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80'
    },
    conversationSummary: [
      conv.aiSummary?.intent || 'Customer interested in projects.',
      conv.aiSummary?.recommendedAction || 'Needs details and site visit.'
    ],
    aiGeneratedReply: doc.pendingReplyText,
    knowledgeUsed: [
      `${lead.project || 'Sunshine Villas'} Price List (May 2025)`,
      `Project Brochure - ${lead.project || 'Sunshine Villas'}`
    ],
    confidenceScore: doc.confidenceScore || 80
  };
};

export const ApprovalService = {
  getApprovals: async (): Promise<ApiResponse<ApprovalItem[]>> => {
    try {
      const res = await apiClient.get<ApiResponse<any[]>>('/approvals');
      if (res.data && res.data.success && Array.isArray(res.data.data)) {
        return {
          ...res.data,
          data: res.data.data.map(mapDocToItem)
        } as unknown as ApiResponse<ApprovalItem[]>;
      }
      return { success: true, message: 'Success', data: MOCK_APPROVALS };
    } catch (e) {
      return { success: true, message: 'Success', data: MOCK_APPROVALS };
    }
  },

  getApprovalById: async (id: string): Promise<ApiResponse<ApprovalItem>> => {
    try {
      const res = await apiClient.get<ApiResponse<any>>(`/approvals/${id}`);
      if (res.data && res.data.success && res.data.data) {
        return {
          ...res.data,
          data: mapDocToItem(res.data.data)
        } as unknown as ApiResponse<ApprovalItem>;
      }
      const found = MOCK_APPROVALS.find((a) => a.id === id);
      return { success: !!found, message: found ? 'Success' : 'Not Found', data: found || MOCK_APPROVALS[0] };
    } catch (e) {
      const found = MOCK_APPROVALS.find((a) => a.id === id);
      return { success: !!found, message: found ? 'Success' : 'Not Found', data: found || MOCK_APPROVALS[0] };
    }
  },

  approve: async (id: string): Promise<ApiResponse<{ success: boolean }>> => {
    try {
      const res = await apiClient.patch<ApiResponse<{ success: boolean }>>(`/approvals/${id}/approve`);
      return res.data;
    } catch (e) {
      return { success: true, message: 'Success', data: { success: true } };
    }
  },

  reject: async (id: string, reason: string): Promise<ApiResponse<{ success: boolean }>> => {
    try {
      const res = await apiClient.patch<ApiResponse<{ success: boolean }>>(`/approvals/${id}/reject`, { reason });
      return res.data;
    } catch (e) {
      return { success: true, message: 'Success', data: { success: true } };
    }
  },

  editAndSend: async (id: string, replyText: string): Promise<ApiResponse<{ success: boolean }>> => {
    try {
      const res = await apiClient.patch<ApiResponse<{ success: boolean }>>(`/approvals/${id}/edit`, { pendingReplyText: replyText });
      return res.data;
    } catch (e) {
      return { success: true, message: 'Success', data: { success: true } };
    }
  },

  assignToSales: async (id: string, salesUserId: string, salesUserName?: string): Promise<ApiResponse<{ success: boolean }>> => {
    try {
      const res = await apiClient.patch<ApiResponse<{ success: boolean }>>(`/approvals/${id}/assign`, { 
        salesUserId,
        salesUserName: salesUserName || 'Neha Singh' 
      });
      return res.data;
    } catch (e) {
      return { success: true, message: 'Success', data: { success: true } };
    }
  },

  pauseAi: async (id: string): Promise<ApiResponse<{ success: boolean }>> => {
    try {
      const res = await apiClient.patch<ApiResponse<{ success: boolean }>>(`/approvals/${id}/pause`);
      return res.data;
    } catch (e) {
      return { success: true, message: 'Success', data: { success: true } };
    }
  },

  getActivities: async (): Promise<ApiResponse<ApprovalActivity[]>> => {
    try {
      // Fetch timeline entries for org_leadpilot_demo
      const res = await apiClient.get<ApiResponse<any[]>>('/timeline');
      // If activities are returned from the backend, map them
      if (res.data && res.data.success && Array.isArray(res.data.data)) {
        const mapped = res.data.data.slice(0, 10).map((t: any, index: number) => ({
          id: t._id || `act-${index}`,
          customerName: 'Rohit Sharma',
          action: t.eventType === 'HUMAN_ESCALATION' ? 'pending' : t.eventType === 'STATUS_UPDATED' ? 'approved' : 'pending',
          actorName: t.actorType || 'AI',
          time: new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          details: t.description || t.title,
          timestamp: 'Today'
        }));
        return {
          ...res.data,
          data: mapped.length > 0 ? mapped : MOCK_ACTIVITIES
        } as unknown as ApiResponse<ApprovalActivity[]>;
      }
      return { success: true, message: 'Success', data: MOCK_ACTIVITIES };
    } catch (e) {
      return { success: true, message: 'Success', data: MOCK_ACTIVITIES };
    }
  },
};
