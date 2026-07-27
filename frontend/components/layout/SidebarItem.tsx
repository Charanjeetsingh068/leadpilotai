import React from 'react';
import Link from 'next/link';

export interface SidebarItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
  isActive: boolean;
  isCollapsed?: boolean;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  href,
  label,
  icon,
  badge,
  isActive,
  isCollapsed = false,
}) => {
  return (
    <Link
      href={href}
      className={`sidebar-menu-item ${isActive ? 'active' : ''}`}
      title={isCollapsed ? label : undefined}
    >
      <div className="sidebar-menu-left">
        <span>{icon}</span>
        {!isCollapsed ? <span>{label}</span> : null}
      </div>
      {!isCollapsed && badge ? (
        <span className="sidebar-count-badge">{badge}</span>
      ) : null}
    </Link>
  );
};
