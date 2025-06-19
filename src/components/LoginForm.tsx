
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { GraduationCap, Info } from 'lucide-react';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = await login(email, password);
    if (!success) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="max-w-md w-full space-y-6">
      {/* About Section */}
      <Card className="cvsu-card bg-white/90 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="cvsu-gradient p-2 rounded-full">
              <Info className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-primary mb-1">About SecureClass Appoint</h3>
              <p className="text-sm text-muted-foreground">
                An online appointment platform for CvSU students to book academic consultations with professors.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="cvsu-card bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="cvsu-gradient p-3 rounded-full">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-primary">SecureClass Appoint</CardTitle>
          <CardDescription className="text-primary/70">
            Cavite State University - Academic Consultation System
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="border-primary/20 focus:border-primary"
                placeholder="Enter your CvSU email"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="border-primary/20 focus:border-primary"
                placeholder="Enter your password"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full cvsu-gradient"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
            
            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={onSwitchToRegister}
                disabled={isLoading}
                className="text-primary hover:text-primary/80"
              >
                New student? Register here
              </Button>
            </div>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-primary/20">
            <h4 className="font-semibold text-primary mb-2">Demo Credentials:</h4>
            <div className="text-sm space-y-1">
              <p><strong>Student:</strong> student@cvsu.edu.ph / student123</p>
              <p><strong>Professor:</strong> santos@cvsu.edu.ph / prof123</p>
              <p><strong>Admin:</strong> admin@cvsu.edu.ph / admin123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
