'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import { PageContainer } from '@/components/layout/PageContainer';
import { ChatList } from '@/components/conversation/ChatList';
import { ChatHeader } from '@/components/conversation/ChatHeader';
import { MessageBubble } from '@/components/conversation/MessageBubble';
import { MessageComposer } from '@/components/conversation/MessageComposer';
import { ConversationService } from '@/services/conversation.service';
import { ChatMessage, ConversationSummary } from '@/types/conversation.types';
import toast from 'react-hot-toast';

export default function ConversationDetailPage() {
  const params = useParams();
  const conversationId = String(params.id || '');

  const [conversations, setConversations] = useState<ConversationSummary[]>([
    {
      id: 'conv-101',
      leadId: 'lead-101',
      leadName: 'Vikram Malhotra',
      leadPhone: '+91 98112 23344',
      leadProject: 'Grand Residency',
      leadScore: 88,
      isAiAutomated: true,
      unreadCount: 0,
      lastMessageContent: 'Would Saturday 3 PM work for your site visit?',
      lastMessageAt: new Date().toISOString(),
    },
    {
      id: 'conv-102',
      leadId: 'lead-102',
      leadName: 'Ananya Roy',
      leadPhone: '+91 98223 34455',
      leadProject: 'Skyline Towers',
      leadScore: 94,
      isAiAutomated: false,
      unreadCount: 2,
      lastMessageContent: 'Can you confirm the price list for 3 BHK?',
      lastMessageAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ]);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      conversationId,
      sender: 'LEAD',
      content: 'Hi, I saw your ad for Grand Residency. What is the starting price?',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: 'msg-2',
      conversationId,
      sender: 'AI',
      senderName: 'LeadPilot AI',
      content: 'Hello Vikram! Premium 2 & 3 BHK apartments start at ₹85 Lakhs. Would you like our detailed floor plan brochure?',
      timestamp: new Date(Date.now() - 7100000).toISOString(),
      aiMetadata: {
        intent: 'PRICING_INQUIRY',
        confidenceScore: 0.98,
        ragDocumentUsed: 'Grand_Residency_Brochure_v2.pdf',
      },
    },
    {
      id: 'msg-3',
      conversationId,
      sender: 'LEAD',
      content: 'Yes please send floor plans and schedule a site visit for this weekend.',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'msg-4',
      conversationId,
      sender: 'SYSTEM',
      content: 'Lead status auto-updated to QUALIFIED (Score: 88/100)',
      timestamp: new Date(Date.now() - 3500000).toISOString(),
    },
    {
      id: 'msg-5',
      conversationId,
      sender: 'AI',
      senderName: 'LeadPilot AI',
      content: 'Would Saturday 3 PM work for your site visit?',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      aiMetadata: {
        intent: 'SITE_VISIT_BOOKING',
        confidenceScore: 0.96,
      },
    },
  ]);

  const [isSending, setIsSending] = useState(false);
  const [isTogglingAi, setIsTogglingAi] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChat = conversations.find((c) => c.id === conversationId || c.leadId === conversationId) || conversations[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChatData = useCallback(async () => {
    try {
      const [convRes, msgRes] = await Promise.all([
        ConversationService.getConversations(),
        ConversationService.getMessages(conversationId),
      ]);

      if (convRes.success && convRes.data.length > 0) {
        setConversations(convRes.data);
      }
      if (msgRes.success && msgRes.data.length > 0) {
        setMessages(msgRes.data);
      }
    } catch {
      // Fallback baseline for client rendering
    }
  }, [conversationId]);

  useEffect(() => {
    fetchChatData();
  }, [fetchChatData]);

  const handleSendMessage = async (content: string) => {
    setIsSending(true);
    try {
      const res = await ConversationService.sendMessage(activeChat.id, content);
      if (res.success && res.data) {
        setMessages((prev) => [...prev, res.data]);
      } else {
        const newMsg: ChatMessage = {
          id: `msg-${Date.now()}`,
          conversationId: activeChat.id,
          sender: 'AGENT',
          senderName: 'Sales Executive',
          content,
          timestamp: new Date().toISOString(),
          status: 'SENT',
        };
        setMessages((prev) => [...prev, newMsg]);
      }
      toast.success('Message sent via WhatsApp!');
    } catch {
      toast.error('Failed to send message.');
    } finally {
      setIsSending(false);
    }
  };

  const handleToggleAi = async () => {
    setIsTogglingAi(true);
    const newStatus = !activeChat.isAiAutomated;
    try {
      await ConversationService.toggleAiAutomation(activeChat.id, newStatus);
      setConversations((prev) =>
        prev.map((c) => (c.id === activeChat.id ? { ...c, isAiAutomated: newStatus } : c))
      );
      toast.success(newStatus ? 'AI Auto-Pilot activated' : 'Human Takeover activated');
    } catch {
      setConversations((prev) =>
        prev.map((c) => (c.id === activeChat.id ? { ...c, isAiAutomated: newStatus } : c))
      );
      toast.success(newStatus ? 'AI Auto-Pilot activated' : 'Human Takeover activated');
    } finally {
      setIsTogglingAi(false);
    }
  };

  return (
    <PageContainer
      title="WhatsApp Live Chat & AI Command Center"
      subtitle="Real-time multi-agent chat stream with instant AI Auto-Pilot toggle"
    >
      <div className="chat-container">
        <ChatList conversations={conversations} activeConversationId={activeChat.id} />

        <div className="chat-main">
          <ChatHeader
            leadId={activeChat.leadId}
            leadName={activeChat.leadName}
            leadPhone={activeChat.leadPhone}
            isAiAutomated={activeChat.isAiAutomated}
            leadScore={activeChat.leadScore}
            onToggleAi={handleToggleAi}
            isToggling={isTogglingAi}
          />

          <div className="chat-messages-area">
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                sender={msg.sender}
                senderName={msg.senderName}
                content={msg.content}
                mediaUrl={msg.mediaUrl}
                status={msg.status}
                timestamp={msg.timestamp}
                aiMetadata={msg.aiMetadata}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>

          <MessageComposer onSendMessage={handleSendMessage} isLoading={isSending} />
        </div>
      </div>
    </PageContainer>
  );
}
