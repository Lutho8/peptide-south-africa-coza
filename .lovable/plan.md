# Fix My Stack persistence across login

## Goal
Make a user’s saved stack persist across sessions and devices so they do not have to re-add peptides after logging in, and ensure all stack UI updates immediately after hydration.

## What I’ll change

1. **Preserve local stack when a user signs in for the first time**
   - Update the stack sync flow so a signed-in user does not lose an existing local/guest stack when their backend stack is empty.
   - Use a merge strategy similar to the daily dose flow: if the backend has no rows but the current local stack has items, push the local stack to the backend instead of replacing it with an empty array.

2. **Make backend hydration explicit and safe**
   - Refine `useCloudSync` so stack loading distinguishes between:
     - backend already has saved stack items
     - backend is empty for this user
     - local signed-in namespace already has stack items
   - Avoid destructive overwrite behavior during login hydration.

3. **Refresh the home “My Stack” preview after hydration and edits**
   - Update `ActiveStackPreview` so it reacts to stack changes after login, hydration, or saves instead of only reading once on initial mount.
   - Reuse the existing stack hydration event pattern or add a dedicated stack-changed event so both the home card and full stack screen stay in sync.

4. **Verify the auth/startup timing**
   - Ensure the startup order between `AuthContext`, `useStorageInit`, and stack hydration does not briefly seed an empty state that wins over real saved data.
   - Keep the fix frontend-only unless a backend schema problem is discovered.

## Expected outcome
- A returning signed-in user sees their existing stack after login.
- A user who built a stack before signing in keeps that stack once authenticated.
- The home card no longer keeps showing “Add your first peptide” when a stack exists.
- The full “Active Stack” screen and home preview stay consistent.

## Technical notes
- Likely files:
  - `src/hooks/useCloudSync.ts`
  - `src/components/home/ActiveStackPreview.tsx`
  - possibly `src/screens/MyStackScreen.tsx` or a small shared event utility if needed
- No database migration is currently planned because the `user_stacks` table and access rules already exist and appear readable/writable.
- I already confirmed the backend currently contains at least one `user_stacks` row, so this looks like an app-side hydration/persistence bug rather than missing backend infrastructure.