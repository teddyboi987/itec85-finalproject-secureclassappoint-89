
import React, { useState } from 'react';
import { GraduationCap } from 'lucide-react';
import BookAppointmentForm from './BookAppointmentForm';
import QuickActions from './dashboard/QuickActions';
import AppointmentStats from './dashboard/AppointmentStats';
import RecentActivity from './dashboard/RecentActivity';
import AppointmentsList from './dashboard/AppointmentsList';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useAppointments } from '@/hooks/useAppointments';

const StudentDashboard: React.FC = () => {
  const { user } = useSupabaseAuth();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const { appointments, isLoading, refetchAppointments } = useAppointments(user?.id);

  const handleBookingSuccess = () => {
    setShowBookingForm(false);
    refetchAppointments();
  };

  const handleAppointmentDeleted = () => {
    refetchAppointments();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="cvsu-gradient p-2 rounded-full">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-primary">Student Dashboard</h2>
          </div>
          <p className="text-muted-foreground">Manage your appointments with CvSU professors</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <QuickActions onBookAppointment={() => setShowBookingForm(true)} />
          <AppointmentStats appointments={appointments} />
          <RecentActivity appointments={appointments} />
        </div>

        <AppointmentsList 
          appointments={appointments} 
          onAppointmentDeleted={handleAppointmentDeleted}
        />

        {/* Booking Form Modal */}
        {showBookingForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <BookAppointmentForm
                onSuccess={handleBookingSuccess}
                onCancel={() => setShowBookingForm(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
