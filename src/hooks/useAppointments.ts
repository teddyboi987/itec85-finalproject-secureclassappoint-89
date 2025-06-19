
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DatabaseAppointment {
  id: string;
  student_id: string;
  professor_id: string | null;
  subject: string;
  date: string;
  time: string;
  status: string;
  created_at: string;
}

export const useAppointments = (userId: string | undefined) => {
  const [appointments, setAppointments] = useState<DatabaseAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAppointments = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('student_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching appointments:', error);
        return;
      }

      console.log('Fetched appointments:', data);
      setAppointments(data || []);
    } catch (err) {
      console.error('Unexpected error fetching appointments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [userId]);

  return {
    appointments,
    isLoading,
    refetchAppointments: fetchAppointments
  };
};
