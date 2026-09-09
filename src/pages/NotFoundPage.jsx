import React from 'react';
import { Link } from 'react-router-dom';

/**
 * 404 Not Found placeholder view.
 */
export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#080811] text-[#F1F0F5] p-8 flex flex-col items-center justify-center text-center selection:bg-[#8B4DFF]/40">
      <h1 className="text-6xl font-black bg-gradient-to-r from-[#9B5CFF] to-[#C084FC] bg-clip-text text-transparent mb-2 drop-shadow">
        404
      </h1>
      <p className="text-[#9CA3B5] text-sm mb-6">Page not found.</p>
      <Link
        to="/"
        className="px-6 py-2.5 bg-gradient-to-r from-[#8B4DFF] via-[#9B5CFF] to-[#6E2FF0] hover:from-[#9B5CFF] hover:to-[#8B4DFF] text-white text-xs font-bold rounded-full shadow-lg shadow-purple-600/35 border border-purple-400/30 transition-all duration-200 hover:scale-[1.03]"
      >
        Return Home
      </Link>
    </div>
  );
}
