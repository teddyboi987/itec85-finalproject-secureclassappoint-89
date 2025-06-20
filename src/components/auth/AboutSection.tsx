
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Info, Mail } from 'lucide-react';

interface AboutSectionProps {
  isProfessorEmail: boolean;
  isLogin: boolean;
}

const AboutSection: React.FC<AboutSectionProps> = ({ isProfessorEmail, isLogin }) => {
  return (
    <Card className="cvsu-card bg-white/90 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="cvsu-gradient p-2 rounded-full">
            <Info className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-primary mb-1">About SecureClass Appoint</h3>
            <p className="text-sm text-muted-foreground">
              An online appointment platform for students to book academic consultations with professors.
            </p>
            {isProfessorEmail && (
              <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-700 font-medium">
                  Professor Account Detected
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Use "Sign In" with your admin-provided credentials. 
                  {isLogin ? '' : ' No signup needed!'}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AboutSection;
