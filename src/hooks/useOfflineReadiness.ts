import { useEffect, useState } from 'react';

export type OfflineStatus = 'unknown' | 'caching' | 'ready' | 'unsupported';

const LAST_UPDATED_KEY = 'rtd-offline-last-updated';

export function useOfflineReadiness() {
  const [status, setStatus] = useState<OfflineStatus>('unknown');
  const [cachedAssets, setCachedAssets] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState<number | null>(() => {
    try {
      const v = localStorage.getItem(LAST_UPDATED_KEY);
      return v ? parseInt(v, 10) : null;
    } catch { return null; }
  });

  useEffect(() => {
    let cancelled = false;

    if (!('serviceWorker' in navigator) || !('caches' in window)) {
      setStatus('unsupported');
      return;
    }

    const check = async () => {
      try {
        const reg = await navigator.serviceWorker.getRegistration();
        if (!reg) { if (!cancelled) setStatus('caching'); return; }
        if (reg.installing || reg.waiting) { if (!cancelled) setStatus('caching'); }
        const keys = await caches.keys();
        const relevant = keys.filter(k => /workbox|rtd-|precache/i.test(k));
        let count = 0;
        for (const k of relevant) {
          try { const c = await caches.open(k); count += (await c.keys()).length; } catch {}
        }
        if (cancelled) return;
        setCachedAssets(count);
        if (navigator.serviceWorker.controller && (relevant.length > 0 || count > 0)) {
          setStatus('ready');
        } else if (reg) {
          setStatus('caching');
        }
      } catch {
        if (!cancelled) setStatus('unknown');
      }
    };

    check();
    const onControllerChange = () => {
      const now = Date.now();
      try { localStorage.setItem(LAST_UPDATED_KEY, String(now)); } catch {}
      setLastUpdated(now);
      check();
    };
    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);
    const id = setInterval(check, 15000);
    return () => {
      cancelled = true;
      clearInterval(id);
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
    };
  }, []);

  return { status, cachedAssets, lastUpdated };
}
