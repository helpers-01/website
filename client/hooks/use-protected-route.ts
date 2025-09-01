'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';

type Role = 'user' | 'helper' | 'admin';

export function useProtectedRoute(allowedRoles?: Role[]) {
  const router = useRouter();
  const { user, userProfile, role, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login');
      } else if (allowedRoles && role && !allowedRoles.includes(role)) {
        router.replace('/');
      }
    }
  }, [user, userProfile, role, loading, router, allowedRoles]);

  return { user, userProfile, role, loading };
}
