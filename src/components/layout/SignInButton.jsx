import React from 'react';
import { LogOut, User } from 'lucide-react';

/**
 * Google Sign In trigger component.
 * Displays "Sign in with Google" when unauthenticated, and user profile avatar when authenticated.
 */
export function SignInButton({ user, onSignIn, onSignOut, className = '' }) {
  if (user) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div
          title={user.displayName || user.email}
          className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-full hover:border-slate-700 transition-colors"
        >
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || 'User profile'}
              className="w-6 h-6 rounded-full object-cover border border-indigo-500/30"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <User className="w-3.5 h-3.5" />
            </div>
          )}
          <span className="text-xs font-semibold text-slate-200 hidden sm:inline max-w-[120px] truncate">
            {user.displayName || 'Student'}
          </span>
        </div>
        <button
          onClick={onSignOut}
          title="Sign out"
          className="p-2 text-slate-400 hover:text-rose-400 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-full transition-colors"
          aria-label="Sign out"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onSignIn}
      className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold rounded-full shadow-lg shadow-indigo-600/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${className}`}
    >
      {/* SVG Google 'G' Logo */}
      <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
      </svg>
      <span className="whitespace-nowrap">Sign in with Google</span>
    </button>
  );
}
