import React, { createContext, useState, useEffect, useCallback } from 'react';
import {
  subscribeToAuthChanges,
  loginWithGoogle,
  loginWithGoogleRedirect,
  checkRedirectResult,
  loginWithEmail as authLoginWithEmail,
  registerWithEmail as authRegisterWithEmail,
  logoutUser,
  getUserProfile,
  mapAuthError,
} from '@/services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Load user profile from Firestore whenever currentUser changes
  const loadUserProfile = useCallback(async (user) => {
    if (!user?.uid) {
      setUserProfile(null);
      return;
    }

    try {
      const profile = await getUserProfile(user.uid);
      if (profile) {
        setUserProfile(profile);
      } else {
        setUserProfile({
          uid: user.uid,
          name: user.displayName || 'Student',
          email: user.email,
        });
      }
    } catch {
      setUserProfile({
        uid: user.uid,
        name: user.displayName || 'Student',
        email: user.email,
      });
    }
  }, []);

  useEffect(() => {
    // Process redirect result if coming back from redirect sign-in
    checkRedirectResult()
      .then(async (user) => {
        if (user) {
          setCurrentUser(user);
          await loadUserProfile(user);
        }
      })
      .catch((err) => {
        console.warn('[AuthContext] Redirect login processing error:', err);
      });

    const unsubscribe = subscribeToAuthChanges(async (user) => {
      setCurrentUser(user);
      if (user) {
        await loadUserProfile(user);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [loadUserProfile]);

  const clearAuthError = () => setAuthError(null);

  const registerWithEmail = async (name, email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const user = await authRegisterWithEmail(name, email, password);
      setCurrentUser(user);
      await loadUserProfile(user);
      return user;
    } catch (error) {
      const friendlyMessage = mapAuthError(error);
      setAuthError(friendlyMessage);
      throw new Error(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const user = await authLoginWithEmail(email, password);
      setCurrentUser(user);
      await loadUserProfile(user);
      return user;
    } catch (error) {
      const friendlyMessage = mapAuthError(error);
      setAuthError(friendlyMessage);
      throw new Error(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      const user = await loginWithGoogle();
      setCurrentUser(user);
      await loadUserProfile(user);
      return user;
    } catch (error) {
      const friendlyMessage = mapAuthError(error);
      setAuthError(friendlyMessage);
      throw new Error(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogleRedirect = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      await loginWithGoogleRedirect();
    } catch (error) {
      const friendlyMessage = mapAuthError(error);
      setAuthError(friendlyMessage);
      throw new Error(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      await logoutUser();
      setCurrentUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    authError,
    clearAuthError,
    isAuthenticated: !!currentUser,
    registerWithEmail,
    loginWithEmail,
    signInWithGoogle,
    signInWithGoogleRedirect,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
