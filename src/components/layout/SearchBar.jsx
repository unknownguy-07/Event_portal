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
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      <input
        type="text"
        placeholder="Search events by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-10 pr-9 py-2 bg-slate-900/90 border border-slate-800 focus:border-indigo-500/80 rounded-full text-xs md:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
        aria-label="Search events"
      />
      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white transition-colors"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
