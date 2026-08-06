import React from 'react';

/**
 * Debounced live search input bar component stub.
 */
export function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full max-w-xs">
      <input
        type="text"
        placeholder="Search events..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-full text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
      />
    </div>
  );
}
