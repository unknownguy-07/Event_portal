import React from 'react';
import { ArrowUpDown } from 'lucide-react';

/**
 * SortDropdown Component
 * Provides updated sorting options:
 * - Most Popular (default)
 * - Latest
 */
export function SortDropdown({ value, onChange, className = '' }) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <label
        htmlFor="sort-select"
        className="text-[11px] font-semibold text-[#9CA3B5] uppercase tracking-wider shrink-0 flex items-center gap-1.5"
      >
        <ArrowUpDown className="w-3.5 h-3.5 text-[#C084FC]" />
        <span>Sort by:</span>
      </label>
      <div className="relative">
        <select
          id="sort-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none bg-[#12101F] border border-purple-500/15 text-xs font-semibold text-[#F1F0F5] rounded-xl pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#9B5CFF]/30 focus:border-[#9B5CFF] transition-colors cursor-pointer shadow-sm"
        >
          <option value="popular" className="bg-[#12101F] text-[#F1F0F5]">Most Popular</option>
          <option value="latest" className="bg-[#12101F] text-[#F1F0F5]">Latest</option>
        </select>
        <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9CA3B5]">
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
