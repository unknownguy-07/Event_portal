import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  query,
  orderBy,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import {
  mockEvents,
  mockCategories,
  mockCollegeInfo,
  mockFeaturedEvents,
} from './mockData';

/**
 * Fetches events list from Firestore collection 'events' or falls back to mockEvents.
 */
export async function getEvents() {
  if (isFirebaseConfigured && db) {
    try {
      const eventsRef = collection(db, 'events');
      const q = query(eventsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      }
    } catch (err) {
      console.warn('Firestore getEvents fallback to mockData:', err.message);
    }
  }
  return mockEvents;
}

/**
 * Fetches categories list from Firestore collection 'categories' or falls back to mockCategories.
 */
export async function getCategories() {
  if (isFirebaseConfigured && db) {
    try {
      const catRef = collection(db, 'categories');
      const snapshot = await getDocs(catRef);
      if (!snapshot.empty) {
        return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      }
    } catch (err) {
      console.warn('Firestore getCategories fallback to mockData:', err.message);
    }
  }
  return mockCategories;
}

/**
 * Fetches featured events from Firestore collection 'featured_events' or falls back to mockFeaturedEvents.
 */
export async function getFeaturedEvents() {
  if (isFirebaseConfigured && db) {
    try {
      const featRef = collection(db, 'featured_events');
      const snapshot = await getDocs(featRef);
      if (!snapshot.empty) {
        return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      }
    } catch (err) {
      console.warn('Firestore getFeaturedEvents fallback to mockData:', err.message);
    }
  }
  return mockFeaturedEvents;
}

/**
 * Fetches college info from Firestore doc 'college_info/main' or falls back to mockCollegeInfo.
 */
export async function getCollegeInfo() {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'college_info', 'main');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      }
    } catch (err) {
      console.warn('Firestore getCollegeInfo fallback to mockData:', err.message);
    }
  }
  return mockCollegeInfo;
}

/**
 * Syncs user bookmark to Firestore 'users/{userId}/bookmarks' or fallback.
 */
export async function toggleBookmarkInDb(userId, eventId, isCurrentlyBookmarked) {
  if (isFirebaseConfigured && db && userId) {
    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(
        userRef,
        {
          bookmarks: isCurrentlyBookmarked
            ? arrayRemove(eventId)
            : arrayUnion(eventId),
        },
        { merge: true }
      );
    } catch (err) {
      console.warn('Firestore toggleBookmarkInDb error:', err.message);
    }
  }
}
