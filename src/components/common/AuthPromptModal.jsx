import React from 'react';
import { Modal } from './Modal';
import { useEvents } from '@/hooks/useEvents';
import { useAuth } from '@/hooks/useAuth';

/**
 * Non-disruptive Google Sign-In prompt modal when an unauthenticated user
 * attempts to bookmark an event or filter by Interested Events.
 */
export function AuthPromptModal() {
  const { showAuthModal, setShowAuthModal } = useEvents();
  const { signInWithGoogle } = useAuth();

  const handleSignIn = async () => {
    await signInWithGoogle();
    setShowAuthModal(false);
  };

  return (
    <Modal
      isOpen={showAuthModal}
      onClose={() => setShowAuthModal(false)}
      title="Sign in required"
    >
      <p className="text-slate-400 mb-6 text-sm">
        Please sign in with your university Google account to bookmark events and view your saved list.
      </p>
      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowAuthModal(false)}
          className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSignIn}
          className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-full transition-colors"
        >
          Sign in with Google
        </button>
      </div>
    </Modal>
  );
}
