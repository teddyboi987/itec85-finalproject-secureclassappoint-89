
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/supabase-auth';
import { profileService } from '@/services/profileService';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('useAuthState: Setting up auth state management');
    let mounted = true;

    const fetchProfile = async (userId: string) => {
      try {
        console.log('useAuthState: Fetching profile for user:', userId);
        const profileData = await profileService.fetchProfile(userId);
        if (mounted && profileData) {
          console.log('useAuthState: Profile fetched successfully:', profileData);
          setProfile(profileData);
        } else if (mounted) {
          console.log('useAuthState: No profile found, clearing profile state');
          setProfile(null);
        }
      } catch (error) {
        console.error('useAuthState: Error fetching profile:', error);
        if (mounted) {
          setProfile(null);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('useAuthState: Auth state changed:', event, session?.user?.email);
        
        if (!mounted) {
          console.log('useAuthState: Component unmounted, ignoring auth state change');
          return;
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('useAuthState: User authenticated, fetching profile');
          // Use setTimeout to prevent blocking the auth state change
          setTimeout(() => {
            if (mounted) {
              fetchProfile(session.user.id);
            }
          }, 0);
        } else {
          console.log('useAuthState: User signed out, clearing profile');
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('useAuthState: Getting initial session');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('useAuthState: Error getting initial session:', error);
          if (mounted) {
            setIsLoading(false);
          }
          return;
        }

        if (!mounted) return;
        
        console.log('useAuthState: Initial session:', session?.user?.email || 'No session');
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('useAuthState: Initial session has user, fetching profile');
          setTimeout(() => {
            if (mounted) {
              fetchProfile(session.user.id);
            }
          }, 0);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('useAuthState: Error in getInitialSession:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Get initial session
    getInitialSession();

    return () => {
      console.log('useAuthState: Cleaning up auth state management');
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  console.log('useAuthState: Current state:', { 
    hasUser: !!user, 
    hasProfile: !!profile, 
    hasSession: !!session, 
    isLoading 
  });

  return {
    user,
    profile,
    session,
    isLoading
  };
};
