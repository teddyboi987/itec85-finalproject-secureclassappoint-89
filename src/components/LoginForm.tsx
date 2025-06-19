
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, GraduationCap, BookOpen } from 'lucide-react';

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
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const success = await login(email, password);
    if (!success) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-screen">
          {/* About Section */}
          <div className="space-y-6">
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start space-x-3 mb-4">
                <div className="cvsu-gradient p-3 rounded-full">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-primary">SecureClass Appoint</h1>
              </div>
              <p className="text-xl text-gray-600 mb-6">
                CvSU Academic Consultation Platform
              </p>
            </div>
            
            <Card className="cvsu-card bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-primary">
                  <BookOpen className="h-5 w-5" />
                  <span>About SecureClass Appoint</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  SecureClass Appoint is an online platform for CvSU students to conveniently 
                  book academic consultations with their professors.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="bg-green-50 p-3 rounded-lg border-l-4 border-primary">
                    <h4 className="font-semibold text-primary">For Students</h4>
                    <p className="text-gray-600">Book appointments with professors by subject</p>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-lg border-l-4 border-accent">
                    <h4 className="font-semibold text-accent-foreground">For Professors</h4>
                    <p className="text-gray-600">Manage consultation requests efficiently</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Login Form */}
          <div className="w-full max-w-md mx-auto">
            <Card className="cvsu-card bg-white/90 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-primary">Welcome Back</CardTitle>
                <CardDescription>Sign in to your CvSU account</CardDescription>
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
                      placeholder="your.email@cvsu.edu.ph"
                      disabled={isLoading}
                      className="border-primary/20 focus:border-primary"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      disabled={isLoading}
                      className="border-primary/20 focus:border-primary"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full cvsu-gradient" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>
                
                <div className="mt-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    New student?{' '}
                    <button
                      onClick={onSwitchToRegister}
                      className="text-primary hover:underline font-medium"
                      type="button"
                    >
                      Register here
                    </button>
                  </p>
                </div>
                
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-primary/20">
                  <p className="text-sm font-medium mb-2 text-primary">Demo Credentials:</p>
                  <div className="text-xs space-y-1 text-gray-600">
                    <p><strong>Student:</strong> student@cvsu.edu.ph / student123</p>
                    <p><strong>Professor:</strong> santos@cvsu.edu.ph / prof123</p>
                    <p><strong>Admin:</strong> admin@cvsu.edu.ph / admin123</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
