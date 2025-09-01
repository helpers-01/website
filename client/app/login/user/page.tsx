"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { validateEmail, validatePhone, validatePassword, getUserProfile, getRoleRedirectPath } from '@/lib/auth-utils';
import { ArrowLeft, User, Phone, Mail, Eye, EyeOff, Chrome, Facebook, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface AuthState {
  isLoading: boolean;
  error: string | null;
  success: string | null;
  otpSent: boolean;
}

type AuthMode = 'login' | 'signup';
type AuthMethod = 'email' | 'phone';

export default function UserLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('login');
  const [method, setMethod] = useState<AuthMethod>('email');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [role, setRole] = useState<'customer' | 'provider'>('customer');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    if (mode === 'signup') {
      if (!validatePassword(password)) {
        setAuthState(prev => ({ ...prev, error: 'Password must be at least 8 characters', isLoading: false }));
        return;
      }

      if (password !== confirmPassword) {
        setAuthState(prev => ({ ...prev, error: 'Passwords do not match', isLoading: false }));
        return;
      }

      if (!name.trim()) {
        setAuthState(prev => ({ ...prev, error: 'Name is required', isLoading: false }));
        return;
      }
    }

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setAuthState(prev => ({ ...prev, success: 'Login successful!' }));
      } else {
        const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/login` : '/login';
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              role: role === 'customer' ? 'user' : 'helper'
            },
            emailRedirectTo: redirectTo
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
    setConfirmPassword("");
    setName("");
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/login" className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Login Options
          </Link>

          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <User className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-gray-600">
            {mode === 'login' ? 'Sign in to your account' : 'Join our community today'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <div className="space-y-6">
            {/* Mode Tabs */}
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                type="button"
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  mode === 'login'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => switchMode('login')}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  mode === 'signup'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => switchMode('signup')}
              >
                Sign Up
              </button>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
              >
                <Chrome className="w-5 h-5 text-red-500" />
                <span className="text-gray-700 font-medium">Continue with Google</span>
              </button>

              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-blue-600 rounded-xl hover:bg-blue-700 transition-all duration-200"
              >
                <Facebook className="w-5 h-5 text-white" />
                <span className="text-white font-medium">Continue with Facebook</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">or continue with</span>
              </div>
            </div>

            {/* Error/Success Messages */}
            {authState.error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700">{authState.error}</p>
              </div>
            )}

            {authState.success && (
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <p className="text-sm text-green-700">{authState.success}</p>
              </div>
            )}

            {/* Sign Up Form */}
            {mode === 'signup' && !authState.otpSent && (
              <form onSubmit={handleEmailAuth} className="space-y-5">
                {/* Role Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700">I want to join as</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        role === 'customer'
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                      onClick={() => setRole('customer')}
                    >
                      <User className="w-6 h-6 mx-auto mb-2" />
                      <span className="text-sm font-medium">Customer</span>
                    </button>
                    <button
                      type="button"
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        role === 'provider'
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                      onClick={() => setRole('provider')}
                    >
                      <User className="w-6 h-6 mx-auto mb-2" />
                      <span className="text-sm font-medium">Provider</span>
                    </button>
                  </div>
                </div>

                {/* Name Field */}
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-semibold text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-semibold text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>

                {/* Phone Field */}
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a strong password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authState.isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {authState.isLoading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>
            )}

            {/* Sign In Form */}
            {mode === 'login' && !authState.otpSent && (
              <form onSubmit={handleEmailAuth} className="space-y-5">
                {/* Email/Phone Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-semibold text-gray-700">
                    Email or Phone
                  </label>
                  <input
                    type="text"
                    id="email"
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email or phone"
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Forgot Password Link */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
                    onClick={handleForgotPassword}
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={authState.isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {authState.isLoading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>
            )}

            {/* OTP Verification Form */}
            {authState.otpSent && (
              <form onSubmit={handleOtpVerification} className="space-y-5">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Check your email</h3>
                  <p className="text-gray-600 mb-6">
                    We've sent a verification code to {email}
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="otp" className="text-sm font-semibold text-gray-700 text-center block">
                    Enter verification code
                  </label>
                  <input
                    type="text"
                    id="otp"
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-4 text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="000000"
                    maxLength={6}
                  />
                </div>

                <button
                  type="submit"
                  disabled={authState.isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {authState.isLoading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    'Verify Code'
                  )}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
                    onClick={() => setAuthState(prev => ({ ...prev, otpSent: false, error: null, success: null }))}
                  >
                    Didn't receive code? Resend
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            By continuing, you agree to our{' '}
            <a href="#" className="text-purple-600 hover:text-purple-700 font-medium transition-colors">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-purple-600 hover:text-purple-700 font-medium transition-colors">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
