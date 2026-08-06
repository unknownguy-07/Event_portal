import React from 'react';
import { Skeleton } from '@/components/common/Skeleton';

/**
 * SkeletonFeaturedCarousel Component
 * Displays loading skeleton placeholder for the hero banner carousel.
 */
export function SkeletonFeaturedCarousel() {
  return (
    <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-6 pb-2">
      <div className="relative w-full h-[340px] sm:h-[400px] lg:h-[440px] rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 p-6 sm:p-10 flex flex-col justify-end">
        <Skeleton className="w-28 h-6 rounded-full mb-4" />
        <Skeleton className="w-3/4 sm:w-1/2 h-10 rounded-xl mb-3" />
        <Skeleton className="w-2/3 sm:w-1/3 h-5 rounded-lg mb-6" />
        <Skeleton className="w-36 h-10 rounded-full" />
      </div>
      <div className="flex justify-center gap-2 mt-4">
        <Skeleton className="w-8 h-2 rounded-full" />
        <Skeleton className="w-2 h-2 rounded-full" />
        <Skeleton className="w-2 h-2 rounded-full" />
      </div>
    </div>
  );
}
