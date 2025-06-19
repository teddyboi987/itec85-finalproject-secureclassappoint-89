
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/hooks/use-toast';
import { Shield, Users, CheckCircle } from 'lucide-react';

interface ProfessorAccountManagerProps {
  onProfessorsCreated?: () => void;
}

interface ApprovedProfessor {
  id: string;
  email: string;
  name: string;
  subject: string;
}

const ProfessorAccountManager: React.FC<ProfessorAccountManagerProps> = ({ onProfessorsCreated }) => {
  const [approvedProfessors, setApprovedProfessors] = useState<ApprovedProfessor[]>([]);
  const [registeredProfessors, setRegisteredProfessors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { profile } = useSupabaseAuth();
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      // Fetch approved professors
      const { data: approved, error: approvedError } = await supabase
        .from('approved_professors')
        .select('*')
        .order('name');

      if (approvedError) {
        console.error('Error fetching approved professors:', approvedError);
      } else {
        setApprovedProfessors(approved || []);
      }

      // Fetch registered professors
      const { data: registered, error: registeredError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'professor')
        .order('name');

      if (registeredError) {
        console.error('Error fetching registered professors:', registeredError);
      } else {
        setRegisteredProfessors(registered || []);
      }
    } catch (err) {
      console.error('Unexpected error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refreshData = async () => {
    setIsLoading(true);
    await fetchData();
    if (onProfessorsCreated) {
      onProfessorsCreated();
    }
    toast({
      title: "Refreshed",
      description: "Professor data has been updated.",
    });
  };

  if (profile?.role !== 'admin') {
    return (
      <Card className="cvsu-card bg-white/90 backdrop-blur-sm">
        <CardContent className="p-6">
          <p className="text-muted-foreground">Only administrators can access this feature.</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="cvsu-card bg-white/90 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading professor data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="cvsu-card bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-primary">
            <Shield className="h-5 w-5 text-blue-600" />
            <span>Professor Security System</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Only pre-approved professor emails can be assigned professor role. This ensures system security.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-semibold mb-2 flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Approved Professors ({approvedProfessors.length})</span>
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {approvedProfessors.map((prof) => {
                  const isRegistered = registeredProfessors.some(rp => rp.email === prof.email);
                  return (
                    <div key={prof.id} className={`p-2 rounded border ${isRegistered ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-medium">{prof.name}</span>
                          <p className="text-sm text-muted-foreground">{prof.email}</p>
                          <p className="text-xs text-blue-600">{prof.subject}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${isRegistered ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                          {isRegistered ? 'Registered' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">System Status</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Approved Professor Emails:</span>
                  <span className="font-medium">{approvedProfessors.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Registered Professors:</span>
                  <span className="font-medium">{registeredProfessors.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pending Registration:</span>
                  <span className="font-medium">{approvedProfessors.length - registeredProfessors.length}</span>
                </div>
              </div>
            </div>
          </div>

          <Button 
            onClick={refreshData}
            className="w-full cvsu-gradient"
          >
            Refresh Data
          </Button>

          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>Security:</strong> ✅ Only pre-approved emails can become professors</p>
            <p><strong>Registration:</strong> Professors must sign up with their approved @cvsu.edu.ph email</p>
            <p><strong>Auto-Assignment:</strong> ✅ Role and subject automatically assigned upon registration</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfessorAccountManager;
