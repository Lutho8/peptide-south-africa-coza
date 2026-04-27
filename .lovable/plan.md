# Plan: Prepare "Ride The Tide" for Google Play Production Release

## Decisions confirmed
- **App ID:** `info.ridethetide.app` (permanent)
- **Track:** Production (skipping internal testing)
- **Content rating:** 18+ (Adult / Mature)

---

## Codebase changes I'll make

### 1. `capacitor.config.ts` — production-ready config
- `appId`: `info.ridethetide.app`
- `appName`: `Ride The Tide`
- **Remove the `server.url` block** (this points to the Lovable sandbox — it MUST be removed for a production Play Store build, otherwise the published app would just be a webview of the dev preview)
- Keep LocalNotifications + PushNotifications plugin config

### 2. `public/manifest.json`
- Already correctly branded — no change needed

### 3. Create `RELEASE_GUIDE.md` in project root
A complete step-by-step guide you'll follow on your local machine, covering:

**Part A — Local build (one-time setup)**
1. Export project to GitHub → `git pull` locally
2. `npm install`
3. `npx cap add android`
4. `npm run build`
5. `npx cap sync android`
6. `npx cap open android` (opens Android Studio)

**Part B — Generate signing key (one-time, CRITICAL)**
- `keytool` command to create `ride-the-tide-release.keystore`
- Store keystore + passwords in a password manager (losing this = locked out of Play Store updates forever)

**Part C — Configure release signing in Android Studio**
- Edit `android/app/build.gradle` with signing config
- Set `versionCode: 1`, `versionName: "1.0.0"`
- Build → Generate Signed Bundle → AAB (Android App Bundle, required by Play Store)

**Part D — Google Play Console submission**
1. Go to https://play.google.com/console → Create app
2. App name: **Ride The Tide**
3. Default language: English (US)
4. App or game: App
5. Free or paid: Free
6. Declarations: confirm policies

**Part E — Required store listing assets** (you'll need to prepare/upload):
- App icon: 512×512 PNG (use existing `/icon-512.png`)
- Feature graphic: 1024×500 PNG (I'll provide design spec)
- Phone screenshots: minimum 2, recommended 4–8 (1080×1920)
- Short description (80 chars)
- Full description (4000 chars)
- Privacy policy URL: `https://ridethetide.info/privacy` ✓ (already exists)

**Part F — Content rating questionnaire**
- Category: Reference, News, or Educational
- Confirm: References to drugs/medication for educational purposes → **Mature 17+ / 18+**

**Part G — Data safety form**
- Data collected: email, name, health & fitness data
- Encrypted in transit: Yes
- Users can request deletion: Yes

**Part H — Upload AAB & submit for review**
- Production track → Create new release → Upload `.aab`
- Review timeline: typically 1–7 days for first submission

### 4. Create `STORE_LISTING.md` with ready-to-paste copy
- App title (30 char): **Ride The Tide: Peptide Tracker**
- Short description (80 char): **Track peptide protocols, doses, cycles & bloodwork. Research-grade tools.**
- Full description (4000 char): polished marketing copy emphasizing research/educational use, safety disclaimers, key features (stack builder, dose reminders, bloodwork tracking, cycle protocols, reconstitution calculator)
- Keywords / categories: **Health & Fitness** (primary), **Medical** (secondary)
- Content rating answers pre-filled

---

## What you'll need to do (I cannot do these for you)
1. Export project to your GitHub
2. Run the build commands locally (requires Android Studio installed)
3. Create the signing keystore
4. Create Google Play Console developer account ($25 one-time, if not done)
5. Upload screenshots + feature graphic
6. Submit for review

---

## What happens after approval
- App goes live on Google Play under your developer account (`8427019085313968947`)
- Users worldwide can install it
- Future updates: bump `versionCode`, rebuild AAB, upload new release

---

## Notes
- **iOS / Apple App Store**: Not in scope for this plan. Requires a Mac + Xcode + $99/yr Apple Developer account. Happy to do a separate plan when you're ready.
- **App ID is permanent**: `info.ridethetide.app` cannot be changed after first upload — confirmed.
- **Server URL removal is critical**: without removing it, the Play Store build would just load the Lovable preview, which would fail review.

Approve and I'll switch to build mode, update the Capacitor config, and generate both guide files.
