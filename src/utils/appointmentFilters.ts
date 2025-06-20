
import { DatabaseAppointment } from '@/types/appointment';

export const filterAppointmentsBySubject = (
  appointments: DatabaseAppointment[],
  professorSubject: string
): DatabaseAppointment[] => {
  if (!professorSubject) {
    console.log('No professor subject provided for filtering');
    return [];
  }

  console.log('🔍 Filtering appointments for professor subject:', professorSubject);
  console.log('📊 Total appointments to filter:', appointments.length);

  const filteredAppointments = appointments.filter(appointment => {
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
  console.log(`   📊 Total appointments in DB: ${appointments.length}`);
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
    appointments.forEach((apt, index) => {
      console.log(`   ${index + 1}. "${apt.subject}"`);
    });
  }

  return filteredAppointments;
};
