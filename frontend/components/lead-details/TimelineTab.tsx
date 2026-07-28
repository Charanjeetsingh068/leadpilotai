'use client';

import React, { useState } from 'react';
import { MessageSquare, Bot, Calendar, FileText, Camera, Paperclip, Smile, Send } from 'lucide-react';
import { useLeadDetailsStore } from '@/store/useLeadDetailsStore';

export const TimelineTab: React.FC = () => {
  const { timeline, addNote } = useLeadDetailsStore();
  const [noteText, setNoteText] = useState<string>('');

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    addNote(noteText.trim());
    setNoteText('');
  };

  const renderIcon = (type: string) => {
    switch (type) {
      case 'whatsapp_ai':
      case 'whatsapp_customer':
        return <MessageSquare size={14} className="timeline-icon-svg" />;
      case 'score_update':
        return <Bot size={14} className="timeline-icon-svg" />;
      case 'site_visit':
        return <Calendar size={14} className="timeline-icon-svg" />;
      case 'brochure':
        return <FileText size={14} className="timeline-icon-svg" />;
      case 'instagram':
        return <Camera size={14} className="timeline-icon-svg" />;
      default:
        return <MessageSquare size={14} className="timeline-icon-svg" />;
    }
  };

  return (
    <div className="timeline-tab-container">
      {/* Date Marker Header 1 */}
      <div className="timeline-date-divider">
        <span>May 26, 2025</span>
      </div>

      {/* May 26 Timeline Feed Stream */}
      <div className="timeline-stream-wrapper">
        {timeline.slice(0, 6).map((item) => (
          <div key={item.id} className="timeline-stream-item">
            <div className={`timeline-icon-circle ${item.iconBg || 'bg-green'}`}>
              {renderIcon(item.type)}
            </div>

            <div className="timeline-content-card">
              <div className="timeline-item-header-row">
                <span className="timeline-item-title">{item.title}</span>
                <span className="timeline-item-meta">
                  {item.time} {item.user ? `by ${item.user}` : ''}
                </span>
              </div>

              <div className="timeline-item-body">
                {item.linkText ? (
                  <a href={item.linkHref || '#'} className="timeline-file-link">
                    {item.linkText}
                  </a>
                ) : (
                  <p className="timeline-desc-text">{item.description}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Date Marker Header 2 */}
      <div className="timeline-date-divider">
        <span>May 25, 2025</span>
      </div>

      {/* May 25 Timeline Feed Stream */}
      <div className="timeline-stream-wrapper">
        {timeline.slice(6).map((item) => (
          <div key={item.id} className="timeline-stream-item">
            <div className={`timeline-icon-circle ${item.iconBg || 'bg-pink'}`}>
              {renderIcon(item.type)}
            </div>

            <div className="timeline-content-card">
              <div className="timeline-item-header-row">
                <span className="timeline-item-title">{item.title}</span>
                <span className="timeline-item-meta">
                  {item.time} {item.user ? `by ${item.user}` : ''}
                </span>
              </div>

              <div className="timeline-item-body">
                <p className="timeline-desc-text">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Quick Note Input Bar */}
      <form onSubmit={handleNoteSubmit} className="timeline-quick-note-box">
        <input
          type="text"
          className="timeline-note-input"
          placeholder="Type your note here..."
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
        />

        <div className="timeline-note-actions">
          <button type="button" className="note-icon-action" title="Attach file">
            <Paperclip size={16} />
          </button>
          <button type="button" className="note-icon-action" title="Insert Emoji">
            <Smile size={16} />
          </button>
          <button type="submit" className="note-btn-primary">
            <Send size={14} /> Add Note
          </button>
        </div>
      </form>
    </div>
  );
};
