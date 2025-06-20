
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

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

interface PendingAppointmentsProps {
  pendingAppointments: import('@/types/appointment').DatabaseAppointment[];
  professorSubject: string;
  onAppointmentAction: (appointmentId: string, action: 'approved' | 'rejected') => void;
}

const PendingAppointments: React.FC<PendingAppointmentsProps> = ({
  pendingAppointments,
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

  console.log('PendingAppointments - Rendering with appointments:', pendingAppointments);
  console.log('PendingAppointments - Professor subject:', professorSubject);

  if (pendingAppointments.length === 0) {
    return (
      <Card className="cvsu-card mb-6 bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-primary">
            <AlertCircle className="h-5 w-5 text-green-600" />
            <span>Consultation Requests for {professorSubject}</span>
          </CardTitle>
          <CardDescription>Review and respond to student consultation requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-primary/40 mx-auto mb-4" />
            <p className="text-muted-foreground">
              No pending consultation requests at the moment.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Debug: Looking for appointments containing "{professorSubject}"
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="cvsu-card mb-6 bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-primary">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <span>Consultation Requests for {professorSubject}</span>
        </CardTitle>
        <CardDescription>Review and respond to student consultation requests</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendingAppointments.map((appointment) => (
            <div key={appointment.id} className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-primary">{appointment.subject}</h3>
                    <Badge className={getStatusColor(appointment.status)}>
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
                <div className="flex space-x-2 ml-4">
                  <Button
                    size="sm"
                    onClick={() => onAppointmentAction(appointment.id, 'approved')}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onAppointmentAction(appointment.id, 'rejected')}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PendingAppointments;
