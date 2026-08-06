import React from 'react';
import { Bookmark } from 'lucide-react';
import { CategoryPill } from './CategoryPill';
import { useEvents } from '@/hooks/useEvents';
import { useAuth } from '@/hooks/useAuth';

/**
 * CategoryBar Component
 * Positioned directly below the navigation bar.
 * Renders dynamically provided categories as pill-styled buttons, plus the "Interested Events" action button.
 */
export function CategoryBar() {
  const { categories, selectedCategory, setSelectedCategory, setShowAuthModal } = useEvents();
  const { isAuthenticated } = useAuth();

  const handleInterestedClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      setSelectedCategory('interested');
    }
  };

  return (
    <nav
      aria-label="Category Navigation"
      className="w-full bg-slate-950/90 border-b border-slate-900 px-4 md:px-8 py-3 backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Horizontal Scrollable Categories Container */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth">
          {categories.map((cat) => (
            <CategoryPill
              key={cat.id}
              label={cat.name}
              isActive={selectedCategory === cat.id}
              onClick={() => setSelectedCategory(cat.id)}
            />
          ))}
        </div>

        {/* Interested Events Action Button (Visually & functionally distinct) */}
        <button
          onClick={handleInterestedClick}
          aria-pressed={selectedCategory === 'interested'}
          className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
            selectedCategory === 'interested'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 border-purple-500 text-white shadow-lg shadow-purple-600/30'
              : 'border-purple-500/30 bg-purple-950/20 text-purple-300 hover:bg-purple-900/30 hover:border-purple-500/60'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5 fill-current text-purple-400" />
          <span>Interested Events</span>
        </button>
      </div>
    </nav>
  );
}
