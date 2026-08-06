import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookmarkIcon } from './BookmarkIcon';
import { useEvents } from '@/hooks/useEvents';
import { useAuth } from '@/hooks/useAuth';

/**
 * EventCard Component
 * Strictly displays summary information per PRD:
 * 1. Event thumbnail
 * 2. Event name
 * 3. Category tag badge
 * 4. Date
 * 5. Registration fee (or "Free")
 * 6. Bookmark icon
 */
export function EventCard({ event }) {
  const navigate = useNavigate();
  const { bookmarkedIds, toggleBookmark, setShowAuthModal, setPendingAction } = useEvents();
  const { isAuthenticated } = useAuth();

  const isBookmarked = bookmarkedIds.has(event.id);

  const handleCardClick = () => {
    navigate(`/events/${event.id}`);
  };

  const handleBookmarkClick = () => {
    if (!isAuthenticated) {
      setPendingAction({ type: 'bookmark', eventId: event.id });
      setShowAuthModal(true);
    } else {
      toggleBookmark(event.id);
    }
  };

  const isFree = event.rawFee === 0 || event.fee?.toLowerCase() === 'free';

  return (
    <article
      onClick={handleCardClick}
      className="group bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden cursor-pointer hover:border-slate-700 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
    >
      {/* Thumbnail & Overlays */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
        <img
          src={event.thumbnail}
          alt={event.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/20 opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Category Tag Badge */}
        <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-indigo-300 text-[10px] font-extrabold tracking-wider uppercase px-3 py-1 rounded-full border border-indigo-500/30 shadow-sm">
          {event.category}
        </span>

        {/* Isolated Bookmark Icon */}
        <div className="absolute top-3 right-3 z-10">
          <BookmarkIcon isBookmarked={isBookmarked} onClick={handleBookmarkClick} />
        </div>
      </div>

      {/* Content Summary Area */}
      <div className="p-5 flex flex-col justify-between flex-grow">
        <h3 className="font-extrabold text-slate-100 text-base md:text-lg line-clamp-2 group-hover:text-indigo-300 transition-colors leading-snug mb-4">
          {event.name}
        </h3>

        {/* Card Footer: Date & Fee Badge */}
        <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-800/80 mt-auto">
          <span className="text-slate-400 font-medium">{event.date}</span>
          <span
            className={`font-bold px-2.5 py-0.5 rounded-md ${
              isFree
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-slate-800 text-slate-200 border border-slate-700/60'
            }`}
          >
            {isFree ? 'Free' : event.fee}
          </span>
        </div>
      </div>
    </article>
  );
}
