import React, { useState, useEffect } from 'react';
import { FeaturedSlide } from './FeaturedSlide';
import { useEvents } from '@/hooks/useEvents';

/**
 * Auto-advancing rotating banner hero carousel component stub.
 */
export function FeaturedCarousel() {
  const { featuredEvents } = useEvents();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || !featuredEvents.length) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredEvents.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, featuredEvents.length]);

  if (!featuredEvents.length) return null;

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative max-w-7xl mx-auto px-4 md:px-8 py-6"
    >
      <FeaturedSlide slide={featuredEvents[currentIndex]} />

      {/* Pagination Dots */}
      <div className="flex justify-center items-center gap-2 mt-4">
        {featuredEvents.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              idx === currentIndex ? 'w-8 bg-indigo-500' : 'bg-slate-800'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
