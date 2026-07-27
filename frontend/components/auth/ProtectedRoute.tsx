'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { UserRole } from '@/types/user.types';
import { Loader } from '@/components/ui/Loader';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requiredPermission?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  requiredPermission,
}) => {
  const router = useRouter();
  const { isAuthenticated, isInitialized, isLoading, role, hasPermission } = useAuthStore();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push('/login');
    }
  }, [isInitialized, isAuthenticated, router]);

  if (!isInitialized || isLoading) {
    return <Loader fullPage text="Authenticating..." />;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return (
      <div className="card" style={{ margin: '2rem', textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p className="text-muted">You do not have permission to view this page.</p>
      </div>
    );
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="card" style={{ margin: '2rem', textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p className="text-muted">Missing required permission: {requiredPermission}</p>
      </div>
    );
  }

  return <>{children}</>;
};
