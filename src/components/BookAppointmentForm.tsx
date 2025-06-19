
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { professors } from '@/data/subjects';
import ProfessorSelect from './forms/ProfessorSelect';
import DateTimeSelect from './forms/DateTimeSelect';

interface BookAppointmentFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const BookAppointmentForm: React.FC<BookAppointmentFormProps> = ({ onSuccess, onCancel }) => {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const [selectedProfessor, setSelectedProfessor] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      // Find the selected professor from demo data
      const professor = professors.find(p => p.id === selectedProfessor);
      
      if (!professor) {
        setError('Selected professor not found. Please try again.');
        setIsSubmitting(false);
        return;
      }

      console.log('Creating appointment with professor:', professor);

      // Create the subject string that matches what professors will look for
      const subjectString = `${professor.subject} (Prof. ${professor.name})`;
      console.log('Subject string for appointment:', subjectString);

      // Create appointment in database - use null for professor_id since we're using demo data
      const { data: appointment, error: appointmentError } = await supabase
        .from('appointments')
        .insert({
          student_id: user!.id,
          professor_id: null,
          subject: subjectString,
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
          
          <ProfessorSelect
            value={selectedProfessor}
            onChange={setSelectedProfessor}
            disabled={isSubmitting}
          />
          
          <DateTimeSelect
            date={date}
            time={time}
            onDateChange={setDate}
            onTimeChange={setTime}
            disabled={isSubmitting}
          />
          
          <div className="flex space-x-2">
            <Button 
              type="submit" 
              disabled={isSubmitting} 
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
