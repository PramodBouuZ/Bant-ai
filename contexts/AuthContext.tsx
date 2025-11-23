import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { supabase } from '../services/supabase'; // Import Supabase client

interface AuthContextType {
  isAuthenticated: boolean;
  userProfile: UserProfile | null;
  userRole: UserRole | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, username: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSessionAndProfile = async () => {
      setLoading(true);
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error('Error getting session:', sessionError.message);
        setIsAuthenticated(false);
        setUserProfile(null);
        setUserRole(null);
        setLoading(false);
        return;
      }

      if (session?.user) {
        // Fetch user profile from your 'users' table
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching user profile:', profileError.message);
          setIsAuthenticated(false); // Consider logging out if profile can't be fetched
          setUserProfile(null);
          setUserRole(null);
        } else if (profile) {
          setIsAuthenticated(true);
          setUserProfile(profile as UserProfile);
          setUserRole(profile.role as UserRole);
        } else {
          // User exists in auth.users but not in your 'users' table (might indicate incomplete signup)
          console.warn('User found in auth.users but not in public.users table.');
          setIsAuthenticated(false);
          setUserProfile(null);
          setUserRole(null);
        }
      } else {
        setIsAuthenticated(false);
        setUserProfile(null);
        setUserRole(null);
      }
      setLoading(false);
    };

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      // This will trigger whenever auth state changes (login, logout, token refresh)
      fetchSessionAndProfile();
    });

    fetchSessionAndProfile(); // Initial fetch

    return () => {
      authListener?.subscription.unsubscribe(); // Cleanup the listener
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      console.error('Login error:', error.message);
      setIsAuthenticated(false);
      setUserProfile(null);
      setUserRole(null);
      return false;
    }

    if (data.user) {
      // Session management and profile loading handled by useEffect and onAuthStateChange
      return true;
    }
    return false; // Should ideally not be reached if no error and no user
  };

  const signup = async (email: string, password: string, username: string, role: UserRole): Promise<boolean> => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    
    if (error) {
      console.error('Signup error:', error.message);
      setLoading(false);
      return false;
    }

    if (data.user) {
      // Insert into your public 'users' table to store username and role
      const { error: insertError } = await supabase
        .from('users')
        .insert([
          { id: data.user.id, email: data.user.email, username, role: role },
        ]);

      if (insertError) {
        console.error('Error inserting user profile:', insertError.message);
        // You might want to delete the auth.user here if profile creation fails
        await supabase.auth.admin.deleteUser(data.user.id); // Requires admin access, might not be suitable for client-side
        setLoading(false);
        return false;
      }
      // Session management and profile loading handled by useEffect and onAuthStateChange
      return true;
    }
    setLoading(false);
    return false; // Should not be reached if no error and no user
  };

  const logout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    setLoading(false);

    if (error) {
      console.error('Logout error:', error.message);
      return; // Keep user logged in if logout fails
    }

    // State reset is handled by onAuthStateChange in useEffect
    window.location.hash = '/login'; // Redirect to login page
  };

  const value = {
    isAuthenticated,
    userProfile,
    userRole,
    loading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};