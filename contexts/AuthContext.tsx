
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { supabase } from '../services/supabase';

interface AuthContextType {
  isAuthenticated: boolean;
  userProfile: UserProfile | null;
  userRole: UserRole | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, username: string, role: UserRole, mobile?: string, companyName?: string, location?: string) => Promise<boolean>;
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
      
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (session?.user) {
          // Fetch user profile from the public 'users' table
          const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            setIsAuthenticated(true);
            const user: UserProfile = {
              id: profile.id,
              email: profile.email,
              username: profile.username,
              role: profile.role as UserRole,
              status: profile.status,
              mobile: profile.mobile,
              companyName: profile.company_name,
              location: profile.location
            };
            setUserProfile(user);
            setUserRole(profile.role as UserRole);
          } else {
             console.error('User authenticated but profile not found in public table.');
             setIsAuthenticated(true); // Still authenticated technically
             // Fallback profile from metadata if DB trigger failed
             const fallback: UserProfile = {
                 id: session.user.id,
                 email: session.user.email || '',
                 username: session.user.user_metadata?.username || 'User',
                 role: session.user.user_metadata?.role || UserRole.USER,
                 status: 'active',
                 mobile: session.user.user_metadata?.mobile,
                 companyName: session.user.user_metadata?.companyName,
                 location: session.user.user_metadata?.location
             };
             setUserProfile(fallback);
             setUserRole(fallback.role);
          }
        } else {
          setIsAuthenticated(false);
          setUserProfile(null);
          setUserRole(null);
        }
      } catch (err) {
        console.error('Supabase session check failed:', err);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
       if (_event === 'SIGNED_OUT') {
           setIsAuthenticated(false);
           setUserProfile(null);
           setUserRole(null);
       } else if (_event === 'SIGNED_IN' && session) {
           fetchSessionAndProfile();
       }
    });

    fetchSessionAndProfile();

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      // State updates handled by onAuthStateChange listener
      return true; 
    } catch (err) {
      console.error("Login failed:", err);
      setLoading(false);
      return false;
    }
  };

  const signup = async (email: string, password: string, username: string, role: UserRole, mobile?: string, companyName?: string, location?: string): Promise<boolean> => {
    setLoading(true);
    try {
        // We pass metadata so the SQL Trigger can pick it up and insert into public.users
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: { 
                data: { 
                  username, 
                  role,
                  mobile,
                  companyName,
                  location
                } 
            }
        });
        
        if (error) throw error;
        // If email confirmation is disabled in Supabase, they are logged in.
        // If enabled, they need to check email. 
        return true;
    } catch (err) {
        console.error("Signup failed:", err);
        setLoading(false);
        return false;
    }
  };

  const logout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
    window.location.hash = '/login'; 
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
