'use client';

import React, { useState } from 'react';
import { Pin, Send, Plus, User } from 'lucide-react';
import { useLeadDetailsStore } from '@/store/useLeadDetailsStore';

export const NotesTab: React.FC = () => {
  const { notes, addNote } = useLeadDetailsStore();
  const [content, setContent] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    addNote(content.trim());
    setContent('');
  };

  return (
    <div className="notes-tab-container">
      {/* Note Input Composer */}
      <form onSubmit={handleSubmit} className="notes-composer-card">
        <textarea
          className="notes-textarea"
          rows={3}
          placeholder="Type internal sales note, follow-up comments, or mention team members..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="notes-composer-footer">
          <span className="notes-hint-text">💡 Tip: Notes are visible to all assigned team members</span>
          <button type="submit" className="note-submit-primary-btn">
            <Send size={14} /> Add Internal Note
          </button>
        </div>
      </form>

      {/* Notes Stream Feed */}
      <div className="notes-feed-list">
        {notes.map((n) => (
          <div key={n.id} className={`note-feed-card ${n.isPinned ? 'note-pinned-card' : ''}`}>
            <div className="note-card-header">
              <div className="note-author-group">
                <div className="note-author-avatar">
                  <User size={14} />
                </div>
                <div>
                  <span className="note-author-name">{n.authorName}</span>
                  <span className="note-author-role"> • {n.authorRole}</span>
                </div>
              </div>
              {n.isPinned && (
                <span className="note-pin-badge">
                  <Pin size={12} /> Pinned Note
                </span>
              )}
            </div>

            <p className="note-card-body">{n.content}</p>
            <div className="note-card-footer">{n.createdAt}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
