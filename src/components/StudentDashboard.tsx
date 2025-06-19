
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, BookOpen, Plus, GraduationCap } from 'lucide-react';
import BookAppointmentForm from './BookAppointmentForm';
import { Appointment } from '@/types/auth';

const StudentDashboard: React.FC = () => {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      studentId: '1',  
      professorId: '2',
      studentName: 'John Student',
      professorName: 'Prof. Santos',
      subject: 'Programming',
      date: '2024-01-15',
      time: '10:00',
      status: 'pending'
    }
  ]);

  const handleBookingSuccess = (appointment: Appointment) => {
    setAppointments([...appointments, appointment]);
    setShowBookingForm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-600 hover:bg-green-700';
      case 'rejected': return 'bg-red-600 hover:bg-red-700';
      default: return 'bg-yellow-600 hover:bg-yellow-700';
    }
  };

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
                Last appointment request sent on {new Date().toLocaleDateString()}
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
                          Professor: {appointment.professorName}
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
