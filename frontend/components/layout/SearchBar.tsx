'use client';

import React from 'react';
import { Search } from 'lucide-react';

export const SearchBar: React.FC = () => {
  return (
    <div className="header-search">
      <Search size={16} className="header-search-icon" />
      <input
        type="text"
        className="header-search-input"
        placeholder="Search leads, conversations, projects..."
        readOnly
      />
      <span className="header-search-shortcut">Ctrl K</span>
    </div>
  );
};
