import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Building2 } from 'lucide-react';
import { BookmarkIcon } from './BookmarkIcon';
import { useEvents } from '@/hooks/useEvents';
import { useAuth } from '@/hooks/useAuth';

/**
 * EventCard Component
 * Displays card summary information:
 * 1. Event thumbnail
 * 2. Event name
 * 3. Category tag & Organizer badge
 * 4. Venue location
 * 5. Short Description (2-3 lines truncated)
 * 6. Date
 * 7. Registration fee (or "Free")
 * 8. Bookmark icon
 *
 * (Note: Contact number is strictly excluded from card view; displayed on detail page).
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

  const isFree = event.rawFee === 0 || event.registrationType === 'Free' || event.fee?.toLowerCase() === 'free';

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

        {/* Category & Organizer Tag Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10 max-w-[80%]">
          <span className="bg-slate-950/80 backdrop-blur-md text-indigo-300 text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-full border border-indigo-500/30 shadow-sm">
            {event.category}
          </span>
          {event.organizer && (
            <span className="bg-purple-950/80 backdrop-blur-md text-purple-300 text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full border border-purple-500/30 shadow-sm flex items-center gap-1">
              <Building2 className="w-2.5 h-2.5" />
              {event.organizer}
            </span>
          )}
        </div>

        {/* Isolated Bookmark Icon */}
        <div className="absolute top-3 right-3 z-10">
          <BookmarkIcon isBookmarked={isBookmarked} onClick={handleBookmarkClick} />
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col justify-between flex-grow space-y-3">
        <div>
          <h3 className="font-extrabold text-slate-100 text-base md:text-lg line-clamp-2 group-hover:text-indigo-300 transition-colors leading-snug mb-2">
            {event.name}
          </h3>

          {/* Venue Info */}
          {event.venue && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
              <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="line-clamp-1">{event.venue}</span>
            </div>
          )}

          {/* Short Description (2-3 lines) */}
          {event.description && (
            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
              {event.description}
            </p>
          )}
        </div>

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
