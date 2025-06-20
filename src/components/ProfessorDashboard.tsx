
import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useProfessorAppointments } from '@/hooks/useProfessorAppointments';
import ProfessorStatsCards from './professor/ProfessorStatsCards';
import PendingAppointments from './professor/PendingAppointments';
import AllAppointments from './professor/AllAppointments';

const ProfessorDashboard: React.FC = () => {
  const { profile } = useSupabaseAuth();
  const { appointments, isLoading, updateAppointmentStatus, refetchAppointments } = useProfessorAppointments(profile?.subject);

  const handleAppointmentAction = async (appointmentId: string, action: 'approved' | 'rejected') => {
    const success = await updateAppointmentStatus(appointmentId, action);
    if (success) {
      // Refresh appointments to ensure stats are updated
      refetchAppointments();
    }
  };

  const professorSubject = profile?.subject || '';
  const pendingAppointments = appointments.filter(a => a.status === 'pending');

  console.log('🏛️ === PROFESSOR DASHBOARD DEBUG ===');
  console.log('👤 Profile:', profile);
  console.log('📚 Professor subject:', professorSubject);
  console.log('📊 All appointments count:', appointments.length);
  console.log('⏳ Pending appointments count:', pendingAppointments.length);
  console.log('⚡ Is loading:', isLoading);
  console.log('📋 All appointments:', appointments);
  console.log('⏳ Pending appointments:', pendingAppointments);
  console.log('🏛️ === END PROFESSOR DASHBOARD DEBUG ===');

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
          <div className="text-xs text-muted-foreground mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="font-semibold text-blue-800 mb-1">🔍 Debug Information:</p>
            <p>📊 Found {appointments.length} total appointments, {pendingAppointments.length} pending</p>
            <p>👤 Profile loaded: {profile ? 'Yes' : 'No'}</p>
            <p>⚡ Loading: {isLoading ? 'Yes' : 'No'}</p>
            <p>📚 Looking for appointments matching subject: "{professorSubject}"</p>
            {appointments.length > 0 && (
              <div className="mt-2">
                <p className="font-semibold text-blue-700">📋 Found appointments:</p>
                {appointments.map((apt, i) => (
                  <p key={apt.id} className="ml-2 text-blue-600">
                    {i + 1}. Subject: "{apt.subject}" | Status: {apt.status} | Student: {apt.student_profile?.name || 'Unknown'}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        <ProfessorStatsCards appointments={appointments} />
        
        <PendingAppointments 
          pendingAppointments={pendingAppointments}
          professorSubject={professorSubject}
          onAppointmentAction={handleAppointmentAction}
        />

        <AllAppointments 
          appointments={appointments}
          professorSubject={professorSubject}
          onAppointmentAction={handleAppointmentAction}
        />
      </div>
    </div>
  );
};

export default ProfessorDashboard;
