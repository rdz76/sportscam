import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.c5eee065e70542a68073adb1563272c8',
  appName: 'SportsCam Pro',
  webDir: 'dist',
  server: {
    url: 'https://c5eee065-e705-42a6-8073-adb1563272c8.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Camera: {
      permissions: ['camera', 'photos']
    }
  }
};

export default config;
