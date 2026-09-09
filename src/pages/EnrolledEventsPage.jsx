import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarCheck,
  History,
  BookOpen,
  CalendarX,
  AlertTriangle,
  RefreshCw,
  LogIn,
  Sparkles,
} from 'lucide-react';
import { NavigationBar } from '@/components/layout/NavigationBar';
import { AuthPromptModal } from '@/components/common/AuthPromptModal';
import { EnrolledEventCard } from '@/components/enrollment/EnrolledEventCard';
import { useAuth } from '@/hooks/useAuth';
import { useEvents } from '@/hooks/useEvents';
import { TicketModal } from '@/components/enrollment/TicketModal';

/* ─── Inline skeleton card (no separate component needed) ─────────── */
function SkeletonEnrolledCard() {
  return (
    <div className="flex flex-col rounded-2xl overflow-hidden bg-[#12101F] border border-purple-500/15 shadow-sm">
      {/* Thumbnail skeleton */}
      <div className="w-full bg-[#1A162B] animate-pulse" style={{ aspectRatio: '16/9' }} />
      {/* Content skeleton */}
      <div className="p-5 flex flex-col gap-3">
        <div className="h-5 rounded-lg w-3/5 bg-[#1A162B] animate-pulse" />
        <div className="flex gap-2">
          <div className="h-4 rounded-full w-16 bg-[#1A162B] animate-pulse" />
          <div className="h-4 rounded-full w-12 bg-[#1A162B] animate-pulse" />
        </div>
        <div className="h-3 rounded w-1/3 bg-[#1A162B] animate-pulse" />
        <div className="h-3 rounded w-1/2 bg-[#1A162B] animate-pulse" />
        <div className="flex justify-between pt-3 mt-1 border-t border-purple-500/10">
          <div className="h-4 rounded w-1/4 bg-[#1A162B] animate-pulse" />
          <div className="h-4 rounded w-1/4 bg-[#1A162B] animate-pulse" />
        </div>
      </div>
    </div>
  );
}

/* ─── Section heading ─────────────────────────────────────────────── */
function SectionHeading({ icon: Icon, badge, children }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2.5">
        <Icon size={20} className="text-[#9B5CFF]" />
        <h2 className="text-lg font-bold text-[#F1F0F5] tracking-tight">
          {children}
        </h2>
      </div>
      {badge !== undefined && (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#12101F] border border-purple-500/20 text-[#C084FC]">
          {badge}
        </span>
      )}
    </div>
  );
}

/* ─── Empty state ─────────────────────────────────────────────────── */
function EmptyState({ icon: Icon, title, description, cta }) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-3 py-14 px-4 rounded-3xl bg-[#12101F]/70 border border-purple-500/15 shadow-xl">
      <div className="w-14 h-14 rounded-2xl bg-[#161324] border border-purple-500/20 flex items-center justify-center shadow-inner">
        <Icon size={26} className="text-[#9CA3B5]" />
      </div>
      <div>
        <p className="text-sm font-bold text-[#F1F0F5]">
          {title}
        </p>
        {description && (
          <p className="text-xs text-[#9CA3B5] mt-1 max-w-sm">
            {description}
          </p>
        )}
      </div>
      <Link
        to="/"
        className="mt-2 px-5 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-[#8B4DFF] to-[#6E2FF0] hover:from-[#9B5CFF] hover:to-[#8B4DFF] text-white shadow-lg shadow-purple-600/30 border border-purple-400/30 transition-all hover:scale-105"
      >
        {cta}
      </Link>
    </div>
  );
}

/* ─── Error state ─────────────────────────────────────────────────── */
function ErrorState({ onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <AlertTriangle size={40} className="text-[#F59E0B]" />
      <p className="text-sm font-medium text-[#9CA3B5]">
        Failed to load your events. Please try again.
      </p>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-[#12101F] border border-purple-500/20 text-[#F1F0F5] hover:border-purple-500/40 hover:bg-[#161324] transition-colors cursor-pointer"
      >
        <RefreshCw size={14} />
        Retry
      </button>
    </div>
  );
}

/* ─── Sign-in prompt ─────────────────────────────────────────────── */
function SignInPrompt() {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-20 max-w-md mx-auto my-8 p-8 rounded-3xl bg-[#12101F] border border-purple-500/20 shadow-2xl shadow-purple-950/30">
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-[#8B4DFF]/15 border border-purple-400/30 shadow-inner">
        <LogIn size={28} className="text-[#C084FC]" />
      </div>
      <div className="text-center">
        <h2 className="text-xl font-extrabold text-[#F1F0F5] mb-1.5 tracking-tight">
          Sign in to continue
        </h2>
        <p className="text-xs text-[#9CA3B5] leading-relaxed">
          View your enrolled events and campus participation history.
        </p>
      </div>
      <Link
        to="/login"
        className="px-6 py-2.5 rounded-full text-xs font-bold bg-gradient-to-r from-[#8B4DFF] via-[#9B5CFF] to-[#6E2FF0] hover:from-[#9B5CFF] hover:to-[#8B4DFF] text-white shadow-lg shadow-purple-600/35 border border-purple-400/30 transition-all duration-200 hover:scale-[1.02] cursor-pointer"
      >
        Sign In with Account
      </Link>
    </div>
  );
}

/* ─── Card grid ──────────────────────────────────────────────────── */
function EnrolledGrid({ items, variant, onViewTicket }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map(({ enrollment, event }) => (
        <EnrolledEventCard
          key={enrollment.enrollmentId}
          event={event}
          enrollment={enrollment}
          variant={variant}
          onViewTicket={onViewTicket}
        />
      ))}
    </div>
  );
}

/* ─── Skeleton grid ───────────────────────────────────────────────── */
function SkeletonGrid({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonEnrolledCard key={i} />
      ))}
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────── */
export function EnrolledEventsPage() {
  const { currentUser, userProfile, isAuthenticated } = useAuth();
  const { events, userRegistrations, isLoadingRegistrations } = useEvents();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'upcoming' | 'history'
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [error, setError] = useState(false);

  const displayName =
    userProfile?.name ||
    currentUser?.displayName ||
    (currentUser?.email ? currentUser.email.split('@')[0] : 'Student');

  /* Enrich userRegistrations with full event objects */
  const enriched = useMemo(() => {
    if (!events.length || !userRegistrations.length) return [];
    return userRegistrations
      .map((enrollment) => {
        const event = events.find((e) => e.id === enrollment.eventId);
        if (!event) return null;
        return { enrollment, event };
      })
      .filter(Boolean);
  }, [userRegistrations, events]);

  /* Split into upcoming / history based on event date vs. today */
  const { upcomingItems, historyItems } = useMemo(() => {
    const now = new Date();
    const upcoming = [];
    const history = [];

    enriched.forEach((item) => {
      const eventDate = new Date(item.event.date);
      const isPast = eventDate < now;
      const isCancelled = item.enrollment.status === 'cancelled';

      if (!isPast && !isCancelled) {
        upcoming.push(item);
      } else {
        history.push(item);
      }
    });

    // Sort upcoming by event date ascending
    upcoming.sort((a, b) => new Date(a.event.date) - new Date(b.event.date));
    // Sort history by event date descending
    history.sort((a, b) => new Date(b.event.date) - new Date(a.event.date));

    return { upcomingItems: upcoming, historyItems: history };
  }, [enriched]);

  const handleOpenTicket = (enrollment, event) => {
    setSelectedTicket({
      enrollment,
      event,
      user: currentUser,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080811] text-[#F1F0F5] selection:bg-[#8B4DFF]/40">
      <NavigationBar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8 animate-fade-in">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#9CA3B5] hover:text-[#C084FC] transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Back to campus events
        </Link>

        {/* Personalized Header & Stats Chips */}
        <div className="mb-8 border-b border-purple-500/15 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-[#C084FC]" />
              <span className="text-[11px] font-bold text-[#C084FC] uppercase tracking-wider">
                Student Event Dashboard
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#F1F0F5] tracking-tight">
              Welcome back, <span className="bg-gradient-to-r from-[#C084FC] via-[#9B5CFF] to-[#8B4DFF] bg-clip-text text-transparent">{displayName}</span>
            </h1>
            <p className="text-xs text-[#9CA3B5] mt-1 max-w-2xl">
              Track your enrolled events, manage digital passes, and view campus participation history.
            </p>
          </div>

          {/* Quick Stats Chips */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2.5 rounded-2xl bg-gradient-to-b from-[#141124] to-[#100E1C] border border-purple-500/20 shadow-lg shadow-purple-950/30 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#4FD1A5]/15 border border-[#4FD1A5]/30 flex items-center justify-center text-[#4FD1A5]">
                <CalendarCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-semibold text-[#9CA3B5] uppercase tracking-wider block">Upcoming</span>
                <span className="text-base font-black text-[#F1F0F5] leading-none">{upcomingItems.length}</span>
              </div>
            </div>

            <div className="px-4 py-2.5 rounded-2xl bg-gradient-to-b from-[#141124] to-[#100E1C] border border-purple-500/20 shadow-lg shadow-purple-950/30 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#9B5CFF]/15 border border-[#9B5CFF]/30 flex items-center justify-center text-[#C084FC]">
                <History className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-semibold text-[#9CA3B5] uppercase tracking-wider block">Participated</span>
                <span className="text-base font-black text-[#F1F0F5] leading-none">{historyItems.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Unauthenticated */}
        {!isAuthenticated ? (
          <SignInPrompt />
        ) : error ? (
          <ErrorState onRetry={() => setError(false)} />
        ) : (
          <>
            {/* Segmented Section Filters */}
            <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-gradient-to-r from-[#8B4DFF] to-[#6E2FF0] text-white shadow-md shadow-purple-600/30'
                    : 'bg-[#12101F] text-[#9CA3B5] hover:text-[#F1F0F5] border border-purple-500/20'
                }`}
              >
                All Events ({enriched.length})
              </button>

              <button
                onClick={() => setActiveTab('upcoming')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                  activeTab === 'upcoming'
                    ? 'bg-gradient-to-r from-[#8B4DFF] to-[#6E2FF0] text-white shadow-md shadow-purple-600/30'
                    : 'bg-[#12101F] text-[#9CA3B5] hover:text-[#F1F0F5] border border-purple-500/20'
                }`}
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>Upcoming Events</span>
                <span className="px-1.5 py-0.2 rounded-full bg-purple-900/40 text-[10px]">
                  {upcomingItems.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                  activeTab === 'history'
                    ? 'bg-gradient-to-r from-[#8B4DFF] to-[#6E2FF0] text-white shadow-md shadow-purple-600/30'
                    : 'bg-[#12101F] text-[#9CA3B5] hover:text-[#F1F0F5] border border-purple-500/20'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Events Participated</span>
                <span className="px-1.5 py-0.2 rounded-full bg-purple-900/40 text-[10px]">
                  {historyItems.length}
                </span>
              </button>
            </div>

            {/* ── Section 1: Upcoming Events ──────────────────────── */}
            {(activeTab === 'all' || activeTab === 'upcoming') && (
              <section className="mb-12" aria-labelledby="upcoming-heading">
                <SectionHeading icon={CalendarCheck} badge={upcomingItems.length} id="upcoming-heading">
                  Upcoming Events
                </SectionHeading>

                {isLoadingRegistrations ? (
                  <SkeletonGrid count={3} />
                ) : upcomingItems.length === 0 ? (
                  <EmptyState
                    icon={CalendarX}
                    title="No upcoming events registered"
                    description="You haven't enrolled in any upcoming university hackathons, workshops, or seminars yet."
                    cta="Explore Campus Events"
                  />
                ) : (
                  <EnrolledGrid
                    items={upcomingItems}
                    variant="upcoming"
                    onViewTicket={handleOpenTicket}
                  />
                )}
              </section>
            )}

            {/* ── Section 2: Events Participated ───────────────── */}
            {(activeTab === 'all' || activeTab === 'history') && (
              <section aria-labelledby="history-heading">
                <SectionHeading icon={History} badge={historyItems.length} id="history-heading">
                  Events Participated
                </SectionHeading>

                {isLoadingRegistrations ? (
                  <SkeletonGrid count={3} />
                ) : historyItems.length === 0 ? (
                  <EmptyState
                    icon={BookOpen}
                    title="No campus participation history yet"
                    description="Events you participate in and complete will be logged here in your permanent university activity record."
                    cta="Find Events to Join"
                  />
                ) : (
                  <EnrolledGrid
                    items={historyItems}
                    variant="history"
                    onViewTicket={handleOpenTicket}
                  />
                )}
              </section>
            )}
          </>
        )}
      </main>

      <TicketModal
        isOpen={Boolean(selectedTicket)}
        onClose={() => setSelectedTicket(null)}
        ticketData={selectedTicket}
      />

      <footer className="border-t border-purple-500/10 py-8 text-center text-xs text-[#6B6882] bg-[#080811]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="font-bold text-[#F1F0F5] tracking-tight">Event<span className="text-[#9B5CFF]">Portal</span></span>
            <span className="ml-2 text-[11px] text-[#6B6882]">• Student Registration Portal</span>
          </div>
          <p className="text-[11px] text-[#6B6882]">
            © {new Date().getFullYear()} Manav Rachna University. All rights reserved.
          </p>
        </div>
      </footer>

      <AuthPromptModal />
    </div>
  );
}
