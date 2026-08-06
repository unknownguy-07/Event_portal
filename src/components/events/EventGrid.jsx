import React from 'react';
import { EventCard } from './EventCard';
import { useEvents } from '@/hooks/useEvents';
import { SortDropdown } from '@/components/controls/SortDropdown';

/**
 * Responsive grid container for event cards with empty state and sort control header.
 */
export function EventGrid() {
  const { displayedEvents, sortBy, setSortBy, selectedCategory, searchQuery } = useEvents();

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      {/* Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Explore Events</h2>
          <p className="text-xs text-slate-400">
            Showing {displayedEvents.length} event{displayedEvents.length === 1 ? '' : 's'}
          </p>
        </div>
        <SortDropdown value={sortBy} onChange={setSortBy} />
      </div>

      {/* Empty State */}
      {displayedEvents.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
          <p className="text-slate-300 font-semibold mb-1">No events found</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {selectedCategory === 'interested'
              ? "You haven't bookmarked any events yet. Click the bookmark icon on any event to save it here!"
              : searchQuery
              ? `No events matching "${searchQuery}". Try searching for something else.`
              : 'There are no events available for this category right now.'}
          </p>
        </div>
      ) : (
        /* Event Cards Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedEvents.map((evt) => (
            <EventCard key={evt.id} event={evt} />
          ))}
        </div>
      )}
    </section>
  );
}
