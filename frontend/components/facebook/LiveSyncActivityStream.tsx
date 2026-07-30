import React from 'react';
import { ArrowRight } from 'lucide-react';
import { FacebookIcon } from './FacebookIcon';
import { LiveActivityItem } from '@/types/facebook.types';

interface Props {
  events: LiveActivityItem[];
}

export const LiveSyncActivityStream: React.FC<Props> = ({ events = [] }) => {
  return (
    <div className="fb-card fb-activity-card">
      <div className="fb-card-header-row">
        <h3 className="fb-card-title">Live Sync Activity</h3>
        <span className="fb-live-badge">🟢 Live</span>
      </div>

      <div className="fb-activity-list">
        {events.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            No live events recorded yet. Connected account activities will appear here in real-time.
          </div>
        ) : (
          events.map((item) => (
            <div key={item.id} className="fb-activity-item">
              <div className="fb-activity-icon">
                <FacebookIcon size={16} className="fb-activity-fb-svg" />
              </div>
              <div className="fb-activity-content">
                <div className="fb-activity-title-row">
                  <span className="fb-activity-title">{item.title}</span>
                  <span className="fb-activity-time">{item.timeAgo || item.timestamp}</span>
                </div>
                <div className="fb-activity-desc">{item.description}</div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="fb-activity-footer">
        <button type="button" className="fb-link-view-all">
          <span>View all activity</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
