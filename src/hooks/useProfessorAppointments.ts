
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DatabaseAppointment, AppointmentStatus } from '@/types/appointment';

export const useProfessorAppointments = (professorSubject: string | undefined) => {
  const [appointments, setAppointments] = useState<DatabaseAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      console.log('🔍 FETCHING APPOINTMENTS - Professor Subject:', professorSubject);
      
      if (!professorSubject) {
        console.log('❌ No professor subject provided');
        setAppointments([]);
        return;
      }

      // Query all appointments first, then filter
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          student_profile:profiles!appointments_student_id_fkey(name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Database error:', error);
        throw error;
      }

      console.log('📊 ALL APPOINTMENTS FROM DB:', data);
      console.log('📊 Number of total appointments:', data?.length || 0);
      
      if (!data) {
        setAppointments([]);
        return;
      }

      // Filter appointments by subject (case insensitive)
      const filteredAppointments = data.filter(appointment => {
        const appointmentSubject = appointment.subject?.toLowerCase().trim();
        const profSubject = professorSubject.toLowerCase().trim();
        console.log('🔍 Comparing:', appointmentSubject, 'vs', profSubject);
        return appointmentSubject === profSubject;
      });

      console.log('✅ FILTERED APPOINTMENTS:', filteredAppointments);
      console.log('✅ Number of filtered appointments:', filteredAppointments.length);
      
      setAppointments(filteredAppointments);
    } catch (err) {
      console.error('💥 ERROR in fetchAppointments:', err);
      toast({
        title: "Error",
        description: "Failed to fetch appointments",
        variant: "destructive",
      });
      setAppointments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, status: AppointmentStatus) => {
    try {
      console.log(`🔄 Updating appointment ${appointmentId} to ${status}`);
      
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', appointmentId);

      if (error) {
        console.error('❌ Error updating appointment:', error);
        throw error;
      }

      // Update local state
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
      console.error('💥 Error updating appointment:', err);
      toast({
        title: "Error",
        description: `Failed to ${status} appointment`,
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    console.log('🚀 EFFECT TRIGGERED - Professor Subject:', professorSubject);
    if (professorSubject) {
      fetchAppointments();
    }

    // Set up real-time subscription
    const channel = supabase
      .channel('professor-appointments')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments'
        },
        (payload) => {
          console.log('🔄 Real-time change detected:', payload);
          if (professorSubject) {
            fetchAppointments();
          }
        }
      )
      .subscribe();

    return () => {
      console.log('🧹 Cleaning up subscription');
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
