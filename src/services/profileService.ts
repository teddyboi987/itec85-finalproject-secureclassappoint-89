
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/supabase-auth';

export const profileService = {
  async fetchProfile(userId: string): Promise<Profile | null> {
    try {
      console.log('Fetching profile for user ID:', userId);
      
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      console.log('Raw profile data from DB:', profileData);
      
      if (profileData) {
        const profile = {
          id: profileData.id,
          name: profileData.name,
          email: profileData.email,
          role: profileData.role as 'student' | 'professor' | 'admin',
          subject: profileData.subject || undefined
        };
        console.log('Processed profile:', profile);
        return profile;
      }
      
      console.log('No profile found for user:', userId);
      return null;
    } catch (error) {
      console.error('Error in profile fetch:', error);
      return null;
    }
  }
};
