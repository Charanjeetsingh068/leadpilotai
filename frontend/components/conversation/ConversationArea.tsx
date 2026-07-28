'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile, Paperclip, Bot, CheckCheck } from 'lucide-react';
import { ChatMessage, Conversation } from '@/types/conversation.types';
import { useConversationStore } from '@/store/useConversationStore';
import { ActivityLogTab } from './ActivityLogTab';

interface ConversationAreaProps {
  activeConv: Conversation;
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  onQuickShortcut: (text: string) => void;
}

export const ConversationArea: React.FC<ConversationAreaProps> = ({
  activeConv,
  messages,
  onSendMessage,
  onQuickShortcut,
}) => {
  const { activeTab, setActiveTab, isAiTyping } = useConversationStore();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAiTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const leadInitials = (activeConv?.leadName || 'RS')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="conv-center-panel">
      {/* Top Tabs Bar */}
      <div className="conv-center-tabs-header">
        <button
          type="button"
          className={`conv-tab-btn ${activeTab === 'Conversation' ? 'active' : ''}`}
          onClick={() => setActiveTab('Conversation')}
        >
          Conversation
        </button>
        <button
          type="button"
          className={`conv-tab-btn ${activeTab === 'Activity Log' ? 'active' : ''}`}
          onClick={() => setActiveTab('Activity Log')}
        >
          Activity Log
        </button>
      </div>

      {activeTab === 'Conversation' ? (
        <div className="conv-workspace-body">
          {/* Messages Scroll Area */}
          <div className="conv-messages-container">
            {/* Date separator */}
            <div className="conv-date-separator">
              <span className="conv-date-pill">Today</span>
            </div>

            {/* Messages */}
            {messages.map((msg) => {
              const isLead = msg.sender === 'LEAD';

              if (isLead) {
                return (
                  <div key={msg.id} className="conv-msg-row msg-row-right">
                    <div className="conv-bubble bubble-customer">
                      <p className="conv-bubble-text">{msg.content}</p>
                      <span className="conv-msg-time">
                        {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:25 AM'}
                        <CheckCheck size={14} className="conv-read-receipt-blue" />
                      </span>
                    </div>
                    <div className="conv-msg-avatar avatar-customer">
                      {leadInitials}
                    </div>
                  </div>
                );
              }

              return (
                <div key={msg.id} className="conv-msg-row msg-row-left">
                  <div className="conv-msg-avatar avatar-bot">
                    <Bot size={16} />
                  </div>
                  <div className="conv-bubble bubble-bot">
                    <p className="conv-bubble-text">{msg.content}</p>
                    <span className="conv-msg-time">
                      {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:24 AM'}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* AI Typing Indicator */}
            {isAiTyping && (
              <div className="conv-msg-row msg-row-left">
                <div className="conv-msg-avatar avatar-bot">
                  <Bot size={16} />
                </div>
                <div className="conv-bubble bubble-bot bubble-typing">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Shortcut Pills Bar */}
          <div className="conv-quick-pills-row">
            <button
              type="button"
              className="conv-shortcut-pill"
              onClick={() => onQuickShortcut('Share Property Options')}
            >
              Property Options
            </button>
            <button
              type="button"
              className="conv-shortcut-pill"
              onClick={() => onQuickShortcut('Share Price Details')}
            >
              Price Details
            </button>
            <button
              type="button"
              className="conv-shortcut-pill"
              onClick={() => onQuickShortcut('Schedule Site Visit')}
            >
              Schedule Visit
            </button>
            <button
              type="button"
              className="conv-shortcut-pill"
              onClick={() => onQuickShortcut('Send Brochure PDF')}
            >
              Brochure
            </button>
          </div>

          {/* Message Input Box */}
          <form className="conv-input-composer" onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Type your message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="conv-composer-input"
            />
            <div className="conv-composer-actions">
              <button type="button" className="conv-input-icon-btn" title="Emoji Picker">
                <Smile size={18} />
              </button>
              <button type="button" className="conv-input-icon-btn" title="Attach Media/File">
                <Paperclip size={18} />
              </button>
              <button type="submit" className="conv-send-blue-btn" title="Send Message">
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <ActivityLogTab conversationId={activeConv?.id} />
      )}
    </div>
  );
};
