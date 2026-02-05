import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Crown, Shield, Zap, BarChart3, Bell, Download, Users, Lock, Loader2, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMembership } from '@/hooks/useMembership';
import { useToast } from '@/hooks/use-toast';
import { useCountUp } from '@/hooks/useCountUp';

// PayPal Plan ID - Replace with your actual PayPal subscription plan ID
const PAYPAL_PLAN_ID = 'P-PEPTIDEPRO-MONTHLY-EUR';

interface MembersPaywallProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSignInClick: () => void;
  isAuthenticated: boolean;
  onAccessDashboard: () => void;
}

const features = [
  { icon: Zap, title: 'Dose Tracker', description: 'Log and track your daily peptide doses' },
  { icon: BarChart3, title: 'Body Composition', description: 'Track weight, body fat, and muscle mass' },
  { icon: Bell, title: 'Smart Reminders', description: 'Never miss a dose with customizable alerts' },
  { icon: Download, title: 'Export Reports', description: 'Download detailed PDF reports' },
  { icon: Shield, title: 'Cycle Management', description: 'Plan and monitor your peptide cycles' },
  { icon: Users, title: 'Multi-Profile', description: 'Separate profiles for family members' },
];

const benefits = [
  'Unlimited dose logging',
  'Body composition tracking',
  'Smart dose reminders',
  'Cycle planning tools',
  'Bloodwork integration',
  'Inventory management',
  'Research library access',
  'Priority support',
];

// Feature card with 3D flip animation
function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, rotateY: -90, transformPerspective: 1000 }}
      animate={{ opacity: 1, rotateY: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.23, 1, 0.32, 1],
      }}
      whileHover={{ 
        scale: 1.02, 
        y: -4,
        boxShadow: '0 10px 30px -10px hsl(var(--primary) / 0.2)',
      }}
      className="p-3 rounded-lg bg-secondary/50 border border-border/50 cursor-default"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3 + index * 0.1, type: 'spring', stiffness: 300 }}
      >
        <feature.icon className="w-5 h-5 text-accent mb-2" />
      </motion.div>
      <p className="text-sm font-medium">{feature.title}</p>
      <p className="text-xs text-muted-foreground">{feature.description}</p>
    </motion.div>
  );
}

// Animated benefit item with checkmark pop
function BenefitItem({ benefit, index }: { benefit: string; index: number }) {
  return (
    <motion.li 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 + index * 0.05 }}
      whileHover={{ x: 4, backgroundColor: 'hsl(var(--accent) / 0.05)' }}
      className="flex items-center gap-2 text-sm p-1 rounded transition-colors"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          delay: 0.6 + index * 0.05, 
          type: 'spring', 
          stiffness: 400,
          damping: 10,
        }}
      >
        <Check className="w-4 h-4 text-accent flex-shrink-0" />
      </motion.div>
      <span>{benefit}</span>
    </motion.li>
  );
}

// Price display with count-up
function AnimatedPrice() {
  const { formattedValue, ref } = useCountUp({
    end: 9.99,
    duration: 1500,
    delay: 300,
    decimals: 2,
    prefix: '€',
    enableScrollTrigger: false,
  });

  return (
    <div className="mt-4" ref={ref as any}>
      <span className="text-4xl font-bold">{formattedValue}</span>
      <span className="text-muted-foreground">/month</span>
    </div>
  );
}

export function MembersPaywall({ 
  open, 
  onOpenChange, 
  onSignInClick, 
  isAuthenticated, 
  onAccessDashboard 
}: MembersPaywallProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { membership, hasMembership, isLoading, activateMembership } = useMembership();
  const { toast } = useToast();

  // Handle PayPal redirect callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const subscriptionId = urlParams.get('subscription_id');
    const payerId = urlParams.get('PayerID');
    
    if (subscriptionId && payerId && isAuthenticated) {
      handlePayPalSuccess(subscriptionId, payerId);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [isAuthenticated]);

  const handlePayPalSuccess = async (subscriptionId: string, payerId: string) => {
    setIsProcessing(true);
    try {
      await activateMembership(subscriptionId, payerId, PAYPAL_PLAN_ID);
      toast({
        title: "Welcome to PeptidePro!",
        description: "Your membership is now active.",
      });
      onAccessDashboard();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Activation Failed",
        description: "Please contact support if this persists.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayPalClick = () => {
    setIsProcessing(true);
    const returnUrl = encodeURIComponent(window.location.origin + '/?membership=success');
    const cancelUrl = encodeURIComponent(window.location.origin + '/?membership=cancelled');
    const paypalUrl = `https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=${PAYPAL_PLAN_ID}&return_url=${returnUrl}&cancel_url=${cancelUrl}`;
    
    window.open(paypalUrl, '_blank');
    setIsProcessing(false);
    
    toast({
      title: "PayPal Opened",
      description: "Complete your subscription in the PayPal window, then return here.",
    });
  };

  // Loading state
  if (isLoading && isAuthenticated) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md bg-background border-border">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // If user has membership, show access button
  if (isAuthenticated && hasMembership) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md bg-background border-border">
          <DialogHeader>
            <DialogTitle className="text-center flex items-center justify-center gap-2">
              <Crown className="w-5 h-5 text-gold" />
              Welcome Back, Member!
            </DialogTitle>
            <DialogDescription className="text-center">
              Your Ride The Tide membership is active
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-6">
            <div className="mb-4 p-4 rounded-lg bg-accent/10 border border-accent/20">
              <p className="text-sm text-accent">
                ✓ Membership Active {membership?.expires_at && `until ${new Date(membership.expires_at).toLocaleDateString()}`}
              </p>
            </div>
            <p className="text-muted-foreground mb-6">
              Access your personalized peptide tracking dashboard.
            </p>
            <Button 
              onClick={() => {
                onAccessDashboard();
                onOpenChange(false);
              }}
              className="w-full bg-gradient-to-r from-primary to-accent"
            >
              Enter Dashboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-background border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <DialogTitle className="text-center text-2xl flex items-center justify-center gap-2">
              <Crown className="w-6 h-6 text-primary" />
              Unlock Ride The Tide
            </DialogTitle>
          </motion.div>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 py-4">
          {/* Features Preview with 3D flip */}
          <div>
            <motion.h3 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg font-semibold mb-4"
            >
              What You Get
            </motion.h3>
            <div className="grid grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <FeatureCard key={feature.title} feature={feature} index={index} />
              ))}
            </div>
          </div>

          {/* Pricing Card with premium shimmer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <Card className="border-accent/50 bg-gradient-to-b from-accent/5 to-transparent relative overflow-hidden">
              {/* Premium shimmer effect */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                  className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-primary/5 to-transparent skew-x-12"
                  animate={{ left: ['100%', '-100%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
                />
              </div>

              <CardHeader className="text-center pb-2 relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: 'spring', stiffness: 300 }}
                >
                  <Badge className="w-fit mx-auto mb-2 bg-gold/20 text-gold border-gold/30">
                    <motion.span
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Most Popular
                    </motion.span>
                  </Badge>
                </motion.div>
                <CardTitle className="text-xl">Pro Membership</CardTitle>
                <AnimatedPrice />
                <CardDescription>Cancel anytime. No commitment.</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 relative z-10">
                <ul className="space-y-2">
                  {benefits.map((benefit, index) => (
                    <BenefitItem key={benefit} benefit={benefit} index={index} />
                  ))}
                </ul>

                <div className="pt-4 space-y-3">
                  {!isAuthenticated ? (
                    <>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button 
                          onClick={onSignInClick}
                          className="w-full bg-gradient-to-r from-primary to-accent"
                        >
                          Sign In to Subscribe
                        </Button>
                      </motion.div>
                      <p className="text-xs text-center text-muted-foreground">
                        Create an account first, then subscribe
                      </p>
                    </>
                  ) : (
                    <>
                      <motion.div 
                        whileHover={{ scale: 1.02 }} 
                        whileTap={{ scale: 0.98 }}
                        className="relative overflow-hidden rounded-md"
                      >
                        <Button 
                          onClick={handlePayPalClick}
                          disabled={isProcessing}
                          className="w-full bg-[#0070ba] hover:bg-[#003087] text-white relative z-10"
                        >
                          {isProcessing ? (
                            'Processing...'
                          ) : (
                            <>
                              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .761-.629h6.317c2.102 0 3.585.453 4.413 1.348.796.858 1.058 2.042.781 3.52l-.026.15-.13.626-.038.171c-.537 2.664-2.212 4.004-4.976 4.004H9.73l-.969 5.434a.77.77 0 0 1-.761.629H7.076Z"/>
                                <path d="M19.956 8.665c-.497 2.922-2.401 4.405-5.696 4.405h-1.445c-.35 0-.648.253-.703.597l-.792 5.027-.224 1.421a.37.37 0 0 0 .366.427h2.57a.641.641 0 0 0 .632-.538l.026-.135.501-3.17.032-.175a.641.641 0 0 1 .633-.538h.399c2.581 0 4.6-1.048 5.191-4.079.247-1.266.119-2.323-.535-3.066a2.563 2.563 0 0 0-.955-.676Z"/>
                              </svg>
                              Subscribe with PayPal
                            </>
                          )}
                        </Button>
                      </motion.div>
                      <div className="flex items-center gap-2 justify-center text-xs text-muted-foreground">
                        <Lock className="w-3 h-3" />
                        <span>Secure payment via PayPal</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="pt-4 border-t border-border/50">
                  <p className="text-xs text-center text-muted-foreground">
                    By subscribing, you agree to our Terms of Service and Privacy Policy.
                    Your subscription will automatically renew each month.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
