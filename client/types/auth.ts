export type UserRole = 'user' | 'helper' | 'admin';

export interface AuthError {
  message: string;
  status?: number;
}

export interface AuthState {
  isLoading: boolean;
  error: AuthError | null;
  success: string | null;
}

export interface ProfileData {
  id: string;
  role: UserRole;
  email?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}
