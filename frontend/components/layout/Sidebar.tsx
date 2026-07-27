'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import {
  Home,
  Users,
  MessageSquare,
  Sparkles,
  Bot,
  Megaphone,
  Zap,
  Calendar,
  Tag,
  BarChart3,
  BookOpen,
  Layers,
  Settings,
  Building2,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { SidebarItem } from './SidebarItem';
import { useUIStore } from '@/store/useUIStore';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { useUserStore } from '@/store/useUserStore';
import Image from 'next/image';

interface NavConfig {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
}

const NAV_ITEMS: NavConfig[] = [
  { href: '/overview', label: 'Overview', icon: <Home size={18} /> },
  { href: '/lead-inbox', label: 'Leads', icon: <Users size={18} /> },
  { href: '/conversation', label: 'Conversations', icon: <MessageSquare size={18} />, badge: 18 },
  { href: '/qualification', label: 'AI Qualification', icon: <Sparkles size={18} /> },
  { href: '/ai-agents', label: 'AI Agents', icon: <Bot size={18} /> },
  { href: '/whatsapp', label: 'WhatsApp', icon: <MessageSquare size={18} /> },
  { href: '/campaigns', label: 'Campaigns', icon: <Megaphone size={18} /> },
  { href: '/automations', label: 'Automations', icon: <Zap size={18} /> },
  { href: '/site-visits', label: 'Site Visits', icon: <Calendar size={18} /> },
  { href: '/bookings', label: 'Bookings', icon: <Tag size={18} /> },
  { href: '/reports', label: 'Reports', icon: <BarChart3 size={18} /> },
  { href: '/knowledge-base', label: 'Knowledge Base', icon: <BookOpen size={18} /> },
  { href: '/integrations', label: 'Integrations', icon: <Layers size={18} /> },
  { href: '/team', label: 'Team', icon: <Users size={18} /> },
  { href: '/settings', label: 'Settings', icon: <Settings size={18} /> },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebar } = useUIStore();
  const { currentWorkspace, toggleDropdown } = useWorkspaceStore();
  const { profile, toggleProfileMenu } = useUserStore();

  return (
    <aside className={`sidebar-container ${isSidebarCollapsed ? 'collapsed' : ''}`}>
      {/* Sidebar Header / Branding */}
      <div className="sidebar-header-branding">
        {!isSidebarCollapsed ? (
          <div className="sidebar-logo-group">
            <div className="sidebar-logo-icon">L</div>
            <span className="sidebar-logo-text">LeadPilot AI</span>
          </div>
        ) : (
          <div className="sidebar-logo-icon">L</div>
        )}
        <button
          type="button"
          className="sidebar-collapse-btn"
          onClick={toggleSidebar}
          title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Main Scrollable Menu Links */}
      <nav className="sidebar-nav-scroll">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href === '/overview' && (pathname === '/' || pathname === '/dashboard'));
          return (
            <SidebarItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              badge={item.badge}
              isActive={isActive}
              isCollapsed={isSidebarCollapsed}
            />
          );
        })}
      </nav>

      {/* Bottom Cards: Workspace & Logged User */}
      <div className="sidebar-bottom-cards">
        {!isSidebarCollapsed ? (
          <>
            {/* Bottom Workspace Card */}
            <div className="sidebar-workspace-card" onClick={toggleDropdown}>
              <div className="user-card-left">
                <Building2 size={16} className="text-muted" />
                <div>
                  <div className="workspace-name-title">
                    {currentWorkspace.name}
                  </div>
                  <div className="workspace-role-sub">
                    Workspace
                  </div>
                </div>
              </div>
              <span className="text-subtle text-xs">▼</span>
            </div>

            {/* Bottom Logged User Card */}
            <div className="sidebar-user-card">
              <div className="sidebar-user-left">
                <div className="user-avatar-status-wrapper">
                  <Image
                    src={profile.avatarUrl}
                    alt={profile.name}
                    width={34}
                    height={34}
                    className="profile-avatar-img"
                  />
                  <div className="user-online-dot" />
                </div>
                <div>
                  <div className="workspace-name-title">
                    {profile.name}
                  </div>
                  <div className="workspace-role-sub">
                    {profile.role}
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="sidebar-collapse-btn"
                onClick={toggleProfileMenu}
                title="Account Menu"
              >
                <MoreHorizontal size={16} />
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            className="sidebar-collapse-btn full-width-center"
            onClick={toggleProfileMenu}
            title={profile.name}
          >
            <LogOut size={18} />
          </button>
        )}
      </div>
    </aside>
  );
};
