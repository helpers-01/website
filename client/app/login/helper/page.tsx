"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { getUserProfile, getRoleRedirectPath } from '@/lib/auth-utils';
import { ArrowLeft, Users, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

interface AuthState {
  isLoading: boolean;
  error: string | null;
  success: string | null;
}

export default function HelperLoginPage() {
  const router = useRouter();
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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
          if (profile.role === 'helper') {
            const redirectPath = getRoleRedirectPath(profile.role);
            router.push(redirectPath);
          } else {
            setAuthState(prev => ({ ...prev, error: 'Access denied. Helper privileges required.' }));
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

    if (!employeeId || !password) {
      setAuthState(prev => ({ ...prev, error: 'Please fill in all fields', isLoading: false }));
      return;
    }

    try {
      // For helper login, we'll use employeeId as email for authentication
      const { error } = await supabase.auth.signInWithPassword({
        email: employeeId.includes('@') ? employeeId : `${employeeId}@helper.local`,
        password,
      });

      if (error) throw error;

      setAuthState(prev => ({ ...prev, success: 'Login successful!' }));
    } catch (err: any) {
      setAuthState(prev => ({ ...prev, error: err.message, isLoading: false }));
    }
  };

  const handleForgotPassword = async () => {
    if (!employeeId) {
      setAuthState(prev => ({ ...prev, error: 'Please enter your Employee ID first' }));
      return;
    }

    setAuthState(prev => ({ ...prev, isLoading: true, error: null, success: null }));

    try {
      const email = employeeId.includes('@') ? employeeId : `${employeeId}@helper.local`;
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
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Helper Login
          </h1>
          <p className="text-gray-500">
            Access your service provider account
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-lg font-medium text-gray-900">Service Provider Portal</h2>
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
                <label htmlFor="employeeId" className="text-sm font-medium text-gray-700">
                  Employee ID
                </label>
                <input
                  type="text"
                  id="employeeId"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="Enter your Employee ID"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
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
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                  onClick={handleForgotPassword}
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={authState.isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative"
              >
                {authState.isLoading ? (
                  <>
                    <span className="opacity-0">Signing in...</span>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </>
                ) : (
                  'Login to Helper Portal'
                )}
              </button>
            </form>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                New helper?{' '}
                <button
                  onClick={() => router.push('/apply-helper')}
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  Apply to join
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
