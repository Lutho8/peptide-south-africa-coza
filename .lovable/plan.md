
# Weekly Adherence Report + Reminder Testing

## Overview
This plan implements a weekly adherence report that calculates the percentage of scheduled doses taken vs. missed per peptide, and provides guidance for testing the swipe-to-mark-taken gesture.

## Part 1: Weekly Adherence Report

### What It Does
- Compares **scheduled reminders** against **logged doses** for the past 7 days
- Shows adherence percentage per peptide (e.g., "TA1: 6/7 doses = 86%")
- Displays overall protocol compliance with visual indicators
- Highlights missed doses and streaks

### Architecture

```text
+------------------+      +-------------------+
| dose_reminders   |      |   daily_doses     |
| (scheduled)      |      |   (logged)        |
+--------+---------+      +---------+---------+
         |                          |
         v                          v
    +----+-------------+------------+----+
    |     useAdherenceReport Hook        |
    |  - Matches reminders to doses      |
    |  - Calculates per-peptide stats    |
    +-------------------+----------------+
                        |
                        v
         +--------------+--------------+
         |   WeeklyAdherenceReport     |
         |   Component (Dashboard)     |
         +-----------------------------+
```

### Files to Create/Modify

**1. Create `src/hooks/useAdherenceReport.ts`**
- Logic to calculate adherence by comparing:
  - `dose_reminders` (what was scheduled)
  - `daily_doses` (what was taken)
- For each peptide with reminders, calculate:
  - Expected doses in the past 7 days
  - Actual doses logged
  - Adherence percentage

**2. Create `src/components/home/WeeklyAdherenceReport.tsx`**
- Card component for the home dashboard
- Shows:
  - Overall adherence percentage with progress ring
  - Per-peptide breakdown with color-coded bars
  - Streak indicator (consecutive days with 100% adherence)
  - Quick link to view full report in DoseSummary

**3. Modify `src/screens/HomeScreen.tsx`**
- Add the `WeeklyAdherenceReport` component below `TodaysReminders`

### Adherence Calculation Logic

```typescript
// For each peptide with reminders:
function calculatePeptideAdherence(peptideId: string, reminders: Reminder[], doses: Dose[]) {
  const past7Days = getLast7Days();
  let expectedDoses = 0;
  let actualDoses = 0;
  
  for (const day of past7Days) {
    const dayName = getDayName(day); // 'mon', 'tue', etc.
    
    // Check if reminder was scheduled for this day
    const scheduledReminders = reminders.filter(r => 
      r.peptide_id === peptideId && 
      r.enabled &&
      (r.days.length === 0 || r.days.includes(dayName))
    );
    
    expectedDoses += scheduledReminders.length;
    
    // Check if dose was logged for this day
    const loggedDoses = doses.filter(d => 
      d.peptide_id === peptideId && 
      d.date === formatDate(day)
    );
    
    actualDoses += Math.min(loggedDoses.length, scheduledReminders.length);
  }
  
  return {
    peptideId,
    expected: expectedDoses,
    actual: actualDoses,
    percentage: expectedDoses > 0 ? (actualDoses / expectedDoses) * 100 : 0
  };
}
```

### UI Design
- **Progress Ring**: Large circular progress indicator showing overall percentage
- **Peptide Bars**: Color-coded horizontal bars per peptide
  - Green (80-100%): On track
  - Amber (50-79%): Needs attention  
  - Red (0-49%): Missed most doses
- **Streak Badge**: Shows consecutive perfect days
- **Empty State**: Message encouraging users to create reminders if none exist

---

## Part 2: Testing Swipe-to-Mark-Taken

### Current Status
The swipe-to-mark-taken gesture is already implemented in `TodaysReminders.tsx`. To test it:

### How to Create a Test Reminder

1. Navigate to **Settings** (gear icon in top-right)
2. Scroll to **Notification Settings** section
3. Click **"Add"** button next to "Scheduled Reminders"
4. Fill in the reminder form:
   - **Peptide**: Select any peptide (e.g., "BPC-157")
   - **Dose**: Enter a value (e.g., "250")
   - **Unit**: Select "mcg"
   - **Time**: Set to a time in the near future (e.g., 5 minutes from now)
   - **Days**: Leave empty for daily, or select today's day
5. Click **"Add Reminder"**
6. Return to **Home** screen

### Testing the Swipe Gesture
Once the reminder appears in "Today's Reminders":
1. Locate the reminder card
2. Swipe it **right** (drag to the right)
3. A green checkmark background appears
4. Release after dragging 80+ pixels
5. The `NotificationActionModal` opens with "Mark as Taken" and "Snooze" options
6. Clicking "Mark as Taken" logs the dose to the database

---

## Implementation Steps

### Step 1: Create Adherence Hook
Create `src/hooks/useAdherenceReport.ts`:
- Import `useDoseReminders` and `useDailyDoses`
- Implement date range logic for past 7 days
- Match reminders to doses by peptide_id and date
- Return per-peptide and overall statistics

### Step 2: Create Adherence Report Component  
Create `src/components/home/WeeklyAdherenceReport.tsx`:
- Import the hook and UI components
- Design responsive card with progress indicators
- Add visual hierarchy with peptide categories
- Include click handler to navigate to full Summary view

### Step 3: Integrate into Home Screen
Modify `src/screens/HomeScreen.tsx`:
- Import `WeeklyAdherenceReport`
- Add component after `TodaysReminders`
- Pass navigation prop for "View Details" action

### Step 4: Enhance DoseSummary (Optional)
Consider adding to `src/components/doses/DoseSummary.tsx`:
- Link adherence data with existing summary view
- Show which specific doses were missed

---

## Technical Considerations

### Performance
- Memoize adherence calculations with `useMemo`
- Only recalculate when reminders or doses change
- Limit date range to prevent heavy queries

### Data Matching
- Match by `peptide_id` for accuracy
- Handle timezone differences in date comparisons
- Account for users who log doses at different times than scheduled

### Edge Cases
- No reminders configured: Show prompt to create reminders
- No doses logged: Show 0% with encouraging message
- Partial data: Calculate based on available data only
