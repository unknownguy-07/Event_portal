import React from 'react';

/**
 * Individual selectable pill button with fully rounded styling.
 */
export function CategoryPill({ label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
        isActive
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
          : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
      }`}
    >
      {label}
    </button>
  );
}
