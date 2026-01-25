import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GradientCard } from '@/components/ui/GradientCard';
import { useRenphoSync } from '@/hooks/useRenphoSync';
import { useAuth } from '@/contexts/AuthContext';
import { Scale, RefreshCw, Link2, Unlink, Loader2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export function RenphoConnection() {
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
  const [passwordHash, setPasswordHash] = useState('');

  useEffect(() => {
    if (user) {
      checkConnection();
    }
  }, [user, checkConnection]);

  const handleConnect = async () => {
    if (!email || !passwordHash) return;
    
    const success = await connectRenpho(email, passwordHash);
    if (success) {
      setShowConnect(false);
      setEmail('');
      setPasswordHash('');
    }
  };

  if (!user) {
    return (
      <GradientCard className="p-4">
        <div className="flex items-center gap-3">
          <Scale size={20} className="text-muted-foreground" />
          <div>
            <p className="font-medium text-foreground">Renpho Scale Sync</p>
            <p className="text-xs text-muted-foreground">Sign in to connect your Renpho account</p>
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
            <p className="font-medium text-foreground">Renpho Scale Sync</p>
            <p className="text-xs text-muted-foreground">
              {isConnected 
                ? `Connected • Last sync: ${lastSyncAt ? lastSyncAt.toLocaleDateString() : 'Never'}`
                : 'Not connected'
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
              Connect
            </Button>
          )}
        </div>
      </div>

      {showConnect && (
        <div className="space-y-3 pt-3 border-t border-border/50">
          <div className="flex items-start gap-2 p-2 rounded-lg bg-muted/50 text-xs text-muted-foreground">
            <Info size={14} className="flex-shrink-0 mt-0.5" />
            <p>
              Enter your Renpho app email and password hash. Your password hash can be found using 
              browser dev tools when signing into the Renpho web app.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs">Renpho Email</Label>
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-muted border-border"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs">Password Hash</Label>
            <Input
              type="password"
              placeholder="Your encrypted password hash"
              value={passwordHash}
              onChange={(e) => setPasswordHash(e.target.value)}
              className="bg-muted border-border"
            />
          </div>

          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={handleConnect}
              disabled={isSyncing || !email || !passwordHash}
              className="flex-1"
            >
              {isSyncing ? (
                <Loader2 size={14} className="animate-spin mr-1" />
              ) : null}
              Connect
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowConnect(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </GradientCard>
  );
}
