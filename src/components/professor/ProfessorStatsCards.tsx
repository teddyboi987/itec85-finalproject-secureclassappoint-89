
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { User, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

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

interface ProfessorStatsCardsProps {
  appointments: DatabaseAppointment[];
}

const ProfessorStatsCards: React.FC<ProfessorStatsCardsProps> = ({ appointments }) => {
  console.log('ProfessorStatsCards - Computing stats for appointments:', appointments);
  
  const totalConsultations = appointments.length;
  const awaitingReview = appointments.filter(a => a.status === 'pending').length;
  const scheduled = appointments.filter(a => a.status === 'approved').length;
  const declined = appointments.filter(a => a.status === 'rejected').length;

  console.log('ProfessorStatsCards - Stats computed:', {
    total: totalConsultations,
    pending: awaitingReview,
    approved: scheduled,
    rejected: declined
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="cvsu-card bg-white/80 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Consultations</p>
              <p className="text-2xl font-bold text-primary">{totalConsultations}</p>
            </div>
            <User className="h-8 w-8 text-primary/60" />
          </div>
        </CardContent>
      </Card>

      <Card className="cvsu-card bg-white/80 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Awaiting Review</p>
              <p className="text-2xl font-bold text-yellow-600">{awaitingReview}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="cvsu-card bg-white/80 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Scheduled</p>
              <p className="text-2xl font-bold text-green-600">{scheduled}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="cvsu-card bg-white/80 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Declined</p>
              <p className="text-2xl font-bold text-red-600">{declined}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfessorStatsCards;
