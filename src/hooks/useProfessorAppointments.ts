
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
      console.log('🔍 Fetching appointments for professor subject:', professorSubject);
      
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          student_profile:profiles!appointments_student_id_fkey(name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching appointments:', error);
        toast({
          title: "Error",
          description: "Failed to fetch appointments",
          variant: "destructive",
        });
        setAppointments([]);
        return;
      }

      console.log('📊 Raw appointments from database:', data);
      
      if (!data || data.length === 0) {
        console.log('📭 No appointments found in database');
        setAppointments([]);
        return;
      }

      // Enhanced filtering logic with multiple strategies
      const filteredAppointments = data.filter(appointment => {
        const appointmentSubject = appointment.subject?.toLowerCase().trim() || '';
        const professorSubjectLower = professorSubject.toLowerCase().trim();
        
        console.log(`\n🔎 Filtering appointment ID: ${appointment.id}`);
        console.log(`   📝 Appointment subject: "${appointment.subject}"`);
        console.log(`   👨‍🏫 Professor subject: "${professorSubject}"`);
        
        // Strategy 1: Exact match
        const exactMatch = appointmentSubject === professorSubjectLower;
        console.log(`   ✅ Exact match: ${exactMatch}`);
        
        // Strategy 2: Professor subject is contained in appointment subject
        const professorInAppointment = appointmentSubject.includes(professorSubjectLower);
        console.log(`   📍 Professor subject in appointment: ${professorInAppointment}`);
        
        // Strategy 3: Appointment subject is contained in professor subject
        const appointmentInProfessor = professorSubjectLower.includes(appointmentSubject);
        console.log(`   📍 Appointment subject in professor: ${appointmentInProfessor}`);
        
        // Strategy 4: Check if they share common keywords (for cases like "CS" vs "Computer Science")
        const professorWords = professorSubjectLower.split(/\s+/).filter(word => word.length > 2);
        const appointmentWords = appointmentSubject.split(/\s+/).filter(word => word.length > 2);
        const commonWords = professorWords.some(pWord => 
          appointmentWords.some(aWord => aWord.includes(pWord) || pWord.includes(aWord))
        );
        console.log(`   🔗 Common words match: ${commonWords}`);
        console.log(`   📝 Professor words: [${professorWords.join(', ')}]`);
        console.log(`   📝 Appointment words: [${appointmentWords.join(', ')}]`);
        
        const matches = exactMatch || professorInAppointment || appointmentInProfessor || commonWords;
        console.log(`   🎯 Final match result: ${matches}`);
        
        return matches;
      });

      console.log('🎯 FILTERING RESULTS:');
      console.log(`   📊 Total appointments in DB: ${data.length}`);
      console.log(`   ✅ Filtered appointments: ${filteredAppointments.length}`);
      console.log('   📋 Filtered appointment IDs:', filteredAppointments.map(a => a.id));
      
      if (filteredAppointments.length > 0) {
        console.log('📝 Filtered appointments details:');
        filteredAppointments.forEach((apt, index) => {
          console.log(`   ${index + 1}. Subject: "${apt.subject}", Status: "${apt.status}", Student: "${apt.student_profile?.name || 'Unknown'}"`);
        });
      } else {
        console.log('⚠️ NO APPOINTMENTS MATCHED THE FILTER CRITERIA');
        console.log('   🔍 All subjects in database:');
        data.forEach((apt, index) => {
          console.log(`   ${index + 1}. "${apt.subject}"`);
        });
      }
      
      setAppointments(filteredAppointments);
    } catch (err) {
      console.error('💥 Unexpected error fetching appointments:', err);
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
      console.log(`🔄 Updating appointment ${appointmentId} status to:`, status);
      
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', appointmentId);

      if (error) {
        console.error('❌ Error updating appointment:', error);
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
      console.error('💥 Unexpected error updating appointment:', err);
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
      console.log('⚠️ No professor subject, skipping subscription setup');
      return;
    }

    console.log('🔄 Setting up professor appointments subscription for subject:', professorSubject);
    
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
          console.log('🔄 Real-time appointment change detected:', payload);
          // Refetch appointments to ensure filtering is applied correctly
          fetchAppointments();
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
    refetchAppointments: fetchAppointments
  };
};
