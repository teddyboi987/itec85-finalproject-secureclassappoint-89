
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';

interface BookAppointmentFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

// Simple subject list that matches exactly what we need
const availableSubjects = [
  'Programming',
  'Data Structures', 
  'Web Development',
  'Computer Networks',
  'Operating Systems',
  'Cybersecurity',
  'Algorithms'
];

const BookAppointmentForm: React.FC<BookAppointmentFormProps> = ({ onSuccess, onCancel }) => {
  const { user } = useSupabaseAuth();
  const [selectedSubject, setSelectedSubject] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!selectedSubject || !date || !time) {
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
      // Find professor for the selected subject using exact match
      const { data: professorProfile, error: professorError } = await supabase
        .from('profiles')
        .select('id, name, subject, email')
        .eq('role', 'professor')
        .eq('subject', selectedSubject)
        .maybeSingle();

      if (professorError) {
        console.error('Error finding professor:', professorError);
        setError('Error finding professor. Please try again.');
        setIsSubmitting(false);
        return;
      }

      if (!professorProfile) {
        // If no professor found, create a mock appointment (since we don't have real professors in auth.users)
        // In a real system, you'd need to create actual user accounts for professors
        setError(`Currently no professor is available for "${selectedSubject}". This is a demo system - professor accounts need to be created in Supabase Auth first.`);
        setIsSubmitting(false);
        return;
      }

      // Create appointment in database
      const { data: appointment, error: appointmentError } = await supabase
        .from('appointments')
        .insert({
          student_id: user!.id,
          professor_id: professorProfile.id,
          subject: selectedSubject,
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
          
          <div className="space-y-2">
            <Label htmlFor="subject">Select Subject</Label>
            <select
              id="subject"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full p-3 border border-primary/20 rounded-md focus:border-primary focus:ring-1 focus:ring-primary"
              disabled={isSubmitting}
            >
              <option value="">Choose a Computer Science subject...</option>
              {availableSubjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
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
