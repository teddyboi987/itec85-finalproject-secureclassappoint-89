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
      if (error.message.includes('User already registered') || 
          error.message.includes('duplicate key') ||
          error.message.includes('already been registered')) {
        return { 
          error: { 
            message: 'An account with this email already exists. Please try signing in instead.' 
          } 
        };
      }
      return { error };
    }
    
    // If signup was successful, log the user creation
    if (data.user && !data.user.email_confirmed_at) {
      console.log('User created successfully, verification email sent to:', email);
    }
    
    return { data, error: null };
  },

  async signIn(email: string, password: string) {
    console.log('Attempting to sign in user:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    console.log('Signin response:', { data, error });
    
    if (error) {
      console.error('Signin error:', error);
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

  async signOut() {
    console.log('Signing out user');
    await supabase.auth.signOut();
  }
};
