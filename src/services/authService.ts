
import { supabase } from '@/integrations/supabase/client';

export const authService = {
  async signUp(email: string, password: string, name: string) {
    const redirectUrl = `${window.location.origin}/`;
    
    console.log('Attempting to sign up user:', email);
    
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
    
    console.log('Signup response:', { data, error });
    
    if (error) {
      console.error('Signup error:', error);
      return { data: null, error };
    }
    
    // Return both data and error for proper handling
    return { data, error: null };
  },

  async signIn(email: string, password: string) {
    console.log('Attempting to sign in user:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    console.log('Signin response:', { user: data?.user?.email, error });
    
    if (error) {
      console.error('Signin error:', error);
      // Handle specific error cases
      if (error.message.includes('Email not confirmed')) {
        return { 
          error: { 
            message: 'Please check your email and click the confirmation link to verify your account before signing in.' 
          } 
        };
      }
      if (error.message.includes('Invalid login credentials')) {
        return { 
          error: { 
            message: 'Invalid email or password. Please check your credentials and try again.' 
          } 
        };
      }
    }
    
    return { error };
  },

  async signInWithGoogle() {
    const redirectUrl = `${window.location.origin}/`;
    
    console.log('Attempting Google sign in with redirect:', redirectUrl);
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',  
          prompt: 'consent'
        }
      }
    });
    
    console.log('Google signin response:', { data, error });
    
    if (error) {
      console.error('Google signin error:', error);
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

  async resendConfirmation(email: string) {
    console.log('Resending confirmation email to:', email);
    
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${window.location.origin}/`
      }
    });
    
    if (error) {
      console.error('Resend confirmation error:', error);
      return { error };
    }
    
    return { error: null };
  },

  async signOut() {
    console.log('Signing out user');
    await supabase.auth.signOut();
  }
};
