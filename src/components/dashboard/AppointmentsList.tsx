
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, BookOpen, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  onAppointmentDeleted?: () => void;
}

const AppointmentsList: React.FC<AppointmentsListProps> = ({ appointments, onAppointmentDeleted }) => {
  const { toast } = useToast();
  const [localAppointments, setLocalAppointments] = useState(appointments);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  // Update local state when appointments prop changes
  React.useEffect(() => {
    setLocalAppointments(appointments);
  }, [appointments]);

  const handleDeleteAppointment = async (appointmentId: string) => {
    setDeletingIds(prev => new Set(prev).add(appointmentId));
    
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', appointmentId);

      if (error) {
        console.error('Error deleting appointment:', error);
        toast({
          title: "Error",
          description: "Failed to delete appointment",
          variant: "destructive",
        });
        return;
      }

      // Remove from local state immediately for instant UI feedback
      setLocalAppointments(prev => prev.filter(apt => apt.id !== appointmentId));

      toast({
        title: "Success",
        description: "Appointment request deleted successfully",
      });

      // Also call the parent callback to refresh data
      if (onAppointmentDeleted) {
        onAppointmentDeleted();
      }
    } catch (err) {
      console.error('Unexpected error deleting appointment:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(appointmentId);
        return newSet;
      });
    }
  };

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
        {localAppointments.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-primary/40 mx-auto mb-4" />
            <p className="text-muted-foreground py-4">
              No appointments yet. Click "Book New Appointment" to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {localAppointments.map((appointment) => (
              <div key={appointment.id} className="border border-primary/20 rounded-lg p-4 bg-white">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
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
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(appointment.status)}>
                      {appointment.status}
                    </Badge>
                    {appointment.status === 'pending' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteAppointment(appointment.id)}
                        disabled={deletingIds.has(appointment.id)}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        {deletingIds.has(appointment.id) ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
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
