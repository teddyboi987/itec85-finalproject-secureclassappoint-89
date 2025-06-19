
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, BookOpen, Plus } from 'lucide-react';
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
      professorName: 'Dr. Smith',
      subject: 'Mathematics',
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
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Student Dashboard</h2>
        <p className="text-muted-foreground">Manage your appointments with professors</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setShowBookingForm(true)}
              className="w-full"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Book New Appointment
            </Button>
          </CardContent>
        </Card>

        {/* Appointment Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Appointment Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Total Appointments:</span>
              <Badge variant="secondary">{appointments.length}</Badge>
            </div>
            <div className="flex justify-between">
              <span>Pending:</span>
              <Badge className="bg-yellow-500">{appointments.filter(a => a.status === 'pending').length}</Badge>
            </div>
            <div className="flex justify-between">
              <span>Approved:</span>
              <Badge className="bg-green-500">{appointments.filter(a => a.status === 'approved').length}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Last appointment request sent on {new Date().toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Appointments List */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>My Appointments</CardTitle>
          <CardDescription>View and manage your appointment requests</CardDescription>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No appointments yet. Click "Book New Appointment" to get started.
            </p>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h3 className="font-semibold">{appointment.subject}</h3>
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
          <div className="bg-background rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <BookAppointmentForm
              onSuccess={handleBookingSuccess}
              onCancel={() => setShowBookingForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
