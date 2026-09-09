import React from 'react';
import { Star } from 'lucide-react';

/**
 * InterestedButton Component
 * Isolated toggle button to mark/unmark event interest.
 * Prevents event propagation to parent EventCard.
 */
export function InterestedButton({ isInterested, onClick, showLabel = false }) {
  const handleClick = (e) => {
    e.stopPropagation(); // Prevent card navigation
    onClick();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isInterested ? 'Remove from interested events' : 'Mark as interested event'}
      aria-pressed={isInterested}
      title={isInterested ? 'Interested ✓ (Click to remove)' : 'Mark as Interested'}
      className={`inline-flex items-center gap-1.5 backdrop-blur-md border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400/50 cursor-pointer ${
        showLabel ? 'px-3 py-1.5 rounded-full text-xs font-bold' : 'p-2 rounded-full'
      } ${
        isInterested
          ? 'bg-gradient-to-br from-amber-500 to-yellow-600 border-amber-400/60 text-white shadow-lg shadow-amber-500/40 scale-105'
          : 'bg-[#080811]/75 border-purple-500/20 text-[#9CA3B5] hover:text-amber-300 hover:bg-[#161324] hover:border-amber-400/30'
      }`}
    >
      <Star className={`w-4 h-4 ${isInterested ? 'fill-current text-white' : ''}`} />
      {showLabel && (
        <span>{isInterested ? 'Interested ✓' : 'Mark Interested'}</span>
      )}
    </button>
  );
}
