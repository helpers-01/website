"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { validateEmail, validatePassword, getUserProfile, SUPER_ADMIN_EMAIL } from '@/lib/auth-utils';
import type { AuthState } from '@/types/auth';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: false,
    error: null,
    success: null
  });

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthState(prev => ({ ...prev, isLoading: true, error: null, success: null }));

    try {
      // Validate email and password
      if (!validateEmail(email)) {
        throw new Error("Please enter a valid email address");
      }
      if (!validatePassword(password)) {
        throw new Error("Password must be at least 8 characters long");
      }

      // Email password login
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) throw signInError;

      // Get user profile
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const profile = await getUserProfile(user.id);
      
      // Verify admin role
      if (profile?.role !== 'admin') {
        await supabase.auth.signOut();
        throw new Error("Unauthorized access. This portal is for administrators only.");
      }

      setAuthState(prev => ({
        ...prev,
        success: "Sign in successful! Redirecting to admin panel...",
      }));

      // Log admin login (for debugging)
      console.log('Admin login:', {
        email: user.email,
        timestamp: new Date().toISOString(),
      });

      // Wait for session establishment
      await new Promise(resolve => setTimeout(resolve, 500));

      // Redirect to admin panel
      router.push('/admin-panel');
    } catch (err: any) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: { message: err.message },
      }));
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setAuthState(prev => ({
        ...prev,
        error: { message: "Please enter your email address" },
      }));
      return;
    }

    if (!validateEmail(email)) {
      setAuthState(prev => ({
        ...prev,
        error: { message: "Please enter a valid email address" },
      }));
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;

      setAuthState(prev => ({
        ...prev,
        success: "Password reset instructions sent to your email",
        error: null,
      }));
    } catch (err: any) {
      setAuthState(prev => ({
        ...prev,
        error: { message: err.message },
      }));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-surface font-sans px-4 py-8">
      <div className="w-full max-w-md bg-white shadow-lg border border-gray-200 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to access the admin dashboard
            </p>
          </div>

          {authState.error && (
            <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
              {authState.error.message}
            </div>
          )}

          {authState.success && (
            <div className="p-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg">
              {authState.success}
            </div>
          )}

          <form onSubmit={handleAuth} className="flex flex-col gap-6">
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  required
                  placeholder=" "
                  className="peer w-full h-11 px-4 border border-gray-300 rounded-lg text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label
                  htmlFor="email"
                  className="absolute left-2 -top-2 bg-white px-2 text-xs text-gray-600 transition-all 
                    peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 
                    peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-600"
                >
                  Admin Email
                </label>
              </div>

              <div className="relative">
                <input
                  type="password"
                  id="password"
                  required
                  placeholder=" "
                  className="peer w-full h-11 px-4 border border-gray-300 rounded-lg text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label
                  htmlFor="password"
                  className="absolute left-2 -top-2 bg-white px-2 text-xs text-gray-600 transition-all 
                    peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 
                    peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-600"
                >
                  Password
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={authState.isLoading}
              className="w-full h-11 px-4 rounded-lg font-medium text-white bg-primary hover:bg-primary/90 
                disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-colors relative"
            >
              {authState.isLoading ? (
                <>
                  <span className="opacity-0">Signing in...</span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </>
              ) : (
                "Sign in to Admin Portal"
              )}
            </button>

            <button
              type="button"
              className="text-sm text-primary hover:text-primary/80 font-medium text-center"
              onClick={handleResetPassword}
            >
              Reset password
            </button>
          </form>

          <div className="text-sm text-gray-600 text-center mt-8">
            <p>Only authorized administrators can access this portal.</p>
            <p className="mt-2">
              Contact {SUPER_ADMIN_EMAIL} for admin access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
