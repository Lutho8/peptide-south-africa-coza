import React, { createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  setActiveUserId,
  clearAllUserScopedStorage,
  clearLegacyGlobalKeys,
  initializeStorage,
} from '@/services/storage';
import { clearAllScheduledNotifications } from '@/services/pushScheduler';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// One-time legacy cleanup flag
let legacyCleared = false;
function ensureLegacyCleared() {
  if (legacyCleared) return;
  clearLegacyGlobalKeys();
  legacyCleared = true;
}

function applyUserScope(currentUser: User | null, prevUserId: string | null) {
  // If the user changed (login, switch, or logout), wipe the previous user's
  // local-namespace data so no leakage occurs on the same device.
  const newUserId = currentUser?.id ?? null;
  if (prevUserId !== newUserId) {
    // Wipe ALL namespaced data (both prior user's and any guest leftover).
    clearAllUserScopedStorage();
  }
  setActiveUserId(newUserId);
  // Seed default data into the (now-empty) namespace for this user/guest.
  initializeStorage();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [session, setSession] = React.useState<Session | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const prevUserIdRef = React.useRef<string | null>(null);
  const initializedRef = React.useRef(false);

  React.useEffect(() => {
    ensureLegacyCleared();

    const handleAuth = (currentSession: Session | null) => {
      const currentUser = currentSession?.user ?? null;
      // Only apply scope changes after the first resolution, OR on actual user-id change.
      const prevId = prevUserIdRef.current;
      if (!initializedRef.current || prevId !== (currentUser?.id ?? null)) {
        applyUserScope(currentUser, prevId);
        prevUserIdRef.current = currentUser?.id ?? null;
        initializedRef.current = true;
      }
      setSession(currentSession);
      setUser(currentUser);
      setIsLoading(false);
    };

    // Set up auth state listener BEFORE checking session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, currentSession) => {
        handleAuth(currentSession);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      handleAuth(currentSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, displayName?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { display_name: displayName },
      },
    });
    return { error: error as Error | null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
