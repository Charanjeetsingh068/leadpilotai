'use client';

import React, { useEffect, useRef } from 'react';
import { Search, HelpCircle } from 'lucide-react';
import { ThemeSwitcher } from './ThemeSwitcher';
import { NotificationBell } from './NotificationBell';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';
import { ProfileMenu } from './ProfileMenu';

export const Header: React.FC = () => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="header-container">
      {/* Left Search Bar matching reference image */}
      <div className="header-search-wrapper">
        <Search size={16} className="header-search-icon" />
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search anything..."
          className="header-search-input"
        />
        <div className="header-search-shortcut">
          <span>⌘</span>
          <span>K</span>
        </div>
      </div>

      {/* Right User & Action Controls */}
      <div className="header-actions-group">
        <ThemeSwitcher />
        <NotificationBell />

        <button
          type="button"
          className="icon-action-btn"
          title="Help & Documentation"
          aria-label="Help"
        >
          <HelpCircle size={18} />
        </button>

        <WorkspaceSwitcher />
        <ProfileMenu />
      </div>
    </header>
  );
};
