import React from 'react';
import { Search, X } from 'lucide-react';

export const SearchBar = ({ value, onChange, onClear }) => {
  return (
    <div className="w-full px-4 py-3">
      <div className="mx-auto w-full max-w-[1200px] relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
          <Search size={20} style={{ color: 'var(--text-muted)' }} />
        </div>
        
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder="Search events, clubs, venues..."
          className="w-full h-12 pl-12 pr-12 rounded-2xl outline-none transition-colors duration-200"
          style={{
            backgroundColor: 'var(--bg-input)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--border-focus)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--border)';
          }}
        />

        {value && (
          <button
            onClick={onClear}
            aria-label="Clear search"
            className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full"
            style={{ color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        )}
      </div>
    </div>
  );
};
