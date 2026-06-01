import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { resetPwaMock, pwaMock } from '@/test/setup';

// Mock analytics & onboarding progress so we can assert calls.
const trackSpy = vi.fn();
const markStepSpy = vi.fn();
vi.mock('@/lib/analytics', () => ({ track: (...a: unknown[]) => trackSpy(...a) }));
vi.mock('@/lib/onboardingProgress', async () => {
  const actual = await vi.importActual<typeof import('@/lib/onboardingProgress')>('@/lib/onboardingProgress');
  return { ...actual, markStep: (...a: unknown[]) => markStepSpy(...a) };
});

// Force useOfflineReadiness to return a controllable value
let mockReadiness = { status: 'ready' as const, cachedAssets: 12, lastUpdated: null as number | null };
vi.mock('@/hooks/useOfflineReadiness', () => ({
  useOfflineReadiness: () => mockReadiness,
}));

import { InstallVerification } from '@/components/pwa/InstallVerification';

const UA = {
  iosSafari: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  iosChrome: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 CriOS/120.0 Mobile/15E148 Safari/604.1',
  androidChrome: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Mobile Safari/537.36',
  androidSamsung: 'Mozilla/5.0 (Linux; Android 14; SM-G998B) AppleWebKit/537.36 SamsungBrowser/24.0 Chrome/120 Mobile Safari/537.36',
};

async function runCheck() {
  fireEvent.click(screen.getByRole('button', { name: /Run install check|Re-run check/i }));
  await waitFor(() => expect(screen.queryByText(/Run install check/i)).toBeTruthy(), { timeout: 1500 });
}

beforeEach(() => {
  trackSpy.mockClear();
  markStepSpy.mockClear();
  mockReadiness = { status: 'ready', cachedAssets: 12, lastUpdated: null };
});

describe('InstallVerification — iOS', () => {
  it('passes when iOS Safari is installed and offline-ready', async () => {
    resetPwaMock({
      ua: UA.iosSafari, iosStandalone: true, standaloneMedia: true,
      caches: [{ name: 'rtd-precache', keys: ['/offline.html', '/index.html'], match: { '/offline.html': true } }],
    });
    render(<InstallVerification />);
    await runCheck();

    await waitFor(() => expect(screen.getByText(/You're offline-ready/i)).toBeInTheDocument());
    expect(trackSpy).toHaveBeenCalledWith('install_verification_passed', expect.objectContaining({
      platform: 'ios-safari', standalone: true, swOk: true,
    }));
    expect(markStepSpy).toHaveBeenCalledWith('install_completed', { meta: { source: 'verification' } });
  });

  it('opens iOS Safari troubleshooting when not yet installed', async () => {
    resetPwaMock({ ua: UA.iosSafari, iosStandalone: false, standaloneMedia: false });
    render(<InstallVerification />);
    await runCheck();

    expect(await screen.findByText(/Open the app from your Home Screen icon/i)).toBeInTheDocument();
    expect(screen.getByText(/Add to Home Screen/i)).toBeInTheDocument();
    expect(trackSpy).toHaveBeenCalledWith('install_verification_failed', expect.objectContaining({ standalone: false }));
  });

  it('warns iOS users on a non-Safari browser', async () => {
    resetPwaMock({ ua: UA.iosChrome, iosStandalone: false });
    render(<InstallVerification />);
    await runCheck();
    expect(await screen.findByText(/Install only works in Safari on iOS/i)).toBeInTheDocument();
  });
});

describe('InstallVerification — Android', () => {
  it('fails cache check when offline assets are missing (offline simulation)', async () => {
    mockReadiness = { status: 'ready', cachedAssets: 0, lastUpdated: null };
    resetPwaMock({
      ua: UA.androidChrome, standaloneMedia: true,
      caches: [], // simulate empty cache (offline-not-ready)
    });
    render(<InstallVerification />);
    await runCheck();

    expect(await screen.findByText(/Offline fallback not yet cached/i)).toBeInTheDocument();
    expect(trackSpy).toHaveBeenCalledWith(
      'install_verification_failed',
      expect.objectContaining({ platform: 'android-chrome', cacheOk: false, fallbackOk: false }),
    );
  });

  it('passes for Android Chrome with cache populated', async () => {
    resetPwaMock({
      ua: UA.androidChrome, standaloneMedia: true,
      caches: [{ name: 'workbox-precache', keys: ['/offline.html'], match: { '/offline.html': true } }],
    });
    render(<InstallVerification />);
    await runCheck();

    await waitFor(() => expect(screen.getByText(/You're offline-ready/i)).toBeInTheDocument());
    expect(markStepSpy).toHaveBeenCalledWith('install_completed', { meta: { source: 'verification' } });
  });

  it('shows Chrome deep-link troubleshooting for non-Chrome Android browsers', async () => {
    resetPwaMock({ ua: UA.androidSamsung, standaloneMedia: false });
    render(<InstallVerification />);
    await runCheck();
    const link = await screen.findByRole('link', { name: /Open in Chrome/i });
    expect(link.getAttribute('href')).toMatch(/^intent:\/\//);
  });
});

describe('InstallVerification — troubleshooting interactions', () => {
  it('toggles troubleshooting and fires analytics', async () => {
    resetPwaMock({ ua: UA.iosSafari, iosStandalone: true, standaloneMedia: true,
      caches: [{ name: 'rtd-precache', keys: ['/offline.html'], match: { '/offline.html': true } }] });
    render(<InstallVerification />);
    await runCheck(); // passes, panel stays closed
    fireEvent.click(screen.getByRole('button', { name: /Troubleshooting/i }));
    expect(trackSpy).toHaveBeenCalledWith('install_verification_trouble_toggled', { open: true });
  });

  it('clear cache & retry unregisters SW, drops caches and reloads', async () => {
    resetPwaMock({
      ua: UA.androidChrome,
      caches: [{ name: 'workbox-precache', keys: ['/a'], match: {} }, { name: 'rtd-pages', keys: [], match: {} }],
    });
    render(<InstallVerification />);
    await runCheck();
    fireEvent.click(screen.getByRole('button', { name: /Clear cache & retry/i }));

    await waitFor(() => expect(pwaMock.state.reloads).toBe(1));
    expect(pwaMock.state.cacheDeletes).toEqual(expect.arrayContaining(['workbox-precache', 'rtd-pages']));
    expect(pwaMock.state.unregistered).toBeGreaterThanOrEqual(1);
    expect(trackSpy).toHaveBeenCalledWith('install_verification_clear_retry', expect.any(Object));
  });
});
