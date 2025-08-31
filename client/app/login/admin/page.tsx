"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { getUserProfile, getRoleRedirectPath } from '@/lib/auth-utils';
import { ArrowLeft, Shield, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface AuthState {
  isLoading: boolean;
  error: string | null;
  success: string | null;
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: false,
    error: null,
    success: null
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          const profile = await getUserProfile(session.user.id);
          if (profile.role === 'admin') {
            const redirectPath = getRoleRedirectPath(profile.role);
            router.push(redirectPath);
          } else {
            setAuthState(prev => ({ ...prev, error: 'Access denied. Admin privileges required.' }));
            await supabase.auth.signOut();
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          setAuthState(prev => ({ ...prev, error: 'Failed to load user profile' }));
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthState(prev => ({ ...prev, isLoading: true, error: null, success: null }));

    if (!username || !password) {
      setAuthState(prev => ({ ...prev, error: 'Please fill in all fields', isLoading: false }));
      return;
    }

    try {
      // For admin login, we'll use username as email for authentication
      const { error } = await supabase.auth.signInWithPassword({
        email: username.includes('@') ? username : `${username}@admin.local`,
        password,
      });

      if (error) throw error;

      setAuthState(prev => ({ ...prev, success: 'Login successful!' }));
    } catch (err: any) {
      setAuthState(prev => ({ ...prev, error: err.message, isLoading: false }));
    }
  };

  const handleResetPassword = async () => {
    if (!username) {
      setAuthState(prev => ({ ...prev, error: 'Please enter your Admin Username first' }));
      return;
    }

    setAuthState(prev => ({ ...prev, isLoading: true, error: null, success: null }));

    try {
      const email = username.includes('@') ? username : `${username}@admin.local`;
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      setAuthState(prev => ({ ...prev, success: 'Password reset email sent!', isLoading: false }));
    } catch (err: any) {
      setAuthState(prev => ({ ...prev, error: err.message, isLoading: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/login" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Login Options
          </Link>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Admin Login
          </h1>
          <p className="text-gray-500">
            Administrative access only
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-lg font-medium text-gray-900">Admin Portal</h2>
            </div>

            {/* Security Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Restricted Access</p>
                  <p className="text-xs text-yellow-700 mt-1">
                    This portal is for authorized administrators only. All activities are logged and monitored.
                  </p>
                </div>
              </div>
            </div>

            {authState.error && (
              <div className="text-sm text-red-500 text-center">
                {authState.error}
              </div>
            )}

            {authState.success && (
              <div className="text-sm text-green-500 text-center">
                {authState.success}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-gray-700">
                  Admin Username
                </label>
                <input
                  type="text"
                  id="username"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter admin username"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Admin Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    checked={keepSignedIn}
                    onChange={(e) => setKeepSignedIn(e.target.checked)}
                  />
                  <span className="text-sm text-gray-600">Keep me signed in</span>
                </label>
                <button
                  type="button"
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                  onClick={handleResetPassword}
                >
                  Reset password
                </button>
              </div>

              <button
                type="submit"
                disabled={authState.isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative"
              >
                {authState.isLoading ? (
                  <>
                    <span className="opacity-0">Accessing Admin Panel...</span>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </>
                ) : (
                  'Access Admin Panel'
                )}
              </button>
            </form>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                Need help? Contact system administrator.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
