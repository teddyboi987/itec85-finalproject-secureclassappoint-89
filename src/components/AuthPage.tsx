
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { GraduationCap } from 'lucide-react';
import AboutSection from './auth/AboutSection';
import GoogleSignInButton from './auth/GoogleSignInButton';
import AuthForm from './auth/AuthForm';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { signIn, signUp, signInWithGoogle, isLoading } = useSupabaseAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    console.log('Form submitted:', { isLogin, email, hasPassword: !!password, hasName: !!name });
    
    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) {
        console.error('Login error:', error);
        if (error.message.includes('Email not confirmed')) {
          setError('Please check your email and click the confirmation link before signing in.');
        } else if (error.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials and try again.');
        } else {
          setError(error.message);
        }
      }
    } else {
      if (!name.trim()) {
        setError('Please enter your full name');
        return;
      }
      
      console.log('Attempting signup with:', { email, name });
      
      const { data, error } = await signUp(email, password, name);
      if (error) {
        console.error('Signup error:', error);
        setError(error.message);
      } else {
        console.log('Signup successful, showing verification message');
        setMessage('Account created successfully! Please check your email for a confirmation link before you can sign in.');
        // Clear form after successful signup
        setEmail('');
        setPassword('');
        setName('');
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setMessage('');
    console.log('Google sign in initiated');
    const { error } = await signInWithGoogle();
    if (error) {
      console.error('Google signin error:', error);
      setError(error.message);
    }
  };

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setMessage('');
    console.log('Toggled auth mode to:', !isLogin ? 'login' : 'signup');
  };

  // Check if it's a professor email to show appropriate messaging
  const isProfessorEmail = email.includes('@cvsu.edu.ph') && email !== 'admin@cvsu.edu.ph';

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <AboutSection isProfessorEmail={isProfessorEmail} isLogin={isLogin} />

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
            <div className="space-y-4">
              <GoogleSignInButton 
                onGoogleSignIn={handleGoogleSignIn}
                isLoading={isLoading}
              />
              
              <AuthForm
                isLogin={isLogin}
                email={email}
                password={password}
                name={name}
                error={error}
                message={message}
                isLoading={isLoading}
                isProfessorEmail={isProfessorEmail}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
                onNameChange={setName}
                onSubmit={handleSubmit}
                onToggleMode={handleToggleMode}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
