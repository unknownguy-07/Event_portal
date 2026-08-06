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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
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

      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        © 2026 University EventPortal. All rights reserved.
      </footer>

      <AuthPromptModal />
    </div>
  );
}
