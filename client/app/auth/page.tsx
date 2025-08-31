"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { validateEmail, validatePhone, validatePassword, getUserProfile, getRoleRedirectPath } from '@/lib/auth-utils';

interface AuthState {
  isLoading: boolean;
  error: string | null;
  success: string | null;
  otpSent: boolean;
}

type AuthMode = 'login' | 'signup';
type AuthMethod = 'email' | 'phone';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('login');
  const [method, setMethod] = useState<AuthMethod>('email');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: false,
    error: null,
    success: null,
    otpSent: false
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          let profile = await getUserProfile(session.user.id);

          // If profile doesn't exist, create it
          if (!profile) {
            const { error: upsertError } = await supabase
              .from('profiles')
              .upsert({
                id: session.user.id,
                email: session.user.email,
                phone: session.user.phone,
                role: 'user'
              } as any);

            if (upsertError) throw upsertError;

            // Fetch the newly created profile
            profile = await getUserProfile(session.user.id);
          }

          const redirectPath = getRoleRedirectPath(profile.role);
          router.push(redirectPath);
        } catch (error) {
          console.error('Error fetching/creating profile:', error);
          setAuthState(prev => ({ ...prev, error: 'Failed to load user profile' }));
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthState(prev => ({ ...prev, isLoading: true, error: null, success: null }));

    if (!validateEmail(email)) {
      setAuthState(prev => ({ ...prev, error: 'Invalid email format', isLoading: false }));
      return;
    }

    if (mode === 'signup' && !validatePassword(password)) {
      setAuthState(prev => ({ ...prev, error: 'Password must be at least 8 characters', isLoading: false }));
      return;
    }

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setAuthState(prev => ({ ...prev, success: 'Login successful!' }));
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role: 'user'
            }
          }
        });
        if (error) throw error;
        setAuthState(prev => ({ ...prev, success: 'Sign up successful! Please check your email.' }));
      }
    } catch (err: any) {
      setAuthState(prev => ({ ...prev, error: err.message, isLoading: false }));
    }
  };

  const handlePhoneAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthState(prev => ({ ...prev, isLoading: true, error: null, success: null }));

    if (!validatePhone(phone)) {
      setAuthState(prev => ({ ...prev, error: 'Invalid phone format. Use +countrycode', isLoading: false }));
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          data: mode === 'signup' ? { role: 'user' } : undefined
        }
      });
      if (error) throw error;
      setAuthState(prev => ({ ...prev, success: 'OTP sent to your phone!', otpSent: true, isLoading: false }));
    } catch (err: any) {
      setAuthState(prev => ({ ...prev, error: err.message, isLoading: false }));
    }
  };

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthState(prev => ({ ...prev, isLoading: true, error: null, success: null }));

    try {
      const { error } = await supabase.auth.verifyOtp({
        phone,
        token: otp,
        type: 'sms'
      });
      if (error) throw error;
      setAuthState(prev => ({ ...prev, success: 'Verification successful!' }));
    } catch (err: any) {
      setAuthState(prev => ({ ...prev, error: err.message, isLoading: false }));
    }
  };

  const handleForgotPassword = async () => {
    if (!validateEmail(email)) {
      setAuthState(prev => ({ ...prev, error: 'Please enter a valid email first' }));
      return;
    }

    setAuthState(prev => ({ ...prev, isLoading: true, error: null, success: null }));

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      setAuthState(prev => ({ ...prev, success: 'Password reset email sent!', isLoading: false }));
    } catch (err: any) {
      setAuthState(prev => ({ ...prev, error: err.message, isLoading: false }));
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setPhone("");
    setOtp("");
    setAuthState({
      isLoading: false,
      error: null,
      success: null,
      otpSent: false
    });
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    resetForm();
  };

  const switchMethod = (newMethod: AuthMethod) => {
    setMethod(newMethod);
    resetForm();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 font-sans px-4 py-8">
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
        <div className="flex flex-col gap-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              {mode === 'login' ? 'Login to your account' : 'Sign up for a new account'}
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="flex space-x-4 border-b border-gray-200">
            <button
              type="button"
              className={`cursor-pointer px-4 py-2 text-gray-600 hover:text-purple-600 ${
                mode === 'login' ? 'border-b-2 border-purple-600 text-purple-600' : ''
              }`}
              onClick={() => switchMode('login')}
            >
              Login
            </button>
            <button
              type="button"
              className={`cursor-pointer px-4 py-2 text-gray-600 hover:text-purple-600 ${
                mode === 'signup' ? 'border-b-2 border-purple-600 text-purple-600' : ''
              }`}
              onClick={() => switchMode('signup')}
            >
              Sign Up
            </button>
          </div>

          {/* Method Toggle */}
          <div className="flex space-x-4 border-b border-gray-200">
            <button
              type="button"
              className={`cursor-pointer px-4 py-2 text-gray-600 hover:text-purple-600 ${
                method === 'email' ? 'border-b-2 border-purple-600 text-purple-600' : ''
              }`}
              onClick={() => switchMethod('email')}
            >
              Email
            </button>
            <button
              type="button"
              className={`cursor-pointer px-4 py-2 text-gray-600 hover:text-purple-600 ${
                method === 'phone' ? 'border-b-2 border-purple-600 text-purple-600' : ''
              }`}
              onClick={() => switchMethod('phone')}
            >
              Phone
            </button>
          </div>

          {authState.error && (
            <div className="text-sm text-red-500 mt-1">
              {authState.error}
            </div>
          )}

          {authState.success && (
            <div className="text-sm text-green-500 mt-1">
              {authState.success}
            </div>
          )}

          {/* Email Form */}
          {method === 'email' && !authState.otpSent && (
            <form onSubmit={handleEmailAuth} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  className="w-full min-h-[44px] px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  required
                  className="w-full min-h-[44px] px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={authState.isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed relative"
              >
                {authState.isLoading ? (
                  <>
                    <span className="opacity-0">
                      {mode === 'login' ? 'Signing in...' : 'Signing up...'}
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </>
                ) : (
                  `${mode === 'login' ? 'Sign in' : 'Sign up'} with Email`
                )}
              </button>

              {mode === 'login' && (
                <button
                  type="button"
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium text-center"
                  onClick={handleForgotPassword}
                >
                  Forgot password?
                </button>
              )}
            </form>
          )}

          {/* Phone Form */}
          {method === 'phone' && !authState.otpSent && (
            <form onSubmit={handlePhoneAuth} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Phone number
                </label>
                <input
                  type="tel"
                  id="phone"
                  required
                  className="w-full min-h-[44px] px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1234567890"
                />
              </div>

              <button
                type="submit"
                disabled={authState.isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed relative"
              >
                {authState.isLoading ? (
                  <>
                    <span className="opacity-0">Sending OTP...</span>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </>
                ) : (
                  `Send OTP to ${mode === 'login' ? 'Login' : 'Sign up'}`
                )}
              </button>
            </form>
          )}

          {/* OTP Verification Form */}
          {method === 'phone' && authState.otpSent && (
            <form onSubmit={handleOtpVerification} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="otp" className="text-sm font-medium text-gray-700">
                  Enter OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  required
                  className="w-full min-h-[44px] px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                />
              </div>

              <button
                type="submit"
                disabled={authState.isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed relative"
              >
                {authState.isLoading ? (
                  <>
                    <span className="opacity-0">Verifying...</span>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </>
                ) : (
                  'Verify OTP'
                )}
              </button>

              <button
                type="button"
                className="text-sm text-purple-600 hover:text-purple-700 font-medium text-center"
                onClick={() => setAuthState(prev => ({ ...prev, otpSent: false, error: null, success: null }))}
              >
                Resend OTP
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}