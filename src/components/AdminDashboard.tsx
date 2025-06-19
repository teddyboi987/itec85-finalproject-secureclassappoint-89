
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Calendar, BookOpen, TrendingUp, GraduationCap, Shield } from 'lucide-react';
import { User, Appointment } from '@/types/auth';
import { subjects } from '@/data/subjects';

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    // Initialize with current system users (this would come from your auth system)
    const systemUsers: User[] = [
      { id: '1', name: 'John Student', email: 'student@cvsu.edu.ph', role: 'student' },
      { id: '4', name: 'Jane Student', email: 'jane@cvsu.edu.ph', role: 'student' },
      { id: '3', name: 'Admin User', email: 'admin@cvsu.edu.ph', role: 'admin' },
      { id: '2', name: 'Prof. Santos', email: 'santos@cvsu.edu.ph', role: 'professor', subject: 'Programming' },
      { id: '5', name: 'Prof. Reyes', email: 'reyes@cvsu.edu.ph', role: 'professor', subject: 'Data Structures' },
      { id: '6', name: 'Prof. Cruz', email: 'cruz@cvsu.edu.ph', role: 'professor', subject: 'Web Development' },
      { id: '7', name: 'Prof. Dela Peña', email: 'delapena@cvsu.edu.ph', role: 'professor', subject: 'Computer Networks' },
      { id: '8', name: 'Prof. Garcia', email: 'garcia@cvsu.edu.ph', role: 'professor', subject: 'Operating Systems' },
      { id: '9', name: 'Prof. Ramos', email: 'ramos@cvsu.edu.ph', role: 'professor', subject: 'Cybersecurity' },
      { id: '10', name: 'Prof. Lim', email: 'lim@cvsu.edu.ph', role: 'professor', subject: 'Algorithms' },
    ];

    const systemAppointments: Appointment[] = [
      {
        id: '1',
        studentId: '1',
        professorId: '2',
        studentName: 'John Student',
        professorName: 'Prof. Santos',
        subject: 'Programming',
        date: '2024-12-20',
        time: '10:00',
        status: 'pending'
      },
      {
        id: '2',
        studentId: '4',
        professorId: '6',
        studentName: 'Jane Student',
        professorName: 'Prof. Cruz',
        subject: 'Web Development',
        date: '2024-12-21',
        time: '14:00',
        status: 'approved'
      },
      {
        id: '3',
        studentId: '1', 
        professorId: '10',
        studentName: 'John Student',
        professorName: 'Prof. Lim',
        subject: 'Algorithms',
        date: '2024-12-22',
        time: '09:00',
        status: 'rejected'
      }
    ];

    setUsers(systemUsers);
    setAppointments(systemAppointments);
  }, []);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-500 hover:bg-purple-600';
      case 'professor': return 'bg-primary hover:bg-primary/90';
      case 'student': return 'bg-blue-500 hover:bg-blue-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500 hover:bg-green-600';
      case 'rejected': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-yellow-500 hover:bg-yellow-600';
    }
  };

  const studentCount = users.filter(u => u.role === 'student').length;
  const professorCount = users.filter(u => u.role === 'professor').length;
  const adminCount = users.filter(u => u.role === 'admin').length;
  const pendingAppointments = appointments.filter(a => a.status === 'pending').length;
  const approvedAppointments = appointments.filter(a => a.status === 'approved').length;
  const rejectedAppointments = appointments.filter(a => a.status === 'rejected').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="cvsu-gradient p-2 rounded-full">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-primary">Admin Dashboard</h2>
          </div>
          <p className="text-muted-foreground">SecureClass Appoint - System overview and management</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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

          <Card className="cvsu-card bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Appointments</p>
                  <p className="text-2xl font-bold text-accent">{appointments.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-accent/80" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="users" className="data-[state=active]:bg-primary data-[state=active]:text-white">User Management</TabsTrigger>
            <TabsTrigger value="appointments" className="data-[state=active]:bg-primary data-[state=active]:text-white">Appointments</TabsTrigger>
            <TabsTrigger value="subjects" className="data-[state=active]:bg-primary data-[state=active]:text-white">Subjects</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="cvsu-card bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-primary">All Users ({users.length})</CardTitle>
                <CardDescription>Complete list of system users by role</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex justify-between items-center p-4 border border-primary/20 rounded-lg bg-white">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-primary">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        {user.subject && (
                          <p className="text-xs text-primary/70">Subject: {user.subject}</p>
                        )}
                      </div>
                      <Badge className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments">
            <div className="space-y-6">
              {/* Appointment Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="cvsu-card bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Pending</p>
                        <p className="text-2xl font-bold text-yellow-600">{pendingAppointments}</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-yellow-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="cvsu-card bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Approved</p>
                        <p className="text-2xl font-bold text-green-600">{approvedAppointments}</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="cvsu-card bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Completion Rate</p>
                        <p className="text-2xl font-bold text-primary">
                          {appointments.length > 0 ? Math.round((approvedAppointments / appointments.length) * 100) : 0}%
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-primary/60" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* All Appointments */}
              <Card className="cvsu-card bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-primary">All Appointments ({appointments.length})</CardTitle>
                  <CardDescription>Complete appointment history across all subjects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div key={appointment.id} className="border border-primary/20 rounded-lg p-4 bg-white">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold text-primary">{appointment.subject}</h3>
                              <Badge className={getStatusColor(appointment.status)}>
                                {appointment.status}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              <p>Student: {appointment.studentName}</p>
                              <p>Professor: {appointment.professorName}</p>
                            </div>
                            <div className="flex items-center space-x-4 text-sm">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{appointment.date}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <TrendingUp className="h-4 w-4" />
                                <span>{appointment.time}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="subjects">
            <Card className="cvsu-card bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-primary">Computer Science Subjects ({subjects.length})</CardTitle>
                <CardDescription>Available subjects and assigned professors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subjects.map((subject, index) => (
                    <div key={index} className="border border-primary/20 rounded-lg p-4 bg-white">
                      <h3 className="font-semibold text-primary mb-2">{subject.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Professor: {subject.professor.name}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
