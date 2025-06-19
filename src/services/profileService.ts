
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/supabase-auth';

export const profileService = {
  async fetchProfile(userId: string): Promise<Profile | null> {
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      if (profileData) {
        return {
          id: profileData.id,
          name: profileData.name,
          email: profileData.email,
          role: profileData.role as 'student' | 'professor' | 'admin',
          subject: profileData.subject || undefined
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error in profile fetch:', error);
      return null;
    }
  }
};
