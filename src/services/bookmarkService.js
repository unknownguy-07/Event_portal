import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';

/**
 * Service for managing user-specific bookmarks in Cloud Firestore.
 * Hierarchical data structure:
 * users/{userId}/bookmarks/{eventId}
 *   ├── eventId: string
 *   └── createdAt: timestamp
 *
 * Implements a dual-layer persistence strategy:
 * 1. Primary: Cloud Firestore subcollection `users/{userId}/bookmarks`.
 * 2. Per-UID Cache: Local cache strictly partitioned by `userId`.
 *    Ensures zero data loss across reloads/logins even if Firestore cloud rules
 *    are temporarily rejecting requests or during offline periods.
 */

// ─── Per-UID Local Cache Helpers ─────────────────────────────────────
function getCachedBookmarkIds(userId) {
  if (!userId) return new Set();
  try {
    const raw = localStorage.getItem(`eventportal_user_${userId}_bookmarks`);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return new Set(arr);
    }
  } catch (err) {
    console.warn('[bookmarkService] Failed to read local user cache:', err);
  }
  return new Set();
}

function setCachedBookmarkIds(userId, set) {
  if (!userId) return;
  try {
    localStorage.setItem(
      `eventportal_user_${userId}_bookmarks`,
      JSON.stringify(Array.from(set))
    );
  } catch (err) {
    console.warn('[bookmarkService] Failed to write local user cache:', err);
  }
}

/**
 * Fetches all bookmarked event IDs for a given user.
 *
 * @param {string} userId - Firebase Auth user UID
 * @returns {Promise<Set<string>>}
 */
export async function fetchUserBookmarks(userId) {
  if (!userId) return new Set();
  const cached = getCachedBookmarkIds(userId);

  if (!isFirebaseConfigured || !db) {
    return cached;
  }

  try {
    const bookmarksCol = collection(db, 'users', userId, 'bookmarks');
    const snapshot = await getDocs(bookmarksCol);
    const ids = new Set();
    snapshot.forEach((docSnap) => {
      ids.add(docSnap.id);
    });
    setCachedBookmarkIds(userId, ids);
    console.log('[bookmarkService] Bookmarks loaded from Firestore for user:', userId, 'count:', ids.size);
    return ids;
  } catch (err) {
    console.warn('[bookmarkService] fetchUserBookmarks Firestore read error (using user cache):', err.message);
    return cached;
  }
}

/**
 * Saves a bookmark for the authenticated user under users/{userId}/bookmarks/{eventId}.
 *
 * @param {string} userId - Firebase Auth user UID
 * @param {string} eventId - Unique event identifier
 */
export async function addBookmarkInDb(userId, eventId) {
  if (!userId || !eventId) return;

  // Immediately persist to per-UID cache
  const cached = getCachedBookmarkIds(userId);
  cached.add(eventId);
  setCachedBookmarkIds(userId, cached);

  if (isFirebaseConfigured && db) {
    try {
      const bookmarkDocRef = doc(db, 'users', userId, 'bookmarks', eventId);
      await setDoc(bookmarkDocRef, {
        eventId,
        createdAt: serverTimestamp(),
      });
      console.log('[bookmarkService] Bookmark written to Firestore for user:', userId, 'eventId:', eventId);
    } catch (err) {
      console.warn('[bookmarkService] addBookmarkInDb Firestore write error (preserved in user cache):', err.message);
    }
  }
}

/**
 * Removes a bookmark for the authenticated user from users/{userId}/bookmarks/{eventId}.
 *
 * @param {string} userId - Firebase Auth user UID
 * @param {string} eventId - Unique event identifier
 */
export async function removeBookmarkFromDb(userId, eventId) {
  if (!userId || !eventId) return;

  // Immediately remove from per-UID cache
  const cached = getCachedBookmarkIds(userId);
  cached.delete(eventId);
  setCachedBookmarkIds(userId, cached);

  if (isFirebaseConfigured && db) {
    try {
      const bookmarkDocRef = doc(db, 'users', userId, 'bookmarks', eventId);
      await deleteDoc(bookmarkDocRef);
      console.log('[bookmarkService] Bookmark removed from Firestore for user:', userId, 'eventId:', eventId);
    } catch (err) {
      console.warn('[bookmarkService] removeBookmarkFromDb Firestore delete error (removed from user cache):', err.message);
    }
  }
}

/**
 * Toggles a bookmark state in Firestore for the given user.
 *
 * @param {string} userId
 * @param {string} eventId
 * @param {boolean} isCurrentlyBookmarked
 */
export async function toggleBookmarkInDb(userId, eventId, isCurrentlyBookmarked) {
  if (isCurrentlyBookmarked) {
    await removeBookmarkFromDb(userId, eventId);
  } else {
    await addBookmarkInDb(userId, eventId);
  }
}

/**
 * Subscribes to real-time bookmark updates for a user.
 * Immediately invokes onUpdate with cached data, then connects to Firestore.
 *
 * @param {string} userId
 * @param {Function} onUpdate - callback receiving Set<string>
 * @param {Function} [onError] - optional error callback
 * @returns {Function} unsubscribe function
 */
export function subscribeToUserBookmarks(userId, onUpdate, onError) {
  if (!userId) {
    onUpdate(new Set());
    return () => {};
  }

  // Instantly seed with cached data for this UID (0ms latency, eliminates blank flash)
  const cached = getCachedBookmarkIds(userId);
  onUpdate(cached);

  if (!isFirebaseConfigured || !db) {
    return () => {};
  }

  try {
    const bookmarksCol = collection(db, 'users', userId, 'bookmarks');
    const unsubscribe = onSnapshot(
      bookmarksCol,
      (snapshot) => {
        const ids = new Set();
        snapshot.forEach((docSnap) => {
          ids.add(docSnap.id);
        });
        setCachedBookmarkIds(userId, ids);
        console.log('[bookmarkService] Live bookmarks synced from Firestore for user:', userId, 'count:', ids.size);
        onUpdate(ids);
      },
      (err) => {
        console.warn('[bookmarkService] Firestore onSnapshot warning (keeping user cache active):', err.message);
        onUpdate(getCachedBookmarkIds(userId));
        if (onError) onError(err);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('[bookmarkService] subscribeToUserBookmarks failed:', err.message);
    onUpdate(getCachedBookmarkIds(userId));
    if (onError) onError(err);
    return () => {};
  }
}
