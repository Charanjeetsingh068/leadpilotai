'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Drawer } from '@/components/ui/Drawer';
import { useUIStore } from '@/store/useUIStore';

export interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { isSidebarCollapsed, activeDrawer, closeDrawer } = useUIStore();

  const marginLeft = isSidebarCollapsed
    ? 'var(--sidebar-collapsed-width)'
    : 'var(--sidebar-expanded-width)';

  return (
    <ProtectedRoute>
      <div className="app-layout">
        <Sidebar />
        <div className="app-main" style={{ marginLeft }}>
          <Header />
          <main className="app-content">{children}</main>
        </div>

        {/* Reusable Global Drawer Integration */}
        <Drawer
          isOpen={activeDrawer === 'NOTIFICATIONS'}
          onClose={closeDrawer}
          title="Notifications"
        >
          <div style={{ padding: '1rem 0' }}>
            <p className="text-muted">No new unread notifications.</p>
          </div>
        </Drawer>
      </div>
    </ProtectedRoute>
  );
};
