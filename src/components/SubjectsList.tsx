
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { subjects } from '@/data/subjects';

const SubjectsList: React.FC = () => {
  return (
    <Card className="cvsu-card bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-primary">Computer Science Subjects ({subjects.length})</CardTitle>
        <CardDescription>Available subjects and assigned professors</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subjects.map((subject, index) => (
            <div key={index} className="border border-primary/20 rounded-lg p-4 bg-white">
              <h3 className="font-semibold text-primary mb-2">{subject.name}</h3>
              <p className="text-sm text-muted-foreground">
                Professor: {subject.professor.name}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubjectsList;
