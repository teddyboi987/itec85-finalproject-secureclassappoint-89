
import React, { useState, useEffect } from 'react';
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
  const [pendingVerification, setPendingVerification] = useState(false);
  const { signIn, signUp, signInWithGoogle, isLoading } = useSupabaseAuth();

  // Check for email confirmation on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    const token_hash = urlParams.get('token_hash');
    
    if (type === 'signup' && token_hash) {
      setMessage('Email confirmed successfully! You can now sign in with your credentials.');
      setIsLogin(true); // Switch to login mode
      setPendingVerification(false);
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    console.log('Form submitted:', { isLogin, email, hasPassword: !!password, hasName: !!name });
    
    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) {
        console.error('Login error:', error);
        setError(error.message);
        
        // If email not confirmed, show option to resend
        if (error.message.includes('confirmation') || error.message.includes('verify')) {
          setPendingVerification(true);
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
        if (error.message.includes('User already registered')) {
          setError('An account with this email already exists. Please try signing in instead.');
          setIsLogin(true);
        } else {
          setError(error.message);
        }
      } else {
        console.log('Signup successful, showing verification message');
        setMessage('Account created successfully! Please check your email for a confirmation link. You must click the link to verify your account before you can sign in.');
        setPendingVerification(true);
        // Clear form after successful signup
        setPassword('');
        setName('');
      }
    }
  };

  const handleResendConfirmation = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    setError('');
    setMessage('');
    
    const { authService } = await import('@/services/authService');
    const { error } = await authService.resendConfirmation(email);
    
    if (error) {
      setError('Failed to resend confirmation email. Please try again.');
    } else {
      setMessage('Confirmation email sent! Please check your inbox and click the verification link.');
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
    setPendingVerification(false);
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
                pendingVerification={pendingVerification}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
                onNameChange={setName}
                onSubmit={handleSubmit}
                onToggleMode={handleToggleMode}
                onResendConfirmation={handleResendConfirmation}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
