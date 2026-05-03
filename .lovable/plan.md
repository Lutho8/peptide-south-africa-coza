Problem being solved
- Your stack is getting wiped because the app currently clears all user-scoped local data whenever auth state changes.
- The backend stack table already exists, but it is only synced manually from Settings, so most users never save their stack there.
- Cycle creation currently hardcodes the start date to today.
- Some purchase CTAs still say “Order from Supplier” / “Order Now” instead of pointing to your shop consistently.

Plan
1. Preserve user data per account instead of deleting it on login/logout
- Update the auth scope logic so switching users no longer deletes every saved user namespace from local storage.
- Keep the privacy-safe behavior by switching storage scope to the current user/guest, rather than globally wiping prior users’ saved data.
- This will stop the app from “forgetting” stack/cycle data on the same device.

2. Make stack persistence automatic for logged-in users
- Keep using the existing backend-backed stack storage already protected per user.
- Change stack save flows so editing the stack immediately syncs to the backend instead of requiring a manual “Sync now” press in Settings.
- Ensure login hydration pulls the saved stack before the screen settles, so each user sees their own stack after signing in.
- Handle the empty-backend case safely so a truly new user still starts with an empty stack.

3. Support custom cycle start dates
- Add an optional “Started on” date field to cycle creation flows, defaulting to today.
- Use that selected date when creating a cycle instead of always forcing today’s date.
- Apply this to the main cycle entry points so the behavior is consistent wherever a cycle can be started.
- Keep all progress/timeline/break calculations based on the chosen start date.

4. Rename and relink purchase CTAs
- Replace “Order from Supplier” and “Order Now” with “Buy Peptides”.
- Point those buttons to https://www.ridethetide.site and open in a new tab.
- Standardize related shop CTAs where it makes sense so the wording is consistent across the app.

Files likely involved
- src/contexts/AuthContext.tsx
- src/services/storage.ts
- src/hooks/useCloudSync.ts
- src/screens/MyStackScreen.tsx
- src/components/modals/CycleManagementModal.tsx
- src/components/modals/DoseTrackerModal.tsx
- src/components/modals/PeptideDetailModal.tsx
- src/components/bloodwork/StackPeptideCard.tsx

Technical notes
- No new backend table is required for stack persistence; the existing per-user stack table and access rules are already in place.
- I checked the current data and the stack table has no rows yet, which matches the current manual-sync-only behavior.
- The cycle date change should not require a migration unless we decide to move cycle storage into the backend as a separate improvement later.
- Side effect of the auth/storage fix: user-specific locally saved cycle data will also stop being erased on auth changes.

Validation after implementation
- Create a stack while logged in, refresh, sign out, sign back in, and confirm the same stack returns.
- Sign in as a different user and confirm they do not see another user’s stack.
- Start a cycle with an earlier date and verify timeline/progress/break timing reflect that date.
- Confirm every updated CTA says “Buy Peptides” and opens your shop URL.