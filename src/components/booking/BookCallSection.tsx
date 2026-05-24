import { motion } from 'framer-motion';
import { Calendar, Clock, Video, CheckCircle2, ArrowRight, Sparkles, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GradientCard } from '@/components/ui/GradientCard';
import { cn } from '@/lib/utils';

const BOOKING_EMAIL = 'webinars@fintiba.com';
const CALL_DURATION = 60;

interface BookCallSectionProps {
  className?: string;
}

const benefits = [
  'Personalized peptide protocol review',
  'Stack optimization for your goals',
  'Dosing and timing recommendations',
  'Safety considerations & bloodwork guidance',
  'Q&A on your specific questions',
];

export function BookCallSection({ className }: BookCallSectionProps) {
  const handleRequestCall = () => {
    const subject = encodeURIComponent('1:1 Peptide Consultation Request');
    const body = encodeURIComponent(
      "Hi,\n\nI'd like to book a 1:1 peptide consultation call.\n\nPreferred date/time:\nTimezone:\nTopics I want to cover:\n\nThanks!"
    );
    window.location.href = `mailto:${BOOKING_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
      className={cn("space-y-6", className)}
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-accent text-sm font-medium"
        >
          <Sparkles className="w-4 h-4" />
          Free 1:1 Consultation
        </motion.div>
        <h2 className="text-2xl font-bold text-foreground">Book a 1:1 Call</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Get personalized guidance from an expert on optimizing your peptide protocol
        </p>
      </div>

      {/* Main Card */}
      <GradientCard className="premium-border relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 pointer-events-none" />
        <motion.div
          className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative z-10 space-y-6">
          {/* Header row */}
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ rotate: 5, scale: 1.05 }}
              className="p-3 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/30"
            >
              <Video className="w-6 h-6 text-accent" />
            </motion.div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Zoom Consultation</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{CALL_DURATION} minutes</span>
              </div>
            </div>
          </div>

          {/* Benefits List */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">What's included:</h4>
            <ul className="space-y-2">
              {benefits.map((benefit, index) => (
                <motion.li
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center gap-3 text-sm text-muted-foreground"
                >
                  <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-3 h-3 text-accent" />
                  </div>
                  {benefit}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleRequestCall}
              className={cn(
                "w-full h-14 text-lg font-semibold relative overflow-hidden",
                "bg-primary hover:bg-primary/90",
                "text-primary-foreground border-0 shadow-lg shadow-primary/30"
              )}
            >
              <Mail className="w-5 h-5 mr-2" />
              <span>Book 1:1 Call</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>

          {/* Footnote */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Mail className="w-4 h-4" />
            <span>Sends an email to {BOOKING_EMAIL}</span>
          </div>
        </div>
      </GradientCard>

      {/* Additional Info */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-xl bg-card border border-border text-center">
          <Calendar className="w-5 h-5 mx-auto mb-2 text-primary" />
          <p className="text-xs text-muted-foreground">Flexible scheduling to fit your timezone</p>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-xl bg-card border border-border text-center">
          <Video className="w-5 h-5 mx-auto mb-2 text-primary" />
          <p className="text-xs text-muted-foreground">Recording available upon request</p>
        </motion.div>
      </div>

      <p className="text-[10px] text-muted-foreground/60 text-center italic">
        For research and educational purposes only. Not medical advice.
        Consult a healthcare professional before making any changes to your protocol.
      </p>
    </motion.section>
  );
}
