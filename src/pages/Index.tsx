
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';
import Header from '@/components/Header';
import StudentDashboard from '@/components/StudentDashboard';
import ProfessorDashboard from '@/components/ProfessorDashboard';
import AdminDashboard from '@/components/AdminDashboard';

const Index = () => {
  const { user } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  const renderDashboard = () => {
    switch (user?.role) {
      case 'student':
        return <StudentDashboard />;
      case 'professor':
        return <ProfessorDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {user && <Header />}
      
      {!user ? (
        <div className="min-h-screen flex items-center justify-center p-4">
          {showRegister ? (
            <RegisterForm onSwitchToLogin={() => setShowRegister(false)} />
          ) : (
            <LoginForm onSwitchToRegister={() => setShowRegister(true)} />
          )}
        </div>
      ) : (
        renderDashboard()
      )}
    </div>
  );
};

export default Index;
