import React from 'react';

/**
 * Loading Skeleton component placeholder.
 */
export function Skeleton({ className = '' }) {
  return (
    <div className={`animate-pulse bg-slate-800 rounded-xl ${className}`} />
  );
}
