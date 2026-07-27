import React from 'react';
import { Bot, CheckCheck } from 'lucide-react';
import { MessageSender, MessageStatus } from '@/types/conversation.types';

export interface MessageBubbleProps {
  sender: MessageSender;
  senderName?: string;
  content: string;
  mediaUrl?: string;
  status?: MessageStatus;
  timestamp: string;
  aiMetadata?: {
    intent?: string;
    confidenceScore?: number;
    ragDocumentUsed?: string;
  };
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  sender,
  senderName,
  content,
  mediaUrl,
  timestamp,
  aiMetadata,
}) => {
  if (sender === 'SYSTEM') {
    return (
      <div className="message-bubble system">
        <span>{content}</span>
      </div>
    );
  }

  const isAgent = sender === 'AGENT';
  const isAi = sender === 'AI';

  return (
    <div className={`message-bubble ${sender.toLowerCase()}`}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, opacity: 0.85 }}>
          {isAi ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#15803d' }}>
              <Bot size={12} /> LeadPilot AI
            </span>
          ) : (
            senderName || (isAgent ? 'Sales Executive' : 'Customer')
          )}
        </span>
      </div>

      <p style={{ margin: 0 }}>{content}</p>

      {mediaUrl ? (
        <div style={{ marginTop: '0.5rem' }}>
          <a href={mediaUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', textDecoration: 'underline' }}>
            View Attachment
          </a>
        </div>
      ) : null}

      {aiMetadata?.ragDocumentUsed ? (
        <div style={{ marginTop: '0.35rem', fontSize: '10px', opacity: 0.8, borderTop: '1px solid #bbf7d0', paddingTop: '0.2rem' }}>
          Source Doc: {aiMetadata.ragDocumentUsed}
        </div>
      ) : null}

      <div className="message-meta">
        <span>{new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        {isAgent ? <CheckCheck size={12} /> : null}
      </div>
    </div>
  );
};
