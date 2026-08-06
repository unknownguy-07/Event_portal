import React from 'react';
import { MapPin } from 'lucide-react';

/**
 * Renders College Name and a clickable Address that opens Google Maps in a new tab.
 */
export function CollegeInfoBlock({ name, address, mapsQueryUrl, className = '' }) {
  const googleMapsUrl =
    mapsQueryUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${name} ${address}`
    )}`;

  return (
    <div className={`flex flex-col items-center md:items-start ${className}`}>
      <span className="text-xs md:text-sm font-semibold text-slate-100 tracking-wide">
        {name}
      </span>
      <a
        href={googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="Open in Google Maps"
        className="group inline-flex items-center gap-1.5 text-[11px] md:text-xs text-slate-400 hover:text-indigo-400 transition-colors duration-200 mt-0.5"
      >
        <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-500 group-hover:text-indigo-400 transition-colors" />
        <span className="underline-offset-2 group-hover:underline line-clamp-1">
          {address}
        </span>
      </a>
    </div>
  );
}
