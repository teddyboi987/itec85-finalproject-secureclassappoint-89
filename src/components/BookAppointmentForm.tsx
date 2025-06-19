
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { subjects, getProfessorBySubject } from '@/data/subjects';

interface BookAppointmentFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const BookAppointmentForm: React.FC<BookAppointmentFormProps> = ({ onSuccess, onCancel }) => {
  const { user, profile } = useSupabaseAuth();
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
      console.log('=== APPOINTMENT BOOKING DEBUG ===');
      console.log('Selected subject:', selectedSubject);
      
      // Get all professors first to debug
      const { data: allProfiles, error: allError } = await supabase
        .from('profiles')
        .select('*');
      
      console.log('All profiles in database:', allProfiles);
      
      if (allProfiles) {
        const professors = allProfiles.filter(p => p.role === 'professor');
        console.log('All professors:', professors);
        console.log('Professor subjects:', professors.map(p => ({ name: p.name, subject: p.subject })));
      }

      // Now try to find the professor for the selected subject
      let { data: professorProfile, error: professorError } = await supabase
        .from('profiles')
        .select('id, name, subject, email')
        .eq('role', 'professor')
        .eq('subject', selectedSubject)
        .maybeSingle();

      console.log('Exact match result:', professorProfile, professorError);

      // If no exact match, try flexible search
      if (!professorProfile) {
        console.log('No exact match found, trying flexible search...');
        const { data: allProfessors, error: allProfError } = await supabase
          .from('profiles')
          .select('id, name, subject, email')
          .eq('role', 'professor');

        if (!allProfError && allProfessors) {
          console.log('All professors for flexible search:', allProfessors);
          
          // Try multiple matching strategies
          professorProfile = allProfessors.find(prof => {
            if (!prof.subject) {
              console.log(`Professor ${prof.name} has no subject assigned`);
              return false;
            }
            
            console.log(`Comparing "${prof.subject}" with "${selectedSubject}"`);
            
            // Exact match (case-sensitive)
            if (prof.subject === selectedSubject) {
              console.log('Found exact match!');
              return true;
            }
            
            // Case-insensitive match
            if (prof.subject.toLowerCase() === selectedSubject.toLowerCase()) {
              console.log('Found case-insensitive match!');
              return true;
            }
            
            // Trimmed match
            if (prof.subject.trim() === selectedSubject.trim()) {
              console.log('Found trimmed match!');
              return true;
            }
            
            // Both trimmed and case-insensitive
            if (prof.subject.trim().toLowerCase() === selectedSubject.trim().toLowerCase()) {
              console.log('Found trimmed + case-insensitive match!');
              return true;
            }
            
            return false;
          }) || null;
        }
      }

      console.log('Final professor found:', professorProfile);

      if (!professorProfile) {
        // Get detailed debugging info
        const { data: debugProfessors } = await supabase
          .from('profiles')
          .select('id, name, subject, email, role');
        
        const professorsList = debugProfessors
          ?.filter(p => p.role === 'professor')
          .map(p => `${p.name}: "${p.subject || 'NO SUBJECT'}"`)
          .join(', ') || 'None';
        
        console.log('=== DEBUGGING INFO ===');
        console.log('Selected subject:', `"${selectedSubject}"`);
        console.log('Available professors and their subjects:', professorsList);
        
        setError(`No professor found for "${selectedSubject}". Available professors: ${professorsList}`);
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

  const selectedProfessor = selectedSubject ? getProfessorBySubject(selectedSubject) : null;

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
              {subjects.map((subject) => (
                <option key={subject.name} value={subject.name}>
                  {subject.name}
                </option>
              ))}
            </select>
            {selectedProfessor && (
              <div className="text-sm text-primary bg-green-50 p-3 rounded border border-primary/20">
                <p className="font-medium">Professor: {selectedProfessor.name}</p>
                <p className="text-xs text-primary/70">Subject: {selectedSubject}</p>
              </div>
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
