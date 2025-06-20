
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, BookOpen } from 'lucide-react';
import { DatabaseAppointment } from '@/types/appointment';
import AppointmentRequestCard from './AppointmentRequestCard';

interface AppointmentRequestsContainerProps {
  appointments: DatabaseAppointment[];
  professorSubject: string;
  onAppointmentAction: (appointmentId: string, action: 'approved' | 'rejected') => Promise<boolean>;
}

const AppointmentRequestsContainer: React.FC<AppointmentRequestsContainerProps> = ({
  appointments,
  professorSubject,
  onAppointmentAction
}) => {
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  // Separate pending and processed appointments
  const pendingAppointments = appointments.filter(apt => apt.status === 'pending');
  const processedAppointments = appointments.filter(apt => apt.status !== 'pending');

  const handleAction = async (appointmentId: string, action: 'approved' | 'rejected') => {
    setProcessingIds(prev => new Set(prev).add(appointmentId));
    
    try {
      await onAppointmentAction(appointmentId, action);
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(appointmentId);
        return newSet;
      });
    }
  };

  if (appointments.length === 0) {
    return (
      <div className="space-y-6">
        <Card className="cvsu-card bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-primary">
              <BookOpen className="h-5 w-5" />
              <span>Consultation Requests - {professorSubject}</span>
            </CardTitle>
            <CardDescription>
              Review and manage student consultation requests for your subject
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <AlertCircle className="h-16 w-16 text-primary/40 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-primary mb-2">No Consultation Requests</h3>
              <p className="text-muted-foreground">
                When students book consultations for {professorSubject}, they will appear here for your review.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pending Requests Section */}
      {pendingAppointments.length > 0 && (
        <Card className="cvsu-card bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-primary">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <span>Pending Consultation Requests ({pendingAppointments.length})</span>
            </CardTitle>
            <CardDescription>
              These requests require your immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingAppointments.map((appointment) => (
                <AppointmentRequestCard
                  key={appointment.id}
                  appointment={appointment}
                  onApprove={(id) => handleAction(id, 'approved')}
                  onReject={(id) => handleAction(id, 'rejected')}
                  isProcessing={processingIds.has(appointment.id)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Processed Requests Section */}
      {processedAppointments.length > 0 && (
        <Card className="cvsu-card bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-primary">
              <BookOpen className="h-5 w-5" />
              <span>Processed Consultation Requests ({processedAppointments.length})</span>
            </CardTitle>
            <CardDescription>
              Previously reviewed consultation requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {processedAppointments.map((appointment) => (
                <AppointmentRequestCard
                  key={appointment.id}
                  appointment={appointment}
                  onApprove={() => {}}
                  onReject={() => {}}
                  isProcessing={false}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AppointmentRequestsContainer;
