import React, { createContext, useState, useEffect, useMemo } from 'react';
import {
  getEvents,
  getCategories,
  getFeaturedEvents,
  getCollegeInfo,
  toggleBookmarkInDb,
} from '@/services/eventService';
import { mockOrganizers } from '@/services/mockData';
import { useAuth } from '@/hooks/useAuth';

export const EventContext = createContext(null);

export function EventProvider({ children }) {
  const { currentUser } = useAuth();

  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [collegeInfo, setCollegeInfo] = useState({});
  const [organizers] = useState(mockOrganizers);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular'); // Default sort: 'popular' | 'latest'
  const [registrationTypeFilter, setRegistrationTypeFilter] = useState('all'); // 'all' | 'free' | 'paid'
  const [organizerFilter, setOrganizerFilter] = useState('all'); // 'all' | organizer name

  const [bookmarkedIds, setBookmarkedIds] = useState(new Set(['evt-101', 'evt-103']));
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  // Fetch initial data on mount via eventService abstraction layer
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoadingEvents(true);
      try {
        const [evts, cats, featEvts, info] = await Promise.all([
          getEvents(),
          getCategories(),
          getFeaturedEvents(),
          getCollegeInfo(),
        ]);
        if (isMounted) {
          setEvents(evts);
          setCategories(cats);
          setFeaturedEvents(featEvts);
          setCollegeInfo(info);
        }
      } catch (err) {
        console.error('Failed to load event portal data:', err);
      } finally {
        if (isMounted) setIsLoadingEvents(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleBookmark = (eventId) => {
    const isCurrentlyBookmarked = bookmarkedIds.has(eventId);
    setBookmarkedIds((prev) => {
      const updated = new Set(prev);
      if (updated.has(eventId)) {
        updated.delete(eventId);
      } else {
        updated.add(eventId);
      }
      return updated;
    });

    if (currentUser?.uid) {
      toggleBookmarkInDb(currentUser.uid, eventId, isCurrentlyBookmarked);
    }
  };

  // Computed displayed events based on search, category, registrationType, organizer, and sorting
  const displayedEvents = useMemo(() => {
    let result = [...events];

    // Filter by search query (name, category, organizer, or venue)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (evt) =>
          evt.name?.toLowerCase().includes(q) ||
          evt.category?.toLowerCase().includes(q) ||
          evt.organizer?.toLowerCase().includes(q) ||
          evt.venue?.toLowerCase().includes(q)
      );
    }

    // Filter by category
    if (selectedCategory === 'interested') {
      result = result.filter((evt) => bookmarkedIds.has(evt.id));
    } else if (selectedCategory !== 'all') {
      result = result.filter((evt) => evt.categoryId === selectedCategory);
    }

    // Filter by Registration Type (Free / Paid)
    if (registrationTypeFilter === 'free') {
      result = result.filter(
        (evt) => evt.registrationType === 'Free' || evt.rawFee === 0
      );
    } else if (registrationTypeFilter === 'paid') {
      result = result.filter(
        (evt) => evt.registrationType === 'Paid' || evt.rawFee > 0
      );
    }

    // Filter by Organizing Body
    if (organizerFilter !== 'all') {
      result = result.filter((evt) => evt.organizer === organizerFilter);
    }

    // Sort order
    if (sortBy === 'popular') {
      result.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    } else if (sortBy === 'latest') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }, [
    events,
    searchQuery,
    selectedCategory,
    registrationTypeFilter,
    organizerFilter,
    sortBy,
    bookmarkedIds,
  ]);

  const value = {
    events,
    displayedEvents,
    categories,
    featuredEvents,
    collegeInfo,
    organizers,
    isLoadingEvents,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    registrationTypeFilter,
    setRegistrationTypeFilter,
    organizerFilter,
    setOrganizerFilter,
    bookmarkedIds,
    toggleBookmark,
    showAuthModal,
    setShowAuthModal,
    pendingAction,
    setPendingAction,
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
}
