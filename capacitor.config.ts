import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ishansharma.royaldeal',
  appName: 'The Royal Deal',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  },
  android: {
    backgroundColor: '#222222' // Dark background for your poker theme
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: "#222222",
      showSpinner: true,
      spinnerColor: "#d4af37", // Gold spinner to match your theme
      androidSpinnerStyle: "large"
    }
  }
};

export default config;