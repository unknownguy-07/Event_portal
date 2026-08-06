import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useEvents } from '@/hooks/useEvents';

/**
 * Placeholder page for dedicated Event Detail view.
 */
export function EventDetailPage() {
  const { id } = useParams();
  const { events, featuredEvents } = useEvents();

  const event = events.find((e) => e.id === id) || featuredEvents.find((e) => e.id === id);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-extrabold mb-4">
        {event ? event.name || event.title : 'Event Detail View'}
      </h1>
      <p className="text-slate-400 text-sm max-w-md mb-6">
        Full event details (venue, schedule, registration flow, rules, gallery) will be displayed here on the dedicated Event Detail page.
      </p>
      <Link
        to="/"
        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-full transition-colors"
      >
        ← Back to Landing Page
      </Link>
    </div>
  );
}
