import { HashRouter, BrowserRouter } from "react-router-dom";
import type { ReactNode } from "react";

/**
 * Environment-aware router.
 *
 * - WEB build  → BrowserRouter (clean paths like /peptides/bpc-157), which is
 *   required for prerendering/SSG and for crawlers to see real URLs.
 * - NATIVE build (Capacitor Android/iOS) → HashRouter, which works from a
 *   file:// bundle without a server to handle deep-link rewrites.
 *
 * Selection is driven by the VITE_ROUTER build flag (see vite.config.ts):
 *   VITE_ROUTER === "hash"  → HashRouter   (set for the Capacitor build)
 *   otherwise               → BrowserRouter (default web build)
 *
 * A runtime Capacitor check is used as a belt-and-braces fallback so a native
 * bundle that somehow missed the flag still gets HashRouter rather than a
 * broken BrowserRouter on file://.
 */
function useHashRouting(): boolean {
  const flag = import.meta.env.VITE_ROUTER as string | undefined;
  if (flag === "hash") return true;
  if (flag === "browser") return false;
  // Fallback: detect a Capacitor native shell at runtime.
  if (typeof window !== "undefined") {
    const w = window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } };
    if (w.Capacitor?.isNativePlatform?.()) return true;
    if (window.location.protocol === "file:") return true;
  }
  return false;
}

export default function AppRouter({ children }: { children: ReactNode }) {
  const Router = useHashRouting() ? HashRouter : BrowserRouter;
  return <Router>{children}</Router>;
}
