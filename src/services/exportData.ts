import { 
  getBodyCompositionHistory, 
  getDoseLogs, 
  getDoseSchedules, 
  getCycles,
  getUserProfile,
  BodyComposition,
  DoseLog,
  DoseSchedule,
  Cycle,
  UserProfile
} from './storage';

interface ExportData {
  exportDate: string;
  userProfile: UserProfile;
  bodyComposition: BodyComposition[];
  doseLogs: DoseLog[];
  doseSchedules: DoseSchedule[];
  cycles: Cycle[];
}

function formatDate(): string {
  return new Date().toISOString().split('T')[0];
}

function getAllData(): ExportData {
  return {
    exportDate: new Date().toISOString(),
    userProfile: getUserProfile(),
    bodyComposition: getBodyCompositionHistory(),
    doseLogs: getDoseLogs(),
    doseSchedules: getDoseSchedules(),
    cycles: getCycles(),
  };
}

export function exportAsJSON(): void {
  const data = getAllData();
  const json = JSON.stringify(data, null, 2);
  downloadFile(json, `peptide-tracker-backup-${formatDate()}.json`, 'application/json');
}

export function exportBodyCompositionCSV(): void {
  const history = getBodyCompositionHistory();
  if (history.length === 0) {
    throw new Error('No body composition data to export');
  }

  const headers = [
    'Date', 'Weight (kg)', 'BMI', 'Body Fat (%)', 'Fat-Free Weight (kg)', 
    'Muscle Mass (kg)', 'Skeletal Muscle (%)', 'Body Water (%)', 
    'Subcutaneous Fat (%)', 'Visceral Fat', 'Bone Mass (kg)', 
    'Protein (%)', 'BMR (kcal)', 'Metabolic Age'
  ];

  const rows = history.map(entry => [
    entry.date,
    entry.weight,
    entry.bmi,
    entry.bodyFat,
    entry.fatFreeWeight,
    entry.muscleMass,
    entry.skeletalMuscle,
    entry.bodyWater,
    entry.subcutaneousFat,
    entry.visceralFat,
    entry.boneMass,
    entry.protein,
    entry.bmr,
    entry.metabolicAge,
  ]);

  const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  downloadFile(csv, `body-composition-${formatDate()}.csv`, 'text/csv');
}

export function exportDoseLogsCSV(): void {
  const logs = getDoseLogs();
  if (logs.length === 0) {
    throw new Error('No dose logs to export');
  }

  const headers = [
    'Date', 'Peptide', 'Dose', 'Scheduled Time', 'Actual Time', 'Status', 'Notes'
  ];

  const rows = logs.map(log => [
    log.date,
    `"${log.peptideName}"`,
    `"${log.dose}"`,
    log.scheduledTime,
    log.actualTime || '',
    log.status,
    `"${log.notes || ''}"`,
  ]);

  const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  downloadFile(csv, `dose-logs-${formatDate()}.csv`, 'text/csv');
}

export function exportCyclesCSV(): void {
  const cycles = getCycles();
  if (cycles.length === 0) {
    throw new Error('No cycle data to export');
  }

  const headers = [
    'Peptide', 'Dose', 'Frequency', 'Start Date', 'Duration (days)', 
    'Break Duration (days)', 'Status', 'Notes'
  ];

  const rows = cycles.map(cycle => [
    `"${cycle.peptideName}"`,
    `"${cycle.dose}"`,
    `"${cycle.frequency}"`,
    cycle.startDate,
    cycle.plannedDuration,
    cycle.breakDuration,
    cycle.status,
    `"${cycle.notes || ''}"`,
  ]);

  const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  downloadFile(csv, `cycles-${formatDate()}.csv`, 'text/csv');
}

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function importFromJSON(file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string) as ExportData;
        
        // Validate the data structure
        if (!data.bodyComposition || !data.cycles) {
          throw new Error('Invalid backup file format');
        }
        
        // Import body composition
        if (data.bodyComposition.length > 0) {
          localStorage.setItem('bodyCompositionHistory', JSON.stringify(data.bodyComposition));
        }
        
        // Import dose logs
        if (data.doseLogs && data.doseLogs.length > 0) {
          localStorage.setItem('doseLogs', JSON.stringify(data.doseLogs));
        }
        
        // Import schedules
        if (data.doseSchedules && data.doseSchedules.length > 0) {
          localStorage.setItem('doseSchedules', JSON.stringify(data.doseSchedules));
        }
        
        // Import cycles
        if (data.cycles.length > 0) {
          localStorage.setItem('cycles', JSON.stringify(data.cycles));
        }
        
        // Import user profile
        if (data.userProfile) {
          localStorage.setItem('userProfile', JSON.stringify(data.userProfile));
        }
        
        resolve();
      } catch (error) {
        reject(new Error('Failed to parse backup file'));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
