import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Individual slide inside the FeaturedCarousel.
 */
export function FeaturedSlide({ slide }) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(slide.detailUrl);
  };

  return (
    <div
      onClick={handleNavigate}
      className="relative w-full h-[320px] md:h-[400px] rounded-3xl overflow-hidden cursor-pointer group select-none"
    >
      <img
        src={slide.image}
        alt={slide.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-6 md:p-10">
        <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">
          {slide.title}
        </h2>
        <p className="text-slate-300 text-sm md:text-base mb-6 max-w-xl line-clamp-1">
          {slide.tagline}
        </p>
        <div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNavigate();
            }}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-full transition-all duration-200 shadow-lg shadow-indigo-600/30"
          >
            View Event
          </button>
        </div>
      </div>
    </div>
  );
}
