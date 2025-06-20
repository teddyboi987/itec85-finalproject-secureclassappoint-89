import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, BookOpen } from 'lucide-react';

interface DatabaseAppointment {
  id: string;
  student_id: string;
  professor_id: string;
  subject: string;
  date: string;
  time: string;
  status: string;
  created_at: string;
  student_profile?: {
    name: string;
  };
}

interface AllAppointmentsProps {
  appointments: import('@/types/appointment').DatabaseAppointment[];
  professorSubject: string;
  onAppointmentAction: (appointmentId: string, action: 'approved' | 'rejected') => void;
}

const AllAppointments: React.FC<AllAppointmentsProps> = ({
  appointments,
  professorSubject,
  onAppointmentAction
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-600 hover:bg-green-700';
      case 'rejected': return 'bg-red-600 hover:bg-red-700';
      default: return 'bg-yellow-600 hover:bg-yellow-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return CheckCircle;
      case 'rejected': return XCircle;
      default: return AlertCircle;
    }
  };

  return (
    <Card className="cvsu-card bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-primary">All {professorSubject} Consultations</CardTitle>
        <CardDescription>Complete history of student consultation requests for your subject</CardDescription>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-primary/40 mx-auto mb-4" />
            <p className="text-muted-foreground">
              No consultation requests for {professorSubject} yet.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Students can book consultations through the student portal.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => {
              const StatusIcon = getStatusIcon(appointment.status);
              return (
                <div key={appointment.id} className="border border-primary/20 rounded-lg p-4 bg-white">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-primary">{appointment.subject}</h3>
                        <Badge className={getStatusColor(appointment.status)}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {appointment.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Student: {appointment.student_profile?.name || 'Unknown Student'}
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
                    {appointment.status === 'pending' && (
                      <div className="flex space-x-2 ml-4">
                        <Button
                          size="sm"
                          onClick={() => onAppointmentAction(appointment.id, 'approved')}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Schedule
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => onAppointmentAction(appointment.id, 'rejected')}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Decline
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AllAppointments;
