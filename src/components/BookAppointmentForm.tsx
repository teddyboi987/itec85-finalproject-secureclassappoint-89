
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Appointment } from '@/types/auth';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { subjects, getProfessorBySubject } from '@/data/subjects';

interface BookAppointmentFormProps {
  onSuccess: (appointment: Appointment) => void;
  onCancel: () => void;
}

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

    // Get the professor assigned to the selected subject
    const professor = getProfessorBySubject(selectedSubject);
    
    if (!professor) {
      setError('Professor not found for selected subject');
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create appointment with correct subject-professor mapping
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      studentId: user!.id,
      professorId: professor.id,
      studentName: user!.name,
      professorName: professor.name,
      subject: selectedSubject, // This ensures the correct subject is stored
      date,
      time,
      status: 'pending'
    };

    console.log('Creating appointment:', newAppointment); // Debug log

    onSuccess(newAppointment);
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
