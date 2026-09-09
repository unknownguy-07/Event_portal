import React from 'react';

/**
 * Loading Skeleton component placeholder.
 */
export function Skeleton({ className = '' }) {
  return (
    <div className={`animate-pulse bg-[#1A162B] rounded-xl ${className}`} />
  );
}
