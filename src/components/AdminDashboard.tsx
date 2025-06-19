
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import DashboardStats from './DashboardStats';
import UsersList from './UsersList';
import SubjectsList from './SubjectsList';
import ProfessorAccountManager from './ProfessorAccountManager';

interface DatabaseUser {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'professor' | 'admin';
  subject?: string;
}

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<DatabaseUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        return;
      }

      console.log('Fetched users from database:', data);
      setUsers(data || []);
    } catch (err) {
      console.error('Unexpected error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

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
            <ProfessorAccountManager onProfessorsCreated={fetchUsers} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
