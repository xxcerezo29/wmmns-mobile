import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.wmmns.mobile',
  appName: 'wmmns-mobile',
  webDir: 'dist',
  plugins: {
    CapacitorHttp: {
      enabled: true
    }
  }
};

export default config;
