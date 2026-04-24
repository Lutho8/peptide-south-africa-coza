import { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { captureLead } from '@/lib/crm';

interface EnrollmentModalProps {
  open: boolean;
  onEnrolled: (name: string, email: string) => void;
}

export function EnrollmentModal({ open, onEnrolled }: EnrollmentModalProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [smsConsent, setSmsConsent] = useState(false);
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName || trimmedName.length < 2) {
      toast.error('Please enter your full name.');
      return;
    }
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    if (trimmedName.length > 100) {
      toast.error('Name must be less than 100 characters.');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from('course_enrollments' as any).upsert(
        {
          full_name: trimmedName,
          email: trimmedEmail,
          sms_consent: smsConsent,
          phone: smsConsent ? phone.trim() || null : null,
        } as any,
        { onConflict: 'email' }
      );

      if (error) throw error;

      captureLead({
        email: trimmedEmail,
        firstName: trimmedName.split(' ')[0],
        lastName: trimmedName.split(' ').slice(1).join(' ') || undefined,
        phone: smsConsent ? phone.trim() || undefined : undefined,
        source: 'free_course_enrollment',
        planInterest: 'free',
        activityType: 'course_start',
        activityData: { sms_consent: smsConsent },
      });

      toast.success('Welcome aboard! 🚀', { description: 'Your course access is ready.' });
      onEnrolled(trimmedName, trimmedEmail);
    } catch (err: any) {
      console.error('Enrollment error:', err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader className="text-center space-y-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center"
          >
            <GraduationCap className="text-primary" size={28} />
          </motion.div>
          <DialogTitle className="text-xl">Start Your Free Course</DialogTitle>
          <DialogDescription>
            Enter your details to unlock all 6 modules. Your name will appear on your certificate of completion.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              placeholder="e.g. Dr. Jane Smith"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              maxLength={100}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="jane@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              maxLength={255}
            />
            <p className="text-xs text-muted-foreground">We'll send course updates and resources to this email.</p>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="smsConsent"
              checked={smsConsent}
              onCheckedChange={(c) => setSmsConsent(c === true)}
            />
            <Label htmlFor="smsConsent" className="text-sm leading-snug cursor-pointer">
              I'd also like to receive SMS updates about new courses and peptide research
            </Label>
          </div>

          {smsConsent && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="space-y-2 overflow-hidden"
            >
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={20}
              />
            </motion.div>
          )}

          <Button type="submit" className="w-full gap-2" size="lg" disabled={submitting}>
            {submitting ? 'Enrolling…' : (
              <>
                <Rocket size={16} />
                Start Learning — It's Free
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            By enrolling, you agree to our{' '}
            <a href="/privacy" className="underline hover:text-foreground">Privacy Policy</a>.
            No credit card required.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
