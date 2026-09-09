import React, { useMemo } from 'react';
import { Star } from 'lucide-react';
import { CategoryPill } from './CategoryPill';
import { useEvents } from '@/hooks/useEvents';
import { useAuth } from '@/hooks/useAuth';

/**
 * CategoryBar Component
 * Positioned directly below the navigation bar.
 * Renders dynamically provided categories as pill-styled buttons, plus the "Interested Events" action button.
 */
export function CategoryBar() {
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    setShowAuthModal,
    setPendingAction,
    bookmarkedIds,
    interestedIds,
  } = useEvents();
  const { isAuthenticated } = useAuth();

  const handleInterestedClick = () => {
    if (!isAuthenticated) {
      setPendingAction('interested');
      setShowAuthModal(true);
    } else {
      setSelectedCategory('interested');
    }
  };

  const interestedCount = useMemo(() => {
    if (!isAuthenticated) return 0;
    const combined = new Set([
      ...(interestedIds ? Array.from(interestedIds) : []),
      ...(bookmarkedIds ? Array.from(bookmarkedIds) : []),
    ]);
    return combined.size;
  }, [isAuthenticated, interestedIds, bookmarkedIds]);

  return (
    <nav
      aria-label="Category Navigation"
      className="w-full bg-[#080811]/70 border-b border-purple-500/10 px-4 md:px-8 py-2.5 backdrop-blur-md sticky top-[61px] md:top-[65px] z-30"
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

        {/* Interested Events Action Button */}
        <button
          onClick={handleInterestedClick}
          aria-pressed={selectedCategory === 'interested'}
          className={`shrink-0 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400/50 cursor-pointer ${
            selectedCategory === 'interested'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-600 border-amber-400/60 text-white shadow-lg shadow-amber-500/30'
              : 'border-purple-500/20 bg-[#161324] text-[#C084FC] hover:bg-[#1E1932] hover:border-amber-400/40 hover:text-white shadow-sm'
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${selectedCategory === 'interested' ? 'fill-current text-white' : 'fill-current text-amber-400'}`} />
          <span className="tracking-wide">Interested Events</span>
          {interestedCount > 0 && (
            <span className="px-1.5 py-0.5 bg-amber-400/25 text-amber-200 text-[10px] rounded-full font-bold border border-amber-400/30">
              {interestedCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}
