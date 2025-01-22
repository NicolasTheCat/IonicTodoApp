import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nbaudry.todoApp',
  appName: 'todoApplication',
  webDir: 'www',

  server: {
    androidScheme: 'https',
    cleartext: true
  },
};

export default config;
