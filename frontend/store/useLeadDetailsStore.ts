import { create } from 'zustand';
import { Lead, LeadStatus } from '@/types/lead.types';

export type LeadDetailsTab = 'timeline' | 'conversation' | 'ai-summary' | 'notes' | 'documents';

export interface TimelineItem {
  id: string;
  type: 'whatsapp_ai' | 'whatsapp_customer' | 'score_update' | 'site_visit' | 'brochure' | 'instagram' | 'system';
  title: string;
  description: string;
  time: string;
  date: string;
  source?: string;
  user?: string;
  linkText?: string;
  linkHref?: string;
  iconBg?: string;
}

export interface WhatsAppMessage {
  id: string;
  sender: 'CUSTOMER' | 'AI_AGENT' | 'SALES_REP';
  senderName: string;
  text: string;
  time: string;
  date: string;
  status?: 'SENT' | 'DELIVERED' | 'READ';
  mediaUrl?: string;
  mediaType?: 'pdf' | 'image' | 'voice';
}

export interface LeadDocumentItem {
  id: string;
  name: string;
  uploadedAt: string;
  fileSize: string;
  fileType: string;
  downloadUrl: string;
}

export interface InternalNoteItem {
  id: string;
  authorName: string;
  authorRole: string;
  content: string;
  createdAt: string;
  isPinned?: boolean;
}

export interface AISummaryMetrics {
  budget: string;
  preferredProperty: string;
  buyingIntent: string;
  timeline: string;
  loanRequirement: string;
  familySize: string;
  preferredLocation: string;
  objections: string;
  buyingProbability: number;
  leadTemperature: 'HOT' | 'WARM' | 'COLD';
  nextSuggestedAction: string;
  aiConfidence: number;
}

interface LeadDetailsState {
  lead: Lead | null;
  activeTab: LeadDetailsTab;
  timeline: TimelineItem[];
  messages: WhatsAppMessage[];
  documents: LeadDocumentItem[];
  notes: InternalNoteItem[];
  aiSummary: AISummaryMetrics;
  isLoading: boolean;

  // Modal Visibility States
  isAssignModalOpen: boolean;
  isBookVisitModalOpen: boolean;
  isMarkQualifiedModalOpen: boolean;
  isRejectModalOpen: boolean;
  isEditLeadModalOpen: boolean;

  // Actions
  setLead: (lead: Lead) => void;
  setActiveTab: (tab: LeadDetailsTab) => void;
  setLoading: (loading: boolean) => void;
  addNote: (content: string) => void;
  addDocument: (doc: Omit<LeadDocumentItem, 'id'>) => void;
  deleteDocument: (id: string) => void;
  assignSalesRep: (repName: string) => void;
  updateLeadStatus: (status: LeadStatus, reason?: string) => void;
  
  // Modal Handlers
  openAssignModal: () => void;
  closeAssignModal: () => void;
  openBookVisitModal: () => void;
  closeBookVisitModal: () => void;
  openMarkQualifiedModal: () => void;
  closeMarkQualifiedModal: () => void;
  openRejectModal: () => void;
  closeRejectModal: () => void;
  openEditLeadModal: () => void;
  closeEditLeadModal: () => void;
}

const INITIAL_MOCK_LEAD: Lead = {
  id: 'lead_rohit_665dfb',
  name: 'Rohit Sharma',
  phone: '+91 98765 43210',
  email: 'rohit.sharma@example.com',
  project: 'Sunshine Villas - 2 BHK',
  source: 'FACEBOOK_ADS',
  qualificationScore: 85,
  status: 'NEW',
  organizationId: 'org_acme',
  createdAt: '2025-05-26T10:24:00.000Z',
  updatedAt: new Date().toISOString(),
  budget: '₹50 - ₹70 Lakhs',
  location: 'Indore, Madhya Pradesh',
  assignedSalesUser: {
    id: 'usr_neha',
    name: 'Neha Singh',
    email: 'neha@leadpilot.ai',
  },
};

const INITIAL_TIMELINE: TimelineItem[] = [
  {
    id: 'tl_1',
    type: 'whatsapp_ai',
    title: 'AI Agent sent message',
    description: 'Hi Rohit 👋, Thanks for your interest in our projects. Can you please confirm your preferred location?',
    time: '10:24 AM',
    date: 'May 26, 2025',
    user: 'AI Agent',
    iconBg: 'bg-green',
  },
  {
    id: 'tl_2',
    type: 'whatsapp_customer',
    title: 'Rohit Sharma replied',
    description: 'I am looking for a 2BHK in Indore.',
    time: '10:26 AM',
    date: 'May 26, 2025',
    user: 'WhatsApp ✓✓',
    iconBg: 'bg-green',
  },
  {
    id: 'tl_3',
    type: 'score_update',
    title: 'Lead updated by AI Agent',
    description: 'Lead score updated from 72 to 85',
    time: '10:28 AM',
    date: 'May 26, 2025',
    iconBg: 'bg-purple',
  },
  {
    id: 'tl_4',
    type: 'site_visit',
    title: 'Site visit requested',
    description: 'Customer requested a site visit for Sunshine Villas',
    time: '10:32 AM',
    date: 'May 26, 2025',
    iconBg: 'bg-orange',
  },
  {
    id: 'tl_5',
    type: 'brochure',
    title: 'Brochure shared',
    description: 'Sunshine Villas Brochure.pdf',
    time: '10:33 AM',
    date: 'May 26, 2025',
    linkText: 'Sunshine Villas Brochure.pdf',
    linkHref: '#',
    iconBg: 'bg-blue',
  },
  {
    id: 'tl_6',
    type: 'whatsapp_ai',
    title: 'AI Agent sent message',
    description: 'Great! Our team will schedule a site visit for you.',
    time: '10:34 AM',
    date: 'May 26, 2025',
    iconBg: 'bg-green',
  },
  {
    id: 'tl_7',
    type: 'instagram',
    title: 'New lead captured',
    description: 'Lead captured from Instagram Lead Ad campaign.',
    time: '09:15 PM',
    date: 'May 25, 2025',
    user: 'System',
    iconBg: 'bg-pink',
  },
];

const INITIAL_MESSAGES: WhatsAppMessage[] = [
  {
    id: 'msg_1',
    sender: 'CUSTOMER',
    senderName: 'Rohit Sharma',
    text: 'Hi, I am interested in 2BHK in Sunshine Villas project. Can you send brochure?',
    time: '10:22 AM',
    date: 'May 26, 2025',
    status: 'READ',
  },
  {
    id: 'msg_2',
    sender: 'AI_AGENT',
    senderName: 'LeadPilot AI',
    text: 'Hi Rohit 👋, Thanks for reaching out to LeadPilot AI. Here is the brochure for Sunshine Villas 2BHK. Can you please confirm your preferred location?',
    time: '10:24 AM',
    date: 'May 26, 2025',
    status: 'READ',
    mediaType: 'pdf',
    mediaUrl: '/sample-brochure.pdf',
  },
  {
    id: 'msg_3',
    sender: 'CUSTOMER',
    senderName: 'Rohit Sharma',
    text: 'I am looking for a 2BHK in Indore.',
    time: '10:26 AM',
    date: 'May 26, 2025',
    status: 'READ',
  },
  {
    id: 'msg_4',
    sender: 'AI_AGENT',
    senderName: 'LeadPilot AI',
    text: 'Great! Sunshine Villas is located in Vijay Nagar, Indore. Would you like to schedule a site visit this Saturday?',
    time: '10:27 AM',
    date: 'May 26, 2025',
    status: 'READ',
  },
  {
    id: 'msg_5',
    sender: 'CUSTOMER',
    senderName: 'Rohit Sharma',
    text: 'Yes, Saturday evening around 4 PM works for me.',
    time: '10:32 AM',
    date: 'May 26, 2025',
    status: 'READ',
  },
  {
    id: 'msg_6',
    sender: 'AI_AGENT',
    senderName: 'LeadPilot AI',
    text: 'Great! Our team will schedule a site visit for you. Our executive Neha Singh will contact you shortly.',
    time: '10:34 AM',
    date: 'May 26, 2025',
    status: 'DELIVERED',
  },
];

const INITIAL_DOCUMENTS: LeadDocumentItem[] = [
  {
    id: 'doc_1',
    name: 'PAN Card.pdf',
    uploadedAt: 'Uploaded on May 26, 2025',
    fileSize: '1.2 MB',
    fileType: 'pdf',
    downloadUrl: '#',
  },
  {
    id: 'doc_2',
    name: 'Aadhaar Card.pdf',
    uploadedAt: 'Uploaded on May 26, 2025',
    fileSize: '2.4 MB',
    fileType: 'pdf',
    downloadUrl: '#',
  },
  {
    id: 'doc_3',
    name: 'Income Proof.pdf',
    uploadedAt: 'Uploaded on May 26, 2025',
    fileSize: '3.1 MB',
    fileType: 'pdf',
    downloadUrl: '#',
  },
];

const INITIAL_NOTES: InternalNoteItem[] = [
  {
    id: 'note_1',
    authorName: 'Neha Singh',
    authorRole: 'Sales Executive',
    content: 'Customer is very serious about buying. Looking for a premium location. Prefers possession in next 6 months.',
    createdAt: 'Added by Neha Singh • 10:40 AM',
    isPinned: true,
  },
];

const INITIAL_AI_SUMMARY: AISummaryMetrics = {
  budget: '₹50 - ₹70 Lakhs',
  preferredProperty: 'Sunshine Villas - 2 BHK',
  buyingIntent: 'Ready to buy in 1 - 3 months',
  timeline: 'Possession within 6 months',
  loanRequirement: 'Yes, Home Loan Required (Pre-approved)',
  familySize: '3 Members (Nuclear Family)',
  preferredLocation: 'Indore, Madhya Pradesh',
  objections: 'Wants possession before Diwali 2025',
  buyingProbability: 88,
  leadTemperature: 'HOT',
  nextSuggestedAction: 'Schedule Site Visit & Offer Token Discount',
  aiConfidence: 94,
};

export const useLeadDetailsStore = create<LeadDetailsState>((set) => ({
  lead: null as any,
  activeTab: 'timeline',
  timeline: INITIAL_TIMELINE,
  messages: INITIAL_MESSAGES,
  documents: INITIAL_DOCUMENTS,
  notes: INITIAL_NOTES,
  aiSummary: INITIAL_AI_SUMMARY,
  isLoading: false,

  isAssignModalOpen: false,
  isBookVisitModalOpen: false,
  isMarkQualifiedModalOpen: false,
  isRejectModalOpen: false,
  isEditLeadModalOpen: false,

  setLead: (lead) => set({ lead }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setLoading: (loading) => set({ isLoading: loading }),

  addNote: (content) =>
    set((state) => ({
      notes: [
        {
          id: `note_${Date.now()}`,
          authorName: 'Neha Singh',
          authorRole: 'Sales Executive',
          content,
          createdAt: `Added by Neha Singh • Just now`,
        },
        ...state.notes,
      ],
    })),

  addDocument: (doc) =>
    set((state) => ({
      documents: [
        {
          ...doc,
          id: `doc_${Date.now()}`,
        },
        ...state.documents,
      ],
    })),

  deleteDocument: (id) =>
    set((state) => ({
      documents: state.documents.filter((d) => d.id !== id),
    })),

  assignSalesRep: (repName) =>
    set((state) => {
      if (!state.lead) return state;
      const updatedLead: Lead = {
        ...state.lead,
        assignedSalesUser: {
          id: `usr_${Date.now()}`,
          name: repName,
          email: `${repName.toLowerCase().replace(' ', '.')}@leadpilot.ai`,
        },
      };

      const newTimelineItem: TimelineItem = {
        id: `tl_${Date.now()}`,
        type: 'system',
        title: 'Assigned to Sales Executive',
        description: `Assigned to ${repName}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: 'Today',
        user: 'System',
        iconBg: 'bg-blue',
      };

      return {
        lead: updatedLead,
        timeline: [newTimelineItem, ...state.timeline],
        isAssignModalOpen: false,
      };
    }),

  updateLeadStatus: (status, reason) =>
    set((state) => {
      if (!state.lead) return state;
      const updatedLead: Lead = {
        ...state.lead,
        status,
      };

      const newTimelineItem: TimelineItem = {
        id: `tl_${Date.now()}`,
        type: status === 'QUALIFIED' ? 'score_update' : 'system',
        title: status === 'QUALIFIED' ? 'Lead Marked Qualified' : `Lead Status Updated: ${status}`,
        description: reason || `Status updated to ${status}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: 'Today',
        iconBg: status === 'QUALIFIED' ? 'bg-green' : 'bg-orange',
      };

      return {
        lead: updatedLead,
        timeline: [newTimelineItem, ...state.timeline],
        isMarkQualifiedModalOpen: false,
        isRejectModalOpen: false,
      };
    }),

  openAssignModal: () => set({ isAssignModalOpen: true }),
  closeAssignModal: () => set({ isAssignModalOpen: false }),

  openBookVisitModal: () => set({ isBookVisitModalOpen: true }),
  closeBookVisitModal: () => set({ isBookVisitModalOpen: false }),

  openMarkQualifiedModal: () => set({ isMarkQualifiedModalOpen: true }),
  closeMarkQualifiedModal: () => set({ isMarkQualifiedModalOpen: false }),

  openRejectModal: () => set({ isRejectModalOpen: true }),
  closeRejectModal: () => set({ isRejectModalOpen: false }),

  openEditLeadModal: () => set({ isEditLeadModalOpen: true }),
  closeEditLeadModal: () => set({ isEditLeadModalOpen: false }),
}));
