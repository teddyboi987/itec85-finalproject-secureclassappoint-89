
import { Subject, Professor } from '@/types/auth';

export const professors: Professor[] = [
  { id: '2', name: 'Prof. Santos', subject: 'Programming' },
  { id: '5', name: 'Prof. Reyes', subject: 'Data Structures' },
  { id: '6', name: 'Prof. Cruz', subject: 'Web Development' },
  { id: '7', name: 'Prof. Dela Peña', subject: 'Computer Networks' },
  { id: '8', name: 'Prof. Garcia', subject: 'Operating Systems' },
  { id: '9', name: 'Prof. Ramos', subject: 'Cybersecurity' },
  { id: '10', name: 'Prof. Lim', subject: 'Algorithms' },
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
