import React from 'react';
import { useAuth } from '@/hooks/useAuth';

/**
 * SignInButton v2
 * Compact sign-in button or avatar circle.
 * Uses currentUser from AuthContext (not "user").
 */
export function SignInButton() {
  const { currentUser, isAuthenticated, signInWithGoogle, signOut } = useAuth();

  if (isAuthenticated && currentUser) {
    const initial = currentUser.displayName
      ? currentUser.displayName.charAt(0).toUpperCase()
      : 'U';

    return (
      <button
        onClick={signOut}
        aria-label="Sign out"
        className="flex items-center justify-center rounded-full font-semibold text-sm"
        style={{
          width: '32px',
          height: '32px',
          backgroundColor: 'var(--accent)',
          color: 'var(--text-inverse)',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        {initial}
      </button>
    );
  }

  return (
    <button
      onClick={signInWithGoogle}
      className="px-3 py-2 rounded-lg text-sm font-medium"
      style={{
        backgroundColor: 'transparent',
        color: 'var(--accent)',
        border: 'none',
        cursor: 'pointer',
        transition: 'opacity var(--transition-fast)',
      }}
    >
      Sign in
    </button>
  );
}
