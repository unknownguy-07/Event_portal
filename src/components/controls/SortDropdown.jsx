import React from 'react';
import { ArrowUpDown } from 'lucide-react';

/**
 * SortDropdown Component
 * Provides sorting options: Latest (default), Registration Fee (Low to High), Registration Fee (High to Low).
 * Visual/structural spacing is left to allow future filter controls without a layout rebuild.
 */
export function SortDropdown({ value, onChange, className = '' }) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <label
        htmlFor="sort-select"
        className="text-xs font-semibold text-slate-400 shrink-0 flex items-center gap-1"
      >
        <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
        <span>Sort by:</span>
      </label>
      <div className="relative">
        <select
          id="sort-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 rounded-xl pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors cursor-pointer"
        >
          <option value="latest">Latest</option>
          <option value="fee_asc">Registration Fee (Low to High)</option>
          <option value="fee_desc">Registration Fee (High to Low)</option>
        </select>
        <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
