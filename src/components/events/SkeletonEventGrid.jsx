import React from 'react';
import { Skeleton } from '@/components/common/Skeleton';

/**
 * SkeletonEventGrid Component
 * Displays loading skeleton card placeholders while event data is loading.
 */
export function SkeletonEventGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden p-0 flex flex-col justify-between"
        >
          <Skeleton className="w-full aspect-video rounded-none" />
          <div className="p-5 space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex justify-between pt-3 border-t border-slate-800/60 mt-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
