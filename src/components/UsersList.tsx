
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, GraduationCap, Shield, BookOpen } from 'lucide-react';
import { User as UserType } from '@/types/auth';

interface UsersListProps {
  users: UserType[];
}

const UsersList: React.FC<UsersListProps> = ({ users }) => {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4" />;
      case 'professor':
        return <BookOpen className="h-4 w-4" />;
      case 'student':
        return <GraduationCap className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-600 hover:bg-red-700';
      case 'professor':
        return 'bg-blue-600 hover:bg-blue-700';
      case 'student':
        return 'bg-green-600 hover:bg-green-700';
      default:
        return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  return (
    <Card className="cvsu-card bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-primary">All Users</CardTitle>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <div className="text-center py-8">
            <User className="h-12 w-12 text-primary/40 mx-auto mb-4" />
            <p className="text-muted-foreground">No users found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="border border-primary/20 rounded-lg p-4 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="cvsu-gradient p-2 rounded-full text-white">
                      {getRoleIcon(user.role)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      {user.role === 'professor' && user.subject && (
                        <p className="text-xs text-primary/70">{user.subject}</p>
                      )}
                    </div>
                  </div>
                  <Badge className={getRoleBadgeColor(user.role)}>
                    {user.role}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UsersList;
