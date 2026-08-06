import React from 'react';
import { CategoryPill } from './CategoryPill';
import { useEvents } from '@/hooks/useEvents';
import { useAuth } from '@/hooks/useAuth';

/**
 * Horizontal scrollable category container + "Interested Events" filter button.
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
    <div className="w-full bg-slate-950 border-b border-slate-900/80 px-4 md:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Scrollable Categories List */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
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
          className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
            selectedCategory === 'interested'
              ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/30'
              : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-purple-500/50 hover:text-purple-300'
          }`}
        >
          Interested Events
        </button>
      </div>
    </div>
  );
}
