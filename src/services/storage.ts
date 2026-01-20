// Local Storage Keys
const STORAGE_KEYS = {
  BODY_COMPOSITION: 'peptide_app_body_composition',
  DOSE_LOGS: 'peptide_app_dose_logs',
  DOSE_SCHEDULES: 'peptide_app_dose_schedules',
  CYCLES: 'peptide_app_cycles',
  NOTIFICATION_SETTINGS: 'peptide_app_notifications',
  USER_PROFILE: 'peptide_app_user_profile',
} as const;

// Generic storage functions
export function getStoredData<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored) as T;
    }
    return defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return defaultValue;
  }
}

export function setStoredData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error writing to localStorage (${key}):`, error);
  }
}

export function removeStoredData(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error);
  }
}

// Body Composition Storage
import { BodyComposition as BodyCompType, bodyCompositionHistory as defaultBodyComp, DoseSchedule as DoseScheduleType, Cycle as CycleType, todaysDoses as defaultDoses, activeCycles as defaultCycles, UserProfile as UserProfileType, userProfile as defaultUserProfile } from '@/data/userData';

export type BodyComposition = BodyCompType;
export type DoseSchedule = DoseScheduleType;
export type Cycle = CycleType;
export type UserProfile = UserProfileType;

// User Profile Storage
export function getUserProfile(): UserProfile {
  return getStoredData(STORAGE_KEYS.USER_PROFILE, defaultUserProfile);
}

export function saveUserProfile(profile: UserProfile): void {
  setStoredData(STORAGE_KEYS.USER_PROFILE, profile);
}

export function getBodyCompositionHistory(): BodyComposition[] {
  return getStoredData(STORAGE_KEYS.BODY_COMPOSITION, defaultBodyComp);
}

export function saveBodyCompositionEntry(entry: BodyComposition): void {
  const history = getBodyCompositionHistory();
  // Insert at beginning (newest first)
  history.unshift(entry);
  setStoredData(STORAGE_KEYS.BODY_COMPOSITION, history);
}

export function updateBodyCompositionHistory(history: BodyComposition[]): void {
  setStoredData(STORAGE_KEYS.BODY_COMPOSITION, history);
}

// Dose Logs Storage
export interface DoseLog {
  id: string;
  scheduleId: string;
  peptideId: string;
  peptideName: string;
  dose: string;
  scheduledTime: string;
  actualTime?: string;
  status: 'taken' | 'skipped' | 'missed';
  date: string;
  notes?: string;
}

export function getDoseLogs(): DoseLog[] {
  return getStoredData(STORAGE_KEYS.DOSE_LOGS, []);
}

export function saveDoseLog(log: DoseLog): void {
  const logs = getDoseLogs();
  logs.unshift(log);
  setStoredData(STORAGE_KEYS.DOSE_LOGS, logs);
}

export function getDoseLogsForDate(date: string): DoseLog[] {
  const logs = getDoseLogs();
  return logs.filter(log => log.date === date);
}

// Dose Schedules Storage

export function getDoseSchedules(): DoseSchedule[] {
  return getStoredData(STORAGE_KEYS.DOSE_SCHEDULES, defaultDoses);
}

export function saveDoseSchedule(schedule: DoseSchedule): void {
  const schedules = getDoseSchedules();
  schedules.push(schedule);
  setStoredData(STORAGE_KEYS.DOSE_SCHEDULES, schedules);
}

export function updateDoseSchedule(schedule: DoseSchedule): void {
  const schedules = getDoseSchedules();
  const index = schedules.findIndex(s => s.id === schedule.id);
  if (index !== -1) {
    schedules[index] = schedule;
    setStoredData(STORAGE_KEYS.DOSE_SCHEDULES, schedules);
  }
}

export function deleteDoseSchedule(scheduleId: string): void {
  const schedules = getDoseSchedules();
  const filtered = schedules.filter(s => s.id !== scheduleId);
  setStoredData(STORAGE_KEYS.DOSE_SCHEDULES, filtered);
}

// Cycles Storage

export function getCycles(): Cycle[] {
  return getStoredData(STORAGE_KEYS.CYCLES, defaultCycles);
}

export function saveCycle(cycle: Cycle): void {
  const cycles = getCycles();
  cycles.push(cycle);
  setStoredData(STORAGE_KEYS.CYCLES, cycles);
}

export function updateCycle(cycle: Cycle): void {
  const cycles = getCycles();
  const index = cycles.findIndex(c => c.id === cycle.id);
  if (index !== -1) {
    cycles[index] = cycle;
    setStoredData(STORAGE_KEYS.CYCLES, cycles);
  }
}

export function deleteCycle(cycleId: string): void {
  const cycles = getCycles();
  const filtered = cycles.filter(c => c.id !== cycleId);
  setStoredData(STORAGE_KEYS.CYCLES, filtered);
}

// Notification Settings Storage
export interface NotificationSettings {
  enabled: boolean;
  soundEnabled: boolean;
  reminderMinutesBefore: number;
  scheduleIds: string[]; // Which schedules have notifications enabled
}

const defaultNotificationSettings: NotificationSettings = {
  enabled: false,
  soundEnabled: true,
  reminderMinutesBefore: 5,
  scheduleIds: [],
};

export function getNotificationSettings(): NotificationSettings {
  return getStoredData(STORAGE_KEYS.NOTIFICATION_SETTINGS, defaultNotificationSettings);
}

export function saveNotificationSettings(settings: NotificationSettings): void {
  setStoredData(STORAGE_KEYS.NOTIFICATION_SETTINGS, settings);
}

// Initialize storage with defaults if empty
export function initializeStorage(): void {
  if (!localStorage.getItem(STORAGE_KEYS.BODY_COMPOSITION)) {
    setStoredData(STORAGE_KEYS.BODY_COMPOSITION, defaultBodyComp);
  }
  if (!localStorage.getItem(STORAGE_KEYS.DOSE_SCHEDULES)) {
    setStoredData(STORAGE_KEYS.DOSE_SCHEDULES, defaultDoses);
  }
  if (!localStorage.getItem(STORAGE_KEYS.CYCLES)) {
    setStoredData(STORAGE_KEYS.CYCLES, defaultCycles);
  }
}

export { STORAGE_KEYS };
