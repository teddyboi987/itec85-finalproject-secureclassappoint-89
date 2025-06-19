
import React from 'react';
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
}

const AppointmentStats: React.FC<AppointmentStatsProps> = ({ appointments }) => {
  // Ensure we have a valid array and calculate stats in real-time
  const validAppointments = appointments || [];
  
  const totalAppointments = validAppointments.length;
  const pendingCount = validAppointments.filter(a => a.status === 'pending').length;
  const approvedCount = validAppointments.filter(a => a.status === 'approved').length;
  const rejectedCount = validAppointments.filter(a => a.status === 'rejected').length;

  console.log('AppointmentStats - Real-time update:', { 
    total: totalAppointments, 
    pending: pendingCount, 
    approved: approvedCount, 
    rejected: rejectedCount,
    appointmentsLength: validAppointments.length
  });

  return (
    <Card className="cvsu-card bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-primary">Appointment Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <span>Total Appointments:</span>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {totalAppointments}
          </Badge>
        </div>
        <div className="flex justify-between">
          <span>Pending:</span>
          <Badge className="bg-yellow-600">
            {pendingCount}
          </Badge>
        </div>
        <div className="flex justify-between">
          <span>Approved:</span>
          <Badge className="bg-green-600">
            {approvedCount}
          </Badge>
        </div>
        <div className="flex justify-between">
          <span>Rejected:</span>
          <Badge className="bg-red-600">
            {rejectedCount}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentStats;
