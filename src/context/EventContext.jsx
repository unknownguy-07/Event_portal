import React, { createContext, useState, useEffect, useMemo } from 'react';
import {
  getEvents,
  getCategories,
  getFeaturedEvents,
  getCollegeInfo,
  toggleBookmarkInDb,
} from '@/services/eventService';
import { useAuth } from '@/hooks/useAuth';

export const EventContext = createContext(null);

export function EventProvider({ children }) {
  const { currentUser } = useAuth();

  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [collegeInfo, setCollegeInfo] = useState({});
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');
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

    // Delegate database persistence to eventService
    if (currentUser?.uid) {
      toggleBookmarkInDb(currentUser.uid, eventId, isCurrentlyBookmarked);
    }
  };

  // Computed displayed events based on search, category, and sorting
  const displayedEvents = useMemo(() => {
    let result = [...events];

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (evt) =>
          evt.name.toLowerCase().includes(q) ||
          evt.category.toLowerCase().includes(q)
      );
    }

    // Filter by category
    if (selectedCategory === 'interested') {
      result = result.filter((evt) => bookmarkedIds.has(evt.id));
    } else if (selectedCategory !== 'all') {
      result = result.filter((evt) => evt.categoryId === selectedCategory);
    }

    // Sort order
    if (sortBy === 'fee_asc') {
      result.sort((a, b) => a.rawFee - b.rawFee);
    } else if (sortBy === 'fee_desc') {
      result.sort((a, b) => b.rawFee - a.rawFee);
    } else {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }, [events, searchQuery, selectedCategory, sortBy, bookmarkedIds]);

  const value = {
    events,
    displayedEvents,
    categories,
    featuredEvents,
    collegeInfo,
    isLoadingEvents,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
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
