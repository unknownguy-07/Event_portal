import React, { createContext, useState, useMemo } from 'react';
import { mockEvents, mockCategories, mockCollegeInfo, mockFeaturedEvents } from '@/services/mockData';

export const EventContext = createContext(null);

export function EventProvider({ children }) {
  const [events, setEvents] = useState(mockEvents);
  const [categories] = useState(mockCategories);
  const [featuredEvents] = useState(mockFeaturedEvents);
  const [collegeInfo] = useState(mockCollegeInfo);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest'); // 'latest' | 'fee_asc' | 'fee_desc'
  // Pre-seed sample bookmarked IDs for interactive preview (evt-101, evt-103)
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set(['evt-101', 'evt-103']));
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); // 'interested' | { type: 'bookmark', eventId }

  const toggleBookmark = (eventId) => {
    setBookmarkedIds((prev) => {
      const updated = new Set(prev);
      if (updated.has(eventId)) {
        updated.delete(eventId);
      } else {
        updated.add(eventId);
      }
      return updated;
    });
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
      // 'latest' default sort by createdAt desc
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
