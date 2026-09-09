import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

/**
 * SearchBar component with debounced live input updates.
 */
export function SearchBar({ value = '', onChange, className = '' }) {
  const [searchTerm, setSearchTerm] = useState(value);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Sync internal state if external value changes (e.g. cleared via category)
  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  // Notify parent on debounced value update
  useEffect(() => {
    if (onChange && debouncedSearchTerm !== value) {
      onChange(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, onChange, value]);

  const handleClear = () => {
    setSearchTerm('');
    if (onChange) onChange('');
  };

  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3B5] pointer-events-none" />
      <input
        type="text"
        placeholder="Search events by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-10 pr-9 py-2 bg-[#12101F]/90 border border-purple-500/20 focus:border-[#9B5CFF] rounded-full text-xs md:text-sm text-[#F1F0F5] placeholder-[#6B6882] focus:outline-none focus:ring-2 focus:ring-[#9B5CFF]/25 focus:shadow-[0_0_15px_rgba(139,77,255,0.2)] transition-all duration-200"
        aria-label="Search events"
      />
      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#9CA3B5] hover:text-[#F1F0F5] hover:bg-[#18152A] rounded-full transition-colors"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
