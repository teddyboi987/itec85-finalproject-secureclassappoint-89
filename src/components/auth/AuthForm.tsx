
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail } from 'lucide-react';

interface AuthFormProps {
  isLogin: boolean;
  email: string;
  password: string;
  name: string;
  error: string;
  message: string;
  isLoading: boolean;
  isProfessorEmail: boolean;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onNameChange: (name: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onToggleMode: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({
  isLogin,
  email,
  password,
  name,
  error,
  message,
  isLoading,
  isProfessorEmail,
  onEmailChange,
  onPasswordChange,
  onNameChange,
  onSubmit,
  onToggleMode
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {message && (
        <Alert>
          <Mail className="h-4 w-4" />
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
        </div>
      </div>
      
      {!isLogin && !isProfessorEmail && (
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            required={!isLogin && !isProfessorEmail}
            disabled={isLoading}
            className="border-primary/20 focus:border-primary"
            placeholder="Enter your full name"
            autoComplete="name"
          />
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
          disabled={isLoading}
          className="border-primary/20 focus:border-primary"
          placeholder="Enter your email address"
          autoComplete="email"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          required
          disabled={isLoading}
          className="border-primary/20 focus:border-primary"
          placeholder={isProfessorEmail && !isLogin ? "Use: prof123" : "Enter your password"}
          autoComplete="new-password"
        />
        {isProfessorEmail && !isLogin && (
          <p className="text-xs text-red-600">
            Professor accounts cannot be created here. Please use "Sign In" instead.
          </p>
        )}
      </div>
      
      {/* Email verification notice for new users */}
      {!isLogin && !isProfessorEmail && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm">
          <div className="flex items-start space-x-2">
            <Mail className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-blue-700">
              <strong>Email Verification Required:</strong> After creating your account, 
              you'll need to check your email and click the confirmation link before you can sign in.
            </p>
          </div>
        </div>
      )}
      
      {/* Conditionally disable signup for professors */}
      <Button 
        type="submit" 
        className="w-full cvsu-gradient"
        disabled={isLoading || (!isLogin && isProfessorEmail)}
      >
        {isLoading ? (isLogin ? 'Signing in...' : 'Creating account...') : (isLogin ? 'Sign In' : isProfessorEmail ? 'Use Sign In Instead' : 'Create Account')}
      </Button>
      
      <div className="text-center">
        <Button
          type="button"
          variant="link"
          onClick={onToggleMode}
          disabled={isLoading}
          className="text-primary hover:text-primary/80"
        >
          {isLogin ? "New student? Create an account" : "Already have an account? Sign in"}
        </Button>
      </div>
    </form>
  );
};

export default AuthForm;
