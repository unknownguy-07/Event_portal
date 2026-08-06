import React from 'react';

/**
 * Sort dropdown control stub (Latest, Registration Fee Low to High, High to Low).
 */
export function SortDropdown({ value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort-select" className="text-xs text-slate-400 font-medium">
        Sort by:
      </label>
      <select
        id="sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500 transition-colors"
      >
        <option value="latest">Latest</option>
        <option value="fee_asc">Registration Fee (Low to High)</option>
        <option value="fee_desc">Registration Fee (High to Low)</option>
      </select>
    </div>
  );
}
