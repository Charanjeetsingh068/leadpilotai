'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Loader } from '@/components/ui/Loader';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isInitialized, fetchCurrentUser } = useAuthStore();

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  useEffect(() => {
    if (isInitialized) {
      if (isAuthenticated) {
        router.replace('/overview');
      } else {
        router.replace('/login');
      }
    }
  }, [isInitialized, isAuthenticated, router]);

  return <Loader fullPage text="Redirecting to LeadPilot AI Workspace..." />;
}
