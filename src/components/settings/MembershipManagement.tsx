import { useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Calendar, CreditCard, AlertCircle, CheckCircle, XCircle, Loader2, ArrowLeft, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useMembership } from '@/hooks/useMembership';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface MembershipManagementProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MembershipManagement({ open, onOpenChange }: MembershipManagementProps) {
  const { user } = useAuth();
  const { membership, hasMembership, isLoading, cancelMembership, refetch } = useMembership();
  const { toast } = useToast();
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const handleCancelMembership = async () => {
    setIsCancelling(true);
    try {
      await cancelMembership();
      toast({
        title: "Membership Cancelled",
        description: "Your membership will remain active until the end of the billing period.",
      });
      setShowCancelConfirm(false);
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel membership. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  const getStatusBadge = () => {
    if (!membership) return null;
    
    const statusConfig = {
      active: { label: 'Active', variant: 'default' as const, icon: CheckCircle, className: 'bg-green-500/10 text-green-600 border-green-500/20' },
      cancelled: { label: 'Cancelled', variant: 'secondary' as const, icon: XCircle, className: 'bg-orange-500/10 text-orange-600 border-orange-500/20' },
      expired: { label: 'Expired', variant: 'destructive' as const, icon: AlertCircle, className: 'bg-destructive/10 text-destructive border-destructive/20' },
      pending: { label: 'Pending', variant: 'outline' as const, icon: Loader2, className: 'bg-muted text-muted-foreground' },
    };
    
    const config = statusConfig[membership.status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className={`${config.className} flex items-center gap-1.5`}>
        <Icon className={`w-3.5 h-3.5 ${membership.status === 'pending' ? 'animate-spin' : ''}`} />
        {config.label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-primary" />
            Membership Settings
          </DialogTitle>
          <DialogDescription>
            Manage your Ride The Tide subscription
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current Plan */}
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Pro Membership</CardTitle>
                {getStatusBadge()}
              </div>
              <CardDescription>
                €{membership?.price_amount || '9.99'}/month
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {membership && (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      Started
                    </p>
                    <p className="font-medium">
                      {membership.started_at 
                        ? new Date(membership.started_at).toLocaleDateString() 
                        : 'Not started'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4" />
                      Next Billing
                    </p>
                    <p className="font-medium">
                      {membership.expires_at 
                        ? new Date(membership.expires_at).toLocaleDateString() 
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              )}

              {hasMembership && (
                <div className="pt-2">
                  <p className="text-xs text-muted-foreground mb-3">
                    Your subscription is managed through PayPal. To update payment method, visit PayPal.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => window.open('https://www.paypal.com/myaccount/autopay', '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Manage on PayPal
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cancel Section */}
          {hasMembership && membership?.status === 'active' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {showCancelConfirm ? (
                <Alert variant="destructive" className="border-destructive/30 bg-destructive/5">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Cancel Membership?</AlertTitle>
                  <AlertDescription className="mt-2">
                    <p className="mb-4">
                      Your membership will remain active until {membership.expires_at 
                        ? new Date(membership.expires_at).toLocaleDateString() 
                        : 'the end of the billing period'}. After that, you'll lose access to Pro features.
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleCancelMembership}
                        disabled={isCancelling}
                      >
                        {isCancelling ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Cancelling...
                          </>
                        ) : (
                          'Confirm Cancel'
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowCancelConfirm(false)}
                      >
                        Keep Membership
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              ) : (
                <Button
                  variant="ghost"
                  className="w-full text-muted-foreground hover:text-destructive"
                  onClick={() => setShowCancelConfirm(true)}
                >
                  Cancel Membership
                </Button>
              )}
            </motion.div>
          )}

          {/* Cancelled but still active notice */}
          {membership?.status === 'cancelled' && membership?.expires_at && new Date(membership.expires_at) > new Date() && (
            <Alert className="border-orange-500/20 bg-orange-500/5">
              <AlertCircle className="h-4 w-4 text-orange-500" />
              <AlertTitle className="text-orange-600">Membership Ending Soon</AlertTitle>
              <AlertDescription>
                Your membership is cancelled but remains active until {new Date(membership.expires_at).toLocaleDateString()}. 
                You can resubscribe anytime to maintain access.
              </AlertDescription>
            </Alert>
          )}

          {/* Expired notice */}
          {(membership?.status === 'expired' || (membership?.expires_at && new Date(membership.expires_at) < new Date())) && (
            <Alert variant="destructive" className="border-destructive/30 bg-destructive/5">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Membership Expired</AlertTitle>
              <AlertDescription>
                Resubscribe to regain access to all Pro features.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
