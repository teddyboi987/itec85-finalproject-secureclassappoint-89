
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

const ProfessorAccountManager: React.FC = () => {
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

  const createProfessorAccount = async (prof: typeof professorData[0]) => {
    try {
      // Check if professor already exists
      const existingProf = existingProfessors.find(p => p.email === prof.email);
      if (existingProf) {
        return { success: false, message: 'Already exists' };
      }

      // Create the profile directly in the database
      const { data: insertData, error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: crypto.randomUUID(),
          name: prof.name,
          email: prof.email,
          role: 'professor',
          subject: prof.subject
        })
        .select()
        .single();

      if (insertError) {
        console.error(`Error creating profile for ${prof.name}:`, insertError);
        return { success: false, message: `Profile creation error - ${insertError.message}` };
      }

      // Try to create auth user (this might fail due to email rate limits, but profile creation should still work)
      const { error: signUpError } = await supabase.auth.signUp({
        email: prof.email,
        password: 'prof123',
        options: {
          data: {
            name: prof.name
          }
        }
      });

      if (signUpError && !signUpError.message.includes('rate limit')) {
        console.error(`Auth error for ${prof.name}:`, signUpError);
        // Don't fail completely, as the profile was created
      }

      return { success: true, message: 'Created successfully' };
    } catch (err) {
      console.error(`Error creating professor ${prof.name}:`, err);
      return { success: false, message: 'Unexpected error' };
    }
  };

  const createProfessorAccounts = async () => {
    if (profile?.role !== 'admin') {
      setError('Only administrators can create professor accounts');
      return;
    }

    setIsCreating(true);
    setError('');
    setMessage('');

    try {
      let successCount = 0;
      let errorCount = 0;
      const results: string[] = [];

      for (const prof of professorData) {
        const result = await createProfessorAccount(prof);
        
        if (result.success) {
          successCount++;
          results.push(`${prof.name}: ${result.message}`);
        } else {
          errorCount++;
          results.push(`${prof.name}: ${result.message}`);
        }
      }

      setMessage(`Professor accounts creation completed.\nSuccess: ${successCount}, Errors: ${errorCount}\n\nDetails:\n${results.join('\n')}`);
      
      // Show toast notification
      toast({
        title: "Professor Creation Complete",
        description: `${successCount} professors created successfully`,
      });
      
      // Refresh the list
      await fetchExistingProfessors();
      
    } catch (err) {
      setError('Failed to create professor accounts');
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to create professor accounts",
        variant: "destructive",
      });
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
          <CardTitle className="text-primary">Professor Account Management</CardTitle>
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
            <h4 className="font-semibold">Professors to create:</h4>
            <ul className="text-sm space-y-1">
              {professorData.map((prof, index) => {
                const exists = existingProfessors.find(p => p.email === prof.email);
                return (
                  <li key={index} className="flex justify-between items-center">
                    <span className={exists ? 'text-green-600' : ''}>{prof.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-muted-foreground">{prof.subject}</span>
                      {exists && <span className="text-xs text-green-600 font-medium">EXISTS</span>}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <Button 
            onClick={createProfessorAccounts}
            disabled={isCreating}
            className="w-full cvsu-gradient"
          >
            {isCreating ? 'Creating Accounts...' : 'Create All Professor Accounts'}
          </Button>

          <p className="text-xs text-muted-foreground">
            Default password for all professors: prof123<br/>
            Note: Professors will be created in the database immediately. Email confirmation may be required for full access.
          </p>
        </CardContent>
      </Card>

      {/* Existing Professors List */}
      <Card className="cvsu-card bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-primary">Existing Professor Accounts ({existingProfessors.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {existingProfessors.length === 0 ? (
            <p className="text-muted-foreground">No professor accounts found in database.</p>
          ) : (
            <div className="space-y-2">
              {existingProfessors.map((prof) => (
                <div key={prof.id} className="flex justify-between items-center p-3 border border-primary/20 rounded-lg bg-white">
                  <div>
                    <h4 className="font-medium text-primary">{prof.name}</h4>
                    <p className="text-sm text-muted-foreground">{prof.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{prof.subject}</p>
                    <p className="text-xs text-muted-foreground">ID: {prof.id.slice(0, 8)}...</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfessorAccountManager;
