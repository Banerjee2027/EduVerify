/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth } from './lib/firebase';
import { getUserProfile, createUserProfile, testConnection } from './services/firestoreService';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import VerifyRecords from './pages/VerifyRecords';
import ProfileSetup from './pages/ProfileSetup';
import Header from './components/Header';
import { UserProfile } from './types';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    testConnection();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        let profile = await getUserProfile(firebaseUser.uid);
        if (!profile) {
          // Create new profile for first-time login
          profile = {
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || 'New User',
            email: firebaseUser.email || '',
            role: 'student', // Default role
            institution: '',
            avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`,
            profileComplete: false,
          };
          await createUserProfile(profile);
        }
        setUser(profile);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    if (loggingIn) return;
    setLoggingIn(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      if (error.code === 'auth/popup-blocked') {
        alert("Sign-in popup was blocked by your browser. Please enable popups for this site.");
      } else if (error.code !== 'auth/cancelled-popup-request') {
        console.error("Login failed:", error);
      }
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleProfileComplete = (updatedUser: UserProfile) => {
    setUser(updatedUser);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-medium animate-pulse">Initializing EduVerify...</p>
        </div>
      </div>
    );
  }

  // If logged in but profile not complete, show setup page
  const needsProfileSetup = user && !user.profileComplete;

  return (
    <Router>
      <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
        <Header user={user} onLogout={handleLogout} onLogin={handleLogin} />
        <main>
          {needsProfileSetup ? (
            <ProfileSetup user={user} onComplete={handleProfileComplete} />
          ) : (
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route 
                path="/dashboard" 
                element={user ? <Dashboard user={user} /> : <div className="p-20 text-center"><button onClick={handleLogin} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold">Sign in with Google to access Dashboard</button></div>} 
              />
              <Route 
                path="/verify" 
                element={user?.role === 'educator' ? <VerifyRecords /> : <Navigate to="/dashboard" />} 
              />
            </Routes>
          )}
        </main>
      </div>
    </Router>
  );
}
