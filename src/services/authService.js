import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from './firebase';

/**
 * Subscribes to Auth state changes.
 * Calls callback with user object or null.
 */
export function subscribeToAuthChanges(callback) {
  if (isFirebaseConfigured && auth) {
    return onAuthStateChanged(auth, (user) => {
      callback(user);
    });
  }
  // Return dummy unsubscribe function for offline/mock mode
  return () => {};
}

/**
 * Sign in with Google provider via popup if Firebase is configured,
 * or fall back to mock student session.
 */
export async function loginWithGoogle() {
  if (isFirebaseConfigured && auth && googleProvider) {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  }

  // Standalone mock login fallback
  return {
    uid: 'student-demo-123',
    displayName: 'Student User',
    email: 'student@mru.edu.in',
    photoURL:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  };
}

/**
 * Sign out user.
 */
export async function logoutUser() {
  if (isFirebaseConfigured && auth) {
    await firebaseSignOut(auth);
  }
}
