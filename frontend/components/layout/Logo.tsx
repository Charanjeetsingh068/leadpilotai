import React from 'react';
import Link from 'next/link';

export interface LogoProps {
  collapsed?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ collapsed = false }) => {
  return (
    <Link href="/dashboard" className="sidebar-logo">
      <div className="sidebar-logo-icon">LP</div>
      {!collapsed ? <span>LeadPilot AI</span> : null}
    </Link>
  );
};
