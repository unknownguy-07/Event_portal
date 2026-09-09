import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider, isFirebaseConfigured } from './firebase';

/**
 * Maps Firebase Auth error codes to user-friendly messages.
 */
export function mapAuthError(error) {
  if (!error) return 'An unexpected error occurred. Please try again.';
  const code = error.code || '';

  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please sign in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please verify your credentials.';
    case 'auth/user-disabled':
      return 'This user account has been disabled. Please contact support.';
    case 'auth/too-many-requests':
      return 'Too many failed login attempts. Please wait a few minutes and try again.';
    case 'auth/popup-closed-by-user':
      if (error?.fastDismiss) {
        return 'The Google popup closed automatically. This happens when: 1) Google sign-in is NOT enabled in your Firebase Console (Authentication > Sign-in method > Google), or 2) Browser blocked the popup. Try Redirect Mode below or check Firebase Console.';
      }
      return 'Google sign-in popup was closed before completing sign-in.';
    case 'auth/popup-blocked':
      return 'Google sign-in popup was blocked by your browser. Please allow popups for localhost.';
    case 'auth/cancelled-popup-request':
      return 'A sign-in window is already open. Please complete or close it.';
    case 'auth/operation-not-allowed':
      return 'Google Sign-In is NOT enabled in your Firebase Console. Go to Firebase Console > Authentication > Sign-in method, click Google, and enable it.';
    case 'auth/unauthorized-domain':
      return 'This domain (localhost) is not authorized in Firebase Console. Go to Firebase Console > Authentication > Settings > Authorized domains and add localhost.';
    case 'auth/invalid-api-key':
    case 'auth/api-key-not-valid':
      return 'Invalid Firebase API Key. Please verify VITE_FIREBASE_API_KEY in your .env.local file.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    default:
      return error.message || 'Authentication failed. Please try again.';
  }
}

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
 * Register a new user with Email and Password.
 * Updates Auth profile and saves user document in Firestore 'users/{uid}'.
 */
export async function registerWithEmail(name, email, password) {
  if (isFirebaseConfigured && auth) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update Firebase Auth profile display name
    await updateProfile(user, { displayName: name });

    // Store basic profile in Firestore 'users/{uid}'
    if (db) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(
          userRef,
          {
            uid: user.uid,
            name: name.trim(),
            email: email.trim().toLowerCase(),
            createdAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (err) {
        console.warn('Could not write user profile to Firestore:', err.message);
      }
    }

    return user;
  }

  // Fallback demo registration if Firebase config is not provided
  return {
    uid: `user-${Date.now()}`,
    displayName: name,
    email,
    photoURL: null,
  };
}

/**
 * Sign in an existing user with Email and Password.
 */
export async function loginWithEmail(email, password) {
  if (isFirebaseConfigured && auth) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  }

  // Fallback demo login
  return {
    uid: 'student-demo-123',
    displayName: 'Student User',
    email,
    photoURL: null,
  };
}

/**
 * Sign in with Google provider via popup.
 * Also stores or updates the user profile in Firestore.
 */
export async function loginWithGoogle() {
  if (isFirebaseConfigured && auth && googleProvider) {
    const startTime = Date.now();
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Ensure user record exists in Firestore
      if (db && user) {
        try {
          const userRef = doc(db, 'users', user.uid);
          await setDoc(
            userRef,
            {
              uid: user.uid,
              name: user.displayName || 'Student',
              email: user.email,
              photoURL: user.photoURL,
              createdAt: new Date().toISOString(),
              role: 'student',
            },
            { merge: true }
          );
        } catch (err) {
          console.warn('[Firestore] Could not sync Google user profile to Firestore:', err.message);
        }
      }

      return user;
    } catch (err) {
      console.error('[Firebase Auth] signInWithPopup failed:', err.code, err.message);
      const elapsed = Date.now() - startTime;
      if (err.code === 'auth/popup-closed-by-user' && elapsed < 3500) {
        err.fastDismiss = true;
      }
      throw err;
    }
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
 * Sign in with Google provider via top-level redirect.
 * Bypasses all popup blocker and cross-origin third-party cookie restrictions.
 */
export async function loginWithGoogleRedirect() {
  if (isFirebaseConfigured && auth && googleProvider) {
    await signInWithRedirect(auth, googleProvider);
    return;
  }
}

/**
 * Checks for any pending redirect result when returning from Google OAuth redirect.
 */
export async function checkRedirectResult() {
  if (isFirebaseConfigured && auth) {
    try {
      const result = await getRedirectResult(auth);
      if (result?.user) {
        const user = result.user;
        if (db) {
          try {
            const userRef = doc(db, 'users', user.uid);
            await setDoc(
              userRef,
              {
                uid: user.uid,
                name: user.displayName || 'Student',
                email: user.email,
                photoURL: user.photoURL,
                createdAt: new Date().toISOString(),
                role: 'student',
              },
              { merge: true }
            );
          } catch (err) {
            console.warn('[Firestore] Could not sync redirect user profile:', err.message);
          }
        }
        return user;
      }
    } catch (err) {
      console.error('[Firebase Auth] getRedirectResult error:', err.code, err.message);
      throw err;
    }
  }
  return null;
}

/**
 * Fetches user profile from Firestore 'users/{userId}'.
 */
export async function getUserProfile(userId) {
  if (isFirebaseConfigured && db && userId) {
    try {
      const docRef = doc(db, 'users', userId);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return snapshot.data();
      }
    } catch (err) {
      console.warn('Could not fetch user profile from Firestore:', err.message);
    }
  }

  return null;
}

/**
 * Sign out user.
 */
export async function logoutUser() {
  if (isFirebaseConfigured && auth) {
    await firebaseSignOut(auth);
  }
}
