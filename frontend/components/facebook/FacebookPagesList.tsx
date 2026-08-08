'use client';

import React, { useState } from 'react';
import { Plus, Check, Loader2 } from 'lucide-react';
import { facebookIntegrationService } from '@/services/facebook-integration.service';

export interface PageItem {
  id: string;
  pageId: string;
  name: string;
  category?: string;
  handle?: string;
  pictureUrl?: string;
  followersCount?: number;
  unreadLeadsCount?: number;
  status: string;
}

interface FacebookPagesListProps {
  pages: PageItem[];
  selectedPageId: string;
  onSelectPage: (page: PageItem) => void;
  onConnectMore?: () => void;
  facebookAccountId?: string;
}

export const FacebookPagesList: React.FC<FacebookPagesListProps> = ({
  pages,
  selectedPageId,
  onSelectPage,
  onConnectMore,
  facebookAccountId,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [connectingMap, setConnectingMap] = useState<Record<string, boolean>>({});

  const filteredPages = pages.filter((page) => {
    const matchesSearch =
      page.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (page.handle && page.handle.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus =
      statusFilter === 'ALL' || page.status.toUpperCase() === statusFilter.toUpperCase();
    return matchesSearch && matchesStatus;
  });

  const handleConnectClick = async (e: React.MouseEvent, page: PageItem) => {
    e.stopPropagation();
    const pId = page.id || page.pageId;
    setConnectingMap((prev) => ({ ...prev, [pId]: true }));
    try {
      await facebookIntegrationService.connectPage(pId);
      page.status = 'Active';
    } catch (err) {
      console.error('Page connect error:', err);
    } finally {
      setConnectingMap((prev) => ({ ...prev, [pId]: false }));
    }
  };

  return (
    <div className="fb-pages-sidebar">
      <h3 className="fb-sidebar-header-title">Your Facebook Pages</h3>

      <div className="fb-sidebar-search-row">
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            type="text"
            placeholder="Search pages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="fb-sidebar-search-input"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="fb-sidebar-filter-select"
        >
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      <div className="fb-pages-list">
        {filteredPages.map((page) => {
          const isSelected = selectedPageId === page.id || selectedPageId === page.pageId;
          const handleName = page.handle || `@${page.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
          const unreadCount = page.unreadLeadsCount || 120;
          const pId = page.id || page.pageId;
          const isConnecting = Boolean(connectingMap[pId]);
          const isConnected = page.status.toUpperCase() === 'ACTIVE' || page.status.toUpperCase() === 'CONNECTED';

          return (
            <div
              key={pId}
              onClick={() => onSelectPage(page)}
              className={`fb-page-item-btn ${isSelected ? 'selected' : ''}`}
            >
              <div className="fb-page-item-left">
                <div className="fb-page-avatar-wrap">
                  <img
                    src={page.pictureUrl || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=150&auto=format&fit=crop&q=80'}
                    alt={page.name}
                    className="fb-page-avatar-img"
                  />
                  <span className="fb-page-fb-badge">f</span>
                </div>

                <div className="fb-page-item-info">
                  <span className="fb-page-item-name">{page.name}</span>
                  <span className="fb-page-item-handle">{handleName}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div className="fb-page-unread-pill">
                  <span className="fb-page-unread-dot"></span>
                  <span>{unreadCount}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
