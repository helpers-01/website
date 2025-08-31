'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth';

type Role = 'user' | 'helper' | 'admin';

export function useProtectedRoute(allowedRoles?: Role[]) {
  const router = useRouter();
  const { user, profile, loading, initialized } = useAuthStore();

  useEffect(() => {
    if (!loading && initialized) {
      if (!user) {
        router.replace('/login');
      } else if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
        router.replace('/');
      }
    }
  }, [user, profile, loading, initialized, router, allowedRoles]);

  return { user, profile, loading, initialized };
}
