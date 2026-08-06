import React from 'react';
import { Link } from 'react-router-dom';

/**
 * 404 Not Found placeholder view.
 */
export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-extrabold text-indigo-400 mb-2">404</h1>
      <p className="text-slate-400 text-sm mb-6">Page not found.</p>
      <Link
        to="/"
        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-full transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}
