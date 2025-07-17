"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, getAuth, onAuthStateChanged, signOut, Auth } from 'firebase/auth';
import { getFirestore, doc, getDoc, Firestore } from 'firebase/firestore';
import { app, db, auth } from "@/firebase/config";
type UserRole = 'admin' | 'homeowner' | 'contractor';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  loading: boolean;
  login: (user: User) => Promise<UserRole | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [db, setDb] = useState<Firestore | null>(null);

  useEffect(() => {
    // Use the directly imported app — no function call
    setAuth(getAuth(app));
    setDb(getFirestore(app));
  }, []);
  const fetchUserRole = useCallback(async (user: User | null): Promise<UserRole | null> => {
    if (!user || !db) return null;
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        return userDoc.data().role as UserRole;
      }
    } catch (e) {
      console.error("Error fetching user role:", e);
    }
    return 'homeowner'; // Default role if not found or error
  }, [db]);

  useEffect(() => {
    // This effect runs when 'auth' state is updated
    if (!auth) {
      // Keep loading until auth is initialized
      setLoading(true);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRole = await fetchUserRole(user);
        setUser(user);
        setRole(userRole);
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, fetchUserRole]);

  const login = useCallback(async (user: User) => {
    setLoading(true);
    const userRole = await fetchUserRole(user);
    setUser(user);
    setRole(userRole);
    setLoading(false);
    return userRole;
  }, [fetchUserRole]);

  const logout = useCallback(async () => {
    if (!auth) return;
    setLoading(true);
    await signOut(auth);
    setUser(null);
    setRole(null);
    setLoading(false);
  }, [auth]);

  return (
    <AuthContext.Provider value={{ user, role, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
