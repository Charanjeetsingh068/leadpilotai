'use client';

import React from 'react';
import { ThumbsUp, Users, Target, FileText, CheckCircle2, ExternalLink, Settings } from 'lucide-react';
import { PageItem } from './FacebookPagesList';

interface SelectedPageCardProps {
  page: PageItem | null;
  onPageSettings?: () => void;
}

export const FacebookSelectedPageCard: React.FC<SelectedPageCardProps> = ({ page, onPageSettings }) => {
  if (!page) {
    return null;
  }

  const handleName = page.handle || `@${page.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

  return (
    <div className="fb-selected-page-card">
      <div className="fb-page-detail-main">
        <div className="fb-big-page-avatar">
          <img
            src={page.pictureUrl || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=150&auto=format&fit=crop&q=80'}
            alt={page.name}
          />
          <span className="fb-page-fb-badge">f</span>
        </div>

        <div className="fb-page-detail-text">
          <div className="fb-page-detail-title-row">
            <h2>{page.name}</h2>
            <span className="fb-active-badge">Active</span>
          </div>

          <p className="fb-page-detail-sub">
            <span>{handleName}</span>
            <span>•</span>
            <span>{page.category || 'Real Estate Company'}</span>
          </p>

          <div className="fb-page-detail-metrics-row">
            <div className="fb-metric-item">
              <ThumbsUp width={14} height={14} />
              <span>12.5K Likes</span>
            </div>

            <div className="fb-metric-item">
              <Users width={14} height={14} />
              <span>{(page.followersCount || 13200).toLocaleString()} Followers</span>
            </div>

            <div className="fb-metric-item">
              <Target width={14} height={14} />
              <span>324 Leads (30 Days)</span>
            </div>

            <div className="fb-metric-item">
              <FileText width={14} height={14} />
              <span>24 Lead Forms</span>
            </div>

            <div className="fb-metric-item">
              <CheckCircle2 width={14} height={14} color="#10b981" />
              <span>Last Sync: Just now</span>
            </div>
          </div>
        </div>
      </div>

      <div className="fb-page-actions">
        <button
          type="button"
          onClick={onPageSettings}
          className="fb-btn-outline"
        >
          <Settings width={15} height={15} />
          <span>Page Settings</span>
        </button>

        <a
          href={`https://facebook.com/${page.pageId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fb-btn-outline"
        >
          <span>View on Facebook</span>
          <ExternalLink width={14} height={14} />
        </a>
      </div>
    </div>
  );
};
