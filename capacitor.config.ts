import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.f6aff7aec2834486af56d9aba23f99f5',
  appName: 'peptide-mastery',
  webDir: 'dist',
  server: {
    url: 'https://f6aff7ae-c283-4486-af56-d9aba23f99f5.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#00CED1',
      sound: 'default'
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    }
  }
};

export default config;
