import "@testing-library/jest-dom";

class IO {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
}
(globalThis as unknown as { IntersectionObserver: typeof IO }).IntersectionObserver = IO;
(globalThis as unknown as { ResizeObserver: typeof IO }).ResizeObserver = IO;


Object.defineProperty(window, "matchMedia", {
  writable: true,
  configurable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// ---- Test helpers for PWA install verification ----

type CacheEntry = { name: string; keys: string[]; match: Record<string, boolean> };

export interface PwaMockState {
  ua: string;
  standaloneMedia: boolean;
  iosStandalone: boolean;
  swSupported: boolean;
  swBlocked: boolean;
  swController: object | null;
  swRegistration: object | null;
  caches: CacheEntry[];
  cacheMatchFailsFor: string[];
  privateBrowsing: boolean;
  online: boolean;
  ipadDesktopUa: boolean;
  reloads: number;
  unregistered: number;
  cacheDeletes: string[];
}

export const pwaMock: { state: PwaMockState } = {
  state: createInitial(),
};

function createInitial(): PwaMockState {
  return {
    ua: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
    standaloneMedia: false,
    iosStandalone: false,
    swSupported: true,
    swBlocked: false,
    swController: { state: 'activated' },
    swRegistration: {},
    caches: [],
    cacheMatchFailsFor: [],
    privateBrowsing: false,
    online: true,
    ipadDesktopUa: false,
    reloads: 0,
    unregistered: 0,
    cacheDeletes: [],
  };
}

export function resetPwaMock(patch: Partial<PwaMockState> = {}) {
  pwaMock.state = { ...createInitial(), ...patch };
  applyMocks();
}

function applyMocks() {
  const s = pwaMock.state;

  // userAgent
  Object.defineProperty(window.navigator, 'userAgent', {
    configurable: true, get: () => s.ua,
  });
  Object.defineProperty(window.navigator, 'platform', {
    configurable: true, get: () => (/iPad|iPhone|iPod/.test(s.ua) ? 'iPhone' : 'Linux'),
  });

  // iOS Safari standalone flag
  Object.defineProperty(window.navigator, 'standalone', {
    configurable: true, get: () => s.iosStandalone,
  });

  // matchMedia: only the standalone query is meaningful
  (window as unknown as { matchMedia: (q: string) => MediaQueryList }).matchMedia = (query: string) => ({
    matches: query.includes('standalone') ? s.standaloneMedia : false,
    media: query, onchange: null,
    addListener: () => {}, removeListener: () => {},
    addEventListener: () => {}, removeEventListener: () => {},
    dispatchEvent: () => false,
  }) as unknown as MediaQueryList;

  // serviceWorker
  if (s.swSupported) {
    const regs = s.swRegistration ? [{ unregister: async () => { s.unregistered++; return true; } }] : [];
    Object.defineProperty(window.navigator, 'serviceWorker', {
      configurable: true,
      value: {
        controller: s.swController,
        getRegistration: async () => (s.swRegistration ? { unregister: async () => { s.unregistered++; return true; } } : undefined),
        getRegistrations: async () => regs,
        register: async () => regs[0] ?? {},
        addEventListener: () => {}, removeEventListener: () => {},
        ready: Promise.resolve(regs[0] ?? {}),
      },
    });
  } else {
    // delete via redefining as undefined
    Object.defineProperty(window.navigator, 'serviceWorker', {
      configurable: true, value: undefined,
    });
  }

  // CacheStorage
  Object.defineProperty(window, 'caches', {
    configurable: true,
    value: {
      keys: async () => s.caches.map(c => c.name),
      open: async (name: string) => {
        const entry = s.caches.find(c => c.name === name) ?? { name, keys: [], match: {} };
        return {
          keys: async () => entry.keys.map(k => new Request(k)),
        };
      },
      match: async (req: RequestInfo) => {
        const url = typeof req === 'string' ? req : (req as Request).url;
        for (const c of s.caches) if (c.match[url] || c.keys.includes(url)) return new Response('');
        return undefined;
      },
      delete: async (name: string) => {
        s.cacheDeletes.push(name);
        s.caches = s.caches.filter(c => c.name !== name);
        return true;
      },
    },
  });

  // location.reload spy
  const loc = window.location;
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: { ...loc, reload: () => { s.reloads++; }, assign: () => {} },
  });
}

applyMocks();
