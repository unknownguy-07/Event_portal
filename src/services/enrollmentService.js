/**
 * Enrollment & Registration Service
 *
 * Provides real-time integration with Cloud Firestore collection 'registrations'.
 * Supports querying, registering with duplicate protection, status verification,
 * and user enrollment history.
 */

import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  setDoc,
  doc,
} from 'firebase/firestore';
import { isFirebaseConfigured, db } from './firebase';
import { mockEnrollments } from './enrollmentMockData';

// In-memory / local storage cache for instant UI feedback
const LOCAL_REGISTRATIONS_KEY = 'eventportal_local_registrations';

function getLocalRegistrations() {
  try {
    const raw = localStorage.getItem(LOCAL_REGISTRATIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalRegistration(registration) {
  try {
    const list = getLocalRegistrations().filter(
      (r) => !(r.userId === registration.userId && r.eventId === registration.eventId)
    );
    list.unshift(registration);
    localStorage.setItem(LOCAL_REGISTRATIONS_KEY, JSON.stringify(list));
  } catch {
    // Ignore storage issues
  }
}

/**
 * Generate a clean ticket code (e.g. TKT-MRU-A8B9C0).
 */
function generateTicketId() {
  const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `TKT-MRU-${randomSuffix}`;
}

/**
 * Fetches all registrations/enrollments for a given user from Firestore 'registrations'.
 * Falls back to mock data only if no live Firestore records or unconfigured.
 * @param {string} userId
 * @returns {Promise<Array>}
 */
export async function getUserEnrollments(userId) {
  if (!userId) return [];

  const localRegs = getLocalRegistrations().filter((r) => r.userId === userId);

  if (isFirebaseConfigured && db) {
    try {
      const regRef = collection(db, 'registrations');
      const q = query(regRef, where('userId', '==', userId));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const firestoreList = snapshot.docs.map((d) => ({
          enrollmentId: d.id,
          registrationId: d.id,
          ...d.data(),
        }));

        // Merge any recent local registrations that haven't synced
        const firestoreIds = new Set(firestoreList.map((r) => r.eventId));
        const merged = [
          ...firestoreList,
          ...localRegs.filter((r) => !firestoreIds.has(r.eventId)),
        ];
        return merged;
      }
    } catch (err) {
      console.warn('Firestore getUserEnrollments fallback:', err.message);
    }
  }

  // If local user has custom registered events, include them with mock demo fallback
  const mockUserRegs = mockEnrollments.filter((e) => e.userId === userId || userId === 'student-demo-123');
  const seenEventIds = new Set(localRegs.map((r) => r.eventId));
  return [...localRegs, ...mockUserRegs.filter((m) => !seenEventIds.has(m.eventId))];
}

/**
 * Checks whether a user is already registered for a specific event.
 * @param {string} userId
 * @param {string} eventId
 * @returns {Promise<boolean>}
 */
export async function isUserRegisteredForEvent(userId, eventId) {
  if (!userId || !eventId) return false;

  // Check local cache first for instant response
  const localMatch = getLocalRegistrations().find(
    (r) => r.userId === userId && r.eventId === eventId && r.status !== 'cancelled'
  );
  if (localMatch) return true;

  if (isFirebaseConfigured && db) {
    try {
      const regDocId = `${userId}_${eventId}`;
      const docRef = doc(db, 'registrations', regDocId);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        return data.status !== 'cancelled' && data.registrationStatus !== 'cancelled';
      }
    } catch (err) {
      console.warn('Error checking registration status:', err.message);
    }
  }

  // Check mock enrollments
  return mockEnrollments.some(
    (e) => (e.userId === userId || userId === 'student-demo-123') && e.eventId === eventId && e.status !== 'cancelled'
  );
}

/**
 * Registers an authenticated user for an event in Firestore.
 * Prevents duplicate registrations.
 * @param {string} userId
 * @param {Object} event
 * @param {Object} userDetails (name, email)
 * @returns {Promise<Object>} The created registration document
 */
export async function registerForEvent(userId, event, userDetails = {}) {
  if (!userId) {
    throw new Error('You must be signed in to register for an event.');
  }

  const eventId = event.id;
  const isAlreadyRegistered = await isUserRegisteredForEvent(userId, eventId);
  if (isAlreadyRegistered) {
    throw new Error('You are already registered for this event.');
  }

  const registrationDocId = `${userId}_${eventId}`;
  const now = new Date().toISOString();
  const ticketId = generateTicketId();

  const registrationRecord = {
    registrationId: registrationDocId,
    enrollmentId: registrationDocId,
    userId,
    userName: userDetails.name || userDetails.displayName || 'Student',
    userEmail: userDetails.email || '',
    eventId: event.id,
    eventTitle: event.name || event.title || 'Campus Event',
    eventDate: event.date || '',
    eventTime: event.time || '10:00 AM',
    eventVenue: event.venue || 'Campus Main Auditorium',
    eventCategory: event.category || 'Campus Event',
    eventOrganizer: event.organizer || 'University',
    eventImage: event.image || event.thumbnail || '',
    registrationStatus: 'registered',
    status: 'registered',
    attendanceStatus: 'upcoming',
    attended: false,
    registeredAt: now,
    enrolledAt: now,
    ticketId,
  };

  // Save to local cache for instant UI feedback
  saveLocalRegistration(registrationRecord);

  if (isFirebaseConfigured && db) {
    try {
      const regDocRef = doc(db, 'registrations', registrationDocId);
      await setDoc(regDocRef, registrationRecord, { merge: true });
    } catch (err) {
      console.error('Firestore registration error:', err);
      // Even if Firestore fails, local record was saved for the session
    }
  }

  return registrationRecord;
}

/**
 * Fetches a single enrollment by enrollmentId.
 * @param {string} enrollmentId
 * @returns {Promise<Object|null>}
 */
export async function getEnrollmentById(enrollmentId) {
  if (isFirebaseConfigured && db) {
    try {
      const docSnap = await getDoc(doc(db, 'registrations', enrollmentId));
      if (docSnap.exists()) {
        return { enrollmentId: docSnap.id, ...docSnap.data() };
      }
    } catch (err) {
      console.warn('Firestore getEnrollmentById error:', err.message);
    }
  }

  const local = getLocalRegistrations().find((r) => r.enrollmentId === enrollmentId);
  if (local) return local;

  return mockEnrollments.find((e) => e.enrollmentId === enrollmentId) || null;
}

/**
 * Cancels a user's registration for an event.
 * @param {string} userId
 * @param {string} eventId
 */
export async function cancelRegistration(userId, eventId) {
  const regDocId = `${userId}_${eventId}`;

  // Update local cache
  const list = getLocalRegistrations().map((r) =>
    r.userId === userId && r.eventId === eventId
      ? { ...r, status: 'cancelled', registrationStatus: 'cancelled' }
      : r
  );
  localStorage.setItem(LOCAL_REGISTRATIONS_KEY, JSON.stringify(list));

  if (isFirebaseConfigured && db) {
    try {
      const regDocRef = doc(db, 'registrations', regDocId);
      await setDoc(
        regDocRef,
        { status: 'cancelled', registrationStatus: 'cancelled' },
        { merge: true }
      );
    } catch (err) {
      console.warn('Firestore cancelRegistration error:', err.message);
    }
  }
}
