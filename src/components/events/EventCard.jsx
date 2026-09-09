import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Building2, CheckCircle2 } from 'lucide-react';
import { BookmarkIcon } from './BookmarkIcon';
import { InterestedButton } from './InterestedButton';
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
 * 8. Bookmark icon & Interested action button
 * 9. Registered badge indicator
 */
export function EventCard({ event }) {
  const navigate = useNavigate();
  const {
    bookmarkedIds,
    toggleBookmark,
    interestedIds,
    toggleInterested,
    setShowAuthModal,
    setPendingAction,
    isEventRegistered,
  } = useEvents();
  const { isAuthenticated } = useAuth();

  const isBookmarked = bookmarkedIds ? bookmarkedIds.has(event.id) : false;
  const isInterested = interestedIds ? interestedIds.has(event.id) : false;
  const isRegistered = isEventRegistered ? isEventRegistered(event.id) : false;

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

  const handleInterestedClick = () => {
    if (!isAuthenticated) {
      setPendingAction({ type: 'interested', eventId: event.id });
      setShowAuthModal(true);
    } else {
      toggleInterested(event.id);
    }
  };

  const isFree = event.rawFee === 0 || event.registrationType === 'Free' || event.fee?.toLowerCase() === 'free';

  return (
    <article
      onClick={handleCardClick}
      className="group bg-gradient-to-b from-[#141122] to-[#100E1C] border border-purple-500/15 rounded-2xl overflow-hidden cursor-pointer hover:border-purple-500/40 hover:shadow-[0_10px_30px_rgba(139,77,255,0.12)] transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
    >
      {/* Thumbnail & Overlays */}
      <div className="relative aspect-video w-full overflow-hidden bg-[#080811]">
        <img
          src={event.thumbnail}
          alt={event.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#100E1C] via-transparent to-[#080811]/30 opacity-70 group-hover:opacity-50 transition-opacity" />

        {/* Category & Organizer Tag Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10 max-w-[80%]">
          {isRegistered && (
            <span className="bg-[#4FD1A5] text-[#080811] text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-md shadow-[#4FD1A5]/40 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-[#080811]" />
              <span>Registered</span>
            </span>
          )}
          <span className="bg-[#080811]/80 backdrop-blur-md text-[#C084FC] text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full border border-purple-400/30 shadow-sm">
            {event.category}
          </span>
          {event.organizer && (
            <span className="bg-[#18142A]/85 backdrop-blur-md text-[#F1F0F5] text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full border border-purple-500/20 shadow-sm flex items-center gap-1">
              <Building2 className="w-2.5 h-2.5 text-[#C084FC]" />
              {event.organizer}
            </span>
          )}
        </div>

        {/* Isolated Action Buttons: Interested & Bookmark */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
          <InterestedButton isInterested={isInterested} onClick={handleInterestedClick} />
          <BookmarkIcon isBookmarked={isBookmarked} onClick={handleBookmarkClick} />
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col justify-between flex-grow space-y-3">
        <div>
          <h3 className="font-extrabold text-[#F1F0F5] text-base md:text-lg line-clamp-2 group-hover:text-white transition-colors leading-snug mb-2">
            {event.name}
          </h3>

          {/* Venue Info */}
          {event.venue && (
            <div className="flex items-center gap-1.5 text-xs text-[#9CA3B5] mb-2">
              <MapPin className="w-3.5 h-3.5 text-[#9B5CFF] shrink-0" />
              <span className="line-clamp-1">{event.venue}</span>
            </div>
          )}

          {/* Short Description (2-3 lines) */}
          {event.description && (
            <p className="text-xs text-[#9CA3B5] line-clamp-2 leading-relaxed">
              {event.description}
            </p>
          )}
        </div>

        {/* Card Footer: Date & Fee Badge */}
        <div className="flex items-center justify-between text-xs pt-3 border-t border-purple-500/10 mt-auto">
          <span className="text-[#9CA3B5] font-medium">{event.date}</span>
          <div className="flex items-center gap-2">
            {isRegistered && (
              <span className="text-[10px] font-bold text-[#4FD1A5] bg-[#4FD1A5]/12 border border-[#4FD1A5]/30 px-2 py-0.5 rounded-md hidden sm:inline-flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5" /> Registered
              </span>
            )}
            <span
              className={`font-bold px-2.5 py-0.5 rounded-lg text-xs ${
                isFree
                  ? 'bg-[#4FD1A5]/12 text-[#4FD1A5] border border-[#4FD1A5]/30 shadow-sm shadow-[#4FD1A5]/10'
                  : 'bg-[#8B4DFF]/15 text-[#C084FC] border border-[#8B4DFF]/30 shadow-sm shadow-purple-900/20'
              }`}
            >
              {isFree ? 'Free' : event.fee}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
