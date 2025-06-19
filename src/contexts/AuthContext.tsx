
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '@/types/auth';
import { professors } from '@/data/subjects';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users data with proper professor subjects
const mockUsers: (User & { password: string })[] = [
  { id: '1', name: 'John Student', email: 'student@cvsu.edu.ph', password: 'student123', role: 'student' },
  { id: '2', name: 'Prof. Santos', email: 'santos@cvsu.edu.ph', password: 'prof123', role: 'professor', subject: 'Programming' },
  { id: '3', name: 'Admin User', email: 'admin@cvsu.edu.ph', password: 'admin123', role: 'admin' },
  { id: '4', name: 'Jane Student', email: 'jane@cvsu.edu.ph', password: 'jane123', role: 'student' },
  { id: '5', name: 'Prof. Reyes', email: 'reyes@cvsu.edu.ph', password: 'prof123', role: 'professor', subject: 'Data Structures' },
  { id: '6', name: 'Prof. Cruz', email: 'cruz@cvsu.edu.ph', password: 'prof123', role: 'professor', subject: 'Web Development' },
  { id: '7', name: 'Prof. Dela Peña', email: 'delapena@cvsu.edu.ph', password: 'prof123', role: 'professor', subject: 'Computer Networks' },
  { id: '8', name: 'Prof. Garcia', email: 'garcia@cvsu.edu.ph', password: 'prof123', role: 'professor', subject: 'Operating Systems' },
  { id: '9', name: 'Prof. Ramos', email: 'ramos@cvsu.edu.ph', password: 'prof123', role: 'professor', subject: 'Cybersecurity' },
  { id: '10', name: 'Prof. Lim', email: 'lim@cvsu.edu.ph', password: 'prof123', role: 'professor', subject: 'Algorithms' },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('secureclass_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const userWithoutPassword = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        subject: foundUser.subject
      };
      setUser(userWithoutPassword);
      localStorage.setItem('secureclass_user', JSON.stringify(userWithoutPassword));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      setIsLoading(false);
      return false;
    }
    
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role: 'student'
    };
    
    mockUsers.push({ ...newUser, password });
    setUser(newUser);
    localStorage.setItem('secureclass_user', JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('secureclass_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
