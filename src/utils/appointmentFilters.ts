
import { DatabaseAppointment } from '@/types/appointment';

export const filterAppointmentsBySubject = (
  appointments: DatabaseAppointment[],
  professorSubject: string
): DatabaseAppointment[] => {
  if (!professorSubject) {
    console.log('❌ No professor subject provided for filtering');
    return [];
  }

  console.log(`🔍 Filtering ${appointments.length} appointments for subject "${professorSubject}"`);

  const filtered = appointments.filter(appointment => {
    const appointmentSubject = appointment.subject?.toLowerCase().trim() || '';
    const profSubject = professorSubject.toLowerCase().trim();
    
    return appointmentSubject === profSubject;
  });

  console.log(`✅ Found ${filtered.length} matching appointments`);
  return filtered;
};
