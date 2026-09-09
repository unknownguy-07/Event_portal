import React from 'react';

/**
 * CategoryPill Component
 * Pill-shaped selectable category button with fully rounded styling.
 */
export function CategoryPill({ label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={isActive}
      className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide whitespace-nowrap transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#9B5CFF]/40 ${
        isActive
          ? 'bg-gradient-to-r from-[#8B4DFF] to-[#6E2FF0] text-white shadow-md shadow-purple-600/35 border border-purple-400/40'
          : 'bg-[#12101F] text-[#9CA3B5] hover:text-[#F1F0F5] hover:bg-[#161324] border border-purple-500/15 hover:border-purple-500/30'
      }`}
    >
      {label}
    </button>
  );
}
