
import { DatabaseAppointment } from '@/types/appointment';

export const filterAppointmentsBySubject = (
  appointments: DatabaseAppointment[],
  professorSubject: string
): DatabaseAppointment[] => {
  if (!professorSubject) {
    console.log('❌ No professor subject provided for filtering');
    return [];
  }

  console.log('🔍 FILTERING APPOINTMENTS:');
  console.log(`   👨‍🏫 Professor subject: "${professorSubject}"`);
  console.log(`   📊 Total appointments to filter: ${appointments.length}`);

  if (appointments.length === 0) {
    console.log('   ⚠️  No appointments to filter');
    return [];
  }

  // Log all appointment subjects first
  console.log('   📝 All appointment subjects in database:');
  appointments.forEach((apt, index) => {
    console.log(`      ${index + 1}. "${apt.subject}" (Status: ${apt.status})`);
  });

  const filteredAppointments = appointments.filter(appointment => {
    const appointmentSubject = appointment.subject?.toLowerCase().trim() || '';
    const professorSubjectLower = professorSubject.toLowerCase().trim();
    
    console.log(`\n🔎 Checking appointment ID: ${appointment.id}`);
    console.log(`   📝 Appointment subject: "${appointment.subject}"`);
    console.log(`   📝 Appointment subject (cleaned): "${appointmentSubject}"`);
    console.log(`   👨‍🏫 Professor subject (cleaned): "${professorSubjectLower}"`);
    
    // Strategy 1: Exact match (case-insensitive)
    const exactMatch = appointmentSubject === professorSubjectLower;
    console.log(`   ✅ Exact match: ${exactMatch}`);
    
    // Strategy 2: Professor subject contains appointment subject
    const professorContainsAppointment = professorSubjectLower.includes(appointmentSubject) && appointmentSubject.length > 0;
    console.log(`   📍 Professor contains appointment: ${professorContainsAppointment}`);
    
    // Strategy 3: Appointment subject contains professor subject  
    const appointmentContainsProfessor = appointmentSubject.includes(professorSubjectLower) && professorSubjectLower.length > 0;
    console.log(`   📍 Appointment contains professor: ${appointmentContainsProfessor}`);
    
    // Strategy 4: Starts with match
    const appointmentStartsWithProfessor = appointmentSubject.startsWith(professorSubjectLower);
    const professorStartsWithAppointment = professorSubjectLower.startsWith(appointmentSubject);
    console.log(`   🔤 Appointment starts with professor: ${appointmentStartsWithProfessor}`);
    console.log(`   🔤 Professor starts with appointment: ${professorStartsWithAppointment}`);
    
    // Strategy 5: Word-based matching for cases like "CS" vs "Computer Science"
    const professorWords = professorSubjectLower.split(/\s+/).filter(word => word.length > 1);
    const appointmentWords = appointmentSubject.split(/\s+/).filter(word => word.length > 1);
    
    const hasCommonWords = professorWords.some(pWord => 
      appointmentWords.some(aWord => 
        aWord.includes(pWord) || pWord.includes(aWord) ||
        aWord.toLowerCase() === pWord.toLowerCase()
      )
    );
    
    console.log(`   🔗 Professor words: [${professorWords.join(', ')}]`);
    console.log(`   🔗 Appointment words: [${appointmentWords.join(', ')}]`);
    console.log(`   🔗 Has common words: ${hasCommonWords}`);
    
    const matches = exactMatch || professorContainsAppointment || appointmentContainsProfessor || 
                   appointmentStartsWithProfessor || professorStartsWithAppointment || hasCommonWords;
    
    console.log(`   🎯 FINAL MATCH RESULT: ${matches}`);
    
    return matches;
  });

  console.log('\n🎯 FILTERING SUMMARY:');
  console.log(`   📊 Total appointments in DB: ${appointments.length}`);
  console.log(`   ✅ Matched appointments: ${filteredAppointments.length}`);
  
  if (filteredAppointments.length > 0) {
    console.log('   📋 Matched appointments:');
    filteredAppointments.forEach((apt, index) => {
      console.log(`      ${index + 1}. Subject: "${apt.subject}" | Status: "${apt.status}" | Student: "${apt.student_profile?.name || 'Unknown'}"`);
    });
  } else {
    console.log('   ❌ NO APPOINTMENTS MATCHED!');
    console.log('   🔍 This usually means:');
    console.log('   - Subject names don\'t match exactly');
    console.log('   - There might be extra spaces or different casing');
    console.log('   - The appointment might be for a different subject');
  }

  return filteredAppointments;
};
