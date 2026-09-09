import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from './Modal';
import { useEvents } from '@/hooks/useEvents';
import { useAuth } from '@/hooks/useAuth';
import { Mail, ArrowRight } from 'lucide-react';

/**
 * Authentication prompt modal.
 * Triggers when unauthenticated users perform protected actions (e.g. registration, bookmarking).
 * Supports both Google Sign-In and Email/Password navigation.
 */
export function AuthPromptModal() {
  const navigate = useNavigate();
  const {
    showAuthModal,
    setShowAuthModal,
    setSelectedCategory,
    pendingAction,
    setPendingAction,
    toggleBookmark,
    toggleInterested,
  } = useEvents();
  const { signInWithGoogle } = useAuth();
  const [modalError, setModalError] = useState('');

  const handleGoogleSignIn = async () => {
    setModalError('');
    try {
      const user = await signInWithGoogle();
      setShowAuthModal(false);

      // Fulfill pending action post-authentication
      if (pendingAction === 'interested') {
        setSelectedCategory('interested');
      } else if (typeof pendingAction === 'object') {
        if (pendingAction.type === 'bookmark') {
          toggleBookmark(pendingAction.eventId, user?.uid);
        } else if (pendingAction.type === 'interested') {
          toggleInterested(pendingAction.eventId, user?.uid);
        }
      }
      setPendingAction(null);
    } catch (err) {
      setModalError(err.message || 'Google sign-in failed. Please try again.');
    }
  };

  const handleGoToAuth = (path) => {
    setShowAuthModal(false);
    navigate(path);
  };

  const handleClose = () => {
    setShowAuthModal(false);
    setPendingAction(null);
    setModalError('');
  };

  return (
    <Modal
      isOpen={showAuthModal}
      onClose={handleClose}
      title="Student Authentication Required"
    >
      <div className="space-y-4">
        <p className="text-[#9CA3B5] text-xs md:text-sm leading-relaxed">
          Please sign in or register your student account to register for events, view your tickets, and bookmark events.
        </p>

        {modalError && (
          <div className="p-3 bg-[#F87171]/12 border border-[#F87171]/30 rounded-xl text-xs text-[#F87171] leading-relaxed animate-fade-in">
            {modalError}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 pt-2">
          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full py-2.5 px-4 bg-[#12101F] hover:bg-[#18152A] border border-purple-500/20 hover:border-purple-500/40 text-[#F1F0F5] text-xs font-bold rounded-full transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:scale-[1.01] cursor-pointer"
          >
            <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Email / Password Sign In */}
          <button
            onClick={() => handleGoToAuth('/login')}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-[#8B4DFF] via-[#9B5CFF] to-[#6E2FF0] hover:from-[#9B5CFF] hover:to-[#8B4DFF] text-white text-xs font-bold rounded-full shadow-lg shadow-purple-600/35 border border-purple-400/30 transition-all duration-200 hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Sign in with Email</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>

        {/* Footer Link to Register */}
        <div className="text-center pt-2 border-t border-purple-500/10">
          <p className="text-[11px] text-[#9CA3B5]">
            Don't have an account?{' '}
            <button
              onClick={() => handleGoToAuth('/signup')}
              className="text-[#C084FC] hover:underline font-semibold cursor-pointer"
            >
              Create Account
            </button>
          </p>
        </div>
      </div>
    </Modal>
  );
}
