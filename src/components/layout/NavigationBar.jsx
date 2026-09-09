import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Calendar, Ticket } from 'lucide-react';
import { CollegeInfoBlock } from './CollegeInfoBlock';
import { SearchBar } from './SearchBar';
import { SignInButton } from './SignInButton';
import { MobileMenu } from './MobileMenu';
import { useEvents } from '@/hooks/useEvents';

/**
 * NavigationBar Component
 * Layout: 3 Horizontal Zones
 * - Left: Logo + Brand + My Events Nav Tab
 * - Center: College Info + Address Link
 * - Right: Live Search + Profile Dropdown
 */
export function NavigationBar() {
  const { collegeInfo, searchQuery, setSearchQuery, userRegisteredIds } = useEvents();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isMyEventsActive = location.pathname === '/my-events' || location.pathname === '/enrolled';
  const registeredCount = userRegisteredIds ? userRegisteredIds.size : 0;

  return (
    <header className="sticky top-0 z-40 bg-[#080811]/85 backdrop-blur-xl border-b border-purple-500/15 px-4 md:px-8 py-3.5 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left Zone: Brand Logo & Navigation Tabs */}
        <div className="flex items-center gap-4 md:gap-6 shrink-0">
          <Link
            to="/"
            className="flex items-center gap-2.5 group"
            aria-label="EventPortal Home"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#9B5CFF] via-[#8B4DFF] to-[#6E2FF0] flex items-center justify-center text-white shadow-lg shadow-purple-600/30 border border-purple-400/30 group-hover:scale-105 group-hover:shadow-purple-500/50 transition-all duration-200">
              <Calendar className="w-5 h-5 text-white drop-shadow" />
            </div>
            <span className="font-extrabold text-lg md:text-xl text-[#F1F0F5] tracking-tight group-hover:text-white transition-colors">
              Event<span className="bg-gradient-to-r from-[#9B5CFF] to-[#C084FC] bg-clip-text text-transparent">Portal</span>
            </span>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-2">
            <Link
              to="/"
              className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
                location.pathname === '/'
                  ? 'bg-purple-500/20 text-[#C084FC] border border-purple-500/30 shadow-sm shadow-purple-950/40'
                  : 'text-[#9CA3B5] hover:text-[#F1F0F5] hover:bg-[#12101F]'
              }`}
            >
              Explore
            </Link>

            <Link
              to="/my-events"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
                isMyEventsActive
                  ? 'bg-purple-500/20 text-[#C084FC] border border-purple-500/30 shadow-sm shadow-purple-950/40'
                  : 'text-[#9CA3B5] hover:text-[#F1F0F5] hover:bg-[#12101F]'
              }`}
            >
              <Ticket className="w-3.5 h-3.5 text-[#9B5CFF]" />
              <span>My Events</span>
              {registeredCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-extrabold rounded-full bg-gradient-to-r from-[#8B4DFF] to-[#6E2FF0] text-white shadow-sm shadow-purple-600/40">
                  {registeredCount}
                </span>
              )}
            </Link>
          </nav>
        </div>

        {/* Center Zone: College Name & Clickable Address (Desktop) */}
        <div className="hidden xl:block">
          <CollegeInfoBlock
            name={collegeInfo.name}
            address={collegeInfo.address}
            mapsQueryUrl={collegeInfo.mapsQueryUrl}
          />
        </div>

        {/* Right Zone: Search Bar & Sign-In Dropdown */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <div className="w-40 sm:w-52 md:w-60">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>

          <div className="hidden sm:block">
            <SignInButton />
          </div>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-[#9CA3B5] hover:text-[#F1F0F5] rounded-xl bg-[#12101F] border border-purple-500/20 hover:border-purple-500/40 md:hidden transition-colors"
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
        <div className="flex flex-col gap-3">
          <span className="text-[10px] font-bold text-[#6B6882] uppercase tracking-wider">
            Navigation
          </span>
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`px-3 py-2 text-xs font-semibold rounded-xl transition-colors ${
              location.pathname === '/'
                ? 'bg-purple-500/20 text-[#C084FC] border border-purple-500/30'
                : 'text-[#9CA3B5] hover:text-[#F1F0F5] hover:bg-[#12101F]'
            }`}
          >
            Explore Events
          </Link>
          <Link
            to="/my-events"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl transition-colors ${
              isMyEventsActive
                ? 'bg-purple-500/20 text-[#C084FC] border border-purple-500/30'
                : 'text-[#9CA3B5] hover:text-[#F1F0F5] hover:bg-[#12101F]'
            }`}
          >
            <div className="flex items-center gap-2">
              <Ticket className="w-4 h-4 text-[#9B5CFF]" />
              <span>My Events</span>
            </div>
            {registeredCount > 0 && (
              <span className="px-2 py-0.5 text-[10px] font-bold bg-[#8B4DFF] text-white rounded-full">
                {registeredCount}
              </span>
            )}
          </Link>

          <div className="pt-3 border-t border-purple-500/15">
            <span className="text-[10px] font-bold text-[#6B6882] uppercase tracking-wider block mb-2">
              Account
            </span>
            <SignInButton />
          </div>
        </div>
      </MobileMenu>
    </header>
  );
}
