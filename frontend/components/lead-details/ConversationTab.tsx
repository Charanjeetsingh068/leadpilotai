'use client';

import React, { useState } from 'react';
import { Send, Paperclip, Smile, CheckCheck, FileText, Download } from 'lucide-react';
import { useLeadDetailsStore } from '@/store/useLeadDetailsStore';

export const ConversationTab: React.FC = () => {
  const { messages, lead } = useLeadDetailsStore();
  const [inputText, setInputText] = useState<string>('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Dispatch message logic
    setInputText('');
  };

  return (
    <div className="conversation-tab-container">
      {/* WhatsApp Chat Room Sub-Header */}
      <div className="whatsapp-chat-header-bar">
        <div className="chat-header-user-info">
          <span className="chat-user-name">{lead?.name || 'Rohit Sharma'}</span>
          <span className="chat-user-phone">{lead?.phone || '+91 98765 43210'}</span>
        </div>
        <span className="chat-encryption-badge">🔒 End-to-end encrypted WhatsApp integration</span>
      </div>

      {/* WhatsApp Chat Scroll Feed */}
      <div className="whatsapp-chat-scroll-area">
        {messages.map((msg) => {
          const isCustomer = msg.sender === 'CUSTOMER';
          return (
            <div
              key={msg.id}
              className={`chat-bubble-row ${isCustomer ? 'bubble-row-left' : 'bubble-row-right'}`}
            >
              <div className={`chat-bubble ${isCustomer ? 'bubble-customer' : 'bubble-agent'}`}>
                <div className="bubble-sender-name">{msg.senderName}</div>

                {msg.mediaType === 'pdf' && (
                  <div className="chat-media-attachment-box">
                    <FileText size={24} className="text-primary" />
                    <div className="media-info">
                      <span className="media-title">Sunshine_Villas_3BHK_Brochure.pdf</span>
                      <span className="media-size">1.4 MB • PDF Document</span>
                    </div>
                    <a href={msg.mediaUrl || '#'} className="media-download-btn" title="Download">
                      <Download size={14} />
                    </a>
                  </div>
                )}

                <p className="bubble-text">{msg.text}</p>

                <div className="bubble-footer-meta">
                  <span className="bubble-timestamp">{msg.time}</span>
                  {!isCustomer && (
                    <CheckCheck size={14} className="read-receipt-check text-blue" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* WhatsApp Chat Message Composer Bar */}
      <form onSubmit={handleSendMessage} className="whatsapp-chat-input-bar">
        <button type="button" className="chat-tool-btn" title="Attach Document / Media">
          <Paperclip size={18} />
        </button>
        <button type="button" className="chat-tool-btn" title="Insert Emoji">
          <Smile size={18} />
        </button>

        <input
          type="text"
          className="chat-message-input"
          placeholder="Type a WhatsApp message to customer..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />

        <button type="submit" className="chat-send-btn">
          <Send size={16} /> Send
        </button>
      </form>
    </div>
  );
};
