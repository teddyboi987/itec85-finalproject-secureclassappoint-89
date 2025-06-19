
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users data (in real app, this would come from backend)
const mockUsers: (User & { password: string })[] = [
  { id: '1', name: 'John Student', email: 'student@test.com', password: 'student123', role: 'student' },
  { id: '2', name: 'Dr. Smith', email: 'professor@test.com', password: 'professor123', role: 'professor' },
  { id: '3', name: 'Admin User', email: 'admin@test.com', password: 'admin123', role: 'admin' },
  { id: '4', name: 'Jane Student', email: 'jane@test.com', password: 'jane123', role: 'student' },
  { id: '5', name: 'Prof. Johnson', email: 'johnson@test.com', password: 'johnson123', role: 'professor' },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('secureclass_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const userWithoutPassword = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role
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
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      setIsLoading(false);
      return false;
    }
    
    // Create new user (only students can register)
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
