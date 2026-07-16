module.exports = {
  expo: {
    name: 'Touch Learn',
    slug: 'english-tutor-app',
    version: '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'dark',
    icon: './assets/icon.png',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#070D1F',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.touchlearn.app',
    },
    android: {
      package: 'com.touchlearn.app',
      versionCode: 20,
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#070D1F',
      },
      permissions: ['RECORD_AUDIO'],
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-speech-recognition',
        {
          microphonePermission: 'Permite que o Touch Learn ouça a sua pronúncia para praticar inglês falado.',
          speechRecognitionPermission: 'Permite que o Touch Learn reconheça a sua fala em inglês.',
          androidSpeechServicePackages: ['com.google.android.googlequicksearchbox'],
        },
      ],
    ],
    scheme: 'touchlearn',
    extra: {
      eas: {
        projectId: '3a565033-091e-4d90-8c72-43d6c28c30ec',
      },
    },
  },
};
