// Notification sound customization service

export type NotificationTone = 'default' | 'gentle' | 'urgent' | 'chime' | 'bell' | 'digital';

export interface PeptideSoundSetting {
  peptideId: string;
  peptideName: string;
  tone: NotificationTone;
}

const STORAGE_KEY = 'peptide_notification_sounds';

// Sound frequencies for web audio generation (fallback when audio files not available)
const TONE_FREQUENCIES: Record<NotificationTone, { freq: number; duration: number; pattern: number[] }> = {
  default: { freq: 440, duration: 200, pattern: [1, 0.5, 1] },
  gentle: { freq: 330, duration: 300, pattern: [0.5, 0.5] },
  urgent: { freq: 880, duration: 100, pattern: [1, 0.2, 1, 0.2, 1] },
  chime: { freq: 523, duration: 400, pattern: [1] },
  bell: { freq: 392, duration: 500, pattern: [1, 0, 0.7] },
  digital: { freq: 1000, duration: 80, pattern: [1, 0.3, 1, 0.3] },
};

// Get all saved sound settings
export function getPeptideSoundSettings(): PeptideSoundSetting[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Save sound settings
export function savePeptideSoundSettings(settings: PeptideSoundSetting[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

// Get sound for specific peptide
export function getPeptideSound(peptideId: string): NotificationTone {
  const settings = getPeptideSoundSettings();
  const setting = settings.find(s => s.peptideId === peptideId);
  return setting?.tone || 'default';
}

// Set sound for specific peptide
export function setPeptideSound(peptideId: string, peptideName: string, tone: NotificationTone): void {
  const settings = getPeptideSoundSettings();
  const existingIndex = settings.findIndex(s => s.peptideId === peptideId);
  
  if (existingIndex >= 0) {
    settings[existingIndex].tone = tone;
  } else {
    settings.push({ peptideId, peptideName, tone });
  }
  
  savePeptideSoundSettings(settings);
}

// Remove sound setting for peptide (revert to default)
export function removePeptideSound(peptideId: string): void {
  const settings = getPeptideSoundSettings();
  const filtered = settings.filter(s => s.peptideId !== peptideId);
  savePeptideSoundSettings(filtered);
}

// Audio context for generating tones
let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioContext;
}

// Play a notification tone
export async function playNotificationTone(tone: NotificationTone = 'default'): Promise<void> {
  try {
    const ctx = getAudioContext();
    const config = TONE_FREQUENCIES[tone];
    
    let time = ctx.currentTime;
    
    for (const amplitude of config.pattern) {
      if (amplitude > 0) {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.type = tone === 'digital' ? 'square' : 'sine';
        oscillator.frequency.value = config.freq;
        
        gainNode.gain.setValueAtTime(0, time);
        gainNode.gain.linearRampToValueAtTime(amplitude * 0.3, time + 0.01);
        gainNode.gain.linearRampToValueAtTime(0, time + config.duration / 1000);
        
        oscillator.start(time);
        oscillator.stop(time + config.duration / 1000);
      }
      
      time += config.duration / 1000 + 0.05;
    }
  } catch (error) {
    console.error('Error playing notification tone:', error);
  }
}

// Preview a tone (for settings UI)
export function previewTone(tone: NotificationTone): void {
  playNotificationTone(tone);
}

// Get human-readable tone name
export function getToneName(tone: NotificationTone, lang: 'en' | 'de' = 'en'): string {
  const names: Record<NotificationTone, { en: string; de: string }> = {
    default: { en: 'Default', de: 'Standard' },
    gentle: { en: 'Gentle', de: 'Sanft' },
    urgent: { en: 'Urgent', de: 'Dringend' },
    chime: { en: 'Chime', de: 'Glockenspiel' },
    bell: { en: 'Bell', de: 'Glocke' },
    digital: { en: 'Digital', de: 'Digital' },
  };
  
  return names[tone][lang];
}

// All available tones
export const AVAILABLE_TONES: NotificationTone[] = ['default', 'gentle', 'urgent', 'chime', 'bell', 'digital'];
