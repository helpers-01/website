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
    <div className="min-h-screen bg-background">
      <div className="w-full max-w-md mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 mb-6 transition-colors text-textSecondary hover:text-textPrimary"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login Options
          </Link>

          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-md bg-primary">
              <User className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="mb-2 text-2xl font-bold text-textPrimary">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-base text-textSecondary">
            {mode === 'login' ? 'Sign in to your account' : 'Join our community today'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="p-8 shadow-sm bg-white border border-border rounded-2xl">
          <div className="space-y-6">
            {/* Mode Tabs */}
            <div
              className="flex p-1 rounded-xl"
              style={{ backgroundColor: '#F9FAFB' }}
            >
              <button
                type="button"
                className="flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200"
                style={{
                  backgroundColor: mode === 'login' ? '#FFFFFF' : 'transparent',
                  color: mode === 'login' ? '#6B46C1' : '#4A5568',
                  boxShadow: mode === 'login' ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none'
                }}
                onClick={() => switchMode('login')}
              >
                Sign In
              </button>
              <button
                type="button"
                className="flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200"
                style={{
                  backgroundColor: mode === 'signup' ? '#FFFFFF' : 'transparent',
                  color: mode === 'signup' ? '#6B46C1' : '#4A5568',
                  boxShadow: mode === 'signup' ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none'
                }}
                onClick={() => switchMode('signup')}
              >
                Sign Up
              </button>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl font-medium shadow-md transition-all duration-200"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '2px solid #E2E8F0',
                  color: '#1A202C'
                }}
              >
                <Chrome className="w-5 h-5" style={{ color: '#E53E3E' }} />
                <span>Continue with Google</span>
              </button>

              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl font-medium shadow-md transition-all duration-200"
                style={{
                  backgroundColor: '#3182CE',
                  color: '#FFFFFF'
                }}
              >
                <Facebook className="w-5 h-5" />
                <span>Continue with Facebook</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: '#E2E8F0' }}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span
                  className="px-4"
                  style={{
                    backgroundColor: '#FFFFFF',
                    color: '#A0AEC0'
                  }}
                >
                  or continue with
                </span>
              </div>
            </div>

            {/* Error/Success Messages */}
            {authState.error && (
              <div
                className="flex items-center gap-3 p-4 rounded-xl"
                style={{
                  backgroundColor: '#FED7D7',
                  border: '1px solid #FEB2B2',
                  color: '#C53030'
                }}
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{authState.error}</p>
              </div>
            )}

            {authState.success && (
              <div
                className="flex items-center gap-3 p-4 rounded-xl"
                style={{
                  backgroundColor: '#C6F6D5',
                  border: '1px solid #9AE6B4',
                  color: '#22543D'
                }}
              >
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{authState.success}</p>
              </div>
            )}

            {/* Sign Up Form */}
            {mode === 'signup' && !authState.otpSent && (
              <form onSubmit={handleEmailAuth} className="space-y-5">
                {/* Role Selection */}
                <div className="space-y-3">
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: '#4A5568' }}
                  >
                    I want to join as
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      className="p-4 rounded-xl border-2 transition-all duration-200"
                      style={{
                        borderColor: role === 'customer' ? '#6B46C1' : '#E2E8F0',
                        backgroundColor: role === 'customer' ? '#FAF5FF' : '#FFFFFF',
                        color: role === 'customer' ? '#6B46C1' : '#4A5568'
                      }}
                      onClick={() => setRole('customer')}
                    >
                      <User className="w-6 h-6 mx-auto mb-2" />
                      <span className="text-sm font-medium">Customer</span>
                    </button>
                    <button
                      type="button"
                      className="p-4 rounded-xl border-2 transition-all duration-200"
                      style={{
                        borderColor: role === 'provider' ? '#6B46C1' : '#E2E8F0',
                        backgroundColor: role === 'provider' ? '#FAF5FF' : '#FFFFFF',
                        color: role === 'provider' ? '#6B46C1' : '#4A5568'
                      }}
                      onClick={() => setRole('provider')}
                    >
                      <User className="w-6 h-6 mx-auto mb-2" />
                      <span className="text-sm font-medium">Provider</span>
                    </button>
                  </div>
                </div>

                {/* Name Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-1"
                    style={{ color: '#4A5568' }}
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200"
                    style={{
                      border: '1px solid #E2E8F0',
                      color: '#1A202C',
                      backgroundColor: '#FFFFFF'
                    }}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-1"
                    style={{ color: '#4A5568' }}
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200"
                    style={{
                      border: '1px solid #E2E8F0',
                      color: '#1A202C',
                      backgroundColor: '#FFFFFF'
                    }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>

                {/* Phone Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium mb-1"
                    style={{ color: '#4A5568' }}
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200"
                    style={{
                      border: '1px solid #E2E8F0',
                      color: '#1A202C',
                      backgroundColor: '#FFFFFF'
                    }}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium mb-1"
                    style={{ color: '#4A5568' }}
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      required
                      className="w-full px-3 py-2 pr-12 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200"
                      style={{
                        border: '1px solid #E2E8F0',
                        color: '#1A202C',
                        backgroundColor: '#FFFFFF'
                      }}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a strong password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                      style={{ color: '#A0AEC0' }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium mb-1"
                    style={{ color: '#4A5568' }}
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      required
                      className="w-full px-3 py-2 pr-12 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200"
                      style={{
                        border: '1px solid #E2E8F0',
                        color: '#1A202C',
                        backgroundColor: '#FFFFFF'
                      }}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                      style={{ color: '#A0AEC0' }}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authState.isLoading}
                  className="w-full py-2 px-4 rounded-2xl font-medium shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, #6B46C1 0%, #9F7AEA 100%)',
                    color: '#FFFFFF'
                  }}
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
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-1"
                    style={{ color: '#4A5568' }}
                  >
                    Email or Phone
                  </label>
                  <input
                    type="text"
                    id="email"
                    required
                    className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200"
                    style={{
                      border: '1px solid #E2E8F0',
                      color: '#1A202C',
                      backgroundColor: '#FFFFFF'
                    }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email or phone"
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium mb-1"
                    style={{ color: '#4A5568' }}
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      required
                      className="w-full px-3 py-2 pr-12 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200"
                      style={{
                        border: '1px solid #E2E8F0',
                        color: '#1A202C',
                        backgroundColor: '#FFFFFF'
                      }}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                      style={{ color: '#A0AEC0' }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Forgot Password Link */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-sm font-medium transition-colors"
                    style={{ color: '#6B46C1' }}
                    onClick={handleForgotPassword}
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={authState.isLoading}
                  className="w-full py-2 px-4 rounded-2xl font-medium shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, #6B46C1 0%, #9F7AEA 100%)',
                    color: '#FFFFFF'
                  }}
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
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: '#C6F6D5' }}
                  >
                    <Mail className="w-8 h-8" style={{ color: '#38A169' }} />
                  </div>
                  <h3
                    className="mb-2"
                    style={{
                      fontSize: '1.125rem',
                      fontWeight: 500,
                      lineHeight: '1.5rem',
                      color: '#1A202C',
                      fontFamily: 'Noto Sans, sans-serif'
                    }}
                  >
                    Check your email
                  </h3>
                  <p
                    className="mb-6"
                    style={{
                      fontSize: '1rem',
                      fontWeight: 400,
                      lineHeight: '1.5rem',
                      color: '#4A5568',
                      fontFamily: 'Noto Sans, sans-serif'
                    }}
                  >
                    We've sent a verification code to {email}
                  </p>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="otp"
                    className="block text-sm font-medium mb-1 text-center"
                    style={{ color: '#4A5568' }}
                  >
                    Enter verification code
                  </label>
                  <input
                    type="text"
                    id="otp"
                    required
                    className="w-full px-3 py-4 text-center text-2xl tracking-widest rounded-lg focus:outline-none focus:ring-2 transition-all duration-200"
                    style={{
                      border: '1px solid #E2E8F0',
                      color: '#1A202C',
                      backgroundColor: '#FFFFFF'
                    }}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="000000"
                    maxLength={6}
                  />
                </div>

                <button
                  type="submit"
                  disabled={authState.isLoading}
                  className="w-full py-2 px-4 rounded-2xl font-medium shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, #6B46C1 0%, #9F7AEA 100%)',
                    color: '#FFFFFF'
                  }}
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
                    className="text-sm font-medium transition-colors"
                    style={{ color: '#6B46C1' }}
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
          <p
            className="text-sm"
            style={{
              color: '#4A5568',
              fontFamily: 'Noto Sans, sans-serif'
            }}
          >
            By continuing, you agree to our{' '}
            <a
              href="#"
              className="font-medium transition-colors"
              style={{ color: '#6B46C1' }}
            >
              Terms of Service
            </a>{' '}
            and{' '}
            <a
              href="#"
              className="font-medium transition-colors"
              style={{ color: '#6B46C1' }}
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
