import React from 'react';
import { SearchX, BookmarkX, CalendarX } from 'lucide-react';
import { EventCard } from './EventCard';
import { SkeletonEventGrid } from './SkeletonEventGrid';
import { useEvents } from '@/hooks/useEvents';
import { SortDropdown } from '@/components/controls/SortDropdown';
import { FilterControls } from '@/components/controls/FilterControls';

/**
 * EventGrid Component
 * Responsible for displaying the controls header, responsive card grid (Desktop 3-col, Tablet 2-col, Mobile 1-col),
 * loading skeleton placeholders, and context-aware empty states with subtle animations.
 */
export function EventGrid() {
  const {
    displayedEvents,
    sortBy,
    setSortBy,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    registrationTypeFilter,
    organizerFilter,
    isLoadingEvents,
  } = useEvents();

  // Determine empty state icon & copy based on current active filter
  const renderEmptyState = () => {
    if (selectedCategory === 'interested') {
      return {
        icon: <BookmarkX className="w-8 h-8 text-[#C084FC]" />,
        title: 'No bookmarked events yet',
        message:
          "You haven't saved any events yet. Click the bookmark icon on any event card to save events to your list!",
        showExplore: true,
      };
    }

    if (searchQuery) {
      return {
        icon: <SearchX className="w-8 h-8 text-[#9B5CFF]" />,
        title: 'No Matching Events Found',
        message: `We couldn't find any events matching "${searchQuery}". Try checking your spelling or adjusting filters.`,
      };
    }

    if (registrationTypeFilter !== 'all' || organizerFilter !== 'all') {
      return {
        icon: <CalendarX className="w-8 h-8 text-[#9CA3B5]" />,
        title: 'No Events Match Selected Filters',
        message: 'No events match the selected Fee or Organizer filters. Try changing or clearing your filter criteria.',
      };
    }

    return {
      icon: <CalendarX className="w-8 h-8 text-[#9CA3B5]" />,
      title: 'No Events Available',
      message: 'There are currently no events listed under this category.',
    };
  };

  const emptyState = renderEmptyState();

  return (
    <section
      aria-label="Events Listing Section"
      className="max-w-7xl mx-auto px-4 md:px-8 py-8 animate-fade-in"
    >
      {/* Event Listing Controls Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-6 mb-6 border-b border-purple-500/10">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-[#F1F0F5] tracking-tight">
            Explore Campus Events
          </h2>
          <p className="text-xs text-[#9CA3B5] mt-1">
            Showing <span className="text-[#C084FC] font-semibold">{displayedEvents.length}</span> event{displayedEvents.length === 1 ? '' : 's'}
          </p>
        </div>

        {/* Filter & Sort Controls Zone */}
        <div className="flex flex-wrap items-center gap-3">
          <FilterControls />
          <SortDropdown value={sortBy} onChange={setSortBy} />
        </div>
      </div>

      {/* Loading Skeleton State */}
      {isLoadingEvents ? (
        <SkeletonEventGrid count={6} />
      ) : displayedEvents.length === 0 ? (
        /* Empty State */
        <div className="text-center py-16 bg-[#12101F]/70 border border-purple-500/15 rounded-3xl p-8 max-w-md mx-auto shadow-xl shadow-purple-950/20 animate-fade-in">
          <div className="w-14 h-14 rounded-2xl bg-[#161324] border border-purple-500/20 flex items-center justify-center mx-auto mb-4 shadow-inner">
            {emptyState.icon}
          </div>
          <h3 className="text-[#F1F0F5] font-extrabold text-base mb-1">
            {emptyState.title}
          </h3>
          <p className="text-xs text-[#9CA3B5] leading-relaxed">
            {emptyState.message}
          </p>
          {emptyState.showExplore && (
            <button
              onClick={() => setSelectedCategory('all')}
              className="mt-4 inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-[#8B4DFF] to-[#6E2FF0] hover:from-[#9B5CFF] hover:to-[#8B4DFF] text-white shadow-lg shadow-purple-600/30 border border-purple-400/30 transition-all hover:scale-105 cursor-pointer"
            >
              Explore Events
            </button>
          )}
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
