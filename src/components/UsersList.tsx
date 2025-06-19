
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User } from '@/types/auth';

interface UsersListProps {
  users: User[];
}

const UsersList: React.FC<UsersListProps> = ({ users }) => {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-500 hover:bg-purple-600';
      case 'professor': return 'bg-primary hover:bg-primary/90';
      case 'student': return 'bg-blue-500 hover:bg-blue-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <Card className="cvsu-card bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-primary">List of All Users ({users.length})</CardTitle>
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
  );
};

export default UsersList;
