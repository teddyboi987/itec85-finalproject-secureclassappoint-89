
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, CheckCircle, XCircle } from 'lucide-react';
import { DatabaseAppointment } from '@/types/appointment';

interface AppointmentRequestCardProps {
  appointment: DatabaseAppointment;
  onApprove: (appointmentId: string) => void;
  onReject: (appointmentId: string) => void;
  isProcessing?: boolean;
}

const AppointmentRequestCard: React.FC<AppointmentRequestCardProps> = ({
  appointment,
  onApprove,
  onReject,
  isProcessing = false
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending Review</Badge>;
    }
  };

  return (
    <Card className="cvsu-card mb-4 bg-white shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold text-primary flex items-center gap-2">
              <User className="h-5 w-5" />
              {appointment.student_profile?.name || 'Unknown Student'}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Subject: <span className="font-medium">{appointment.subject}</span>
            </p>
          </div>
          {getStatusBadge(appointment.status)}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{appointment.date}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{appointment.time}</span>
          </div>
        </div>

        {appointment.status === 'pending' && (
          <div className="flex gap-3 pt-3 border-t">
            <Button
              onClick={() => onApprove(appointment.id)}
              disabled={isProcessing}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>
            <Button
              onClick={() => onReject(appointment.id)}
              disabled={isProcessing}
              variant="destructive"
              className="flex-1"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
          </div>
        )}

        {appointment.status !== 'pending' && (
          <div className="pt-3 border-t">
            <p className="text-sm text-muted-foreground">
              This consultation request has been {appointment.status}.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AppointmentRequestCard;
