'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PageContainer } from '@/components/layout/PageContainer';
import { ConversationFiltersPanel } from '@/components/conversation/ConversationFiltersPanel';
import { ConversationDataTable, ConversationRowData } from '@/components/conversation/ConversationDataTable';
import { ConversationRightWidgets } from '@/components/conversation/ConversationRightWidgets';
import { RefreshCw, Download, Filter, Plus, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

const MOCK_TABLE_ROWS: ConversationRowData[] = [
  {
    id: 'row-1',
    leadId: 'conv-rohit-1',
    customerName: 'Rohit Sharma',
    initials: 'RS',
    avatarColorClass: 'avatar-teal',
    phone: '+91 98765 43210',
    source: 'Facebook',
    project: 'Sunshine Villas',
    assignedTo: {
      name: 'Neha Singh',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
    },
    aiStatus: 'AI Active',
    unreadCount: 2,
    lastMessage: 'I am looking for a 2BHK in Indore.',
    lastActivity: '2m ago',
    score: 85,
  },
  {
    id: 'row-2',
    leadId: 'conv-priya-2',
    customerName: 'Priya Verma',
    initials: 'PV',
    avatarColorClass: 'avatar-purple',
    phone: '+91 91234 56789',
    source: 'Instagram',
    project: 'Green Heights',
    assignedTo: {
      name: 'Amit Kumar',
      avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&auto=format&fit=crop&q=80',
    },
    aiStatus: 'AI Active',
    unreadCount: 1,
    lastMessage: 'Can you share the brochure?',
    lastActivity: '5m ago',
    score: 72,
  },
  {
    id: 'row-3',
    leadId: 'conv-amit-3',
    customerName: 'Amit Kumar',
    initials: 'AK',
    avatarColorClass: 'avatar-pink',
    phone: '+91 99887 76655',
    source: 'Google Ads',
    project: 'Royal Residency',
    assignedTo: {
      name: 'Raj Mehta',
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80',
    },
    aiStatus: 'Human Takeover',
    unreadCount: 0,
    lastMessage: 'What is the total cost?',
    lastActivity: '12m ago',
    score: 68,
  },
  {
    id: 'row-4',
    leadId: 'conv-sneha-4',
    customerName: 'Sneha Iyer',
    initials: 'SI',
    avatarColorClass: 'avatar-orange',
    phone: '+91 87654 32109',
    source: 'Website',
    project: 'Lake View Homes',
    assignedTo: {
      name: 'Neha Singh',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
    },
    aiStatus: 'AI Active',
    unreadCount: 3,
    lastMessage: 'I want to schedule a visit.',
    lastActivity: '18m ago',
    score: 90,
  },
  {
    id: 'row-5',
    leadId: 'conv-vikram-5',
    customerName: 'Vikram Singh',
    initials: 'VS',
    avatarColorClass: 'avatar-green',
    phone: '+91 76543 21098',
    source: 'Manual',
    project: 'Park Avenue',
    assignedTo: {
      name: 'Rohit Tiwari',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    },
    aiStatus: 'Paused',
    unreadCount: 0,
    lastMessage: 'Is home loan available?',
    lastActivity: '25m ago',
    score: 55,
  },
  {
    id: 'row-6',
    leadId: 'conv-deepak-6',
    customerName: 'Deepak Sharma',
    initials: 'DS',
    avatarColorClass: 'avatar-blue',
    phone: '+91 88991 12233',
    source: 'Facebook',
    project: 'Sunshine Villas',
    assignedTo: {
      name: 'Amit Kumar',
      avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&auto=format&fit=crop&q=80',
    },
    aiStatus: 'AI Active',
    unreadCount: 2,
    lastMessage: 'Please share the location.',
    lastActivity: '32m ago',
    score: 63,
  },
  {
    id: 'row-7',
    leadId: 'conv-anjali-7',
    customerName: 'Anjali Nair',
    initials: 'AN',
    avatarColorClass: 'avatar-purple',
    phone: '+91 93456 77889',
    source: 'Instagram',
    project: 'Green Heights',
    assignedTo: {
      name: 'Raj Mehta',
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80',
    },
    aiStatus: 'Human Takeover',
    unreadCount: 0,
    lastMessage: 'What is the possession time?',
    lastActivity: '45m ago',
    score: 78,
  },
  {
    id: 'row-8',
    leadId: 'conv-manish-8',
    customerName: 'Manish Gupta',
    initials: 'MG',
    avatarColorClass: 'avatar-gold',
    phone: '+91 90011 22334',
    source: 'Google Ads',
    project: 'Royal Residency',
    assignedTo: {
      name: 'Neha Singh',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
    },
    aiStatus: 'AI Active',
    unreadCount: 1,
    lastMessage: 'Thanks! I will visit.',
    lastActivity: '1h ago',
    score: 80,
  },
  {
    id: 'row-9',
    leadId: 'conv-pooja-9',
    customerName: 'Pooja Bansal',
    initials: 'PB',
    avatarColorClass: 'avatar-teal',
    phone: '+91 91222 33445',
    source: 'Website',
    project: 'Lake View Homes',
    assignedTo: {
      name: 'Rohit Tiwari',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    },
    aiStatus: 'AI Active',
    unreadCount: 4,
    lastMessage: 'Price range?',
    lastActivity: '1h ago',
    score: 61,
  },
  {
    id: 'row-10',
    leadId: 'conv-sandeep-10',
    customerName: 'Sandeep Kumar',
    initials: 'SK',
    avatarColorClass: 'avatar-green',
    phone: '+91 98880 11223',
    source: 'Manual',
    project: 'Park Avenue',
    assignedTo: {
      name: 'Amit Kumar',
      avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&auto=format&fit=crop&q=80',
    },
    aiStatus: 'Qualified',
    unreadCount: 0,
    lastMessage: 'Great, please confirm visit.',
    lastActivity: '2h ago',
    score: 70,
  },
];

export default function ConversationDashboardPage() {
  const [selectedFilter, setSelectedFilter] = useState<string>('All Conversations');

  const filteredRows = MOCK_TABLE_ROWS.filter((r) => {
    if (selectedFilter === 'All Conversations') return true;
    if (selectedFilter === 'Unread') return r.unreadCount > 0;
    if (selectedFilter === 'AI Active') return r.aiStatus === 'AI Active';
    if (selectedFilter === 'Human Takeover') return r.aiStatus === 'Human Takeover';
    if (selectedFilter === 'Qualified') return r.aiStatus === 'Qualified';
    if (selectedFilter === 'Paused') return r.aiStatus === 'Paused';
    if (selectedFilter === r.source) return true;
    return true;
  });

  const handleRefresh = () => {
    toast.success('Conversations list refreshed!');
  };

  const handleExport = () => {
    toast.success('Exporting conversations CSV...');
  };

  return (
    <PageContainer fluid>
      <div className="conv-dashboard-fluid-container">
        {/* Top Title & Header Actions Bar */}
        <div className="conv-dashboard-header-bar">
          <div className="conv-dashboard-title-group">
            <h1 className="conv-dashboard-title">Conversations</h1>
            <p className="conv-dashboard-subtitle">
              Monitor AI and customer conversations from all lead sources.
            </p>
          </div>

          <div className="conv-dashboard-actions-group">
            <button type="button" onClick={handleRefresh} className="btn-dash-action">
              <RefreshCw size={15} />
              <span>Refresh</span>
            </button>

            <button type="button" onClick={handleExport} className="btn-dash-action">
              <Download size={15} />
              <span>Export</span>
            </button>

            <button type="button" className="btn-dash-action">
              <Filter size={15} />
              <span>Filter</span>
            </button>

            <Link href="/ai-whatsapp-conversation" className="btn-dash-primary">
              <Plus size={16} />
              <span>New Conversation</span>
              <ChevronDown size={14} />
            </Link>
          </div>
        </div>

        {/* Main 3-Column Grid Layout */}
        <div className="conv-dashboard-grid-layout">
          {/* Column 1: Left Filters Panel */}
          <ConversationFiltersPanel
            activeFilter={selectedFilter}
            onSelectFilter={(f) => setSelectedFilter(f)}
            onClearAll={() => setSelectedFilter('All Conversations')}
          />

          {/* Column 2: Center Data Table */}
          <ConversationDataTable
            rows={filteredRows}
            selectedFilter={selectedFilter}
          />

          {/* Column 3: Right Overview & Activity Widgets */}
          <ConversationRightWidgets />
        </div>
      </div>
    </PageContainer>
  );
}
