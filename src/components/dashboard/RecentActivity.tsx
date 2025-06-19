
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

interface RecentActivityProps {
  appointments: DatabaseAppointment[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ appointments }) => {
  const getRecentActivity = () => {
    if (appointments.length === 0) return 'No appointment requests yet';
    
    const mostRecent = appointments[0];
    const createdDate = new Date(mostRecent.created_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return `Requested appointment today`;
    } else if (diffDays <= 7) {
      return `Requested appointment ${diffDays} days ago`;
    } else {
      return `Last appointment request: ${createdDate.toLocaleDateString()}`;
    }
  };

  return (
    <Card className="cvsu-card bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-primary">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {getRecentActivity()}
        </p>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
