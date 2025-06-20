
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DatabaseAppointment } from '@/types/appointment';

const ManualAppointmentManager: React.FC = () => {
  const [allAppointments, setAllAppointments] = useState<DatabaseAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const fetchAllAppointments = async () => {
    try {
      setIsLoading(true);
      console.log('🔍 Fetching ALL appointments for manual review');
      
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          student_profile:profiles!appointments_student_id_fkey(name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching appointments:', error);
        throw error;
      }

      console.log('📊 ALL APPOINTMENTS FETCHED:', data);
      setAllAppointments(data || []);
    } catch (err) {
      console.error('💥 Error in fetchAllAppointments:', err);
      toast({
        title: "Error",
        description: "Failed to fetch appointments",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, status: 'approved' | 'rejected') => {
    setProcessingIds(prev => new Set(prev).add(appointmentId));
    
    try {
      console.log(`🔄 Updating appointment ${appointmentId} to ${status}`);
      
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', appointmentId);

      if (error) {
        console.error('❌ Error updating appointment:', error);
        throw error;
      }

      // Update local state
      setAllAppointments(prev =>
        prev.map(appointment =>
          appointment.id === appointmentId
            ? { ...appointment, status }
            : appointment
        )
      );

      toast({
        title: "Success",
        description: `Appointment ${status} successfully`,
      });
    } catch (err) {
      console.error('💥 Error updating appointment:', err);
      toast({
        title: "Error",
        description: `Failed to ${status} appointment`,
        variant: "destructive",
      });
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(appointmentId);
        return newSet;
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
    }
  };

  useEffect(() => {
    fetchAllAppointments();
  }, []);

  return (
    <Card className="cvsu-card bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center space-x-2 text-primary">
            <User className="h-5 w-5" />
            <span>Manual Appointment Manager</span>
          </CardTitle>
          <Button
            onClick={fetchAllAppointments}
            disabled={isLoading}
            size="sm"
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground mt-2">Loading appointments...</p>
          </div>
        )}

        {!isLoading && allAppointments.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No appointments found in the system.</p>
          </div>
        )}

        {!isLoading && allAppointments.length > 0 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Showing all {allAppointments.length} appointments in the system. Review and manage them below:
            </p>
            
            {allAppointments.map((appointment) => (
              <div key={appointment.id} className="border rounded-lg p-4 bg-white shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-primary">{appointment.subject}</h3>
                      {getStatusBadge(appointment.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Student: {appointment.student_profile?.name || 'Unknown Student'}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{appointment.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{appointment.time}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      ID: {appointment.id}
                    </p>
                  </div>
                  
                  {appointment.status === 'pending' && (
                    <div className="flex space-x-2 ml-4">
                      <Button
                        size="sm"
                        onClick={() => updateAppointmentStatus(appointment.id, 'approved')}
                        disabled={processingIds.has(appointment.id)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => updateAppointmentStatus(appointment.id, 'rejected')}
                        disabled={processingIds.has(appointment.id)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ManualAppointmentManager;
