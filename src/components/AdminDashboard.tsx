
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield } from 'lucide-react';
import { User } from '@/types/auth';
import DashboardStats from './DashboardStats';
import UsersList from './UsersList';
import SubjectsList from './SubjectsList';
import ProfessorAccountManager from './ProfessorAccountManager';

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

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

    setUsers(systemUsers);
  }, []);

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

        <DashboardStats users={users} />

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="users" className="data-[state=active]:bg-primary data-[state=active]:text-white">List of All Users</TabsTrigger>
            <TabsTrigger value="subjects" className="data-[state=active]:bg-primary data-[state=active]:text-white">Subjects</TabsTrigger>
            <TabsTrigger value="professors" className="data-[state=active]:bg-primary data-[state=active]:text-white">Create Professors</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <UsersList users={users} />
          </TabsContent>

          <TabsContent value="subjects">
            <SubjectsList />
          </TabsContent>

          <TabsContent value="professors">
            <ProfessorAccountManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
