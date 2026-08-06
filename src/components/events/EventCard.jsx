import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookmarkIcon } from './BookmarkIcon';
import { useEvents } from '@/hooks/useEvents';
import { useAuth } from '@/hooks/useAuth';

/**
 * EventCard summary view component stub.
 * Strictly displays only: thumbnail, name, category tag, date, fee, bookmark icon.
 */
export function EventCard({ event }) {
  const navigate = useNavigate();
  const { bookmarkedIds, toggleBookmark, setShowAuthModal } = useEvents();
  const { isAuthenticated } = useAuth();

  const isBookmarked = bookmarkedIds.has(event.id);

  const handleCardClick = () => {
    navigate(`/events/${event.id}`);
  };

  const handleBookmarkClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      toggleBookmark(event.id);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden cursor-pointer hover:border-slate-700 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
        <img
          src={event.thumbnail}
          alt={event.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Category Tag */}
        <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-indigo-400 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border border-indigo-500/20">
          {event.category}
        </span>
        {/* Bookmark Icon */}
        <div className="absolute top-3 right-3">
          <BookmarkIcon isBookmarked={isBookmarked} onClick={handleBookmarkClick} />
        </div>
      </div>

      <div className="p-4 flex flex-col justify-between flex-grow">
        <h3 className="font-bold text-slate-100 text-base line-clamp-2 group-hover:text-indigo-400 transition-colors mb-2">
          {event.name}
        </h3>
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60 mt-auto">
          <span>{event.date}</span>
          <span className={`font-semibold ${event.rawFee === 0 ? 'text-emerald-400' : 'text-slate-200'}`}>
            {event.fee}
          </span>
        </div>
      </div>
    </div>
  );
}
