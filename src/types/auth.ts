
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'professor' | 'admin';
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
