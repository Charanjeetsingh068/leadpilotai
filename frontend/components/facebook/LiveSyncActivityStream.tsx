import React from 'react';
import { ArrowRight, Zap, MessageSquare, Bot, Database, UserPlus } from 'lucide-react';
import { FacebookIcon } from './FacebookIcon';
import { InstagramIcon } from './InstagramIcon';
import { LiveActivityItem } from '@/types/facebook.types';

interface Props {
  events: LiveActivityItem[];
}

export const LiveSyncActivityStream: React.FC<Props> = ({ events = [] }) => {
  const renderIcon = (type?: string) => {
    const safeType = (type || 'facebook').toLowerCase();
    if (safeType.includes('lead')) return <UserPlus size={15} className="text-emerald-500" />;
    if (safeType.includes('webhook')) return <Zap size={15} className="text-amber-500" />;
    if (safeType.includes('instagram')) return <InstagramIcon size={15} className="fb-ig-icon" />;
    if (safeType.includes('whatsapp')) return <MessageSquare size={15} className="fb-wa-icon" />;
    if (safeType.includes('ai')) return <Bot size={15} className="text-purple-500" />;
    if (safeType.includes('crm')) return <Database size={15} className="text-blue-500" />;
    return <FacebookIcon size={15} className="fb-activity-fb-svg" />;
  };

  return (
    <div className="fb-card fb-activity-card">
      <div className="fb-card-header-row">
        <h3 className="fb-card-title">Realtime Activity Feed</h3>
        <span className="fb-live-badge">🟢 Live</span>
      </div>

      <div className="fb-activity-list">
        {events.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-400">
            No Synchronization History. Connected account events will appear here in real-time.
          </div>
        ) : (
          events.map((item) => (
            <div key={item.id} className="fb-activity-item">
              <div className="fb-activity-icon">
                {renderIcon(item.type || item.eventType)}
              </div>
              <div className="fb-activity-content">
                <div className="fb-activity-title-row">
                  <span className="fb-activity-title">{item.title}</span>
                  <span className="fb-activity-time">{item.timeAgo || (item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now')}</span>
                </div>
                <div className="fb-activity-desc">{item.description}</div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="fb-activity-footer">
        <button type="button" className="fb-link-view-all">
          <span>View all activity logs</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
