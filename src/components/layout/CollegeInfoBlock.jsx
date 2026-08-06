import React from 'react';

/**
 * Renders College Name and clickable Address opening Google Maps in a new tab.
 */
export function CollegeInfoBlock({ name, address, mapsQueryUrl }) {
  return (
    <div className="text-center md:text-left">
      <h2 className="text-sm font-semibold text-slate-200">{name}</h2>
      <a
        href={mapsQueryUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-slate-400 hover:text-indigo-400 transition-colors inline-block"
      >
        {address}
      </a>
    </div>
  );
}
