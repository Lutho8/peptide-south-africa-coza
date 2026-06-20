import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, BellPlus, Check, Loader2 } from 'lucide-react';
import { useDoseReminders } from '@/hooks/useDoseReminders';
import { useToast } from '@/hooks/use-toast';
import { getNotificationPermission, requestNotificationPermission, isNotificationSupported } from '@/services/notifications';

interface QuickAddReminderButtonProps {
  peptideId: string;
  peptideName: string;
  dose: string;
  unit: string;
  time: string;
}

export function QuickAddReminderButton({ 
  peptideId, 
  peptideName, 
  dose, 
  unit, 
  time 
}: QuickAddReminderButtonProps) {
  const { addReminder, reminders } = useDoseReminders();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // Check if a similar reminder already exists
  const existingReminder = reminders.find(
    r => r.peptide_id === peptideId && r.time === time
  );

  const handleAddReminder = async () => {
    if (!isNotificationSupported()) {
      toast({
        title: 'Notifications not supported',
        description: 'Your browser does not support notifications',
        variant: 'destructive',
      });
      return;
    }

    // Check/request permission
    let permission = getNotificationPermission();
    if (permission !== 'granted') {
      permission = await requestNotificationPermission();
      if (permission !== 'granted') {
        toast({
          title: 'Permission required',
          description: 'Enable notifications in Settings to receive reminders',
          variant: 'destructive',
        });
        return;
      }
    }

    setIsAdding(true);
    try {
      await addReminder({
        peptide_id: peptideId,
        peptide_name: peptideName,
        dose: `${dose}${unit}`,
        time: time,
        days: [], // Empty means every day
        enabled: true,
      });
      
      setIsAdded(true);
      toast({
        title: 'Reminder created',
        description: `Daily reminder set for ${peptideName} at ${time}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create reminder',
        variant: 'destructive',
      });
    } finally {
      setIsAdding(false);
    }
  };

  if (existingReminder || isAdded) {
    return (
      <Button variant="ghost" size="sm" disabled className="text-emerald-500 gap-1">
        <Check size={14} />
        Reminder set
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleAddReminder}
      disabled={isAdding}
      className="text-muted-foreground hover:text-primary gap-1"
    >
      {isAdding ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <BellPlus size={14} />
      )}
      Set daily reminder
    </Button>
  );
}
