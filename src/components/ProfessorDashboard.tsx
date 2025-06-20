
import React from 'react';
import { BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useProfessorAppointments } from '@/hooks/useProfessorAppointments';
import ProfessorStatsCards from './professor/ProfessorStatsCards';
import AppointmentRequestsContainer from './professor/AppointmentRequestsContainer';

const ProfessorDashboard: React.FC = () => {
  const { profile } = useSupabaseAuth();
  const { appointments, isLoading, updateAppointmentStatus } = useProfessorAppointments(profile?.subject);

  const handleAppointmentAction = async (appointmentId: string, action: 'approved' | 'rejected') => {
    return await updateAppointmentStatus(appointmentId, action);
  };

  const professorSubject = profile?.subject || '';

  console.log('🏛️ PROFESSOR DASHBOARD RENDER:');
  console.log('👤 Profile:', profile);
  console.log('📚 Professor Subject:', professorSubject);
  console.log('📊 Total appointments:', appointments.length);
  console.log('🔄 Loading state:', isLoading);
  console.log('📋 Appointments data:', appointments);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!professorSubject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 flex items-center justify-center">
        <Card className="cvsu-card">
          <CardContent className="p-8 text-center">
            <BookOpen className="h-16 w-16 text-primary/40 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-primary mb-2">No Subject Assigned</h2>
            <p className="text-muted-foreground">Please contact the administrator to assign a subject to your account.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="cvsu-gradient p-2 rounded-full">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-primary">Professor Dashboard</h2>
          </div>
          <p className="text-muted-foreground">
            Subject: <span className="font-semibold text-primary">{professorSubject}</span> | 
            Manage your student consultations
          </p>
          <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-700">
            Debug: Found {appointments.length} appointments for "{professorSubject}"
          </div>
        </div>

        <ProfessorStatsCards appointments={appointments} />
        
        <AppointmentRequestsContainer 
          appointments={appointments}
          professorSubject={professorSubject}
          onAppointmentAction={handleAppointmentAction}
        />
      </div>
    </div>
  );
};

export default ProfessorDashboard;
