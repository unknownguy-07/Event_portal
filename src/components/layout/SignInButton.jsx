import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Ticket, ChevronDown, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useEvents } from '@/hooks/useEvents';

/**
 * Personalized User Profile Button & Dropdown.
 * Displays user avatar, name, and interactive dropdown menu when logged in.
 * Displays "Sign In" button when unauthenticated.
 */
export function SignInButton({ className = '' }) {
  const { currentUser, userProfile, signOut, isAuthenticated } = useAuth();
  const { userRegisteredIds } = useEvents();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const displayName = userProfile?.name || currentUser?.displayName || 'Student';
  const email = userProfile?.email || currentUser?.email || '';
  const registeredCount = userRegisteredIds ? userRegisteredIds.size : 0;

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (isAuthenticated && currentUser) {
    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 px-3 py-1.5 bg-[#12101F] hover:bg-[#18152A] border border-purple-500/25 hover:border-purple-500/50 rounded-full transition-all duration-200 cursor-pointer group"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {currentUser.photoURL ? (
            <img
              src={currentUser.photoURL}
              alt={displayName}
              className="w-6 h-6 rounded-full object-cover border border-[#9B5CFF]/40"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#9B5CFF]/30 to-[#6E2FF0]/30 border border-[#9B5CFF]/40 flex items-center justify-center text-[#C084FC]">
              <User className="w-3.5 h-3.5" />
            </div>
          )}

          <span className="text-xs font-semibold text-[#F1F0F5] max-w-[110px] truncate">
            {displayName}
          </span>

          <ChevronDown
            className={`w-3.5 h-3.5 text-[#9CA3B5] transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-[#C084FC]' : ''
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#12101F]/95 backdrop-blur-xl border border-purple-500/25 shadow-2xl shadow-purple-950/60 p-2 z-50 animate-fade-in">
            {/* User Info Header */}
            <div className="p-3 bg-[#080811]/60 rounded-xl border border-purple-500/15 mb-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-[#F1F0F5] truncate">
                  {displayName}
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-bold bg-[#8B4DFF]/20 text-[#C084FC] rounded-full border border-purple-400/30">
                  Student
                </span>
              </div>
              <p className="text-[11px] text-[#9CA3B5] truncate">{email}</p>
            </div>

            {/* Menu Items */}
            <div className="space-y-1">
              <Link
                to="/my-events"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-[#F1F0F5] hover:text-white rounded-xl hover:bg-[#18152A] border border-transparent hover:border-purple-500/20 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Ticket className="w-4 h-4 text-[#9B5CFF]" />
                  <span>My Events</span>
                </div>
                {registeredCount > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-gradient-to-r from-[#8B4DFF] to-[#6E2FF0] text-white rounded-full shadow-sm">
                    {registeredCount}
                  </span>
                )}
              </Link>

              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#9CA3B5] hover:text-[#F1F0F5] rounded-xl hover:bg-[#18152A] transition-colors"
              >
                <Sparkles className="w-4 h-4 text-[#C084FC]" />
                <span>Explore Events</span>
              </Link>
            </div>

            {/* Sign Out Action */}
            <div className="pt-2 mt-2 border-t border-purple-500/15">
              <button
                onClick={async () => {
                  setIsOpen(false);
                  await signOut();
                  navigate('/');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#F87171] hover:bg-[#F87171]/10 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Unauthenticated State
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Link
        to="/login"
        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#8B4DFF] via-[#9B5CFF] to-[#7928CA] hover:from-[#9B5CFF] hover:to-[#8B4DFF] text-white text-xs font-bold rounded-full shadow-lg shadow-purple-600/30 hover:shadow-purple-500/50 border border-purple-400/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
      >
        <span>Sign In</span>
      </Link>
    </div>
  );
}
