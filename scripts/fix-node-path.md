# Fix: "node is not recognized"

This means Windows can't find Node.js, even if it's installed. Pick the easiest option that works.

---

## Option A — Reinstall Node.js (recommended, 5 min)

1. Open **Settings → Apps → Installed apps**, find **Node.js**, click **Uninstall**.
2. Restart your PC. (Yes, really. PATH changes need this.)
3. Go to https://nodejs.org and download the **LTS** version.
4. Run the installer. On the **"Custom Setup"** screen, make sure **"Add to PATH"** is checked (it is by default — don't uncheck it).
5. On the **"Tools for Native Modules"** screen, you can leave the checkbox unchecked (we don't need it).
6. Finish the install. Restart your PC again.
7. Open a **new** Command Prompt and run:
   ```
   node -v
   ```
   You should see `v20.x.x` or similar.

---

## Option B — Manually add Node to PATH (if reinstall didn't help)

Node.js is usually installed at `C:\Program Files\nodejs\`. Verify by opening File Explorer and checking that folder exists and contains `node.exe`.

Then:

1. Press **Windows key**, type **"environment variables"**, click **"Edit the system environment variables"**.
2. Click the **"Environment Variables…"** button (bottom right).
3. In the **lower box** (System variables), find and select **Path**, then click **Edit…**.
4. Click **New** and paste:
   ```
   C:\Program Files\nodejs\
   ```
5. Click **OK** on every window to close them all.
6. **Close every Command Prompt window** and open a brand new one.
7. Run `node -v`. Should now work.

---

## Option C — Workaround without fixing PATH

If nothing else works, you can call Node directly with its full path. In Command Prompt:

```
"C:\Program Files\nodejs\npm.cmd" install
"C:\Program Files\nodejs\npm.cmd" run build
"C:\Program Files\nodejs\npx.cmd" cap add android
"C:\Program Files\nodejs\npx.cmd" cap sync android
```

This is ugly but it works. Use Option A or B for a permanent fix.

---

## Still stuck?

Run this in Command Prompt to confirm where Node lives:

```
dir "C:\Program Files\nodejs\node.exe"
```

- If you see the file listed → Node is installed, the problem is PATH (use Option B).
- If you get "File Not Found" → Node didn't install correctly (use Option A).
