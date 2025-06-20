
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DatabaseAppointment, AppointmentStatus } from '@/types/appointment';

export const useProfessorAppointments = (professorSubject: string | undefined) => {
  const [appointments, setAppointments] = useState<DatabaseAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchAppointments = async () => {
    if (!professorSubject) {
      console.log('❌ No professor subject provided');
      setAppointments([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      console.log(`🔄 Fetching appointments for subject: "${professorSubject}"`);
      
      // Simple query - get ALL appointments and filter client-side
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          student_profile:profiles!appointments_student_id_fkey(name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching appointments:', error);
        throw error;
      }

      console.log('📊 Raw appointments from database:', data);
      
      if (!data || data.length === 0) {
        console.log('📭 No appointments found in database');
        setAppointments([]);
        setIsLoading(false);
        return;
      }

      // Simple filtering - just check if appointment subject matches professor subject
      const filteredAppointments = data.filter(appointment => {
        const appointmentSubject = appointment.subject?.toLowerCase().trim() || '';
        const profSubject = professorSubject.toLowerCase().trim();
        
        console.log(`🔍 Checking: "${appointmentSubject}" vs "${profSubject}"`);
        
        // Simple exact match
        const matches = appointmentSubject === profSubject;
        console.log(`✅ Match result: ${matches}`);
        
        return matches;
      });

      console.log(`🎯 Found ${filteredAppointments.length} matching appointments out of ${data.length} total`);
      setAppointments(filteredAppointments);
    } catch (err) {
      console.error('💥 Error fetching appointments:', err);
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
    console.log(`🚀 Setting up appointments for professor subject: "${professorSubject}"`);
    
    if (!professorSubject) {
      setAppointments([]);
      setIsLoading(false);
      return;
    }

    // Initial fetch
    fetchAppointments();

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
          fetchAppointments();
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
