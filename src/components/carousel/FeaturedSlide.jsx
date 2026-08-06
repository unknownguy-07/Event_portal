import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

/**
 * FeaturedSlide Component
 * Displays a single promoted event with large image backdrop, title, tagline, and "View Event" CTA.
 * Clicking anywhere on the banner or the CTA navigates to the event's detail page.
 */
export function FeaturedSlide({ slide }) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(slide.detailUrl || `/events/${slide.id}`);
  };

  return (
    <div
      onClick={handleNavigate}
      className="relative w-full h-[340px] sm:h-[400px] lg:h-[440px] rounded-3xl overflow-hidden cursor-pointer group select-none shadow-2xl border border-slate-800/80 transition-all duration-300 hover:border-slate-700"
    >
      {/* Background Image with Zoom on Hover */}
      <img
        src={slide.image}
        alt={slide.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />

      {/* Dark Gradient Overlay for Contrast Compliance */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/20" />

      {/* Slide Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 lg:p-12 z-10">
        <div className="max-w-2xl space-y-3">
          {/* Featured Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/20 border border-indigo-500/40 backdrop-blur-md rounded-full text-indigo-300 text-[11px] font-bold tracking-wider uppercase">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>Featured Event</span>
          </div>

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight drop-shadow-md group-hover:text-indigo-200 transition-colors">
            {slide.title}
          </h2>

          {/* Tagline */}
          <p className="text-slate-300 text-xs sm:text-sm lg:text-base line-clamp-1 max-w-xl font-normal text-balance">
            {slide.tagline}
          </p>

          {/* CTA Button */}
          <div className="pt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNavigate();
              }}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-full shadow-lg shadow-indigo-600/30 transition-all duration-200 group-hover:translate-x-1"
            >
              <span>View Event</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
