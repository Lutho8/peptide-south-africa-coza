import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GradientCard } from '@/components/ui/GradientCard';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDoseReminders } from '@/hooks/useDoseReminders';
import {
  getPeptideSound,
  setPeptideSound,
  previewTone,
  AVAILABLE_TONES,
  type NotificationTone,
} from '@/services/notificationSounds';
import { Volume2, Play } from 'lucide-react';

export function NotificationSoundSettings() {
  const { t, i18n } = useTranslation();
  const { reminders } = useDoseReminders();
  const [soundSettings, setSoundSettings] = useState<Record<string, NotificationTone>>({});

  // Get unique peptides from reminders
  const uniquePeptides = reminders.reduce((acc, reminder) => {
    if (!acc.find(p => p.id === reminder.peptide_id)) {
      acc.push({
        id: reminder.peptide_id,
        name: reminder.peptide_name,
      });
    }
    return acc;
  }, [] as { id: string; name: string }[]);

  // Load saved sound settings
  useEffect(() => {
    const settings: Record<string, NotificationTone> = {};
    uniquePeptides.forEach(peptide => {
      settings[peptide.id] = getPeptideSound(peptide.id);
    });
    setSoundSettings(settings);
  }, [uniquePeptides.length]);

  const handleSoundChange = (peptideId: string, peptideName: string, tone: NotificationTone) => {
    setPeptideSound(peptideId, peptideName, tone);
    setSoundSettings(prev => ({ ...prev, [peptideId]: tone }));
  };

  const handlePreview = (tone: NotificationTone) => {
    previewTone(tone);
  };

  const getToneLabel = (tone: NotificationTone): string => {
    const labels: Record<NotificationTone, string> = {
      default: t('notifications.defaultTone'),
      gentle: t('notifications.gentle'),
      urgent: t('notifications.urgent'),
      chime: t('notifications.chime'),
      bell: t('notifications.bell'),
      digital: t('notifications.digital'),
    };
    return labels[tone];
  };

  if (uniquePeptides.length === 0) {
    return null;
  }

  return (
    <GradientCard className="p-4">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Volume2 size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">{t('notifications.customSounds')}</h3>
            <p className="text-sm text-muted-foreground">{t('notifications.selectTone')}</p>
          </div>
        </div>

        <div className="h-px bg-border" />

        <div className="space-y-3">
          {uniquePeptides.map(peptide => (
            <div key={peptide.id} className="flex items-center justify-between gap-3">
              <Label className="text-sm text-foreground flex-1 min-w-0 truncate">
                {peptide.name}
              </Label>
              <div className="flex items-center gap-2">
                <Select
                  value={soundSettings[peptide.id] || 'default'}
                  onValueChange={(value) => handleSoundChange(peptide.id, peptide.name, value as NotificationTone)}
                >
                  <SelectTrigger className="w-28 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_TONES.map(tone => (
                      <SelectItem key={tone} value={tone}>
                        {getToneLabel(tone)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handlePreview(soundSettings[peptide.id] || 'default')}
                >
                  <Play size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Preview all tones */}
        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Preview tones:</p>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_TONES.map(tone => (
              <Button
                key={tone}
                variant="outline"
                size="sm"
                className="text-xs h-7 px-2"
                onClick={() => handlePreview(tone)}
              >
                <Play size={10} className="mr-1" />
                {getToneLabel(tone)}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </GradientCard>
  );
}
