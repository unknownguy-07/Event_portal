import React from 'react';
import { Bookmark } from 'lucide-react';

/**
 * Isolated bookmark icon button component stub with e.stopPropagation().
 */
export function BookmarkIcon({ isBookmarked, onClick }) {
  const handleClick = (e) => {
    e.stopPropagation(); // Prevents triggering card navigation
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark event'}
      className={`p-2 rounded-full backdrop-blur-md transition-all duration-200 ${
        isBookmarked
          ? 'bg-purple-600/90 text-white'
          : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800'
      }`}
    >
      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
    </button>
  );
}
