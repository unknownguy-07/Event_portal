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
      className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
        isActive
          ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-600/30'
          : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800/80'
      }`}
    >
      {label}
    </button>
  );
}
