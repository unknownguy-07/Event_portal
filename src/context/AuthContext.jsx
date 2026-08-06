import React, { createContext, useState } from 'react';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null); // null = unauthenticated
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = async () => {
    // Stub implementation for Phase 1 / offline state
    setLoading(true);
    setTimeout(() => {
      setCurrentUser({
        uid: "user-123",
        displayName: "Student User",
        email: "student@university.edu",
        photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      });
      setLoading(false);
    }, 500);
  };

  const signOut = async () => {
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    isAuthenticated: !!currentUser,
    signInWithGoogle,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
