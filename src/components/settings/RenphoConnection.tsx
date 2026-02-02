import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GradientCard } from '@/components/ui/GradientCard';
import { useRenphoSync } from '@/hooks/useRenphoSync';
import { useAuth } from '@/contexts/AuthContext';
import { Scale, RefreshCw, Link2, Unlink, Loader2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export function RenphoConnection() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { 
    isConnected, 
    isSyncing, 
    lastSyncAt, 
    checkConnection, 
    connectRenpho, 
    syncMeasurements, 
    disconnectRenpho 
  } = useRenphoSync();
  
  const [showConnect, setShowConnect] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (user) {
      checkConnection();
    }
  }, [user, checkConnection]);

  const handleConnect = async () => {
    if (!email || !password) return;
    
    const success = await connectRenpho(email, password);
    if (success) {
      setShowConnect(false);
      setEmail('');
      setPassword('');
    }
  };

  if (!user) {
    return (
      <GradientCard className="p-4">
        <div className="flex items-center gap-3">
          <Scale size={20} className="text-muted-foreground" />
          <div>
            <p className="font-medium text-foreground">{t('renpho.title')}</p>
            <p className="text-xs text-muted-foreground">{t('renpho.signInToConnect')}</p>
          </div>
        </div>
      </GradientCard>
    );
  }

  return (
    <GradientCard className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Scale size={20} className={cn("transition-colors", isConnected ? "text-primary" : "text-muted-foreground")} />
          <div>
            <p className="font-medium text-foreground">{t('renpho.title')}</p>
            <p className="text-xs text-muted-foreground">
              {isConnected 
                ? `${t('renpho.connected')} • ${t('settings.lastSync')}: ${lastSyncAt ? lastSyncAt.toLocaleDateString() : t('renpho.never')}`
                : t('renpho.notConnected')
              }
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          {isConnected ? (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={syncMeasurements}
                disabled={isSyncing}
              >
                {isSyncing ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <RefreshCw size={14} />
                )}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={disconnectRenpho}
                className="text-destructive hover:text-destructive"
              >
                <Unlink size={14} />
              </Button>
            </>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowConnect(!showConnect)}
            >
              <Link2 size={14} className="mr-1" />
              {t('renpho.connect')}
            </Button>
          )}
        </div>
      </div>

      {showConnect && (
        <div className="space-y-3 pt-3 border-t border-border/50">
          <div className="flex items-start gap-2 p-2 rounded-lg bg-muted/50 text-xs text-muted-foreground">
            <Info size={14} className="flex-shrink-0 mt-0.5" />
            <p>{t('renpho.credentialsInfo')}</p>
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs">{t('renpho.email')}</Label>
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-muted border-border"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs">{t('renpho.password')}</Label>
            <Input
              type="password"
              placeholder={t('renpho.passwordPlaceholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-muted border-border"
            />
          </div>

          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={handleConnect}
              disabled={isSyncing || !email || !password}
              className="flex-1"
            >
              {isSyncing ? (
                <Loader2 size={14} className="animate-spin mr-1" />
              ) : null}
              {t('renpho.connect')}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowConnect(false)}
            >
              {t('common.cancel')}
            </Button>
          </div>
        </div>
      )}
    </GradientCard>
  );
}
