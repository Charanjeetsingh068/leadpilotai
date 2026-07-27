import React from 'react';
import { MessageSquare, Bot, Calendar, FileText } from 'lucide-react';
import { RecentActivityItem } from '@/types/dashboard.types';

export interface RecentActivitiesListProps {
  activities: RecentActivityItem[];
}

export const RecentActivitiesList: React.FC<RecentActivitiesListProps> = ({ activities }) => {
  return (
    <div className="card recent-leads-card-padding">
      <div className="recent-leads-header-row">
        <h3 className="recent-leads-title">
          Recent AI Activities
        </h3>
        <button
          type="button"
          className="more-action-btn view-all-link"
        >
          View all
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {activities.map((act) => {
          const typeClass =
            act.iconType === 'whatsapp'
              ? 'activity-whatsapp'
              : act.iconType === 'robot'
              ? 'activity-robot'
              : act.iconType === 'calendar'
              ? 'activity-calendar'
              : 'activity-document';

          return (
            <div key={act.id} className="activity-row-item">
              <div className={`activity-icon-badge ${typeClass}`}>
                {act.iconType === 'whatsapp' ? (
                  <MessageSquare size={14} />
                ) : act.iconType === 'robot' ? (
                  <Bot size={14} />
                ) : act.iconType === 'calendar' ? (
                  <Calendar size={14} />
                ) : (
                  <FileText size={14} />
                )}
              </div>
              <div className="flex-1">
                <p className="activity-text-desc">{act.description}</p>
              </div>
              <span className="activity-time-stamp">{act.timeAgo}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
