import React from 'react';
import { SearchX, BookmarkX, CalendarX } from 'lucide-react';
import { EventCard } from './EventCard';
import { SkeletonEventGrid } from './SkeletonEventGrid';
import { useEvents } from '@/hooks/useEvents';
import { SortDropdown } from '@/components/controls/SortDropdown';

/**
 * EventGrid Component
 * Responsible for displaying the controls header, responsive card grid (Desktop 3-col, Tablet 2-col, Mobile 1-col),
 * loading skeleton placeholders, and context-aware empty states.
 */
export function EventGrid({ isLoading = false }) {
  const { displayedEvents, sortBy, setSortBy, selectedCategory, searchQuery } = useEvents();

  // Determine empty state icon & copy based on current active filter
  const renderEmptyState = () => {
    if (selectedCategory === 'interested') {
      return {
        icon: <BookmarkX className="w-8 h-8 text-purple-400" />,
        title: 'No Bookmarked Events',
        message:
          "You haven't saved any events yet. Click the bookmark icon on any event card to add it to your saved list!",
      };
    }

    if (searchQuery) {
      return {
        icon: <SearchX className="w-8 h-8 text-indigo-400" />,
        title: 'No Matching Events Found',
        message: `We couldn't find any events matching "${searchQuery}". Try checking your spelling or clearing filters.`,
      };
    }

    return {
      icon: <CalendarX className="w-8 h-8 text-slate-400" />,
      title: 'No Events Available',
      message: 'There are currently no events listed under this category.',
    };
  };

  const emptyState = renderEmptyState();

  return (
    <section aria-label="Events Grid" className="max-w-7xl mx-auto px-4 md:px-8 py-8">
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

        {/* Filter Controls Zone */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <SortDropdown value={sortBy} onChange={setSortBy} />
        </div>
      </div>

      {/* Loading Skeleton State */}
      {isLoading ? (
        <SkeletonEventGrid count={6} />
      ) : displayedEvents.length === 0 ? (
        /* Empty State */
        <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-3xl p-8 max-w-md mx-auto shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-4 shadow-inner">
            {emptyState.icon}
          </div>
          <h3 className="text-slate-100 font-extrabold text-base mb-1">
            {emptyState.title}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {emptyState.message}
          </p>
        </div>
      ) : (
        /* Responsive Event Grid: Mobile (1 col), Tablet (2 cols), Desktop (3 cols) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedEvents.map((evt) => (
            <EventCard key={evt.id} event={evt} />
          ))}
        </div>
      )}
    </section>
  );
}
