## Plan

1. **Fix the Daily Log crash**
   - Move the `useSwipeNav(...)` hook call out of the conditional JSX branch in `DailyLogScreen` and call it unconditionally near the other hooks.
   - Use the returned swipe props inside the calendar wrapper.

2. **Check related hook-order risk**
   - Keep the existing loading branch safe by ensuring all hooks in `DailyLogScreen` run in the same order on every render before any conditional return can change the rendered view.

3. **Validate the fix**
   - Confirm the Daily Log screen no longer throws React invariant #310 when loading finishes and when switching Calendar/Summary views.
   - Check the browser console/error log for any new Daily Log render errors.

## Technical note

The screenshots show React minified error #310, which is commonly caused by changing the order/number of hooks between renders. In `DailyLogScreen.tsx`, `useSwipeNav()` is currently called inside JSX that only renders in the Calendar view. That violates the Rules of Hooks when the screen switches render paths, causing the Daily Log error boundary to show the failure screen.