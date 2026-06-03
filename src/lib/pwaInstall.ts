export type Platform =
  | 'ios-safari'
  | 'ios-non-safari'
  | 'android-chrome'
  | 'android-other'
  | 'desktop';

export function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'desktop';
  const ua = navigator.userAgent || '';
  const isIOS = /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && (navigator as Navigator & { maxTouchPoints?: number }).maxTouchPoints! > 1);
  if (isIOS) {
    const nonSafari = /CriOS|FxiOS|EdgiOS|OPiOS|GSA\//.test(ua);
    return nonSafari ? 'ios-non-safari' : 'ios-safari';
  }
  if (/Android/i.test(ua)) {
    const chrome = /Chrome\//.test(ua) && !/SamsungBrowser|EdgA|OPR|UCBrowser|YaBrowser/i.test(ua);
    return chrome ? 'android-chrome' : 'android-other';
  }
  return 'desktop';
}

export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    if (window.matchMedia('(display-mode: standalone)').matches) return true;
  } catch {}
  // iOS Safari
  return Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);
}

export type CtaState =
  | { kind: 'installed' }
  | { kind: 'native-prompt' }
  | { kind: 'manual'; platform: Platform };

export function getInstallCtaState(opts: {
  isInstallable: boolean;
  isInstalled: boolean;
  platform: Platform;
}): CtaState {
  if (opts.isInstalled || isStandalone()) return { kind: 'installed' };
  if (opts.isInstallable) return { kind: 'native-prompt' };
  return { kind: 'manual', platform: opts.platform };
}

export function chromeIntentUrl(href: string = 'https://ridethetide.info'): string {
  const stripped = href.replace(/^https?:\/\//, '');
  return `intent://${stripped}#Intent;scheme=https;package=com.android.chrome;end`;
}
