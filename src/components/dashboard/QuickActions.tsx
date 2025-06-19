
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Plus } from 'lucide-react';

interface QuickActionsProps {
  onBookAppointment: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onBookAppointment }) => {
  return (
    <Card className="cvsu-card bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-primary">
          <Plus className="h-5 w-5" />
          <span>Quick Actions</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={onBookAppointment}
          className="w-full cvsu-gradient"
        >
          <BookOpen className="mr-2 h-4 w-4" />
          Book New Appointment
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
