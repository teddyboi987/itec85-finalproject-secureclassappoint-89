
import { Subject, Professor } from '@/types/auth';

// Demo professor data - these would normally be real user accounts in Supabase Auth
export const professors: Professor[] = [
  { id: 'demo-1', name: 'Prof. Santos', subject: 'Programming' },
  { id: 'demo-2', name: 'Prof. Reyes', subject: 'Data Structures' },
  { id: 'demo-3', name: 'Prof. Cruz', subject: 'Web Development' },
  { id: 'demo-4', name: 'Prof. Dela Peña', subject: 'Computer Networks' },
  { id: 'demo-5', name: 'Prof. Garcia', subject: 'Operating Systems' },
  { id: 'demo-6', name: 'Prof. Ramos', subject: 'Cybersecurity' },
  { id: 'demo-7', name: 'Prof. Lim', subject: 'Algorithms' },
];

export const subjects: Subject[] = [
  { name: 'Programming', professor: professors.find(p => p.subject === 'Programming')! },
  { name: 'Data Structures', professor: professors.find(p => p.subject === 'Data Structures')! },
  { name: 'Web Development', professor: professors.find(p => p.subject === 'Web Development')! },
  { name: 'Computer Networks', professor: professors.find(p => p.subject === 'Computer Networks')! },
  { name: 'Operating Systems', professor: professors.find(p => p.subject === 'Operating Systems')! },
  { name: 'Cybersecurity', professor: professors.find(p => p.subject === 'Cybersecurity')! },
  { name: 'Algorithms', professor: professors.find(p => p.subject === 'Algorithms')! },
];

export const getProfessorBySubject = (subjectName: string): Professor | undefined => {
  return professors.find(p => p.subject === subjectName);
};

export const getSubjectsByProfessor = (professorId: string): string[] => {
  const professor = professors.find(p => p.id === professorId);
  return professor ? [professor.subject] : [];
};
