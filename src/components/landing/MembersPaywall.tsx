import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, Shield, Zap, BarChart3, Bell, Download, Users, Lock, Loader2, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMembership } from '@/hooks/useMembership';
import { useToast } from '@/hooks/use-toast';

// PayPal Plan ID - Replace with your actual PayPal subscription plan ID
// Create this at: https://developer.paypal.com/dashboard/applications/sandbox
const PAYPAL_PLAN_ID = 'P-PEPTIDEPRO-MONTHLY-EUR';
const PAYPAL_CLIENT_ID = 'YOUR_PAYPAL_CLIENT_ID'; // Replace with your PayPal Client ID

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
      // Clean up URL
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
    // Construct PayPal subscription URL
    // In production, you would use PayPal's JavaScript SDK for a better experience
    const returnUrl = encodeURIComponent(window.location.origin + '/?membership=success');
    const cancelUrl = encodeURIComponent(window.location.origin + '/?membership=cancelled');
    
    // This is a placeholder URL - replace with your actual PayPal subscription link
    // To get this, create a subscription plan in PayPal Developer Dashboard
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
              <Crown className="w-5 h-5 text-yellow-500" />
              Welcome Back, Member!
            </DialogTitle>
            <DialogDescription className="text-center">
              Your Ride The Tide membership is active
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-6">
            <div className="mb-4 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-sm text-green-400">
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
          <DialogTitle className="text-center text-2xl flex items-center justify-center gap-2">
            <Crown className="w-6 h-6 text-primary" />
            Unlock Ride The Tide
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 py-4">
          {/* Features Preview */}
          <div>
            <h3 className="text-lg font-semibold mb-4">What You Get</h3>
            <div className="grid grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 rounded-lg bg-secondary/50 border border-border/50"
                >
                  <feature.icon className="w-5 h-5 text-accent mb-2" />
                  <p className="text-sm font-medium">{feature.title}</p>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Pricing Card */}
          <div>
            <Card className="border-accent/50 bg-gradient-to-b from-accent/5 to-transparent">
              <CardHeader className="text-center pb-2">
                <Badge className="w-fit mx-auto mb-2 bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                  Most Popular
                </Badge>
                <CardTitle className="text-xl">Pro Membership</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">€9.99</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <CardDescription>Cancel anytime. No commitment.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-4 space-y-3">
                  {!isAuthenticated ? (
                    <>
                      <Button 
                        onClick={onSignInClick}
                        className="w-full bg-gradient-to-r from-primary to-accent"
                      >
                        Sign In to Subscribe
                      </Button>
                      <p className="text-xs text-center text-muted-foreground">
                        Create an account first, then subscribe
                      </p>
                    </>
                  ) : (
                    <>
                      <Button 
                        onClick={handlePayPalClick}
                        disabled={isProcessing}
                        className="w-full bg-[#0070ba] hover:bg-[#003087] text-white"
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
