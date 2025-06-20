
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
      console.log('No professor subject provided, skipping fetch');
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

      console.log('Raw appointments from database:', data);
      
      if (!data || data.length === 0) {
        console.log('No appointments found in database');
        setAppointments([]);
        return;
      }

      // Log each appointment's subject for debugging
      data.forEach((appointment, index) => {
        console.log(`Appointment ${index + 1}:`, {
          id: appointment.id,
          subject: appointment.subject,
          status: appointment.status,
          student_name: appointment.student_profile?.name
        });
      });

      // Enhanced filtering logic
      const filteredAppointments = data.filter(appointment => {
        const appointmentSubject = appointment.subject?.toLowerCase() || '';
        const professorSubjectLower = professorSubject.toLowerCase();
        
        console.log(`\n--- Filtering appointment ---`);
        console.log(`Appointment subject: "${appointment.subject}"`);
        console.log(`Professor subject: "${professorSubject}"`);
        console.log(`Appointment subject (lowercase): "${appointmentSubject}"`);
        console.log(`Professor subject (lowercase): "${professorSubjectLower}"`);
        
        // Check multiple matching strategies
        const exactMatch = appointmentSubject === professorSubjectLower;
        const contains = appointmentSubject.includes(professorSubjectLower);
        const startsWith = appointmentSubject.startsWith(professorSubjectLower);
        
        console.log(`Exact match: ${exactMatch}`);
        console.log(`Contains: ${contains}`);
        console.log(`Starts with: ${startsWith}`);
        
        const matches = exactMatch || contains || startsWith;
        console.log(`Final match result: ${matches}`);
        console.log(`--- End filtering ---\n`);
        
        return matches;
      });

      console.log('Filtered appointments for professor:', filteredAppointments);
      console.log(`Total appointments: ${data.length}, Filtered: ${filteredAppointments.length}`);
      
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
    if (!professorSubject) {
      console.log('No professor subject, skipping subscription setup');
      return;
    }

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
          console.log('Real-time appointment change detected:', payload);
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
