
import React, { createContext, useContext } from 'react';
import { SupabaseAuthContextType } from '@/types/supabase-auth';
import { useAuthState } from '@/hooks/useAuthState';
import { authService } from '@/services/authService';

const AuthContext = createContext<SupabaseAuthContextType | undefined>(undefined);

export const SupabaseAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, session, isLoading } = useAuthState();

  const signOut = async () => {
    const { error } = await authService.signOut();
    if (error) {
      console.error('Sign out error:', error);
    }
  };

  const contextValue: SupabaseAuthContextType = {
    user,
    profile,
    session,
    signUp: authService.signUp,
    signIn: authService.signIn,
    signInWithGoogle: authService.signInWithGoogle,
    signOut,
    isLoading
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useSupabaseAuth = (): SupabaseAuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  return context;
};
