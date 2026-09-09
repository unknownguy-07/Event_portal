import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Mail, Lock, User, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { NavigationBar } from '@/components/layout/NavigationBar';

export function AuthPage({ initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    loginWithEmail,
    registerWithEmail,
    signInWithGoogle,
    signInWithGoogleRedirect,
    isAuthenticated,
    authError,
    clearAuthError,
  } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  const from = location.state?.from?.pathname || '/my-events';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Sync mode with route if initialMode changes
  useEffect(() => {
    setMode(initialMode);
    setLocalError('');
    clearAuthError();
  }, [initialMode, clearAuthError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    clearAuthError();

    if (!email.trim() || !password) {
      setLocalError('Please enter both email and password.');
      return;
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        setLocalError('Please enter your full name.');
        return;
      }
      if (password.length < 6) {
        setLocalError('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setLocalError('Passwords do not match.');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (mode === 'signup') {
        await registerWithEmail(name, email, password);
      } else {
        await loginWithEmail(email, password);
      }
      // Successful auth triggers redirect via useEffect
    } catch (err) {
      setLocalError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLocalError('');
    clearAuthError();
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setLocalError(err.message || 'Google sign-in failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleRedirectSignIn = async () => {
    setLocalError('');
    clearAuthError();
    setIsSubmitting(true);
    try {
      await signInWithGoogleRedirect();
    } catch (err) {
      setLocalError(err.message || 'Google redirect sign-in failed.');
      setIsSubmitting(false);
    }
  };

  const activeError = localError || authError;

  return (
    <div className="min-h-screen bg-[#080811] text-[#F1F0F5] flex flex-col justify-between selection:bg-[#8B4DFF]/40">
      <div>
        <NavigationBar />

        <main className="max-w-md mx-auto px-4 py-12 animate-fade-in">
          {/* Auth Card Container */}
          <div className="bg-gradient-to-b from-[#141124] to-[#100E1C] border border-purple-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-950/40">
            {/* Header / Brand Icon */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#9B5CFF] to-[#6E2FF0] mx-auto flex items-center justify-center text-white shadow-lg shadow-purple-600/35 border border-purple-400/30 mb-3">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-extrabold text-[#F1F0F5] tracking-tight">
                {mode === 'signup' ? 'Create Student Account' : 'Sign in to EventPortal'}
              </h1>
              <p className="text-xs text-[#9CA3B5] mt-1">
                {mode === 'signup'
                  ? 'Join campus events, track registrations, and get event tickets'
                  : 'Access your enrolled events and registered student profile'}
              </p>
            </div>

            {/* Segmented Mode Switcher */}
            <div className="flex bg-[#080811]/90 p-1 rounded-xl border border-purple-500/15 mb-6 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setLocalError('');
                  clearAuthError();
                }}
                className={`flex-1 py-2 rounded-lg transition-all duration-200 ${
                  mode === 'login'
                    ? 'bg-gradient-to-r from-[#8B4DFF] to-[#6E2FF0] text-white shadow-md shadow-purple-600/30'
                    : 'text-[#9CA3B5] hover:text-[#F1F0F5]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setLocalError('');
                  clearAuthError();
                }}
                className={`flex-1 py-2 rounded-lg transition-all duration-200 ${
                  mode === 'signup'
                    ? 'bg-gradient-to-r from-[#8B4DFF] to-[#6E2FF0] text-white shadow-md shadow-purple-600/30'
                    : 'text-[#9CA3B5] hover:text-[#F1F0F5]'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Error Banner */}
            {activeError && (
              <div className="mb-5 p-3 rounded-xl bg-[#F87171]/12 border border-[#F87171]/30 flex items-start gap-2.5 text-xs text-[#F87171] animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{activeError}</span>
              </div>
            )}

            {/* Email / Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="block text-[11px] font-semibold text-[#9CA3B5] uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3B5]" />
                    <input
                      type="text"
                      placeholder="e.g. Alex Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#080811]/80 border border-purple-500/20 focus:border-[#9B5CFF] rounded-xl text-xs text-[#F1F0F5] placeholder-[#6B6882] focus:outline-none focus:ring-2 focus:ring-[#9B5CFF]/25 transition-colors"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-[#9CA3B5] uppercase tracking-wider mb-1.5">
                  University Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3B5]" />
                  <input
                    type="email"
                    placeholder="student@mru.edu.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#080811]/80 border border-purple-500/20 focus:border-[#9B5CFF] rounded-xl text-xs text-[#F1F0F5] placeholder-[#6B6882] focus:outline-none focus:ring-2 focus:ring-[#9B5CFF]/25 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#9CA3B5] uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3B5]" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#080811]/80 border border-purple-500/20 focus:border-[#9B5CFF] rounded-xl text-xs text-[#F1F0F5] placeholder-[#6B6882] focus:outline-none focus:ring-2 focus:ring-[#9B5CFF]/25 transition-colors"
                    required
                  />
                </div>
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="block text-[11px] font-semibold text-[#9CA3B5] uppercase tracking-wider mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3B5]" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#080811]/80 border border-purple-500/20 focus:border-[#9B5CFF] rounded-xl text-xs text-[#F1F0F5] placeholder-[#6B6882] focus:outline-none focus:ring-2 focus:ring-[#9B5CFF]/25 transition-colors"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 bg-gradient-to-r from-[#8B4DFF] via-[#9B5CFF] to-[#6E2FF0] hover:from-[#9B5CFF] hover:to-[#8B4DFF] text-white text-xs font-bold rounded-full shadow-lg shadow-purple-600/35 border border-purple-400/30 transition-all duration-200 hover:scale-[1.01] hover:shadow-purple-500/50 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <>
                    <span>{mode === 'signup' ? 'Create Account' : 'Sign In'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-purple-500/15" />
              </div>
              <span className="relative px-3 bg-[#12101F] text-[11px] text-[#6B6882] uppercase tracking-wider">
                or continue with
              </span>
            </div>

            {/* Google Sign-In Buttons */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
                className="w-full py-2.5 bg-[#080811]/80 hover:bg-[#161324] border border-purple-500/20 hover:border-purple-500/40 text-[#F1F0F5] text-xs font-semibold rounded-full transition-all duration-200 flex items-center justify-center gap-2.5 shadow-sm hover:scale-[1.01] cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    fill="#EA4335"
                  />
                </svg>
                <span>Sign in with Google</span>
              </button>

              <button
                type="button"
                onClick={handleGoogleRedirectSignIn}
                disabled={isSubmitting}
                className="w-full py-2 bg-transparent hover:bg-purple-500/10 border border-purple-500/15 hover:border-purple-500/30 text-[#9CA3B5] hover:text-[#C084FC] text-[11px] font-medium rounded-full transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
                title="Use direct redirect if popup is blocked by browser"
              >
                <span>Popup disappearing? Sign in with Redirect Mode →</span>
              </button>
            </div>

            {/* Demo Mode Helper */}
            <div className="mt-6 p-3 bg-[#080811]/60 border border-purple-500/15 rounded-xl text-[11px] text-[#9CA3B5] flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C084FC] shrink-0" />
              <span>
                University student portal with instant session persistence.
              </span>
            </div>
          </div>
        </main>
      </div>

      <footer className="border-t border-purple-500/10 py-6 text-center text-xs text-[#6B6882] bg-[#080811]/80 backdrop-blur-md">
        © 2026 Manav Rachna University • EventPortal
      </footer>
    </div>
  );
}
