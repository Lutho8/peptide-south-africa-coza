// Teaser mode: limited-preview state that persists for the current session only.
// Cleared on cold start so the hard paywall re-shows on every app launch.
// Authenticated users always get the full free experience — teaser is forced off.
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const KEY = 'rtt_teaser_mode';

function read(): boolean {
  try {
    return sessionStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

export function useTeaserMode() {
  const { user } = useAuth();
  const [teaser, setTeaser] = useState<boolean>(() => read());

  useEffect(() => {
    const handler = () => setTeaser(read());
    window.addEventListener('rtt:teaser-mode-changed', handler);
    return () => window.removeEventListener('rtt:teaser-mode-changed', handler);
  }, []);

  // Signed-in users bypass teaser entirely — they get all free features.
  useEffect(() => {
    if (user) {
      try { sessionStorage.removeItem(KEY); } catch { /* noop */ }
      setTeaser(false);
    }
  }, [user]);

  const enableTeaser = useCallback(() => {
    try { sessionStorage.setItem(KEY, '1'); } catch { /* noop */ }
    setTeaser(true);
    window.dispatchEvent(new Event('rtt:teaser-mode-changed'));
  }, []);

  const exitTeaser = useCallback(() => {
    try { sessionStorage.removeItem(KEY); } catch { /* noop */ }
    setTeaser(false);
    window.dispatchEvent(new Event('rtt:teaser-mode-changed'));
  }, []);

  return { teaser, enableTeaser, exitTeaser };
}
