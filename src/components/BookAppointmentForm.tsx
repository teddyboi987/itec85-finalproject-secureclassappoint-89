
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Appointment } from '@/types/auth';
import { useAuth } from '@/contexts/AuthContext';
import { subjects, getProfessorBySubject } from '@/data/subjects';

interface BookAppointmentFormProps {
  onSuccess: (appointment: Appointment) => void;
  onCancel: () => void;
}

const BookAppointmentForm: React.FC<BookAppointmentFormProps> = ({ onSuccess, onCancel }) => {
  const { user } = useAuth();
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

    const newAppointment: Appointment = {
      id: Date.now().toString(),
      studentId: user!.id,
      professorId: professor.id,
      studentName: user!.name,
      professorName: professor.name,
      subject: selectedSubject,
      date,
      time,
      status: 'pending'
    };

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
              <option value="">Choose a subject...</option>
              {subjects.map((subject) => (
                <option key={subject.name} value={subject.name}>
                  {subject.name}
                </option>
              ))}
            </select>
            {selectedProfessor && (
              <p className="text-sm text-primary bg-green-50 p-2 rounded">
                Professor: {selectedProfessor.name}
              </p>
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
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              disabled={isSubmitting}
              className="border-primary/20 focus:border-primary"
            />
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
