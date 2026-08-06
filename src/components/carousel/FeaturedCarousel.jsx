import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FeaturedSlide } from './FeaturedSlide';
import { SkeletonFeaturedCarousel } from './SkeletonFeaturedCarousel';
import { useEvents } from '@/hooks/useEvents';

/**
 * FeaturedCarousel Component
 * Single rotating banner hero with 5s auto-advance, hover/focus pause,
 * arrow buttons, pagination dots, touch swipe gestures, and loading skeleton support.
 */
export function FeaturedCarousel() {
  const { featuredEvents, isLoadingEvents } = useEvents();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Touch gesture handling refs
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const totalSlides = featuredEvents?.length || 0;

  const nextSlide = useCallback(() => {
    if (totalSlides > 0) {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    if (totalSlides > 0) {
      setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    }
  }, [totalSlides]);

  // Auto-advance timer (5000ms = 5s)
  useEffect(() => {
    if (isPaused || totalSlides <= 1 || isLoadingEvents) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, totalSlides, nextSlide, isLoadingEvents]);

  // Touch gesture handlers for mobile swiping
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 40;

    if (distance > minSwipeDistance) {
      nextSlide(); // Swiped left -> next slide
    } else if (distance < -minSwipeDistance) {
      prevSlide(); // Swiped right -> prev slide
    }

    // Reset touch coordinates
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  if (isLoadingEvents) {
    return <SkeletonFeaturedCarousel />;
  }

  if (!totalSlides) return null;

  return (
    <section
      aria-label="Featured Events Carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative max-w-7xl mx-auto px-4 md:px-8 pt-6 pb-2 group animate-fade-in"
    >
      {/* Featured Slide View */}
      <div className="relative">
        <FeaturedSlide slide={featuredEvents[currentIndex]} />

        {/* Left Arrow Button */}
        {totalSlides > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            aria-label="Previous featured event"
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-950/60 hover:bg-slate-900 border border-slate-700/80 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-200 shadow-xl z-20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Right Arrow Button */}
        {totalSlides > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            aria-label="Next featured event"
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-950/60 hover:bg-slate-900 border border-slate-700/80 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-200 shadow-xl z-20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Pagination Dots Indicator */}
      {totalSlides > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          {featuredEvents.map((slide, idx) => (
            <button
              key={slide.id || idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                idx === currentIndex
                  ? 'w-8 bg-indigo-500 shadow-sm shadow-indigo-500/50'
                  : 'w-2 bg-slate-800 hover:bg-slate-700'
              }`}
              aria-label={`Jump to slide ${idx + 1}: ${slide.title}`}
              aria-current={idx === currentIndex ? 'true' : 'false'}
            />
          ))}
        </div>
      )}
    </section>
  );
}
