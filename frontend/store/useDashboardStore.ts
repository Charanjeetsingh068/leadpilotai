import { create } from 'zustand';
import { fetchDashboardOverview } from '@/services/dashboard.service';
import { DashboardOverviewResponse } from '@/types/dashboard.types';

interface DashboardState {
  data: DashboardOverviewResponse | null;
  isLoading: boolean;
  error: string | null;
  selectedDateFilter: string;
  fetchDashboard: () => Promise<void>;
  setDateFilter: (filter: string) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  data: {
    metrics: {
      todaysLeads: { value: 56, trend: '14% vs yesterday', isPositive: true },
      qualifiedLeads: { value: 18, trend: '12% vs yesterday', isPositive: true },
      pendingReply: { value: 23, trend: '8% vs yesterday', isPositive: false },
      siteVisits: { value: 7, trend: '5% vs yesterday', isPositive: true },
      bookings: { value: 4, trend: '3% vs yesterday', isPositive: true },
      revenue: { value: '₹1,24,500', trend: '16% vs yesterday', isPositive: true },
    },
    recentLeads: [
      {
        id: '1',
        name: 'Rohit Sharma',
        phone: '+91 98765 43210',
        email: 'rohit.s@gmail.com',
        source: 'FACEBOOK',
        status: 'QUALIFIED',
        lastMessage: "Yes, I'm interested in 2BHK flat.",
        timeAgo: '2m ago',
        avatarInitials: 'RS',
      },
      {
        id: '2',
        name: 'Priya Verma',
        phone: '+91 91234 56789',
        email: 'priya.v@gmail.com',
        source: 'INSTAGRAM',
        status: 'AI_IN_PROGRESS',
        lastMessage: 'Can you share the prices?',
        timeAgo: '5m ago',
        avatarInitials: 'PV',
      },
      {
        id: '3',
        name: 'Amit Kumar',
        phone: '+91 99887 76655',
        email: 'amit.k@gmail.com',
        source: 'GOOGLE_ADS',
        status: 'AI_IN_PROGRESS',
        lastMessage: 'Do you have any properties in Wakad?',
        timeAgo: '12m ago',
        avatarInitials: 'AK',
      },
      {
        id: '4',
        name: 'Sneha Iyer',
        phone: '+91 87654 32109',
        email: 'sneha.i@gmail.com',
        source: 'WEBSITE',
        status: 'SITE_VISIT_SCHEDULED',
        lastMessage: 'I want to schedule a visit.',
        timeAgo: '18m ago',
        avatarInitials: 'SI',
      },
      {
        id: '5',
        name: 'Vikram Singh',
        phone: '+91 76543 21098',
        email: 'vikram.s@gmail.com',
        source: 'MANUAL',
        status: 'NEW',
        lastMessage: 'Please share more details.',
        timeAgo: '25m ago',
        avatarInitials: 'VS',
      },
    ],
    recentActivities: [
      {
        id: '1',
        type: 'WHATSAPP_SENT',
        description: 'AI Agent sent offer details to Rohit Sharma',
        timeAgo: '2m ago',
        iconType: 'whatsapp',
      },
      {
        id: '2',
        type: 'QUALIFIED',
        description: 'Lead qualified by AI Agent Priya Verma',
        timeAgo: '5m ago',
        iconType: 'robot',
      },
      {
        id: '3',
        type: 'SITE_VISIT',
        description: 'Site visit scheduled for Sneha Iyer',
        timeAgo: '18m ago',
        iconType: 'calendar',
      },
      {
        id: '4',
        type: 'FOLLOW_UP',
        description: 'Follow-up message sent to Amit Kumar',
        timeAgo: '25m ago',
        iconType: 'whatsapp',
      },
      {
        id: '5',
        type: 'KNOWLEDGE_BASE',
        description: 'Knowledge base updated Project Pricelist.pdf',
        timeAgo: '1h ago',
        iconType: 'document',
      },
    ],
    workspaceSummary: {
      totalLeads: 1248,
      activeAiAgents: 4,
      knowledgeBaseDocs: 23,
      teamMembers: 12,
    },
  },
  isLoading: false,
  error: null,
  selectedDateFilter: 'May 26, 2025',

  fetchDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetchDashboardOverview();
      if (res) {
        set({ data: res, isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  setDateFilter: (filter) => set({ selectedDateFilter: filter }),
}));
