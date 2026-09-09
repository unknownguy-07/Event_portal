import React from 'react';
import { Bookmark } from 'lucide-react';

export const BookmarkIcon = ({ isBookmarked, onClick, size = 18 }) => {
  return (
    <button
      onClick={onClick}
      aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark event'}
      className="flex items-center justify-center rounded-full"
      style={{
        width: '36px',
        height: '36px',
        transition: 'all var(--transition-fast)'
      }}
      onMouseEnter={(e) => {
        if (!isBookmarked) {
          e.currentTarget.querySelector('svg').style.stroke = 'var(--accent)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isBookmarked) {
          e.currentTarget.querySelector('svg').style.stroke = 'var(--text-muted)';
        }
      }}
    >
      <Bookmark
        size={size}
        style={{
          fill: isBookmarked ? 'var(--accent)' : 'none',
          stroke: isBookmarked ? 'var(--accent)' : 'var(--text-muted)',
          transition: 'all var(--transition-fast)'
        }}
      />
    </button>
  );
};
