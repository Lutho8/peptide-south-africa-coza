## Goal
Get you from "Node not recognized" to a signed `.aab` file ready for Google Play, with as little manual terminal work as possible.

Important constraint up front: I (Lovable) **cannot** run anything on your Windows PC. I can't fix your PATH, I can't generate the `android/` folder on your machine, and I can't run Android Studio. The `android/` folder MUST be created on your computer because it contains Windows file paths and is intentionally git-ignored by Capacitor convention.

What I CAN do is make the process on your side as close to "double-click and wait" as possible.

---

## What I'll add to your project

### 1. `scripts/setup-android.bat` — one-click Windows script
A double-clickable Windows batch file. You put it in your project folder, double-click it, and it will:

1. Check if Node.js is installed and on PATH. If not, print a clear message with the download link and stop.
2. Check if Java JDK 17+ is installed. If not, print download link and stop.
3. Run `npm install`
4. Run `npm run build`
5. Run `npx cap add android` (only if `android/` folder doesn't exist yet)
6. Run `npx cap sync android`
7. Print "DONE — now open Android Studio and File → Open the `android` folder"
8. Pause so the window stays open and you can read any errors

You will not need to type any commands. Just double-click the file.

### 2. `scripts/build-release-aab.bat` — one-click rebuild script
For every future release. Double-click to:
1. `npm run build`
2. `npx cap sync android`
3. Print "Now in Android Studio: Build → Generate Signed Bundle → AAB"

### 3. `SETUP_CHECKLIST.md` — plain-English checklist
A short, non-technical checklist in your project root with screenshots-style numbered steps:

- [ ] Install Node.js LTS (link, with the "Add to PATH" checkbox highlighted)
- [ ] Install Java JDK 17 (link)
- [ ] Install Android Studio (link)
- [ ] Double-click `scripts/setup-android.bat`
- [ ] Open the new `android` folder in Android Studio
- [ ] Generate signing keystore (exact `keytool` command, copy-paste)
- [ ] Configure signing in Android Studio (with the exact menu path)
- [ ] Build → Generate Signed Bundle → AAB
- [ ] Upload `.aab` to Play Console

Each step has a "If this fails, do X" note.

### 4. `scripts/fix-node-path.md` — PATH troubleshooting card
A focused doc just for your current blocker. Three options ranked easiest to hardest:
- **Option A (easiest):** Uninstall Node.js → reinstall and tick "Automatically install necessary tools" + confirm "Add to PATH" is checked
- **Option B:** Manually add `C:\Program Files\nodejs\` to System PATH (with the exact Win11 click path: Settings → System → About → Advanced system settings → Environment Variables)
- **Option C:** Use the full path workaround: `"C:\Program Files\nodejs\npm.cmd" install` etc.

---

## What this will NOT do
- It will not auto-install Node.js or Android Studio for you (Windows blocks scripts from doing that without admin prompts and code-signing). The script detects them and tells you what to install.
- It will not generate the keystore for you — that has to happen on your machine for security (the keystore is your private signing identity).
- It will not upload to Google Play — that's a manual web upload.

---

## Your next steps after I switch to build mode
1. I create the 4 files above and commit them.
2. You pull the latest changes in GitHub Desktop (Fetch origin → Pull origin).
3. Open the project folder in Windows File Explorer (`Documents\GitHub\peptide-mastery` or wherever you cloned it).
4. Double-click `scripts\setup-android.bat`.
5. Follow whatever it tells you (most likely: "install Node.js first").
6. Double-click it again after installing Node.js.
7. The `android` folder appears. Open it in Android Studio.
8. Follow `SETUP_CHECKLIST.md` for the keystore + signed AAB steps.

Approve and I'll create the files.