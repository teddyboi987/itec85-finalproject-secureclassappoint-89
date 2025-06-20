
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
    let mounted = true;

    // Check for existing session first
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setIsLoading(false);
          }
          return;
        }

        if (!mounted) return;
        
        console.log('Initial session check:', session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('Fetching profile for user:', session.user.id);
          const profileData = await profileService.fetchProfile(session.user.id);
          if (mounted) {
            console.log('Profile data:', profileData);
            setProfile(profileData);
          }
        }
        
        if (mounted) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('User signed in, fetching profile');
          setTimeout(async () => {
            if (!mounted) return;
            const profileData = await profileService.fetchProfile(session.user.id);
            if (mounted) {
              console.log('Profile fetched after signin:', profileData);
              setProfile(profileData);
              setIsLoading(false);
            }
          }, 100);
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          setProfile(null);
          setIsLoading(false);
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed');
          if (session?.user && !profile) {
            setTimeout(async () => {
              if (!mounted) return;
              const profileData = await profileService.fetchProfile(session.user.id);
              if (mounted) {
                setProfile(profileData);
              }
            }, 0);
          }
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      }
    );

    // Initialize auth after setting up listener
    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [profile]); // Remove profile from dependency to prevent loops

  return {
    user,
    profile,
    session,
    isLoading
  };
};
