
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'professor' | 'admin';
  subject?: string; // For professors
}

export interface Professor {
  id: string;
  name: string;
  subject: string;
}

export interface Subject {
  name: string;
  professor: Professor;
}

export interface Appointment {
  id: string;
  studentId: string;
  professorId: string;
  studentName: string;
  professorName: string;
  subject: string;
  date: string;
  time: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}
