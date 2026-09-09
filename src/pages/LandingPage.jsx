import React from 'react';
import { NavigationBar } from '@/components/layout/NavigationBar';
import { CategoryBar } from '@/components/navigation/CategoryBar';
import { FeaturedCarousel } from '@/components/carousel/FeaturedCarousel';
import { EventGrid } from '@/components/events/EventGrid';
import { AuthPromptModal } from '@/components/common/AuthPromptModal';
import { useEvents } from '@/hooks/useEvents';

/**
 * Main LandingPage component.
 * Features:
 * - Automatically hides FeaturedCarousel with a smooth transition when user types in SearchBar.
 * - Restores FeaturedCarousel when search query is cleared.
 */
export function LandingPage() {
  const { searchQuery } = useEvents();
  const isSearching = Boolean(searchQuery && searchQuery.trim().length > 0);

  return (
    <div className="min-h-screen bg-[#080811] text-[#F1F0F5] flex flex-col justify-between relative selection:bg-[#8B4DFF]/40">
      <div>
        <NavigationBar />
        <CategoryBar />
        <main>
          {/* Featured Events Hero Container with Smooth Fade & Height Transition */}
          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              isSearching
                ? 'max-h-0 opacity-0 py-0 pointer-events-none'
                : 'max-h-[600px] opacity-100'
            }`}
          >
            <FeaturedCarousel />
          </div>

          <EventGrid />
        </main>
      </div>

      <footer className="border-t border-purple-500/10 py-8 text-center text-xs text-[#6B6882] bg-[#080811]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="font-bold text-[#F1F0F5] tracking-tight">Event<span className="text-[#9B5CFF]">Portal</span></span>
            <span className="ml-2 text-[11px] text-[#6B6882]">• AI-Powered Campus Discovery</span>
          </div>
          <p className="text-[11px] text-[#6B6882]">
            © 2026 Manav Rachna University. All rights reserved.
          </p>
        </div>
      </footer>

      <AuthPromptModal />
    </div>
  );
}
