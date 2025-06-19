
import React from 'react';
import { Label } from '@/components/ui/label';
import { professors } from '@/data/subjects';

interface ProfessorSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const ProfessorSelect: React.FC<ProfessorSelectProps> = ({ value, onChange, disabled }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="professor">Select Professor & Subject</Label>
      <select
        id="professor"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 border border-primary/20 rounded-md focus:border-primary focus:ring-1 focus:ring-primary"
        disabled={disabled}
      >
        <option value="">Choose a professor...</option>
        {professors.map((professor) => (
          <option key={professor.id} value={professor.id}>
            {professor.name} - {professor.subject}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProfessorSelect;
