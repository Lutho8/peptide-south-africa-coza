import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Video, Shield, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GradientCard } from '@/components/ui/GradientCard';
import { cn } from '@/lib/utils';

const PAYPAL_EMAIL = 'lutho.kote@fintiba.com';
const CALL_PRICE = 45;
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Check for payment success in URL on mount
  useEffect(() => {
    if (window.location.search.includes('payment=success')) {
      setShowSuccess(true);
    }
  }, []);

  const handlePayPalPayment = () => {
    setIsProcessing(true);
    
    // Create PayPal payment checkout URL
    const paypalCheckout = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${encodeURIComponent(PAYPAL_EMAIL)}&item_name=${encodeURIComponent('1-Hour Peptide Consultation Call')}&amount=${CALL_PRICE}&currency_code=EUR&return=${encodeURIComponent(window.location.href + '?payment=success')}&cancel_return=${encodeURIComponent(window.location.href + '?payment=cancelled')}`;
    
    window.open(paypalCheckout, '_blank');
    
    setTimeout(() => {
      setIsProcessing(false);
    }, 2000);
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
          Premium Consultation
        </motion.div>
        <h2 className="text-2xl font-bold text-foreground">Book a 1:1 Call</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Get personalized guidance from an expert on optimizing your peptide protocol
        </p>
      </div>

      {/* Success Message */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/30"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-accent/20">
                <CheckCircle2 className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Payment Successful!</h3>
                <p className="text-sm text-muted-foreground">
                  You'll receive a Zoom link at your email shortly.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Card */}
      <GradientCard className="premium-border relative overflow-hidden">
        {/* Luxury background effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 pointer-events-none" />
        <motion.div
          className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <div className="relative z-10 space-y-6">
          {/* Price and Duration */}
          <div className="flex items-center justify-between">
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
            <div className="text-right">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="text-3xl font-bold text-foreground"
              >
                €{CALL_PRICE}
              </motion.div>
              <span className="text-xs text-muted-foreground">one-time</span>
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

          {/* PayPal Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={handlePayPalPayment}
              disabled={isProcessing}
              className={cn(
                "w-full h-14 text-lg font-semibold relative overflow-hidden",
                "bg-primary hover:bg-primary/90",
                "text-primary-foreground border-0 shadow-lg shadow-primary/30"
              )}
            >
              {isProcessing ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                />
              ) : (
                <>
                  <span>Pay with PayPal</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </motion.div>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Shield className="w-4 h-4" />
            <span>Secure payment via PayPal</span>
          </div>
        </div>
      </GradientCard>

      {/* Additional Info */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 rounded-xl bg-card border border-border text-center"
        >
          <Calendar className="w-5 h-5 mx-auto mb-2 text-primary" />
          <p className="text-xs text-muted-foreground">
            Flexible scheduling to fit your timezone
          </p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 rounded-xl bg-card border border-border text-center"
        >
          <Video className="w-5 h-5 mx-auto mb-2 text-primary" />
          <p className="text-xs text-muted-foreground">
            Recording available upon request
          </p>
        </motion.div>
      </div>

      {/* Disclaimer */}
      <p className="text-[10px] text-muted-foreground/60 text-center italic">
        For research and educational purposes only. Not medical advice.
        Consult a healthcare professional before making any changes to your protocol.
      </p>
    </motion.section>
  );
}
