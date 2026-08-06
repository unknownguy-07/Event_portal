import React from 'react';
import { Bookmark } from 'lucide-react';

/**
 * BookmarkIcon Component
 * Isolated bookmark toggle button. Prevents event propagation to parent EventCard.
 */
export function BookmarkIcon({ isBookmarked, onClick }) {
  const handleClick = (e) => {
    e.stopPropagation(); // Stop navigation click event from triggering on parent card
    onClick();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isBookmarked ? 'Remove event from bookmarks' : 'Bookmark event'}
      aria-pressed={isBookmarked}
      className={`p-2 rounded-full backdrop-blur-md border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
        isBookmarked
          ? 'bg-purple-600/90 border-purple-500 text-white shadow-lg shadow-purple-600/40 scale-105'
          : 'bg-slate-950/70 border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-900 hover:border-slate-600'
      }`}
    >
      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
    </button>
  );
}
