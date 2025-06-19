
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
      { id: '0302f7da-0d95-4142-a0b4-367e5e99a82f', name: 'tedd hernandez', email: 'main.orchard.hernandez@cvsu.edu.ph', role: 'student' },
      { id: 'fcf71e45-380a-4b2c-bde1-51f48e2303d9', name: 'Jane Student', email: 'jane@cvsu.edu.ph', role: 'student' },
      { id: '579e259b-1218-44e9-b6f4-3f0c14e50b00', name: 'Admin User', email: 'admin@cvsu.edu.ph', role: 'admin' },
      { id: 'c4388413-d27e-4848-b60b-0a1ec155264b', name: 'Prof. Santos', email: 'santos@cvsu.edu.ph', role: 'professor', subject: 'Programming' },
      { id: 'ef673dfd-50ae-4660-baed-fb4de9eb1e24', name: 'Prof. Reyes', email: 'reyes@cvsu.edu.ph', role: 'professor', subject: 'Data Structures' },
      { id: '0bc8748d-89e7-4953-8000-961a2b0bf735', name: 'Prof. Cruz', email: 'cruz@cvsu.edu.ph', role: 'professor', subject: 'Web Development' },
      { id: 'c5bb15fb-3f62-4c8f-95f1-772277fba2f5', name: 'Prof. Dela pena', email: 'delapena@cvsu.edu.ph', role: 'professor', subject: 'Computer Networks' },
      { id: '6db15d63-4ac6-4ec4-baaa-40c14c349634', name: 'Prof. Garcia', email: 'garcia@cvsu.edu.ph', role: 'professor', subject: 'Operating Systems' },
      { id: '99cc1f0d-0324-4a4a-be0a-e18990139606', name: 'Prof. Ramos', email: 'ramos@cvsu.edu.ph', role: 'professor', subject: 'Cybersecurity' },
      { id: 'a9979f6f-9bec-45eb-a1d3-5b2320b2263e', name: 'Prof. Lim', email: 'lim@cvsu.edu.ph', role: 'professor', subject: 'Algorithms' },
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
