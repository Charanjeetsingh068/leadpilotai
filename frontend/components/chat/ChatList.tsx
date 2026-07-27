import React from 'react';
import Link from 'next/link';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Search } from '@/components/ui/Search';
import { Bot, UserCheck } from 'lucide-react';

export interface ChatSummary {
  id: string;
  leadId: string;
  leadName: string;
  leadPhone: string;
  leadProject?: string;
  leadScore?: number;
  isAiAutomated: boolean;
  unreadCount: number;
  lastMessageContent: string;
  lastMessageAt: string;
}

export interface ChatListProps {
  conversations: ChatSummary[];
  activeConversationId?: string;
  onSearch?: (query: string) => void;
}

export const ChatList: React.FC<ChatListProps> = ({
  conversations,
  activeConversationId,
  onSearch,
}) => {
  return (
    <div className="chat-sidebar">
      <div className="chat-sidebar-header">
        <Search placeholder="Search active chats..." onSearch={(q) => onSearch?.(q)} />
      </div>

      <div className="chat-list">
        {conversations.length === 0 ? (
          <div style={{ padding: '2rem 1rem', textAlign: 'center' }} className="text-muted">
            No active conversations.
          </div>
        ) : (
          conversations.map((chat) => {
            const isActive = chat.id === activeConversationId || chat.leadId === activeConversationId;

            return (
              <Link
                key={chat.id}
                href={`/conversation/${chat.id}`}
                className={`chat-item ${isActive ? 'is-active' : ''}`}
              >
                <Avatar name={chat.leadName} size="md" />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }} className="truncate">
                      {chat.leadName}
                    </span>
                    <span className="text-subtle" style={{ fontSize: '10px' }}>
                      {new Date(chat.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-muted truncate" style={{ margin: '0.2rem 0', fontSize: '0.75rem' }}>
                    {chat.lastMessageContent || 'No messages yet.'}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      {chat.isAiAutomated ? (
                        <Badge variant="success" label="AI Auto" dot />
                      ) : (
                        <Badge variant="warning" label="Human" />
                      )}
                    </div>

                    {chat.unreadCount > 0 ? (
                      <span className="notification-badge" style={{ position: 'static' }}>
                        {chat.unreadCount}
                      </span>
                    ) : null}
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
};
