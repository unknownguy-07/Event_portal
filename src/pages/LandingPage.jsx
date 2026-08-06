import React from 'react';
import { NavigationBar } from '@/components/layout/NavigationBar';
import { CategoryBar } from '@/components/navigation/CategoryBar';
import { FeaturedCarousel } from '@/components/carousel/FeaturedCarousel';
import { EventGrid } from '@/components/events/EventGrid';
import { AuthPromptModal } from '@/components/common/AuthPromptModal';

/**
 * Main LandingPage combining the sections in PRD vertical order:
 * 1. NavigationBar
 * 2. CategoryBar
 * 3. FeaturedCarousel
 * 4. EventListingControls (inside EventGrid)
 * 5. EventGrid
 */
export function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <div>
        <NavigationBar />
        <CategoryBar />
        <main>
          <FeaturedCarousel />
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
