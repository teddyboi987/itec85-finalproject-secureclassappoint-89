
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'professor' | 'admin';
  subject?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const SupabaseAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile with a small delay to ensure the trigger has completed
          setTimeout(async () => {
            try {
              const { data: profileData, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .maybeSingle();
              
              if (error) {
                console.error('Error fetching profile:', error);
              } else if (profileData) {
                const typedProfile: Profile = {
                  id: profileData.id,
                  name: profileData.name,
                  email: profileData.email,
                  role: profileData.role as 'student' | 'professor' | 'admin',
                  subject: profileData.subject || undefined
                };
                setProfile(typedProfile);
              }
            } catch (error) {
              console.error('Error in profile fetch:', error);
            }
          }, 500);
        } else {
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Fetch user profile
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle()
          .then(({ data, error }) => {
            if (error) {
              console.error('Error fetching profile:', error);
            } else if (data) {
              const typedProfile: Profile = {
                id: data.id,
                name: data.name,
                email: data.email,
                role: data.role as 'student' | 'professor' | 'admin',
                subject: data.subject || undefined
              };
              setProfile(typedProfile);
            }
          });
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          name: name
        }
      }
    });
    
    // Handle the case where user already exists
    if (error) {
      if (error.message.includes('User already registered') || 
          error.message.includes('duplicate key') ||
          error.message.includes('already been registered')) {
        return { 
          error: { 
            message: 'An account with this email already exists. Please try signing in instead.' 
          } 
        };
      }
    }
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { error };
  };

  const signInWithGoogle = async () => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl
      }
    });
    
    // Provide a more helpful error message for Google auth issues
    if (error) {
      if (error.message.includes('provider is not enabled')) {
        return { 
          error: { 
            message: 'Google sign-in is not enabled. Please contact the administrator or use email/password instead.' 
          } 
        };
      }
    }
    
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      session,
      signUp,
      signIn,
      signInWithGoogle,
      signOut,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useSupabaseAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  return context;
};
