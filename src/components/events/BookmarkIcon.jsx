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
      className={`p-2 rounded-full backdrop-blur-md border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#9B5CFF]/50 ${
        isBookmarked
          ? 'bg-gradient-to-br from-[#8B4DFF] to-[#6E2FF0] border-purple-400/50 text-white shadow-lg shadow-purple-600/50 scale-105'
          : 'bg-[#080811]/75 border-purple-500/20 text-[#9CA3B5] hover:text-white hover:bg-[#161324] hover:border-purple-500/40'
      }`}
    >
      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
    </button>
  );
}
