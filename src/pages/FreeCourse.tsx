import { motion } from 'framer-motion';
import { Rocket, BookOpen, Heart, Brain, Users, FlaskConical, TrendingUp, CheckCircle, Clock, Gift, ArrowRight, GraduationCap, Stethoscope, Target, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { useNavigate } from 'react-router-dom';

const courseTopics = [
  {
    icon: FlaskConical,
    title: 'What Peptides Are',
    description: 'Understand the science behind peptides and why they are revolutionizing medicine.',
  },
  {
    icon: Heart,
    title: 'Why They Matter in Healthcare',
    description: 'Learn how peptides enhance healing, recovery, metabolism, cognitive function, aesthetics, and longevity.',
  },
  {
    icon: Users,
    title: 'Who They Are For',
    description: 'Find out which patients benefit most from peptide therapy and how to personalize treatments.',
  },
  {
    icon: BookOpen,
    title: 'Most Common Uses & Clinical Applications',
    description: 'Get a breakdown of the top peptides used in practice today, including GLP-1s, repair & recovery peptides, and neuropeptides.',
  },
  {
    icon: TrendingUp,
    title: 'What Peptides Can Do for Your Patients & Practice',
    description: 'Increase patient results, retention, and revenue with proven peptide-based protocols.',
  },
  {
    icon: Brain,
    title: 'Common Dosing & Treatment Stacks',
    description: 'Step-by-step guidance on how to stack peptides for corrective healing and optimized health outcomes.',
  },
];

const audiencePoints = [
  { icon: Stethoscope, text: "You're a doctor, clinician, or health practitioner looking to expand your services." },
  { icon: Target, text: 'You need clarity on dosing, protocols, and patient selection.' },
  { icon: ShieldCheck, text: 'You want to integrate peptides safely and effectively into your practice.' },
  { icon: TrendingUp, text: "You're interested in boosting patient outcomes and practice profitability." },
  { icon: Zap, text: 'You want to stay ahead of the curve in the fast-growing field of regenerative medicine.' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function FreeCourse() {
  const navigate = useNavigate();

  const scrollToEnroll = () => {
    document.getElementById('enroll-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader onSignInClick={() => navigate('/')} onSearch={() => navigate('/')} />

      {/* Announcement Bar */}
      <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-semibold tracking-wide">
        FREE INTRODUCTION TO PEPTIDE THERAPY STARTER COURSE
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 py-16 md:py-24">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-accent/20 blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center space-y-6">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center gap-2 text-primary font-semibold">
            <Rocket size={20} />
            <span>Unlock the Power of Peptides in Your Practice</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight"
          >
            Discover How to Transform Patient Outcomes, Scale Your Revenue, and Stay Ahead in Healthcare!
          </motion.h1>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Button size="lg" onClick={scrollToEnroll} className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all gap-2">
              👉 Join the Free Peptide Introductory Course
              <ArrowRight size={18} />
            </Button>
            <p className="text-muted-foreground text-sm mt-3">ENROLL NOW & GET INSTANT ACCESS!</p>
          </motion.div>
        </div>
      </section>

      {/* Intro Text */}
      <section className="py-12 md:py-16 bg-primary/5">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-primary">
            Peptides Are Changing Medicine—Are You Ready?
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            <strong className="text-foreground">Peptide therapy</strong> is one of the <strong className="text-foreground">fastest-growing innovations in healthcare,</strong> offering groundbreaking solutions for <strong className="text-foreground">metabolic health, healing, longevity, cognitive function, aesthetics, and more.</strong>
          </p>
          <p className="text-muted-foreground text-lg">
            But with so many peptides available, <strong className="text-foreground">where do you start?</strong>
          </p>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Join this <strong className="text-foreground">FREE on-demand masterclass</strong> and gain the <strong className="text-foreground">clarity, confidence, and clinical strategies</strong> you need to start integrating peptides into your practice <strong className="text-foreground">right away.</strong>
          </p>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl md:text-4xl font-bold text-center text-foreground mb-12"
          >
            What You'll Learn in This Mini Starter Course
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courseTopics.map((topic, i) => (
              <motion.div
                key={topic.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <Card className="h-full hover:shadow-lg transition-shadow border-primary/10 hover:border-primary/30">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <topic.icon className="text-primary" size={28} />
                    </div>
                    <h3 className="font-bold text-foreground text-lg">{topic.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{topic.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button size="lg" onClick={scrollToEnroll} className="rounded-full px-8 py-6 text-lg gap-2">
              👉 Join the Free Peptide Introductory Course
              <ArrowRight size={18} />
            </Button>
            <p className="text-muted-foreground text-sm mt-2">ENROLL NOW & GET INSTANT ACCESS!</p>
          </div>
        </div>
      </section>

      {/* This Free Training is for You If… */}
      <section className="py-16 md:py-20 bg-primary/5">
        <div className="max-w-4xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl md:text-4xl font-bold text-center text-foreground mb-12"
          >
            This Free Training is for You If…
          </motion.h2>
          <div className="space-y-4">
            {audiencePoints.map((point, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border/50"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <point.icon className="text-primary" size={20} />
                </div>
                <p className="text-foreground text-base leading-relaxed">{point.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="enroll-section" className="py-16 md:py-24 bg-gradient-to-br from-primary/10 via-background to-accent/5">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-primary font-semibold flex items-center justify-center gap-2 mb-2">
              <GraduationCap size={20} />
              DISCOVER the Power of Peptides in Your Practice
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground">
              Watch the Free Mini Starter Course Now!
            </h2>
          </motion.div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-muted-foreground">
            <span className="flex items-center gap-2"><Clock size={18} className="text-primary" /> On-Demand – Watch Instantly</span>
            <span className="flex items-center gap-2"><Gift size={18} className="text-primary" /> 100% Free – No Cost, No Obligation</span>
            <span className="flex items-center gap-2"><Zap size={18} className="text-primary" /> Limited-Time Access – Don't Miss Out!</span>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="pt-4"
          >
            <Button
              size="lg"
              className="text-lg px-10 py-7 rounded-full shadow-xl hover:shadow-2xl transition-all gap-2 animate-premium-shimmer"
              onClick={() => window.open('https://mypeptideuniversity.com/peptide-intro', '_blank')}
            >
              👉 Get Instant Access Now
              <ArrowRight size={20} />
            </Button>
          </motion.div>

          <p className="text-xs text-muted-foreground pt-4">
            This course is provided by Peptide University. By enrolling, you'll be redirected to their platform for instant access.
          </p>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
