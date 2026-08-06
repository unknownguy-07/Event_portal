import React, { useState } from 'react';
import { Menu, Calendar } from 'lucide-react';
import { CollegeInfoBlock } from './CollegeInfoBlock';
import { SearchBar } from './SearchBar';
import { SignInButton } from './SignInButton';
import { MobileMenu } from './MobileMenu';
import { useEvents } from '@/hooks/useEvents';
import { useAuth } from '@/hooks/useAuth';

/**
 * NavigationBar Component
 * Layout: 3 Horizontal Zones (Left: Logo + Title, Center: College Info + Address Link, Right: Live Search + Google Auth)
 */
export function NavigationBar() {
  const { collegeInfo, searchQuery, setSearchQuery } = useEvents();
  const { currentUser, signInWithGoogle, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-slate-900 px-4 md:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left Zone: Brand Logo & Name */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/"
            className="flex items-center gap-2.5 group"
            aria-label="EventPortal Home"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-lg md:text-xl text-white tracking-tight group-hover:text-indigo-300 transition-colors">
              EventPortal
            </span>
          </a>
        </div>

        {/* Center Zone: College Name & Clickable Address (Desktop/Tablet) */}
        <div className="hidden lg:block">
          <CollegeInfoBlock
            name={collegeInfo.name}
            address={collegeInfo.address}
            mapsQueryUrl={collegeInfo.mapsQueryUrl}
          />
        </div>

        {/* Right Zone: Search Bar & Sign-In */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <div className="w-44 sm:w-56 md:w-64">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>

          <div className="hidden sm:block">
            <SignInButton
              user={currentUser}
              onSignIn={signInWithGoogle}
              onSignOut={signOut}
            />
          </div>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800 sm:hidden transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        collegeInfo={collegeInfo}
      >
        <div className="flex flex-col gap-4">
          <span className="text-xs font-semibold text-slate-400">Account</span>
          <SignInButton
            user={currentUser}
            onSignIn={() => {
              signInWithGoogle();
              setIsMobileMenuOpen(false);
            }}
            onSignOut={() => {
              signOut();
              setIsMobileMenuOpen(false);
            }}
          />
        </div>
      </MobileMenu>
    </header>
  );
}
