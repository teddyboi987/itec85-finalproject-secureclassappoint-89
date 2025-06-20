
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DatabaseAppointment, AppointmentStatus } from '@/types/appointment';
import { filterAppointmentsBySubject } from '@/utils/appointmentFilters';
import { fetchAppointments, updateAppointmentStatus as updateAppointmentStatusService } from '@/services/appointmentService';

export const useProfessorAppointments = (professorSubject: string | undefined) => {
  const [appointments, setAppointments] = useState<DatabaseAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchAndFilterAppointments = async () => {
    if (!professorSubject) {
      console.log('⚠️ No professor subject provided, skipping fetch');
      setAppointments([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      console.log(`🔄 Starting to fetch appointments for professor subject: "${professorSubject}"`);
      
      const allAppointments = await fetchAppointments();
      console.log(`📊 Total appointments fetched from database: ${allAppointments.length}`);
      
      const filteredAppointments = filterAppointmentsBySubject(allAppointments, professorSubject);
      console.log(`✅ Filtered appointments for professor: ${filteredAppointments.length}`);
      
      setAppointments(filteredAppointments);
    } catch (err) {
      console.error('💥 Error in fetchAndFilterAppointments:', err);
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
      await updateAppointmentStatusService(appointmentId, status);

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
      console.error('💥 Error updating appointment status:', err);
      toast({
        title: "Error",
        description: `Failed to ${status} appointment`,
        variant: "destructive",
      });
      return false;
    }
  };

  // Set up real-time subscription and initial fetch
  useEffect(() => {
    if (!professorSubject) {
      console.log('⚠️ No professor subject, skipping subscription setup');
      setAppointments([]);
      setIsLoading(false);
      return;
    }

    console.log(`🔄 Setting up professor appointments hook for subject: "${professorSubject}"`);
    
    // Initial fetch
    fetchAndFilterAppointments();

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
          console.log('🔄 Real-time appointment change detected:', payload);
          // Refetch appointments to ensure filtering is applied correctly
          fetchAndFilterAppointments();
        }
      )
      .subscribe();

    return () => {
      console.log('🧹 Cleaning up professor appointments subscription');
      supabase.removeChannel(channel);
    };
  }, [professorSubject]);

  return {
    appointments,
    isLoading,
    updateAppointmentStatus,
    refetchAppointments: fetchAndFilterAppointments
  };
};
