
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, BookOpen, Plus, GraduationCap } from 'lucide-react';
import BookAppointmentForm from './BookAppointmentForm';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { professors } from '@/data/subjects';

interface DatabaseAppointment {
  id: string;
  student_id: string;
  professor_id: string;
  subject: string;
  date: string;
  time: string;
  status: string;
  created_at: string;
}

const StudentDashboard: React.FC = () => {
  const { user } = useSupabaseAuth();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [appointments, setAppointments] = useState<DatabaseAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAppointments = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('student_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching appointments:', error);
        return;
      }

      console.log('Fetched appointments:', data);
      setAppointments(data || []);
    } catch (err) {
      console.error('Unexpected error fetching appointments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const handleBookingSuccess = () => {
    setShowBookingForm(false);
    fetchAppointments(); // Refresh the appointments list
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-600 hover:bg-green-700';
      case 'rejected': return 'bg-red-600 hover:bg-red-700';
      default: return 'bg-yellow-600 hover:bg-yellow-700';
    }
  };

  const getProfessorName = (professorId: string) => {
    const professor = professors.find(p => p.id === professorId);
    return professor ? professor.name : 'Unknown Professor';
  };

  const getRecentActivity = () => {
    if (appointments.length === 0) return 'No appointment requests yet';
    
    const mostRecent = appointments[0];
    const createdDate = new Date(mostRecent.created_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return `Requested ${mostRecent.subject} appointment today`;
    } else if (diffDays <= 7) {
      return `Requested ${mostRecent.subject} appointment ${diffDays} days ago`;
    } else {
      return `Last appointment request: ${createdDate.toLocaleDateString()}`;
    }
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
          {/* Quick Actions */}
          <Card className="cvsu-card bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-primary">
                <Plus className="h-5 w-5" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setShowBookingForm(true)}
                className="w-full cvsu-gradient"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Book New Appointment
              </Button>
            </CardContent>
          </Card>

          {/* Appointment Stats */}
          <Card className="cvsu-card bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-primary">Appointment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Total Appointments:</span>
                <Badge variant="secondary" className="bg-primary/10 text-primary">{appointments.length}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Pending:</span>
                <Badge className="bg-yellow-600">{appointments.filter(a => a.status === 'pending').length}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Approved:</span>
                <Badge className="bg-green-600">{appointments.filter(a => a.status === 'approved').length}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="cvsu-card bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-primary">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {getRecentActivity()}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Appointments List */}
        <Card className="cvsu-card mt-6 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-primary">My Appointments</CardTitle>
            <CardDescription>View and manage your appointment requests</CardDescription>
          </CardHeader>
          <CardContent>
            {appointments.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-primary/40 mx-auto mb-4" />
                <p className="text-muted-foreground py-4">
                  No appointments yet. Click "Book New Appointment" to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="border border-primary/20 rounded-lg p-4 bg-white">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-primary">{appointment.subject}</h3>
                        <p className="text-sm text-muted-foreground">
                          Professor: {getProfessorName(appointment.professor_id)}
                        </p>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{appointment.date}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{appointment.time}</span>
                          </div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

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
