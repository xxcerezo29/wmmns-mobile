import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.wmmns.mobile',
  appName: 'wmmns-mobile',
  webDir: 'dist',
  plugins: {
    CapacitorHttp: {
      enabled: true
    },
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: '#ffffff',
      androidScaleType: 'CENTER_CROP',
      showSpinner: true,
      spinnerColor: '#999999',
      splashFullScreen: true,
      splashImmersive: true
    },
    LiveUpdates: {
      appId: '0dc31600',
      channel: 'dev',
      autoUpdateMethod: 'background',
      maxVersions: 2
    }
  }
};

export default config;
