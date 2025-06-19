
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
    if (!userId) {
      setAppointments([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      console.log('Fetching appointments for user:', userId);
      
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('student_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching appointments:', error);
        setAppointments([]);
        return;
      }

      console.log('Fresh appointments fetched:', data);
      setAppointments(data || []);
    } catch (err) {
      console.error('Unexpected error fetching appointments:', err);
      setAppointments([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Set up real-time subscription for appointments
  useEffect(() => {
    if (!userId) return;

    console.log('Setting up appointments subscription for user:', userId);
    
    // Initial fetch
    fetchAppointments();

    // Set up real-time subscription
    const channel = supabase
      .channel('student-appointments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments',
          filter: `student_id=eq.${userId}`
        },
        (payload) => {
          console.log('Real-time appointment change for student:', payload);
          // Refetch appointments on any change to ensure data consistency
          fetchAppointments();
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up appointments subscription');
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return {
    appointments,
    isLoading,
    refetchAppointments: fetchAppointments
  };
};
