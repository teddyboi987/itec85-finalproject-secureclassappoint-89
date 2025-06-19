
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

interface AppointmentStatsProps {
  appointments: DatabaseAppointment[];
  refreshKey?: number; // Add this to force re-render when needed
}

const AppointmentStats: React.FC<AppointmentStatsProps> = ({ appointments, refreshKey }) => {
  // Use useMemo to recalculate stats when appointments or refreshKey changes
  const stats = useMemo(() => {
    const totalAppointments = appointments.length;
    const pendingCount = appointments.filter(a => a.status === 'pending').length;
    const approvedCount = appointments.filter(a => a.status === 'approved').length;
    const rejectedCount = appointments.filter(a => a.status === 'rejected').length;

    return {
      total: totalAppointments,
      pending: pendingCount,
      approved: approvedCount,
      rejected: rejectedCount
    };
  }, [appointments, refreshKey]);

  return (
    <Card className="cvsu-card bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-primary">Appointment Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <span>Total Appointments:</span>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {stats.total}
          </Badge>
        </div>
        <div className="flex justify-between">
          <span>Pending:</span>
          <Badge className="bg-yellow-600">
            {stats.pending}
          </Badge>
        </div>
        <div className="flex justify-between">
          <span>Approved:</span>
          <Badge className="bg-green-600">
            {stats.approved}
          </Badge>
        </div>
        <div className="flex justify-between">
          <span>Rejected:</span>
          <Badge className="bg-red-600">
            {stats.rejected}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentStats;
