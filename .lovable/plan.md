
## Goal

Replace the stubbed Play Billing wrapper with a working RevenueCat integration on Android (via `@revenuecat/purchases-capacitor`), expose it through a clean `useSubscription` React hook, and rewire `PaywallScreen` + the existing `playBilling` service to use it.

## Conflicts to resolve before I build (please confirm)

1. **File path conflict.** You asked for `lib/billing.ts`, but `src/lib/billing.ts` already exists and is the Tagadapay (web) checkout stub. Overwriting it will break the web Continue button in `PaywallScreen` and `TeaserMode`. **My plan puts RevenueCat in `src/lib/revenuecat.ts`** and keeps `src/lib/billing.ts` as the web/Tagadapay path. The existing `src/services/playBilling.ts` becomes a thin router (native → RevenueCat, web → Tagadapay). If you'd rather I literally overwrite `src/lib/billing.ts`, say so and I'll merge both providers into one file.

2. **Env var name.** `NEXT_PUBLIC_*` is a Next.js convention; this project is Vite, so the equivalent is `VITE_REVENUECAT_ANDROID_KEY`. Vite only exposes vars prefixed with `VITE_` to client code. RevenueCat issues **separate public SDK keys per platform** (one for Android `goog_…`, one for iOS `appl_…`) — there isn't a single key. I'll use `VITE_REVENUECAT_ANDROID_KEY` (and leave room for `VITE_REVENUECAT_IOS_KEY` later). The `.env` file is auto-managed; you'll need to add the key in **Project Settings → Environment Variables** after I scaffold the code.

3. **Pricing string mismatch.** Memory + `PaywallScreen` show **R4.99 / month**. The product ID you provided is `info.ridethetide.app.premium.weekly`. RevenueCat returns the real price string from Play Console at runtime, so the UI will display whatever you configure for that SKU in Play Console (e.g. `R4.99/week`). I won't hardcode a price — I'll display `pkg.product.priceString` once the offering loads. If Play Console says weekly and the screen still says "/ month", that's a Play Console pricing decision, not a code change.

## What I'll build

### 1. New: `src/lib/revenuecat.ts` (native-only RevenueCat wrapper)

Pure functions, no React. Each function is wrapped in try/catch and returns a typed result rather than throwing — never crashes the app. Web calls short-circuit to `{ ok: false, reason: 'not-native' }`.

```ts
initializeBilling(userId: string): Promise<{ ok: boolean; error?: string }>
getOffering(): Promise<PurchasesPackage | null>          // offering 'default', package matching PRODUCT_ID
purchaseWeekly(): Promise<{ ok: boolean; isPremium: boolean; error?: string }>
restorePurchases(): Promise<{ ok: boolean; isPremium: boolean; error?: string }>
checkSubscriptionStatus(): Promise<{ isPremium: boolean }>
```

Constants (top of file, easy to change):
- `PRODUCT_ID = 'info.ridethetide.app.premium.weekly'`
- `OFFERING_ID = 'default'`
- `ENTITLEMENT_ID = 'premium'`

Implementation detail: `checkSubscriptionStatus` reads `customerInfo.entitlements.active['premium']`. `purchaseWeekly` calls `Purchases.purchasePackage` on the package whose `product.identifier === PRODUCT_ID` from offering `default`.

### 2. Rewire `src/services/playBilling.ts`

Becomes the single platform router used by the rest of the app:

```ts
isNativeBilling()           // unchanged
purchaseSubscription()      // native → revenuecat.purchaseWeekly(); web → startCheckout('monthly')
restorePurchases()          // native → revenuecat.restorePurchases(); web → toast "sign in instead"
checkSubscriptionStatus()   // native → revenuecat; web → false (web premium status comes from Supabase membership, not RC)
```

Removes the "not configured" toast — that's no longer true once RC is wired.

### 3. New: `src/hooks/useSubscription.ts`

```ts
const { isPremium, isLoading, error, purchase, restore, refresh } = useSubscription();
```

Behavior:
- On mount: reads `useAuth().user.id`, calls `initializeBilling(userId)` (native only), then `checkSubscriptionStatus()`.
- `isPremium`: boolean, defaults to `false` while loading.
- `isLoading`: true during init + status check.
- `error`: string | null — set from any failed call, never throws.
- `purchase()`: calls `purchaseWeekly()`, refreshes status on success.
- `restore()`: calls `restorePurchases()`, refreshes status.
- `refresh()`: re-runs `checkSubscriptionStatus()`.
- Web behavior: `isPremium = false`, `purchase()` falls through to Tagadapay via `playBilling.purchaseSubscription()`. The hook works on web without crashing, just doesn't talk to RC.
- Re-runs init when `user.id` changes (login/logout).

### 4. Update `src/components/PaywallScreen.tsx`

Swap direct `playBilling` imports for `useSubscription()`. If `isPremium === true` on mount (e.g. user reinstalled and restored), auto-skip the paywall by calling `enableTeaser()` + a parent signal — actually simpler: just call `restore()` silently in the background and let the existing auth/access flow detect Premium on next render.

### 5. Install + Capacitor config

- `bun add @revenuecat/purchases-capacitor`
- Add to `capacitor.config.ts` plugins block (RevenueCat needs no special config but I'll add a comment marker).
- After install, instructions for the user to run `npx cap sync android` locally (sandbox can't run a real Android build).

### 6. `.env` / secrets

`.env` is auto-managed; I'll add a `.env.example` entry and tell you where to paste the key in Project Settings. The Android RevenueCat public SDK key (`goog_…`) is safe to expose client-side — that's what RC's "public SDK key" means.

## Files

**Created**
- `src/lib/revenuecat.ts`
- `src/hooks/useSubscription.ts`
- `.env.example` (add `VITE_REVENUECAT_ANDROID_KEY=goog_xxx`)

**Modified**
- `src/services/playBilling.ts` — wires to revenuecat.ts on native
- `src/components/PaywallScreen.tsx` — uses `useSubscription()`
- `package.json` — adds `@revenuecat/purchases-capacitor`
- `.lovable/memory/features/hard-paywall.md` — note RC is now wired

**Not touched**
- `src/lib/billing.ts` (Tagadapay web path stays)
- `src/components/TeaserMode.tsx` (already calls `startCheckout` via lib/billing)

## Out of scope

- Server-side receipt validation (RC handles entitlement verification client-side; full server validation is a follow-up).
- iOS App Store IAP (key + plugin already supports it; we just don't have an iOS key yet).
- Syncing RC `customerInfo` into your Supabase `subscriptions` table (RC has webhooks for this — separate task).
- Actually creating the SKU `info.ridethetide.app.premium.weekly` and offering `default` in Play Console + RevenueCat dashboard — you have to do that manually.

## What you need to do after I ship

1. Create the product `info.ridethetide.app.premium.weekly` in Google Play Console.
2. In RevenueCat: create entitlement `premium`, attach the product, put it in offering `default`.
3. Add `VITE_REVENUECAT_ANDROID_KEY=goog_xxx` in Project Settings → Environment Variables.
4. Locally: `git pull && npm install && npx cap sync android && npx cap run android`.

Confirm the three conflicts above (especially #1 — file location) and I'll build it.
