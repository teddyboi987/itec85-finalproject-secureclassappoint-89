
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DateTimeSelectProps {
  date: string;
  time: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  disabled?: boolean;
}

const DateTimeSelect: React.FC<DateTimeSelectProps> = ({ 
  date, 
  time, 
  onDateChange, 
  onTimeChange, 
  disabled 
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="date">Preferred Date</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          disabled={disabled}
          min={new Date().toISOString().split('T')[0]}
          className="border-primary/20 focus:border-primary"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="time">Preferred Time</Label>
        <select
          id="time"
          value={time}
          onChange={(e) => onTimeChange(e.target.value)}
          className="w-full p-3 border border-primary/20 rounded-md focus:border-primary focus:ring-1 focus:ring-primary"
          disabled={disabled}
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
    </>
  );
};

export default DateTimeSelect;
