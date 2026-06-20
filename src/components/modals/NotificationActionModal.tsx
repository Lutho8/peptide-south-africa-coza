import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, Clock, X } from 'lucide-react';
import { snoozeNotification } from '@/services/notifications';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface NotificationActionModalProps {
  onMarkAsTaken: (peptideName: string, dose: string, time: string) => void;
}

interface NotificationData {
  reminderId?: string;
  peptideName: string;
  dose: string;
  time: string;
}

export function NotificationActionModal({ onMarkAsTaken }: NotificationActionModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationData, setNotificationData] = useState<NotificationData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const handleNotificationClick = (event: CustomEvent<NotificationData>) => {
      setNotificationData(event.detail);
      setIsOpen(true);
    };

    window.addEventListener('doseNotificationClick', handleNotificationClick as EventListener);
    return () => {
      window.removeEventListener('doseNotificationClick', handleNotificationClick as EventListener);
    };
  }, []);

  const handleMarkAsTaken = () => {
    if (notificationData) {
      onMarkAsTaken(notificationData.peptideName, notificationData.dose, notificationData.time);
      toast({
        title: 'Dose logged',
        description: `${notificationData.peptideName} ${notificationData.dose} marked as taken`,
      });
    }
    setIsOpen(false);
    setNotificationData(null);
  };

  const handleSnooze = (minutes: number) => {
    if (notificationData && notificationData.reminderId) {
      snoozeNotification(
        notificationData.reminderId,
        notificationData.peptideName,
        notificationData.dose,
        minutes
      );
      toast({
        title: 'Reminder snoozed',
        description: `You'll be reminded again in ${minutes} minutes`,
      });
    }
    setIsOpen(false);
    setNotificationData(null);
  };

  const handleDismiss = () => {
    setIsOpen(false);
    setNotificationData(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            💉 {notificationData?.peptideName}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-muted-foreground">
            Scheduled dose: <span className="text-foreground font-medium">{notificationData?.dose}</span>
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Time: {notificationData?.time}
          </p>
        </div>

        <div className="space-y-3">
          <Button 
            className="w-full gap-2" 
            onClick={handleMarkAsTaken}
          >
            <Check size={18} />
            Mark as Taken
          </Button>

          <div className="grid grid-cols-3 gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleSnooze(5)}
              className="gap-1"
            >
              <Clock size={14} />
              5 min
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleSnooze(10)}
              className="gap-1"
            >
              <Clock size={14} />
              10 min
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleSnooze(30)}
              className="gap-1"
            >
              <Clock size={14} />
              30 min
            </Button>
          </div>

          <Button 
            variant="ghost" 
            className="w-full text-muted-foreground"
            onClick={handleDismiss}
          >
            <X size={16} className="mr-1" />
            Dismiss
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
