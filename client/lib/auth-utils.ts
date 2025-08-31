import { AuthError, UserRole } from '@/types/auth';
import { supabase } from './supabase/client';
import type { Database } from '@/types/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

export const SUPER_ADMIN_EMAIL = 'helpers0508@gmail.com';

export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePhone = (phone: string): boolean => {
  return /^\+[1-9]\d{10,14}$/.test(phone);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

export async function getUserProfile(userId: string): Promise<Profile> {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    throw new Error('Failed to fetch user profile');
  }

  return profile;
}

export function getRoleRedirectPath(role: UserRole): string {
  switch (role) {
    case 'admin':
      return '/admin-panel';
    case 'helper':
      return '/helper-dashboard';
    case 'user':
      return '/dashboard';
    default:
      return '/';
  }
}

