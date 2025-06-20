
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DatabaseAppointment {
  id: string;
  student_id: string;
  professor_id: string;
  subject: string;
  date: string;
  time: string;
  status: string;
  created_at: string;
  student_profile?: {
    name: string;
  };
}

export const useProfessorAppointments = (professorSubject: string | undefined) => {
  const [appointments, setAppointments] = useState<DatabaseAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchAppointments = async () => {
    if (!professorSubject) {
      setAppointments([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      console.log('Fetching appointments for professor subject:', professorSubject);
      
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          student_profile:profiles!appointments_student_id_fkey(name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching appointments:', error);
        toast({
          title: "Error",
          description: "Failed to fetch appointments",
          variant: "destructive",
        });
        setAppointments([]);
        return;
      }

      console.log('All appointments fetched:', data);
      
      // More flexible filtering logic
      const filteredAppointments = data?.filter(appointment => {
        const appointmentSubject = appointment.subject.toLowerCase();
        const professorSubjectLower = professorSubject.toLowerCase();
        
        console.log(`Checking appointment: "${appointment.subject}"`);
        console.log(`Against professor subject: "${professorSubject}"`);
        
        // Check if the appointment subject contains the professor's subject
        // This handles cases like "Computer Science (Prof. Prof. Santos)" matching "Computer Science"
        const matches = appointmentSubject.includes(professorSubjectLower);
        
        console.log(`Match result: ${matches}`);
        return matches;
      }) || [];

      console.log('Filtered appointments for professor:', filteredAppointments);
      setAppointments(filteredAppointments);
    } catch (err) {
      console.error('Unexpected error fetching appointments:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      setAppointments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, status: 'approved' | 'rejected') => {
    try {
      console.log(`Updating appointment ${appointmentId} status to:`, status);
      
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', appointmentId);

      if (error) {
        console.error('Error updating appointment:', error);
        toast({
          title: "Error",
          description: `Failed to ${status} appointment`,
          variant: "destructive",
        });
        return false;
      }

      // Update local state immediately for instant UI feedback
      setAppointments(prev =>
        prev.map(appointment =>
          appointment.id === appointmentId
            ? { ...appointment, status }
            : appointment
        )
      );

      toast({
        title: "Success",
        description: `Appointment ${status} successfully`,
      });
      return true;
    } catch (err) {
      console.error('Unexpected error updating appointment:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  // Set up real-time subscription and initial fetch
  useEffect(() => {
    if (!professorSubject) return;

    console.log('Setting up professor appointments subscription for subject:', professorSubject);
    
    // Initial fetch
    fetchAppointments();

    // Set up real-time subscription for all appointment changes
    const channel = supabase
      .channel('professor-appointments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments'
        },
        (payload) => {
          console.log('Real-time appointment change for professor:', payload);
          // Refetch appointments to ensure filtering is applied correctly
          fetchAppointments();
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up professor appointments subscription');
      supabase.removeChannel(channel);
    };
  }, [professorSubject]);

  return {
    appointments,
    isLoading,
    updateAppointmentStatus,
    refetchAppointments: fetchAppointments
  };
};
