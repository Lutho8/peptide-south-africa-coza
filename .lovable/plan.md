## Current state

Capacitor is already wired into this project:

- `capacitor.config.ts` exists with `appId: info.ridethetide.app`, `appName: Ride The Tide`, `webDir: dist`, and plugin config for Local + Push Notifications.
- Installed: `@capacitor/core`, `@capacitor/cli`, `@capacitor/android`, `@capacitor/ios`, `@capacitor/local-notifications`, `@capacitor/push-notifications` (all v8).
- Missing from your list: `@capacitor/preferences`, `@capacitor/app`, `@capacitor/device`, `@capacitor/splash-screen`.
- No `android/` folder yet — that must be generated locally on your machine (the Lovable sandbox cannot produce a usable native Android project for Android Studio; the `android/` folder must live in your local git checkout).

Note: `bundledWebRuntime` is no longer a valid Capacitor 8 config key, so we will not add it.

## Plan

### 1. Install the four missing Capacitor packages

Add to `package.json` dependencies:
- `@capacitor/preferences@^8`
- `@capacitor/app@^8`
- `@capacitor/device@^8`
- `@capacitor/splash-screen@^8`

### 2. Add SplashScreen config to `capacitor.config.ts`

Append a `SplashScreen` plugin block (launch duration, background color `#0F172A`, spinner) so the package has sensible defaults the moment you sync.

### 3. Provide the exact terminal commands for you to run locally

I'll print a copy-paste block for Windows Command Prompt covering:

```text
git pull
npm install
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

…plus a one-liner `scripts/add-android.bat` you can double-click that runs all of the above.

### 4. Update `SETUP_CHECKLIST.md`

Add an "Android project bootstrap" section that explains:
- Why `android/` is generated on your machine, not in Lovable.
- How to verify success (look for `android/app/build.gradle`).
- What to do if `cap add android` fails (usually missing `ANDROID_HOME` or JDK 17).

## Why I can't create `android/` for you here

`npx cap add android` downloads the Android Gradle template and writes a native project that references your local Android SDK paths. Running it inside the Lovable sandbox would produce a folder tied to sandbox paths and would not be committed to your repo in a usable form. It must run on your Windows machine after `git pull`, exactly once. After that, every future `npx cap sync android` just refreshes the web assets inside it.

## Files to change

- `package.json` — add 4 dependencies (via `bun add`)
- `capacitor.config.ts` — add SplashScreen plugin block
- `scripts/add-android.bat` — new one-click bootstrap script
- `SETUP_CHECKLIST.md` — new "Generate Android project" section
