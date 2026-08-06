import React from 'react';
import { EventCard } from './EventCard';
import { useEvents } from '@/hooks/useEvents';
import { SortDropdown } from '@/components/controls/SortDropdown';

/**
 * EventGrid Component
 * Contains Event Listing Controls header (SortDropdown + room for future filters)
 * and responsive grid of Event Cards with contextual empty states.
 */
export function EventGrid() {
  const { displayedEvents, sortBy, setSortBy, selectedCategory, searchQuery } = useEvents();

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      {/* Event Listing Controls Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-900">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
            Explore Campus Events
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Showing <span className="text-indigo-400 font-semibold">{displayedEvents.length}</span> event{displayedEvents.length === 1 ? '' : 's'}
          </p>
        </div>

        {/* Filter Controls Zone (Structured to allow future date range / venue / free-only filters) */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          {/* Reserved slot for future additional filters (e.g., Free Only / Date Range) */}
          <SortDropdown value={sortBy} onChange={setSortBy} />
        </div>
      </div>

      {/* Empty State Handler */}
      {displayedEvents.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-3xl p-8 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-400">
            🔍
          </div>
          <h3 className="text-slate-200 font-bold text-base mb-1">No events found</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {selectedCategory === 'interested'
              ? "You haven't bookmarked any events yet. Click the bookmark icon on any event card to save it here!"
              : searchQuery
              ? `No events matching "${searchQuery}". Try adjusting your search query.`
              : 'There are no events listed under this category right now.'}
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
