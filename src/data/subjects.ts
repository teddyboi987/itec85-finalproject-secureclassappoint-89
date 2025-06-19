
import { Subject, Professor } from '@/types/auth';

// Real professor data that matches the database profiles
export const professors: Professor[] = [
  { id: 'prof-cruz', name: 'Prof. Cruz', subject: 'Mathematics' },
  { id: 'prof-delapena', name: 'Prof. Dela Pena', subject: 'Physics' },
  { id: 'prof-garcia', name: 'Prof. Garcia', subject: 'Chemistry' },
  { id: 'prof-lim', name: 'Prof. Lim', subject: 'Biology' },
  { id: 'prof-ramos', name: 'Prof. Ramos', subject: 'English' },
  { id: 'prof-reyes', name: 'Prof. Reyes', subject: 'History' },
  { id: 'prof-santos', name: 'Prof. Santos', subject: 'Computer Science' },
];

export const subjects: Subject[] = [
  { name: 'Mathematics', professor: professors.find(p => p.subject === 'Mathematics')! },
  { name: 'Physics', professor: professors.find(p => p.subject === 'Physics')! },
  { name: 'Chemistry', professor: professors.find(p => p.subject === 'Chemistry')! },
  { name: 'Biology', professor: professors.find(p => p.subject === 'Biology')! },
  { name: 'English', professor: professors.find(p => p.subject === 'English')! },
  { name: 'History', professor: professors.find(p => p.subject === 'History')! },
  { name: 'Computer Science', professor: professors.find(p => p.subject === 'Computer Science')! },
];

export const getProfessorBySubject = (subjectName: string): Professor | undefined => {
  return professors.find(p => p.subject === subjectName);
};

export const getSubjectsByProfessor = (professorId: string): string[] => {
  const professor = professors.find(p => p.id === professorId);
  return professor ? [professor.subject] : [];
};
