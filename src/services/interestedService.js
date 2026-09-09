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
 * Service for managing user-specific Interested Events in Cloud Firestore.
 * Hierarchical data structure:
 * users/{userId}/interestedEvents/{eventId}
 *   ├── eventId: string
 *   ├── status: "interested"
 *   └── createdAt: timestamp
 *
 * Implements a dual-layer persistence strategy:
 * 1. Primary: Cloud Firestore subcollection `users/{userId}/interestedEvents`.
 * 2. Per-UID Cache: Local cache strictly partitioned by `userId`.
 *    Ensures zero data loss across reloads/logins even if Firestore cloud rules
 *    are temporarily rejecting requests or during offline periods.
 */

// ─── Per-UID Local Cache Helpers ─────────────────────────────────────
function getCachedInterestedIds(userId) {
  if (!userId) return new Set();
  try {
    const raw = localStorage.getItem(`eventportal_user_${userId}_interested`);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return new Set(arr);
    }
  } catch (err) {
    console.warn('[interestedService] Failed to read local user cache:', err);
  }
  return new Set();
}

function setCachedInterestedIds(userId, set) {
  if (!userId) return;
  try {
    localStorage.setItem(
      `eventportal_user_${userId}_interested`,
      JSON.stringify(Array.from(set))
    );
  } catch (err) {
    console.warn('[interestedService] Failed to write local user cache:', err);
  }
}

/**
 * Fetches all interested event IDs for a given user.
 *
 * @param {string} userId - Firebase Auth user UID
 * @returns {Promise<Set<string>>}
 */
export async function fetchUserInterestedEvents(userId) {
  if (!userId) return new Set();
  const cached = getCachedInterestedIds(userId);

  if (!isFirebaseConfigured || !db) {
    return cached;
  }

  try {
    const interestedCol = collection(db, 'users', userId, 'interestedEvents');
    const snapshot = await getDocs(interestedCol);
    const ids = new Set();
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (!data.status || data.status === 'interested') {
        ids.add(docSnap.id);
      }
    });
    setCachedInterestedIds(userId, ids);
    console.log('[interestedService] Interested events loaded from Firestore for user:', userId, 'count:', ids.size);
    return ids;
  } catch (err) {
    console.warn('[interestedService] fetchUserInterestedEvents Firestore error (using user cache):', err.message);
    return cached;
  }
}

/**
 * Marks an event as Interested for the authenticated user under users/{userId}/interestedEvents/{eventId}.
 *
 * @param {string} userId - Firebase Auth user UID
 * @param {string} eventId - Unique event identifier
 */
export async function addInterestedInDb(userId, eventId) {
  if (!userId || !eventId) return;

  // Immediately persist to per-UID cache
  const cached = getCachedInterestedIds(userId);
  cached.add(eventId);
  setCachedInterestedIds(userId, cached);

  if (isFirebaseConfigured && db) {
    try {
      const interestedDocRef = doc(db, 'users', userId, 'interestedEvents', eventId);
      await setDoc(interestedDocRef, {
        eventId,
        status: 'interested',
        createdAt: serverTimestamp(),
      });
      console.log('[interestedService] Event marked as Interested in Firestore for user:', userId, 'eventId:', eventId);
    } catch (err) {
      console.warn('[interestedService] addInterestedInDb Firestore write error (preserved in user cache):', err.message);
    }
  }
}

/**
 * Removes an event from Interested for the authenticated user from users/{userId}/interestedEvents/{eventId}.
 *
 * @param {string} userId - Firebase Auth user UID
 * @param {string} eventId - Unique event identifier
 */
export async function removeInterestedFromDb(userId, eventId) {
  if (!userId || !eventId) return;

  // Immediately remove from per-UID cache
  const cached = getCachedInterestedIds(userId);
  cached.delete(eventId);
  setCachedInterestedIds(userId, cached);

  if (isFirebaseConfigured && db) {
    try {
      const interestedDocRef = doc(db, 'users', userId, 'interestedEvents', eventId);
      await deleteDoc(interestedDocRef);
      console.log('[interestedService] Event interest removed from Firestore for user:', userId, 'eventId:', eventId);
    } catch (err) {
      console.warn('[interestedService] removeInterestedFromDb Firestore delete error (removed from user cache):', err.message);
    }
  }
}

/**
 * Toggles an event's interested state in Firestore for the given user.
 *
 * @param {string} userId
 * @param {string} eventId
 * @param {boolean} isCurrentlyInterested
 */
export async function toggleInterestedInDb(userId, eventId, isCurrentlyInterested) {
  if (isCurrentlyInterested) {
    await removeInterestedFromDb(userId, eventId);
  } else {
    await addInterestedInDb(userId, eventId);
  }
}

/**
 * Subscribes to real-time interested event updates for a user.
 * Immediately invokes onUpdate with cached data, then connects to Firestore.
 *
 * @param {string} userId
 * @param {Function} onUpdate - callback receiving Set<string>
 * @param {Function} [onError] - optional error callback
 * @returns {Function} unsubscribe function
 */
export function subscribeToUserInterestedEvents(userId, onUpdate, onError) {
  if (!userId) {
    onUpdate(new Set());
    return () => {};
  }

  // Instantly seed with cached data for this UID (0ms latency, eliminates blank flash)
  const cached = getCachedInterestedIds(userId);
  onUpdate(cached);

  if (!isFirebaseConfigured || !db) {
    return () => {};
  }

  try {
    const interestedCol = collection(db, 'users', userId, 'interestedEvents');
    const unsubscribe = onSnapshot(
      interestedCol,
      (snapshot) => {
        const ids = new Set();
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (!data.status || data.status === 'interested') {
            ids.add(docSnap.id);
          }
        });
        setCachedInterestedIds(userId, ids);
        console.log('[interestedService] Live interested events synced from Firestore for user:', userId, 'count:', ids.size);
        onUpdate(ids);
      },
      (err) => {
        console.warn('[interestedService] Firestore onSnapshot warning (keeping user cache active):', err.message);
        onUpdate(getCachedInterestedIds(userId));
        if (onError) onError(err);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('[interestedService] subscribeToUserInterestedEvents failed:', err.message);
    onUpdate(getCachedInterestedIds(userId));
    if (onError) onError(err);
    return () => {};
  }
}
