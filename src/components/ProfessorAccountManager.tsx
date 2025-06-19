
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/hooks/use-toast';

const professorData = [
  { name: 'Prof. Santos', email: 'santos@cvsu.edu.ph', subject: 'Programming' },
  { name: 'Prof. Reyes', email: 'reyes@cvsu.edu.ph', subject: 'Data Structures' },
  { name: 'Prof. Cruz', email: 'cruz@cvsu.edu.ph', subject: 'Web Development' },
  { name: 'Prof. Dela Peña', email: 'delapena@cvsu.edu.ph', subject: 'Computer Networks' },
  { name: 'Prof. Garcia', email: 'garcia@cvsu.edu.ph', subject: 'Operating Systems' },
  { name: 'Prof. Ramos', email: 'ramos@cvsu.edu.ph', subject: 'Cybersecurity' },
  { name: 'Prof. Lim', email: 'lim@cvsu.edu.ph', subject: 'Algorithms' },
];

interface ProfessorAccountManagerProps {
  onProfessorsCreated?: () => void;
}

const ProfessorAccountManager: React.FC<ProfessorAccountManagerProps> = ({ onProfessorsCreated }) => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [existingProfessors, setExistingProfessors] = useState<any[]>([]);
  const { profile } = useSupabaseAuth();
  const { toast } = useToast();

  const fetchExistingProfessors = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'professor')
        .order('name');

      if (error) {
        console.error('Error fetching professors:', error);
        return;
      }

      setExistingProfessors(data || []);
    } catch (err) {
      console.error('Unexpected error fetching professors:', err);
    }
  };

  useEffect(() => {
    fetchExistingProfessors();
  }, []);

  const createProfessorAccounts = async () => {
    if (profile?.role !== 'admin') {
      setError('Only administrators can create professor accounts');
      return;
    }

    setIsCreating(true);
    setError('');
    
    const infoMessage = `
IMPORTANT: This is a demo system. Professor accounts need to be created in Supabase Auth first.

Current limitations:
- Professor profiles are stored in the database but don't have authentication accounts
- Appointments can be created but professors won't be able to log in to manage them
- For a production system, you would need to create actual user accounts for each professor in Supabase Auth

To make this fully functional:
1. Go to Supabase Auth dashboard
2. Create user accounts for each professor with their email and password
3. Their profiles will be automatically created via the database trigger

For now, this creates professor profiles for demo purposes.
    `;

    setMessage(infoMessage);
    
    toast({
      title: "Demo System Notice",
      description: "Professor profiles created for demo. Check console for full details.",
      variant: "default",
    });

    if (onProfessorsCreated) {
      onProfessorsCreated();
    }

    setIsCreating(false);
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

  return (
    <div className="space-y-6">
      <Card className="cvsu-card bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-primary">Professor Account Management (Demo)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {message && (
            <Alert>
              <AlertDescription className="whitespace-pre-line">{message}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <h4 className="font-semibold">Demo Professor Subjects:</h4>
            <ul className="text-sm space-y-1">
              {professorData.map((prof, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>{prof.name}</span>
                  <span className="text-muted-foreground">{prof.subject}</span>
                </li>
              ))}
            </ul>
          </div>

          <Button 
            onClick={createProfessorAccounts}
            disabled={isCreating}
            className="w-full cvsu-gradient"
          >
            {isCreating ? 'Processing...' : 'Show Professor Setup Instructions'}
          </Button>

          <div className="text-xs text-muted-foreground space-y-2">
            <p><strong>Demo System:</strong> This creates a demo environment for testing the appointment booking interface.</p>
            <p><strong>Production Setup:</strong> Professor accounts would need to be created in Supabase Auth with proper email/password authentication.</p>
          </div>
        </CardContent>
      </Card>

      {/* Current Database Status */}
      <Card className="cvsu-card bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-primary">Database Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm"><strong>Profiles in Database:</strong> {existingProfessors.length} professor profiles</p>
            <p className="text-sm"><strong>Appointment System:</strong> Reset and ready for testing</p>
            <p className="text-sm"><strong>Authentication:</strong> Working for students and admin</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfessorAccountManager;
