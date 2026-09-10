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
 */

/**
 * Fetches all bookmarked event IDs for a given user.
 * Returns a Set of event IDs (empty Set if none or unauthenticated).
 *
 * @param {string} userId - Firebase Auth user UID
 * @returns {Promise<Set<string>>}
 */
export async function fetchUserBookmarks(userId) {
  if (!isFirebaseConfigured || !db || !userId) {
    return new Set();
  }

  try {
    const bookmarksCol = collection(db, 'users', userId, 'bookmarks');
    const snapshot = await getDocs(bookmarksCol);
    const ids = new Set();
    snapshot.forEach((docSnap) => {
      ids.add(docSnap.id);
    });
    return ids;
  } catch (err) {
    console.warn('[bookmarkService] fetchUserBookmarks error:', err.message);
    return new Set();
  }
}

/**
 * Saves a bookmark for the authenticated user under users/{userId}/bookmarks/{eventId}.
 *
 * @param {string} userId - Firebase Auth user UID
 * @param {string} eventId - Unique event identifier
 */
export async function addBookmarkInDb(userId, eventId) {
  if (!isFirebaseConfigured || !db || !userId || !eventId) {
    return;
  }

  try {
    const bookmarkDocRef = doc(db, 'users', userId, 'bookmarks', eventId);
    await setDoc(bookmarkDocRef, {
      eventId,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn('[bookmarkService] addBookmarkInDb error:', err.message);
    throw err;
  }
}

/**
 * Removes a bookmark for the authenticated user from users/{userId}/bookmarks/{eventId}.
 *
 * @param {string} userId - Firebase Auth user UID
 * @param {string} eventId - Unique event identifier
 */
export async function removeBookmarkFromDb(userId, eventId) {
  if (!isFirebaseConfigured || !db || !userId || !eventId) {
    return;
  }

  try {
    const bookmarkDocRef = doc(db, 'users', userId, 'bookmarks', eventId);
    await deleteDoc(bookmarkDocRef);
  } catch (err) {
    console.warn('[bookmarkService] removeBookmarkFromDb error:', err.message);
    throw err;
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
 * Calls onUpdate with a new Set of event IDs whenever the bookmarks collection changes.
 *
 * @param {string} userId
 * @param {Function} onUpdate - callback receiving Set<string>
 * @param {Function} [onError] - optional error callback
 * @returns {Function} unsubscribe function
 */
export function subscribeToUserBookmarks(userId, onUpdate, onError) {
  if (!isFirebaseConfigured || !db || !userId) {
    onUpdate(new Set());
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
        onUpdate(ids);
      },
      (err) => {
        console.warn('[bookmarkService] onSnapshot listener error:', err.message);
        if (onError) onError(err);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('[bookmarkService] subscribeToUserBookmarks failed:', err.message);
    if (onError) onError(err);
    return () => {};
  }
}
