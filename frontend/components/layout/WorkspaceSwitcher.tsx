'use client';

import React from 'react';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { ChevronDown, Building2 } from 'lucide-react';

export const WorkspaceSwitcher: React.FC = () => {
  const { currentWorkspace, workspaces, isDropdownOpen, toggleDropdown, switchWorkspace } =
    useWorkspaceStore();

  return (
    <div className="pos-relative">
      <button
        type="button"
        className="workspace-switcher-dropdown-btn"
        onClick={toggleDropdown}
      >
        <Building2 size={16} className="text-muted" />
        <div>
          <div className="workspace-name-title">
            {currentWorkspace.name}
          </div>
          <div className="workspace-role-sub">
            {currentWorkspace.role}
          </div>
        </div>
        <ChevronDown size={14} className="text-muted" />
      </button>

      {isDropdownOpen ? (
        <div className="header-dropdown-card">
          <div className="header-dropdown-header-title">
            SWITCH WORKSPACE
          </div>
          {workspaces.map((ws) => (
            <div
              key={ws.id}
              onClick={() => switchWorkspace(ws.id)}
              className={`header-dropdown-item ${ws.id === currentWorkspace.id ? 'active' : ''}`}
            >
              <span>{ws.name}</span>
              <span className="text-muted text-xs">{ws.role}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};
