import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Loader2, Mail, Lock, User } from 'lucide-react';
import { z } from 'zod';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const emailSchema = z.string().email('Invalid email address').max(255);
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters').max(100);

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    try {
      emailSchema.parse(email);
      passwordSchema.parse(password);
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast.error(err.errors[0].message);
        return;
      }
    }

    setIsLoading(true);

    try {
      if (mode === 'signin') {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast.success('Signed in successfully');
        onOpenChange(false);
      } else {
        const { error } = await signUp(email, password, displayName);
        if (error) throw error;
        toast.success('Account created! You can now sign in.');
        onOpenChange(false);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground text-center">
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="displayName" className="text-sm flex items-center gap-2">
                <User size={14} />
                Display Name
              </Label>
              <Input
                id="displayName"
                type="text"
                placeholder="Your name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="bg-muted border-border"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm flex items-center gap-2">
              <Mail size={14} />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-muted border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm flex items-center gap-2">
              <Lock size={14} />
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-muted border-border"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button
              type="button"
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-primary hover:underline"
            >
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
