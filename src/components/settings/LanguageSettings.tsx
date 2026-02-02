import { useTranslation } from 'react-i18next';
import { GradientCard } from '@/components/ui/GradientCard';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { changeLanguage, getCurrentLanguage } from '@/i18n';
import { Languages } from 'lucide-react';
import { toast } from 'sonner';

export function LanguageSettings() {
  const { t } = useTranslation();
  const currentLang = getCurrentLanguage();

  const handleLanguageChange = (lang: string) => {
    changeLanguage(lang);
    toast.success(t('toast.languageChanged'));
  };

  return (
    <GradientCard className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Languages size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">{t('settings.language')}</h3>
            <p className="text-sm text-muted-foreground">{t('settings.selectLanguage')}</p>
          </div>
        </div>
        <Select value={currentLang} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">
              <span className="flex items-center gap-2">
                <span>🇬🇧</span>
                <span>{t('settings.english')}</span>
              </span>
            </SelectItem>
            <SelectItem value="de">
              <span className="flex items-center gap-2">
                <span>🇩🇪</span>
                <span>{t('settings.german')}</span>
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </GradientCard>
  );
}
