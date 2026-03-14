import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Video, Calendar, Users, Clock, CheckCircle2, ArrowLeft, Shield, Zap, BookOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const TOPICS = [
  'Beginner Peptide Basics',
  'Dosage & Administration',
  'Stack Building',
  'Cycle Planning',
  'Reconstitution',
  'Safety & Side Effects',
  'Body Composition',
  'Anti-Aging Protocols',
];

function getNextSessionDate() {
  const now = new Date();
  // Next session = first Saturday of next month
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  while (next.getDay() !== 6) next.setDate(next.getDate() + 1);
  return next;
}

function getSessionMonth() {
  const d = getNextSessionDate();
  return d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
}

export default function LiveQnA() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    experienceLevel: 'beginner',
    topics: [] as string[],
  });

  const sessionDate = getNextSessionDate();
  const sessionMonth = getSessionMonth();

  const handleTopicToggle = (topic: string) => {
    setForm(prev => ({
      ...prev,
      topics: prev.topics.includes(topic)
        ? prev.topics.filter(t => t !== topic)
        : [...prev.topics, topic],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.email.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('qna_registrations').insert({
        full_name: form.fullName.trim().slice(0, 100),
        email: form.email.trim().toLowerCase().slice(0, 255),
        phone: form.phone.trim().slice(0, 20) || null,
        experience_level: form.experienceLevel,
        topics_of_interest: form.topics,
        session_month: sessionMonth,
      });

      if (error) {
        if (error.code === '23505') {
          toast({ title: 'Already registered!', description: `You're already signed up for ${sessionMonth}.`, variant: 'default' });
          setRegistered(true);
        } else {
          throw error;
        }
      } else {
        setRegistered(true);
        toast({ title: 'Registration confirmed! 🎉', description: `You're in for the ${sessionMonth} Live Q&A. Check your email for details.` });
      }
    } catch {
      toast({ title: 'Registration failed', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
          </Link>
          <h1 className="text-lg font-bold text-foreground">Live Q&A Sessions</h1>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden py-16 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-primary/10" />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Badge className="mb-4 bg-accent/20 text-accent border-accent/30 text-sm px-4 py-1">
                <Video className="w-4 h-4 mr-2" /> Monthly Live on Zoom
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-flow">
                  Free Peptide Q&A
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-4 max-w-2xl mx-auto">
                Join me live every month for a free consultation session. Ask anything about peptides — from beginner basics to advanced stacking protocols.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground mb-8">
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-accent" /> {sessionDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-accent" /> 7:00 PM CET</span>
                <span className="flex items-center gap-1"><Users className="w-4 h-4 text-accent" /> Limited Spots</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits + Form */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Benefits */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">What You'll Get</h2>
            {[
              { icon: BookOpen, title: 'Expert Guidance', desc: 'Personalized answers on dosage, reconstitution, and administration.' },
              { icon: Zap, title: 'Stack & Cycle Reviews', desc: 'Get your current or planned protocol reviewed live.' },
              { icon: Shield, title: 'Safety First', desc: 'Learn about side effects, interactions, and harm reduction.' },
              { icon: Users, title: 'Community Learning', desc: 'Benefit from other attendees\' questions and experiences.' },
            ].map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }} className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </motion.div>
            ))}

            <Card className="border-accent/30 bg-accent/5">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Next Session:</strong> {sessionMonth} — First Saturday at 7:00 PM CET via Zoom. A link will be emailed to all registrants 24 hours before the session.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Registration Form */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            {registered ? (
              <Card className="border-accent/50 bg-accent/5">
                <CardContent className="p-8 text-center space-y-4">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
                    <CheckCircle2 className="w-16 h-16 text-accent mx-auto" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-foreground">You're Registered!</h3>
                  <p className="text-muted-foreground">Check your inbox for confirmation. The Zoom link will be sent 24 hours before the session.</p>
                  <Link to="/">
                    <Button variant="outline" className="mt-4">Explore Peptides</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-1">Reserve Your Spot</h3>
                  <p className="text-sm text-muted-foreground mb-6">Free · {sessionMonth} Session</p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input id="fullName" required maxLength={100} value={form.fullName} onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} placeholder="Your name" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" type="email" required maxLength={255} value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="you@example.com" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone (optional)</Label>
                      <Input id="phone" type="tel" maxLength={20} value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+1 (555) 000-0000" />
                    </div>
                    <div>
                      <Label>Experience Level</Label>
                      <Select value={form.experienceLevel} onValueChange={v => setForm(p => ({ ...p, experienceLevel: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Complete Beginner</SelectItem>
                          <SelectItem value="some_research">Some Research Done</SelectItem>
                          <SelectItem value="currently_using">Currently Using Peptides</SelectItem>
                          <SelectItem value="experienced">Experienced User</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="mb-2 block">Topics of Interest</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {TOPICS.map(topic => (
                          <label key={topic} className="flex items-center gap-2 text-sm cursor-pointer p-2 rounded-md hover:bg-muted/50 transition-colors">
                            <Checkbox checked={form.topics.includes(topic)} onCheckedChange={() => handleTopicToggle(topic)} />
                            <span className="text-muted-foreground">{topic}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <Button type="submit" className="w-full" size="lg" disabled={loading}>
                      {loading ? 'Registering...' : 'Register for Free'}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      By registering you agree to our <Link to="/privacy" className="underline">Privacy Policy</Link>. No spam, ever.
                    </p>
                  </form>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
