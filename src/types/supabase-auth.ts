
import { User, Session } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'professor' | 'admin';
  subject?: string;
}

export interface AuthResult {
  error: any;
  message?: string;
}

export interface SupabaseAuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  signUp: (email: string, password: string, name: string) => Promise<AuthResult>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isLoading: boolean;
}
