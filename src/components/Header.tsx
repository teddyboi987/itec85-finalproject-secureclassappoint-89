
import React from 'react';
import { Button } from '@/components/ui/button';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { LogOut, User, GraduationCap } from 'lucide-react';

const Header: React.FC = () => {
  const { profile, signOut } = useSupabaseAuth();

  const getGreeting = () => {
    if (!profile) return '';
    
    switch (profile.role) {
      case 'student':
        return `Welcome, ${profile.name}`;
      case 'professor':
        return `Welcome, ${profile.name}`;
      case 'admin':
        return `Welcome, Admin ${profile.name}`;
      default:
        return `Welcome, ${profile.name}`;
    }
  };

  const getRoleDisplay = () => {
    if (!profile) return '';
    
    switch (profile.role) {
      case 'student':
        return 'Student';
      case 'professor':
        return `Professor - ${profile.subject || 'Various Subjects'}`;
      case 'admin':
        return 'Administrator';
      default:
        return profile.role;
    }
  };

  return (
    <header className="cvsu-gradient text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-full">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">SecureClass Appoint</h1>
            <p className="text-xs opacity-90">Cavite State University</p>
          </div>
          {profile && (
            <div className="ml-4 bg-white/10 px-3 py-1 rounded-full">
              <p className="text-sm">
                {getGreeting()}
                <span className="ml-1 text-xs opacity-75">
                  ({getRoleDisplay()})
                </span>
              </p>
            </div>
          )}
        </div>
        
        {profile && (
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full">
              <User className="h-4 w-4" />
              <span className="text-sm">{profile.email}</span>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={signOut}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
