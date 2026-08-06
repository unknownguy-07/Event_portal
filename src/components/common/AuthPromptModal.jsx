import React from 'react';
import { Modal } from './Modal';
import { useEvents } from '@/hooks/useEvents';
import { useAuth } from '@/hooks/useAuth';

/**
 * Non-disruptive Google Sign-In prompt modal placeholder.
 * Triggers when unauthenticated users click "Interested Events" or bookmark an event.
 * Automatically fulfills pending actions upon signing in.
 */
export function AuthPromptModal() {
  const {
    showAuthModal,
    setShowAuthModal,
    setSelectedCategory,
    pendingAction,
    setPendingAction,
    toggleBookmark,
  } = useEvents();
  const { signInWithGoogle } = useAuth();

  const handleSignIn = async () => {
    await signInWithGoogle();
    setShowAuthModal(false);

    // Fulfill pending action post-authentication
    if (pendingAction === 'interested') {
      setSelectedCategory('interested');
    } else if (typeof pendingAction === 'object' && pendingAction?.type === 'bookmark') {
      toggleBookmark(pendingAction.eventId);
    }
    setPendingAction(null);
  };

  const handleClose = () => {
    setShowAuthModal(false);
    setPendingAction(null);
  };

  return (
    <Modal
      isOpen={showAuthModal}
      onClose={handleClose}
      title="Sign in required"
    >
      <div className="space-y-4">
        <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
          Please sign in with your university Google account to bookmark events and access your saved <span className="font-semibold text-purple-400">Interested Events</span> list.
        </p>

        <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-[11px] text-slate-400">
          🔒 <span className="font-medium text-slate-300">Placeholder Auth Mode:</span> Clicking "Sign in with Google" simulates an instant authenticated student session.
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSignIn}
            className="px-5 py-2 text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-full shadow-lg shadow-indigo-600/30 transition-all duration-200"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </Modal>
  );
}
