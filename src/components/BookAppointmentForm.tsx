
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BookAppointmentFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

interface Professor {
  id: string;
  name: string;
  subject: string;
  email: string;
}

const BookAppointmentForm: React.FC<BookAppointmentFormProps> = ({ onSuccess, onCancel }) => {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const [professors, setProfessors] = useState<professor[]>([]);
  const [selectedProfessor, setSelectedProfessor] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch professors from database
  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        console.log('Fetching professors from database...');
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name, email, subject')
          .eq('role', 'professor')
          .not('subject', 'is', null)
          .order('name');

        if (error) {
          console.error('Error fetching professors:', error);
          setError('Failed to load professors. Please try again.');
          return;
        }

        console.log('Fetched professors from database:', data);
        setProfessors(data || []);
      } catch (err) {
        console.error('Unexpected error fetching professors:', err);
        setError('Failed to load professors. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfessors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!selectedProfessor || !date || !time) {
      setError('Please fill in all fields');
      return;
    }

    // Check if date is in the future
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      setError('Please select a future date');
      return;
    }

    setIsSubmitting(true);

    try {
      // Find the selected professor
      const professor = professors.find(p => p.id === selectedProfessor);
      
      if (!professor) {
        setError('Selected professor not found. Please try again.');
        setIsSubmitting(false);
        return;
      }

      console.log('Creating appointment with professor:', professor);

      // Create appointment in database
      const { data: appointment, error: appointmentError } = await supabase
        .from('appointments')
        .insert({
          student_id: user!.id,
          professor_id: professor.id,
          subject: professor.subject,
          date,
          time,
          status: 'pending'
        })
        .select()
        .single();

      if (appointmentError) {
        console.error('Error creating appointment:', appointmentError);
        setError('Failed to create appointment. Please try again.');
        setIsSubmitting(false);
        return;
      }

      console.log('Appointment created successfully:', appointment);
      
      toast({
        title: "Appointment Booked!",
        description: `Your appointment with ${professor.name} for ${professor.subject} has been requested.`,
      });

      onSuccess();
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred. Please try again.');
    }

    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <Card className="cvsu-card">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading professors...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="cvsu-card">
      <CardHeader>
        <CardTitle className="text-primary">Book New Appointment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="professor">Select Professor & Subject</Label>
            <select
              id="professor"
              value={selectedProfessor}
              onChange={(e) => setSelectedProfessor(e.target.value)}
              className="w-full p-3 border border-primary/20 rounded-md focus:border-primary focus:ring-1 focus:ring-primary"
              disabled={isSubmitting}
            >
              <option value="">Choose a professor...</option>
              {professors.map((professor) => (
                <option key={professor.id} value={professor.id}>
                  {professor.name} - {professor.subject}
                </option>
              ))}
            </select>
            {professors.length === 0 && (
              <Alert>
                <AlertDescription>
                  No professors are currently available in the database. Please contact the administrator to add professor accounts.
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Preferred Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={isSubmitting}
              min={new Date().toISOString().split('T')[0]}
              className="border-primary/20 focus:border-primary"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="time">Preferred Time</Label>
            <select
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-3 border border-primary/20 rounded-md focus:border-primary focus:ring-1 focus:ring-primary"
              disabled={isSubmitting}
            >
              <option value="">Select time...</option>
              <option value="08:00">8:00 AM</option>
              <option value="09:00">9:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="13:00">1:00 PM</option>
              <option value="14:00">2:00 PM</option>
              <option value="15:00">3:00 PM</option>
              <option value="16:00">4:00 PM</option>
            </select>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              type="submit" 
              disabled={isSubmitting || professors.length === 0} 
              className="flex-1 cvsu-gradient"
            >
              {isSubmitting ? 'Booking...' : 'Book Appointment'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel} 
              disabled={isSubmitting}
              className="border-primary text-primary hover:bg-primary hover:text-white"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookAppointmentForm;
