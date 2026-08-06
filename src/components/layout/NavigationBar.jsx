import React from 'react';
import { CollegeInfoBlock } from './CollegeInfoBlock';
import { SearchBar } from './SearchBar';
import { SignInButton } from './SignInButton';
import { useEvents } from '@/hooks/useEvents';
import { useAuth } from '@/hooks/useAuth';

/**
 * Top NavigationBar containing Left (Brand), Center (College Info), and Right (Search & Auth).
 */
export function NavigationBar() {
  const { collegeInfo, searchQuery, setSearchQuery } = useEvents();
  const { currentUser, signInWithGoogle, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 px-4 md:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left Side: App Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-sm">
            E
          </div>
          <span className="font-bold text-lg text-white tracking-tight">EventPortal</span>
        </div>

        {/* Center: College Info */}
        <div className="hidden md:block">
          <CollegeInfoBlock
            name={collegeInfo.name}
            address={collegeInfo.address}
            mapsQueryUrl={collegeInfo.mapsQueryUrl}
          />
        </div>

        {/* Right Side: Search & Auth */}
        <div className="flex items-center gap-3">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <SignInButton
            user={currentUser}
            onSignIn={signInWithGoogle}
            onSignOut={signOut}
          />
        </div>
      </div>
    </header>
  );
}
