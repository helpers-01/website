'use client';

import { useAuth } from '@/lib/contexts/AuthContext';

type Props = {
  children: React.ReactNode;
};

export function AuthLayout({ children }: Props) {
  // The AuthProvider in layout.tsx handles all auth initialization
  // This component now just provides a consistent wrapper
  return children;
}
