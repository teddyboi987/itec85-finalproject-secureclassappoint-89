
import { supabase } from '@/integrations/supabase/client';

export const authService = {
  async signUp(email: string, password: string, name: string) {
    const redirectUrl = `${window.location.origin}/`;
    
    // Check if it's a professor email
    const isProfessor = email.includes('@cvsu.edu.ph') && email !== 'admin@cvsu.edu.ph';
    
    // For professors, we don't allow signup - they should use existing accounts
    if (isProfessor) {
      return { 
        error: { 
          message: 'Professor accounts are pre-created by admin. Please use the "Sign In" option with your provided credentials.' 
        } 
      };
    }
    
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
  },

  async signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { error };
  },

  async signInWithGoogle() {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    });
    
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
  },

  async signOut() {
    await supabase.auth.signOut();
  }
};
