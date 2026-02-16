import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { GraduationCap } from 'lucide-react';
import { toast } from 'sonner';

interface CourseEnrollModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CourseEnrollModal({ open, onOpenChange }: CourseEnrollModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [smsConsent, setSmsConsent] = useState(false);
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = name.trim() && email.trim() && phone.trim() && smsConsent && privacyConsent;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    // Redirect to the external course with params
    const url = new URL('https://mypeptideuniversity.com/peptide-intro');
    url.searchParams.set('name', name.trim());
    url.searchParams.set('email', email.trim());
    window.open(url.toString(), '_blank');
    toast.success('Redirecting you to the course!');
    setSubmitting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center gap-2 text-primary mb-2">
            <GraduationCap size={24} />
          </div>
          <DialogTitle className="text-center text-xl">
            Enter your information below to get access to the{' '}
            <span className="text-primary font-bold">Peptide Intro Course</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="enroll-name">Full Name</Label>
            <Input
              id="enroll-name"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="enroll-email">Email *</Label>
            <Input
              id="enroll-email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              maxLength={255}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="enroll-phone">Phone *</Label>
            <Input
              id="enroll-phone"
              type="tel"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              maxLength={20}
            />
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="sms-consent"
              checked={smsConsent}
              onCheckedChange={(v) => setSmsConsent(v === true)}
            />
            <label htmlFor="sms-consent" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
              <strong className="text-foreground">SMS/Text Consent:</strong> I consent to receive text messages from Peptide University about Peptide Intro Course and related educational content. Message and data rates may apply. Reply STOP to opt out. *
            </label>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="privacy-consent"
              checked={privacyConsent}
              onCheckedChange={(v) => setPrivacyConsent(v === true)}
            />
            <label htmlFor="privacy-consent" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
              I have read and agree to the{' '}
              <a href="/privacy-policy" target="_blank" className="text-primary underline">Privacy Policy</a>.
              I understand how my personal information will be used and protected. *
            </label>
          </div>

          <Button
            type="submit"
            disabled={!canSubmit || submitting}
            className="w-full rounded-full py-6 text-lg"
          >
            Get started now 👉
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
