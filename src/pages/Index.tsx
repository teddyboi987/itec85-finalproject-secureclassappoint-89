
import React, { useState } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import AuthPage from '@/components/AuthPage';
import Header from '@/components/Header';
import StudentDashboard from '@/components/StudentDashboard';
import ProfessorDashboard from '@/components/ProfessorDashboard';
import AdminDashboard from '@/components/AdminDashboard';

const Index = () => {
  const { user, profile, isLoading } = useSupabaseAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const renderDashboard = () => {
    if (!profile) return null;
    
    switch (profile.role) {
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
      {user && profile && <Header />}
      
      {!user || !profile ? (
        <AuthPage />
      ) : (
        renderDashboard()
      )}
    </div>
  );
};

export default Index;
