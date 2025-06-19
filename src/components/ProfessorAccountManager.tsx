
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

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
  const { profile } = useSupabaseAuth();

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

      for (const prof of professorData) {
        try {
          // Create auth user
          const { data, error: signUpError } = await supabase.auth.signUp({
            email: prof.email,
            password: 'prof123', // Default password
            options: {
              data: {
                name: prof.name
              }
            }
          });

          if (signUpError) {
            console.error(`Error creating ${prof.name}:`, signUpError);
            errorCount++;
            continue;
          }

          if (data.user) {
            // Update profile with professor role and subject
            const { error: profileError } = await supabase
              .from('profiles')
              .update({
                role: 'professor',
                subject: prof.subject
              })
              .eq('id', data.user.id);

            if (profileError) {
              console.error(`Error updating profile for ${prof.name}:`, profileError);
              errorCount++;
            } else {
              successCount++;
            }
          }
        } catch (err) {
          console.error(`Error with ${prof.name}:`, err);
          errorCount++;
        }
      }

      setMessage(`Professor accounts creation completed. Success: ${successCount}, Errors: ${errorCount}`);
    } catch (err) {
      setError('Failed to create professor accounts');
      console.error(err);
    }

    setIsCreating(false);
  };

  if (profile?.role !== 'admin') {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Only administrators can access this feature.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Professor Account Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {message && (
          <Alert>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <h4 className="font-semibold">Professors to create:</h4>
          <ul className="text-sm space-y-1">
            {professorData.map((prof, index) => (
              <li key={index} className="flex justify-between">
                <span>{prof.name}</span>
                <span className="text-muted-foreground">{prof.subject}</span>
              </li>
            ))}
          </ul>
        </div>

        <Button 
          onClick={createProfessorAccounts}
          disabled={isCreating}
          className="w-full"
        >
          {isCreating ? 'Creating Accounts...' : 'Create All Professor Accounts'}
        </Button>

        <p className="text-xs text-muted-foreground">
          Default password for all professors: prof123
        </p>
      </CardContent>
    </Card>
  );
};

export default ProfessorAccountManager;
