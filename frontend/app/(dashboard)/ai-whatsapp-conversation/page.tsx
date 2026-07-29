'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { ConversationTopHeader } from '@/components/conversation/ConversationTopHeader';
import { ConversationListPanel } from '@/components/conversation/ConversationListPanel';
import { ConversationArea } from '@/components/conversation/ConversationArea';
import { BottomActionBar } from '@/components/conversation/BottomActionBar';
import { AISummaryRightPanel } from '@/components/conversation/AISummaryRightPanel';
import { ConversationService } from '@/services/conversation.service';
import { useConversationStore } from '@/store/useConversationStore';
import { Conversation, ChatMessage } from '@/types/conversation.types';
import toast from 'react-hot-toast';

const DEFAULT_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-rohit-1',
    leadId: 'conv-rohit-1',
    leadName: 'Rohit Sharma',
    leadPhone: '+91 98765 43210',
    leadProject: 'Sunshine Villas',
    leadScore: 85,
    leadSource: 'Facebook Lead',
    status: 'Active',
    isAiAutomated: true,
    unreadCount: 0,
    lastMessageContent: 'Thanks for the details. I am looking...',
    lastMessageAt: new Date().toISOString(),
    assignedSalesperson: { name: 'Neha Singh', role: 'Sales Executive' },
    aiSummary: {
      intent: 'Buy a 2BHK Apartment',
      budget: '₹50 - ₹70 Lakhs',
      project: 'Sunshine Villas',
      timeline: 'Ready to buy in 1 - 3 months',
      loan: 'Yes, Home Loan Required',
      sentiment: 'Positive',
      leadScore: 85,
      recommendedAction: 'Share matching properties and schedule site visit',
    },
    aiAgent: {
      name: 'Property Advisor Agent',
      industry: 'Real Estate',
      model: 'GPT-4o',
      status: 'Running',
    },
    recentAiActions: [
      { id: '1', action: 'Asked about preferred location', timestamp: '10:26 AM', iconType: 'question' },
      { id: '2', action: 'Shared price range', timestamp: '10:27 AM', iconType: 'document' },
      { id: '3', action: 'Checking availability', timestamp: '10:27 AM', iconType: 'check' },
    ],
  },
  {
    id: 'conv-priya-2',
    leadId: 'conv-priya-2',
    leadName: 'Priya Verma',
    leadPhone: '+91 98220 11223',
    leadProject: 'Grand Heights',
    leadScore: 92,
    leadSource: 'Instagram Lead',
    status: 'Active',
    isAiAutomated: true,
    unreadCount: 0,
    lastMessageContent: 'Can you share the brochure?',
    lastMessageAt: new Date(Date.now() - 300000).toISOString(),
    assignedSalesperson: { name: 'Neha Singh', role: 'Sales Executive' },
  },
  {
    id: 'conv-amit-3',
    leadId: 'conv-amit-3',
    leadName: 'Amit Kumar',
    leadPhone: '+91 98111 44556',
    leadProject: 'Sunshine Villas',
    leadScore: 78,
    leadSource: 'Google Ads',
    status: 'Active',
    isAiAutomated: true,
    unreadCount: 0,
    lastMessageContent: 'What is the total cost?',
    lastMessageAt: new Date(Date.now() - 720000).toISOString(),
    assignedSalesperson: { name: 'Neha Singh', role: 'Sales Executive' },
  },
  {
    id: 'conv-sneha-4',
    leadId: 'conv-sneha-4',
    leadName: 'Sneha Iyer',
    leadPhone: '+91 98333 77889',
    leadProject: 'Orchid Park',
    leadScore: 90,
    leadSource: 'Website Lead',
    status: 'Waiting',
    isAiAutomated: false,
    unreadCount: 1,
    lastMessageContent: 'I want to schedule a visit.',
    lastMessageAt: new Date(Date.now() - 1080000).toISOString(),
    assignedSalesperson: { name: 'Neha Singh', role: 'Sales Executive' },
  },
  {
    id: 'conv-vikram-5',
    leadId: 'conv-vikram-5',
    leadName: 'Vikram Singh',
    leadPhone: '+91 98444 66778',
    leadProject: 'Grand Residency',
    leadScore: 82,
    leadSource: 'Manual Lead',
    status: 'Active',
    isAiAutomated: true,
    unreadCount: 0,
    lastMessageContent: 'Is home loan available?',
    lastMessageAt: new Date(Date.now() - 1500000).toISOString(),
    assignedSalesperson: { name: 'Neha Singh', role: 'Sales Executive' },
  },
  {
    id: 'conv-deepak-6',
    leadId: 'conv-deepak-6',
    leadName: 'Deepak Sharma',
    leadPhone: '+91 98555 12345',
    leadProject: 'Sunshine Villas',
    leadScore: 84,
    leadSource: 'Facebook Lead',
    status: 'Active',
    isAiAutomated: true,
    unreadCount: 0,
    lastMessageContent: 'Please share the location.',
    lastMessageAt: new Date(Date.now() - 1920000).toISOString(),
    assignedSalesperson: { name: 'Neha Singh', role: 'Sales Executive' },
  },
  {
    id: 'conv-anjali-7',
    leadId: 'conv-anjali-7',
    leadName: 'Anjali Nair',
    leadPhone: '+91 98666 23456',
    leadProject: 'Skyline Towers',
    leadScore: 76,
    leadSource: 'Instagram Lead',
    status: 'Waiting',
    isAiAutomated: false,
    unreadCount: 2,
    lastMessageContent: 'What is the possession time?',
    lastMessageAt: new Date(Date.now() - 2700000).toISOString(),
    assignedSalesperson: { name: 'Neha Singh', role: 'Sales Executive' },
  },
  {
    id: 'conv-manish-8',
    leadId: 'conv-manish-8',
    leadName: 'Manish Gupta',
    leadPhone: '+91 98777 34567',
    leadProject: 'Sunshine Villas',
    leadScore: 65,
    leadSource: 'Website Lead',
    status: 'Closed',
    isAiAutomated: false,
    unreadCount: 0,
    lastMessageContent: 'Thanks! I will visit.',
    lastMessageAt: new Date(Date.now() - 3600000).toISOString(),
    assignedSalesperson: { name: 'Neha Singh', role: 'Sales Executive' },
  },
  {
    id: 'conv-pooja-9',
    leadId: 'conv-pooja-9',
    leadName: 'Pooja Bansal',
    leadPhone: '+91 98888 45678',
    leadProject: 'Grand Heights',
    leadScore: 88,
    leadSource: 'Facebook Lead',
    status: 'Active',
    isAiAutomated: true,
    unreadCount: 0,
    lastMessageContent: 'Price range?',
    lastMessageAt: new Date(Date.now() - 3600000).toISOString(),
    assignedSalesperson: { name: 'Neha Singh', role: 'Sales Executive' },
  },
];

const DEFAULT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    conversationId: 'conv-rohit-1',
    sender: 'AI',
    senderName: 'LeadPilot AI',
    content: 'Hi Rohit 👋, Thanks for your interest in our projects. I can help you with details, pricing, site visit and more. What type of property are you looking for?',
    status: 'SEEN',
    timestamp: new Date(Date.now() - 300000).toISOString(),
  },
  {
    id: 'msg-2',
    conversationId: 'conv-rohit-1',
    sender: 'LEAD',
    senderName: 'Rohit Sharma',
    content: 'I am looking for a 2BHK in Indore.',
    status: 'SEEN',
    timestamp: new Date(Date.now() - 240000).toISOString(),
  },
  {
    id: 'msg-3',
    conversationId: 'conv-rohit-1',
    sender: 'AI',
    senderName: 'LeadPilot AI',
    content: 'Great choice! We have some excellent 2BHK options in Indore. May I know your preferred location?',
    status: 'SEEN',
    timestamp: new Date(Date.now() - 180000).toISOString(),
  },
  {
    id: 'msg-4',
    conversationId: 'conv-rohit-1',
    sender: 'LEAD',
    senderName: 'Rohit Sharma',
    content: 'Near Vijay Nagar or Scheme 78.',
    status: 'SEEN',
    timestamp: new Date(Date.now() - 120000).toISOString(),
  },
  {
    id: 'msg-5',
    conversationId: 'conv-rohit-1',
    sender: 'AI',
    senderName: 'LeadPilot AI',
    content: 'Sure! We have great options in Vijay Nagar and Scheme 78. Would you like me to share the price range for 2BHK in these areas?',
    status: 'SEEN',
    timestamp: new Date(Date.now() - 60000).toISOString(),
  },
  {
    id: 'msg-6',
    conversationId: 'conv-rohit-1',
    sender: 'LEAD',
    senderName: 'Rohit Sharma',
    content: 'Yes, please share.',
    status: 'SEEN',
    timestamp: new Date().toISOString(),
  },
];

export default function AIWhatsAppConversationPage() {
  const {
    conversations,
    setConversations,
    activeConversationId,
    setActiveConversationId,
    activeMessages,
    setActiveMessages,
    appendMessage,
    toggleAiStatus,
    setAiTyping,
  } = useConversationStore();

  const [isLoading, setIsLoading] = useState(true);
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');

  const loadInitialData = useCallback(async () => {
    try {
      const res = await ConversationService.getConversations();
      if (res.success && res.data && res.data.length > 0) {
        setConversations(res.data);
        if (!activeConversationId) {
          setActiveConversationId(res.data[0].id);
        }
      } else {
        setConversations(DEFAULT_CONVERSATIONS);
        setActiveConversationId(DEFAULT_CONVERSATIONS[0].id);
      }
    } catch {
      setConversations(DEFAULT_CONVERSATIONS);
      setActiveConversationId(DEFAULT_CONVERSATIONS[0].id);
    } finally {
      setIsLoading(false);
    }
  }, [activeConversationId, setConversations, setActiveConversationId]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const activeConv =
    conversations.find((c) => c.id === activeConversationId || c.leadId === activeConversationId) ||
    conversations[0] ||
    DEFAULT_CONVERSATIONS[0];

  const loadMessages = useCallback(async () => {
    if (!activeConv?.id) return;
    try {
      const res = await ConversationService.getMessages(activeConv.id);
      if (res.success && res.data && res.data.length > 0) {
        setActiveMessages(res.data);
      } else {
        setActiveMessages(DEFAULT_MESSAGES);
      }
    } catch {
      setActiveMessages(DEFAULT_MESSAGES);
    }
  }, [activeConv?.id, setActiveMessages]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    setMobileView('chat');
  };

  const handleSendMessage = async (content: string) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId: activeConv.id,
      sender: 'AGENT',
      senderName: 'Neha Singh',
      content,
      status: 'SEEN',
      timestamp: new Date().toISOString(),
    };
    appendMessage(newMsg);

    try {
      await ConversationService.sendMessage(activeConv.id, content);
    } catch {
      // baseline
    }

    if (activeConv.isAiAutomated) {
      setAiTyping(true);
      setTimeout(() => {
        setAiTyping(false);
        const aiMsg: ChatMessage = {
          id: `msg-ai-${Date.now()}`,
          conversationId: activeConv.id,
          sender: 'AI',
          senderName: 'LeadPilot AI',
          content: 'Here are the matching 2BHK property options with detailed price breakdowns for Vijay Nagar and Scheme 78.',
          status: 'SEEN',
          timestamp: new Date().toISOString(),
        };
        appendMessage(aiMsg);
      }, 1500);
    }
  };

  const handleQuickShortcut = (text: string) => {
    handleSendMessage(text);
  };

  const handlePauseAi = async () => {
    toggleAiStatus(activeConv.id, false);
    toast.success('AI Auto-reply Paused!');
    try {
      await ConversationService.pauseAi(activeConv.id);
    } catch {
      // baseline
    }
  };

  const handleResumeAi = async () => {
    toggleAiStatus(activeConv.id, true);
    toast.success('AI Auto-Pilot Resumed!');
    try {
      await ConversationService.resumeAi(activeConv.id);
    } catch {
      // baseline
    }
  };

  const handleTakeOver = async () => {
    toggleAiStatus(activeConv.id, false);
    toast.success('Human Takeover activated! Salesperson Neha Singh in control.');
    try {
      await ConversationService.takeover(activeConv.id);
    } catch {
      // baseline
    }
  };

  const handleApproveReply = async () => {
    const approvedMsg: ChatMessage = {
      id: `msg-approved-${Date.now()}`,
      conversationId: activeConv.id,
      sender: 'AI',
      senderName: 'LeadPilot AI',
      content: 'Sure! We have great options in Vijay Nagar and Scheme 78. Would you like me to share the price range for 2BHK in these areas?',
      status: 'SEEN',
      timestamp: new Date().toISOString(),
    };
    appendMessage(approvedMsg);
    toast.success('AI Draft Approved & Sent via WhatsApp!');
    try {
      await ConversationService.approveAiReply(activeConv.id);
    } catch {
      // baseline
    }
  };

  const handleAssignSalesperson = () => {
    toast.success('Assigned to Sales Executive Neha Singh');
  };

  const handleBookSiteVisit = async () => {
    toast.success('Site Visit Scheduled for Tomorrow 3:00 PM!');
    try {
      await ConversationService.bookSiteVisit(activeConv.id, 'Tomorrow', '3:00 PM', '2BHK site visit in Vijay Nagar');
    } catch {
      // baseline
    }
  };

  const handleExport = async () => {
    toast.success('Downloading Conversation Export (PDF)...');
    try {
      await ConversationService.exportConversation(activeConv.id, 'pdf');
    } catch {
      // baseline
    }
  };

  return (
    <PageContainer fluid>
      <div className="whatsapp-page-wrapper">
        {/* Top Header metadata bar (Spans full page width) */}
        <ConversationTopHeader
          activeConv={activeConv}
          onMobileBack={() => setMobileView('list')}
        />

        {/* Bottom Workspace: Conversation List + Main Grid (Chat + AI Summary) */}
        <div className={`whatsapp-workspace-container ${mobileView === 'chat' ? 'mobile-show-chat' : 'mobile-show-list'}`}>
          {/* Left Column: All Conversations List Panel (320px) */}
          <ConversationListPanel
            conversations={conversations.length > 0 ? conversations : DEFAULT_CONVERSATIONS}
            activeId={activeConv?.id}
            onSelect={handleSelectConversation}
          />

          {/* Right Workspace Section: Main 2-Column Grid + Bottom Action Bar */}
          <div className="conv-right-workspace-section">
            {/* Main Content Grid: Center Workspace & Right AI Summary */}
            <div className="conv-main-content-grid">
              {/* Center Panel */}
              <div className="conv-center-column-wrapper">
                <ConversationArea
                  activeConv={activeConv}
                  messages={activeMessages.length > 0 ? activeMessages : DEFAULT_MESSAGES}
                  onSendMessage={handleSendMessage}
                  onQuickShortcut={handleQuickShortcut}
                />
              </div>

              {/* Right Panel: AI Summary & Agent Card */}
              <AISummaryRightPanel activeConv={activeConv} />
            </div>

            <BottomActionBar
              activeConv={activeConv}
              onPauseAi={handlePauseAi}
              onResumeAi={handleResumeAi}
              onTakeOver={handleTakeOver}
              onApproveReply={handleApproveReply}
              onAssignSalesperson={handleAssignSalesperson}
              onBookSiteVisit={handleBookSiteVisit}
              onExport={handleExport}
            />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
