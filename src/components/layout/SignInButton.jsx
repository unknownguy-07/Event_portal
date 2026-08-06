import React from 'react';

/**
 * Google Sign-in trigger / authenticated user profile indicator component stub.
 */
export function SignInButton({ user, onSignIn, onSignOut }) {
  if (user) {
    return (
      <button
        onClick={onSignOut}
        className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-full text-xs font-medium text-slate-300 hover:border-slate-700 transition-colors"
      >
        <img
          src={user.photoURL}
          alt={user.displayName}
          className="w-6 h-6 rounded-full object-cover"
        />
        <span>{user.displayName}</span>
      </button>
    );
  }

  return (
    <button
      onClick={onSignIn}
      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-full transition-colors"
    >
      Sign in with Google
    </button>
  );
}
