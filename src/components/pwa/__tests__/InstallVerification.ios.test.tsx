import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { resetPwaMock, pwaMock, goOffline, goOnline } from '@/test/setup';

const trackSpy = vi.fn();
const markStepSpy = vi.fn();
vi.mock('@/lib/analytics', () => ({ track: (...a: unknown[]) => trackSpy(...a) }));
vi.mock('@/lib/onboardingProgress', async () => {
  const actual = await vi.importActual<typeof import('@/lib/onboardingProgress')>('@/lib/onboardingProgress');
  return { ...actual, markStep: (...a: unknown[]) => markStepSpy(...a) };
});

let mockReadiness = { status: 'ready' as const, cachedAssets: 12, lastUpdated: null as number | null };
vi.mock('@/hooks/useOfflineReadiness', () => ({
  useOfflineReadiness: () => mockReadiness,
}));

import { InstallVerification } from '@/components/pwa/InstallVerification';

const IOS_SAFARI =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

async function runCheck() {
  fireEvent.click(screen.getByRole('button', { name: /Run install check|Re-run check/i }));
  await waitFor(() => expect(screen.queryByText(/Run install check|Re-run check/i)).toBeTruthy(), { timeout: 1500 });
}

beforeEach(() => {
  trackSpy.mockClear();
  markStepSpy.mockClear();
  mockReadiness = { status: 'ready', cachedAssets: 12, lastUpdated: null };
});

describe('InstallVerification — iOS Safari realistic states', () => {
  it('in-Safari tab (not installed) auto-opens Safari install steps', async () => {
    resetPwaMock({ ua: IOS_SAFARI, iosStandalone: false, standaloneMedia: false });
    render(<InstallVerification />);
    await runCheck();

    expect(await screen.findByText(/Open the app from your Home Screen icon/i)).toBeInTheDocument();
    // Troubleshooting auto-expands with the exact Safari steps
    expect(screen.getByText(/iOS Safari/i)).toBeInTheDocument();
    expect(screen.getByText(/Add to Home Screen/i)).toBeInTheDocument();

    expect(trackSpy).toHaveBeenCalledWith(
      'install_verification_failed',
      expect.objectContaining({ platform: 'ios-safari', standalone: false }),
    );
  });

  it('standalone + older iOS without serviceWorker still passes (SW marked n/a)', async () => {
    mockReadiness = { status: 'unsupported', cachedAssets: 0, lastUpdated: null };
    resetPwaMock({
      ua: IOS_SAFARI, iosStandalone: true, standaloneMedia: true, swSupported: false,
    });
    render(<InstallVerification />);
    await runCheck();

    expect(await screen.findByText(/Not supported on this browser/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText(/You're offline-ready/i)).toBeInTheDocument());
    expect(markStepSpy).toHaveBeenCalledWith('install_completed', { meta: { source: 'verification' } });
  });

  it('standalone + Private Browsing surfaces incognito troubleshooting', async () => {
    mockReadiness = { status: 'ready', cachedAssets: 0, lastUpdated: null };
    resetPwaMock({
      ua: IOS_SAFARI, iosStandalone: true, standaloneMedia: true, privateBrowsing: true,
    });
    render(<InstallVerification />);
    await runCheck();

    expect(await screen.findByText(/Cache not yet populated/i)).toBeInTheDocument();
    expect(await screen.findByText(/Offline fallback not yet cached/i)).toBeInTheDocument();
    expect(screen.getByText(/Disable private\/incognito mode/i)).toBeInTheDocument();
  });

  it('standalone + SW blocked (SecurityError) reports SW failure', async () => {
    resetPwaMock({
      ua: IOS_SAFARI, iosStandalone: true, standaloneMedia: true, swBlocked: true,
      caches: [{ name: 'rtd-precache', keys: ['/offline.html'], match: { '/offline.html': true } }],
    });
    render(<InstallVerification />);
    await runCheck();

    expect(await screen.findByText(/Could not query service worker/i)).toBeInTheDocument();
    expect(trackSpy).toHaveBeenCalledWith(
      'install_verification_failed',
      expect.objectContaining({ platform: 'ios-safari', swOk: false }),
    );
  });

  it('cache populated but /offline.html missing → fallback row fails, cache row passes', async () => {
    resetPwaMock({
      ua: IOS_SAFARI, iosStandalone: true, standaloneMedia: true,
      caches: [{ name: 'rtd-precache', keys: ['/index.html'], match: { '/index.html': true } }],
      cacheMatchFailsFor: ['/offline.html'],
    });
    render(<InstallVerification />);
    await runCheck();

    expect(await screen.findByText(/Offline fallback not yet cached/i)).toBeInTheDocument();
    expect(screen.getByText(/assets cached/i)).toBeInTheDocument();
  });

  it('passes when toggled offline mid-check (cache serves verification)', async () => {
    resetPwaMock({
      ua: IOS_SAFARI, iosStandalone: true, standaloneMedia: true,
      caches: [{ name: 'rtd-precache', keys: ['/offline.html'], match: { '/offline.html': true } }],
    });
    render(<InstallVerification />);
    goOffline();
    await runCheck();
    expect(pwaMock.state.online).toBe(false);
    await waitFor(() => expect(screen.getByText(/You're offline-ready/i)).toBeInTheDocument());
    goOnline();
  });

  it('iPad desktop-mode UA is treated as iOS Safari (not desktop/Android)', async () => {
    resetPwaMock({
      ipadDesktopUa: true, iosStandalone: false, standaloneMedia: false,
    });
    render(<InstallVerification />);
    await runCheck();

    // Platform pill shows ios safari
    expect(screen.getByText(/ios safari/i)).toBeInTheDocument();
    // Safari (not Android Chrome) troubleshooting is shown
    expect(screen.getByText(/Add to Home Screen/i)).toBeInTheDocument();
    expect(screen.queryByText(/Android Chrome/i)).not.toBeInTheDocument();
  });

  it('re-running after fixing install flips failed → passed exactly once', async () => {
    resetPwaMock({ ua: IOS_SAFARI, iosStandalone: false, standaloneMedia: false });
    render(<InstallVerification />);
    await runCheck();
    expect(trackSpy).toHaveBeenCalledWith('install_verification_failed', expect.any(Object));

    // Simulate the user adding to Home Screen and reopening.
    resetPwaMock({
      ua: IOS_SAFARI, iosStandalone: true, standaloneMedia: true,
      caches: [{ name: 'rtd-precache', keys: ['/offline.html'], match: { '/offline.html': true } }],
    });
    trackSpy.mockClear();
    await runCheck();

    await waitFor(() => expect(screen.getByText(/You're offline-ready/i)).toBeInTheDocument());
    const passedCalls = trackSpy.mock.calls.filter(([e]) => e === 'install_verification_passed');
    expect(passedCalls).toHaveLength(1);
  });

  it('fires install_verification_started exactly once per Run click', async () => {
    resetPwaMock({
      ua: IOS_SAFARI, iosStandalone: true, standaloneMedia: true,
      caches: [{ name: 'rtd-precache', keys: ['/offline.html'], match: { '/offline.html': true } }],
    });
    render(<InstallVerification />);
    await runCheck();
    const startedCalls = trackSpy.mock.calls.filter(([e]) => e === 'install_verification_started');
    expect(startedCalls).toHaveLength(1);
    expect(startedCalls[0][1]).toMatchObject({ platform: 'ios-safari' });
  });
});
