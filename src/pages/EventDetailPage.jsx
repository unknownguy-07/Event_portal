import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Building2,
  Calendar,
  Tag,
  Bookmark,
  Star,
  Sparkles,
  CheckCircle2,
  Ticket,
} from 'lucide-react';
import { useEvents } from '@/hooks/useEvents';
import { useAuth } from '@/hooks/useAuth';
import { NavigationBar } from '@/components/layout/NavigationBar';
import { AuthPromptModal } from '@/components/common/AuthPromptModal';
import { TicketModal } from '@/components/enrollment/TicketModal';

/**
 * EventDetailPage Component
 * Displays complete event details with real-time Firebase registration
 */
export function EventDetailPage() {
  const { id } = useParams();
  const {
    events,
    featuredEvents,
    bookmarkedIds,
    toggleBookmark,
    interestedIds,
    toggleInterested,
    setShowAuthModal,
    setPendingAction,
    isEventRegistered,
    registerUserForEvent,
    userRegistrations,
  } = useEvents();
  const { isAuthenticated, currentUser } = useAuth();

  const [isRegistering, setIsRegistering] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showTicketModal, setShowTicketModal] = useState(false);

  const event =
    events.find((e) => e.id === id) ||
    featuredEvents.find((e) => e.id === id) ||
    events[0]; // Fallback to first event if ID not found

  const isBookmarked = event && bookmarkedIds ? bookmarkedIds.has(event.id) : false;
  const isInterested = event && interestedIds ? interestedIds.has(event.id) : false;
  const isRegistered = event ? isEventRegistered(event.id) : false;
  const registrationRecord = event
    ? userRegistrations.find((r) => r.eventId === event.id)
    : null;

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

  const handleRegister = async () => {
    if (!isAuthenticated) {
      setPendingAction({ type: 'register', eventId: event.id });
      setShowAuthModal(true);
      return;
    }

    if (isRegistered) return;

    setIsRegistering(true);
    try {
      await registerUserForEvent(event);
      setSuccessMessage('Registration confirmed! Your digital event pass is generated.');
      setTimeout(() => setSuccessMessage(''), 6000);
    } catch (err) {
      alert(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-[#080811] text-[#F1F0F5] flex flex-col justify-between">
        <NavigationBar />
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-[#F1F0F5]">Event Not Found</h2>
          <Link
            to="/"
            className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-gradient-to-r from-[#8B4DFF] to-[#6E2FF0] text-white font-semibold text-xs rounded-full shadow-lg shadow-purple-600/30"
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
    <div className="min-h-screen bg-[#080811] text-[#F1F0F5] flex flex-col justify-between selection:bg-[#8B4DFF]/40">
      <div>
        <NavigationBar />

        <main className="max-w-5xl mx-auto px-4 md:px-8 py-8 animate-fade-in">
          {/* Back Navigation Bar */}
          <div className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#9CA3B5] hover:text-[#C084FC] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Campus Events</span>
            </Link>
          </div>

          {/* Hero Banner Image */}
          <div className="relative w-full h-[300px] sm:h-[400px] rounded-3xl overflow-hidden shadow-2xl shadow-purple-950/40 border border-purple-500/20 mb-8 bg-[#12101F]">
            <img
              src={event.image || event.thumbnail}
              alt={event.name || event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080811] via-[#080811]/60 to-[#080811]/15" />

            {/* Floating Bookmark & Category Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 z-10">
              <span className="bg-[#080811]/80 backdrop-blur-md text-[#C084FC] text-xs font-extrabold px-3 py-1 rounded-full border border-purple-400/30 shadow-sm">
                {event.category}
              </span>
              {event.organizer && (
                <span className="bg-[#18142A]/85 backdrop-blur-md text-[#F1F0F5] text-xs font-bold px-3 py-1 rounded-full border border-purple-500/20 shadow-sm flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#C084FC]" />
                  {event.organizer}
                </span>
              )}
            </div>

            <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
              <button
                onClick={handleInterestedClick}
                className={`p-3 rounded-full backdrop-blur-md border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400/50 cursor-pointer ${
                  isInterested
                    ? 'bg-gradient-to-br from-amber-500 to-yellow-600 border-amber-400/60 text-white shadow-lg shadow-amber-500/40 scale-105'
                    : 'bg-[#080811]/80 border-purple-500/25 text-[#9CA3B5] hover:text-amber-300 hover:border-amber-400/30'
                }`}
                aria-label={isInterested ? 'Remove from interested events' : 'Mark as interested event'}
                title={isInterested ? 'Interested ✓ (Click to remove)' : 'Mark as Interested'}
              >
                <Star className={`w-5 h-5 ${isInterested ? 'fill-current text-white' : ''}`} />
              </button>

              <button
                onClick={handleBookmarkClick}
                className={`p-3 rounded-full backdrop-blur-md border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#9B5CFF]/50 cursor-pointer ${
                  isBookmarked
                    ? 'bg-gradient-to-br from-[#8B4DFF] to-[#6E2FF0] border-purple-400/50 text-white shadow-lg shadow-purple-600/50 scale-105'
                    : 'bg-[#080811]/80 border-purple-500/25 text-[#9CA3B5] hover:text-white hover:border-purple-500/50'
                }`}
                aria-label="Bookmark event"
                title={isBookmarked ? 'Bookmarked ✓ (Click to remove)' : 'Bookmark Event'}
              >
                <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>

            <div className="absolute bottom-6 left-6 right-6 z-10">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#F1F0F5] tracking-tight drop-shadow-md mb-2">
                {event.name || event.title}
              </h1>
              {event.tagline && (
                <p className="text-[#9CA3B5] text-sm sm:text-base font-normal max-w-2xl">
                  {event.tagline}
                </p>
              )}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Full Description */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gradient-to-b from-[#141124] to-[#100E1C] border border-purple-500/15 rounded-3xl p-6 sm:p-8 shadow-xl">
                <h2 className="text-lg font-extrabold text-[#F1F0F5] mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#C084FC]" />
                  <span>About This Event</span>
                </h2>
                <p className="text-[#9CA3B5] text-sm leading-relaxed whitespace-pre-line">
                  {event.description ||
                    'Join us for this exciting university event! Connect with peers, gain valuable insights, and participate in hands-on activities led by experienced organizers.'}
                </p>
              </div>
            </div>

            {/* Right Column: Metadata Cards */}
            <div className="space-y-6">
              {/* Event Metadata Card */}
              <div className="bg-gradient-to-b from-[#141124] to-[#100E1C] border border-purple-500/15 rounded-3xl p-6 shadow-xl space-y-4">
                <h3 className="text-xs font-bold text-[#9CA3B5] border-b border-purple-500/15 pb-3 uppercase tracking-wider">
                  Event Highlights
                </h3>

                {/* Date */}
                <div className="flex items-start gap-3 text-xs">
                  <Calendar className="w-4 h-4 text-[#9B5CFF] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#9CA3B5] block font-medium text-[11px]">Date & Time</span>
                    <span className="text-[#F1F0F5] font-semibold">{event.date}</span>
                  </div>
                </div>

                {/* Venue */}
                {event.venue && (
                  <div className="flex items-start gap-3 text-xs">
                    <MapPin className="w-4 h-4 text-[#9B5CFF] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[#9CA3B5] block font-medium text-[11px]">Venue Location</span>
                      <span className="text-[#F1F0F5] font-semibold">{event.venue}</span>
                    </div>
                  </div>
                )}

                {/* Organizer */}
                {event.organizer && (
                  <div className="flex items-start gap-3 text-xs">
                    <Building2 className="w-4 h-4 text-[#C084FC] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[#9CA3B5] block font-medium text-[11px]">Organizing Body</span>
                      <span className="text-[#C084FC] font-bold">{event.organizer}</span>
                    </div>
                  </div>
                )}

                {/* Contact Number */}
                {event.contactNumber && (
                  <div className="flex items-start gap-3 text-xs">
                    <Phone className="w-4 h-4 text-[#4FD1A5] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[#9CA3B5] block font-medium text-[11px]">Organizer Contact</span>
                      <a
                        href={`tel:${event.contactNumber.replace(/\s+/g, '')}`}
                        className="text-[#4FD1A5] font-semibold hover:underline"
                      >
                        {event.contactNumber}
                      </a>
                    </div>
                  </div>
                )}

                {/* Fee & Registration Type */}
                <div className="flex items-start gap-3 text-xs">
                  <Tag className="w-4 h-4 text-[#9B5CFF] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#9CA3B5] block font-medium text-[11px]">Registration Fee</span>
                    <span
                      className={`inline-block font-extrabold mt-1 px-3 py-1 rounded-full text-xs ${
                        isFree
                          ? 'bg-[#4FD1A5]/12 text-[#4FD1A5] border border-[#4FD1A5]/30'
                          : 'bg-[#8B4DFF]/15 text-[#C084FC] border border-[#8B4DFF]/30'
                      }`}
                    >
                      {isFree ? 'Free Registration' : `Paid (${event.fee})`}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-purple-500/15 space-y-3">
                  {successMessage && (
                    <div className="p-3 bg-[#4FD1A5]/12 border border-[#4FD1A5]/30 rounded-xl text-xs text-[#4FD1A5] flex items-center gap-2 animate-fade-in">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{successMessage}</span>
                    </div>
                  )}

                  {isRegistered ? (
                    <div className="space-y-2.5">
                      <div className="w-full py-2.5 px-4 bg-[#4FD1A5]/12 border border-[#4FD1A5]/30 rounded-full text-center flex items-center justify-center gap-2 text-xs font-bold text-[#4FD1A5] shadow-sm shadow-[#4FD1A5]/10">
                        <CheckCircle2 className="w-4 h-4 text-[#4FD1A5]" />
                        <span>Registered ✓</span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setShowTicketModal(true)}
                          className="flex-1 py-2.5 bg-gradient-to-r from-[#8B4DFF] to-[#6E2FF0] hover:from-[#9B5CFF] hover:to-[#8B4DFF] text-white text-xs font-bold rounded-full shadow-md shadow-purple-600/30 border border-purple-400/30 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
                        >
                          <Ticket className="w-3.5 h-3.5" />
                          <span>View Digital Pass</span>
                        </button>

                        <Link
                          to="/my-events"
                          className="px-4 py-2.5 bg-[#12101F] hover:bg-[#18152A] text-[#C084FC] hover:text-white text-xs font-semibold rounded-full border border-purple-500/20 text-center flex items-center justify-center transition-colors"
                        >
                          My Events
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={handleRegister}
                      disabled={isRegistering}
                      className="w-full py-3 bg-gradient-to-r from-[#8B4DFF] via-[#9B5CFF] to-[#6E2FF0] hover:from-[#9B5CFF] hover:to-[#8B4DFF] text-white text-xs font-bold rounded-full shadow-lg shadow-purple-600/35 border border-purple-400/30 transition-all duration-200 hover:scale-[1.01] hover:shadow-purple-500/50 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isRegistering ? (
                        <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      ) : (
                        <span>Register for Event</span>
                      )}
                    </button>
                  )}

                  {/* Interested Quick Toggle */}
                  <button
                    type="button"
                    onClick={handleInterestedClick}
                    className={`w-full py-2.5 px-4 rounded-full border text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
                      isInterested
                        ? 'bg-amber-500/15 border-amber-400/50 text-amber-300 shadow-sm shadow-amber-500/20'
                        : 'bg-[#12101F] hover:bg-[#18152A] border-purple-500/25 text-[#9CA3B5] hover:text-[#F1F0F5]'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${isInterested ? 'fill-current text-amber-400' : 'text-amber-400/80'}`} />
                    <span>{isInterested ? 'Marked as Interested ✓' : 'Mark as Interested'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <footer className="border-t border-purple-500/10 py-8 text-center text-xs text-[#6B6882] bg-[#080811]/80 backdrop-blur-md mt-12">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="font-bold text-[#F1F0F5] tracking-tight">Event<span className="text-[#9B5CFF]">Portal</span></span>
            <span className="ml-2 text-[11px] text-[#6B6882]">• Campus Event Detail</span>
          </div>
          <p className="text-[11px] text-[#6B6882]">
            © 2026 Manav Rachna University. All rights reserved.
          </p>
        </div>
      </footer>

      <TicketModal
        isOpen={showTicketModal}
        onClose={() => setShowTicketModal(false)}
        ticketData={{
          event,
          enrollment: registrationRecord || {
            ticketId: `MRU-${event?.id?.toUpperCase() || 'PASS'}`,
            status: 'Confirmed',
          },
          user: currentUser,
        }}
      />
      <AuthPromptModal />
    </div>
  );
}
