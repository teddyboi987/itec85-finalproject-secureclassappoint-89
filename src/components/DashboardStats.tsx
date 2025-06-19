
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, BookOpen, GraduationCap } from 'lucide-react';
import { User } from '@/types/auth';

interface DashboardStatsProps {
  users: User[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ users }) => {
  const studentCount = users.filter(u => u.role === 'student').length;
  const professorCount = users.filter(u => u.role === 'professor').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="cvsu-card bg-white/80 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold text-primary">{users.length}</p>
            </div>
            <Users className="h-8 w-8 text-primary/60" />
          </div>
        </CardContent>
      </Card>

      <Card className="cvsu-card bg-white/80 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Students</p>
              <p className="text-2xl font-bold text-blue-600">{studentCount}</p>
            </div>
            <GraduationCap className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="cvsu-card bg-white/80 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Professors</p>
              <p className="text-2xl font-bold text-primary">{professorCount}</p>
            </div>
            <BookOpen className="h-8 w-8 text-primary/60" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
