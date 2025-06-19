
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, BookOpen } from 'lucide-react';

interface DatabaseAppointment {
  id: string;
  student_id: string;
  professor_id: string | null;
  subject: string;
  date: string;
  time: string;
  status: string;
  created_at: string;
}

interface AppointmentsListProps {
  appointments: DatabaseAppointment[];
}

const AppointmentsList: React.FC<AppointmentsListProps> = ({ appointments }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-600 hover:bg-green-700';
      case 'rejected': return 'bg-red-600 hover:bg-red-700';
      default: return 'bg-yellow-600 hover:bg-yellow-700';
    }
  };

  const extractProfessorName = (subject: string) => {
    // Extract professor name from subject string like "Mathematics (Prof. Dr. John Smith)"
    const match = subject.match(/\(Prof\. ([^)]+)\)/);
    return match ? match[1] : 'Unknown Professor';
  };

  return (
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
                      Professor: {extractProfessorName(appointment.subject)}
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
  );
};

export default AppointmentsList;
