
import { supabase } from '@/integrations/supabase/client';
import { DatabaseAppointment, AppointmentStatus } from '@/types/appointment';

export const fetchAppointments = async (): Promise<DatabaseAppointment[]> => {
  console.log('🔍 Fetching all appointments from database');
  
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
    return [];
  }

  return data;
};

export const updateAppointmentStatus = async (
  appointmentId: string, 
  status: AppointmentStatus
): Promise<boolean> => {
  console.log(`🔄 Updating appointment ${appointmentId} status to:`, status);
  
  const { error } = await supabase
    .from('appointments')
    .update({ status })
    .eq('id', appointmentId);

  if (error) {
    console.error('❌ Error updating appointment:', error);
    throw error;
  }

  return true;
};
