import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Building2,
  Calendar,
  Tag,
  Bookmark,
  Sparkles,
} from 'lucide-react';
import { useEvents } from '@/hooks/useEvents';
import { useAuth } from '@/hooks/useAuth';
import { NavigationBar } from '@/components/layout/NavigationBar';
import { AuthPromptModal } from '@/components/common/AuthPromptModal';

/**
 * EventDetailPage Component
 * Displays complete event details:
 * - Full description
 * - Venue
 * - Contact Number (click to call)
 * - Organizer
 * - Registration Type (Free/Paid)
 * - Date, Category, Banner image, and Bookmark interaction
 */
export function EventDetailPage() {
  const { id } = useParams();
  const { events, featuredEvents, bookmarkedIds, toggleBookmark, setShowAuthModal, setPendingAction } = useEvents();
  const { isAuthenticated } = useAuth();

  const event =
    events.find((e) => e.id === id) ||
    featuredEvents.find((e) => e.id === id) ||
    events[0]; // Fallback to first event if ID not found

  const isBookmarked = event ? bookmarkedIds.has(event.id) : false;

  const handleBookmarkClick = () => {
    if (!isAuthenticated) {
      setPendingAction({ type: 'bookmark', eventId: event.id });
      setShowAuthModal(true);
    } else {
      toggleBookmark(event.id);
    }
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
        <NavigationBar />
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold">Event Not Found</h2>
          <Link
            to="/"
            className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-indigo-600 text-white font-semibold text-xs rounded-full"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Landing Page
          </Link>
        </div>
      </div>
    );
  }

  const isFree =
    event.rawFee === 0 ||
    event.registrationType === 'Free' ||
    event.fee?.toLowerCase() === 'free';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <div>
        <NavigationBar />

        <main className="max-w-5xl mx-auto px-4 md:px-8 py-8 animate-fade-in">
          {/* Back Navigation Bar */}
          <div className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-indigo-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Campus Events</span>
            </Link>
          </div>

          {/* Hero Banner Image */}
          <div className="relative w-full h-[300px] sm:h-[400px] rounded-3xl overflow-hidden shadow-2xl border border-slate-800 mb-8 bg-slate-900">
            <img
              src={event.image || event.thumbnail}
              alt={event.name || event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            {/* Floating Bookmark & Category Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 z-10">
              <span className="bg-slate-950/80 backdrop-blur-md text-indigo-300 text-xs font-extrabold px-3 py-1 rounded-full border border-indigo-500/30">
                {event.category}
              </span>
              {event.organizer && (
                <span className="bg-purple-950/80 backdrop-blur-md text-purple-300 text-xs font-bold px-3 py-1 rounded-full border border-purple-500/30 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  {event.organizer}
                </span>
              )}
            </div>

            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={handleBookmarkClick}
                className={`p-3 rounded-full backdrop-blur-md border transition-all duration-200 ${
                  isBookmarked
                    ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/40'
                    : 'bg-slate-950/80 border-slate-700 text-slate-300 hover:text-white'
                }`}
                aria-label="Bookmark event"
              >
                <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>

            <div className="absolute bottom-6 left-6 right-6 z-10">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-md mb-2">
                {event.name || event.title}
              </h1>
              {event.tagline && (
                <p className="text-slate-300 text-sm sm:text-base font-normal max-w-2xl">
                  {event.tagline}
                </p>
              )}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Full Description */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
                <h2 className="text-lg font-extrabold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                  <span>About This Event</span>
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                  {event.description ||
                    'Join us for this exciting university event! Connect with peers, gain valuable insights, and participate in hands-on activities led by experienced organizers.'}
                </p>
              </div>
            </div>

            {/* Right Column: Metadata Cards */}
            <div className="space-y-6">
              {/* Event Metadata Card */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-3 uppercase tracking-wider">
                  Event Highlights
                </h3>

                {/* Date */}
                <div className="flex items-start gap-3 text-xs">
                  <Calendar className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block font-medium">Date & Time</span>
                    <span className="text-slate-100 font-semibold">{event.date}</span>
                  </div>
                </div>

                {/* Venue */}
                {event.venue && (
                  <div className="flex items-start gap-3 text-xs">
                    <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 block font-medium">Venue Location</span>
                      <span className="text-slate-100 font-semibold">{event.venue}</span>
                    </div>
                  </div>
                )}

                {/* Organizer */}
                {event.organizer && (
                  <div className="flex items-start gap-3 text-xs">
                    <Building2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 block font-medium">Organizing Body</span>
                      <span className="text-purple-300 font-bold">{event.organizer}</span>
                    </div>
                  </div>
                )}

                {/* Contact Number */}
                {event.contactNumber && (
                  <div className="flex items-start gap-3 text-xs">
                    <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 block font-medium">Organizer Contact</span>
                      <a
                        href={`tel:${event.contactNumber.replace(/\s+/g, '')}`}
                        className="text-emerald-400 font-semibold hover:underline"
                      >
                        {event.contactNumber}
                      </a>
                    </div>
                  </div>
                )}

                {/* Fee & Registration Type */}
                <div className="flex items-start gap-3 text-xs">
                  <Tag className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block font-medium">Registration Fee</span>
                    <span
                      className={`inline-block font-extrabold mt-1 px-3 py-1 rounded-full text-xs ${
                        isFree
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                      }`}
                    >
                      {isFree ? 'Free Registration' : `Paid (${event.fee})`}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <button
                    onClick={() => alert(`Registration flow for ${event.name || event.title} will open here!`)}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold rounded-full shadow-lg shadow-indigo-600/30 transition-all duration-200"
                  >
                    Register for Event
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500 mt-12">
        © 2026 Manav Rachna University EventPortal. All rights reserved.
      </footer>

      <AuthPromptModal />
    </div>
  );
}
