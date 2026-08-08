/**
 * F-Insight Mobile - App Configuration
 * Complete metadata for App Store and Google Play
 */

export default {
  name: "F-Insight",
  slug: "finsight-mobile",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#0a0f1a"
  },
  assetBundlePatterns: ["**/*"],
  
  // iOS Configuration
  ios: {
    supportsTablet: true,
    bundleIdentifier: "org.finsight.mobile",
    buildNumber: "1",
    infoPlist: {
      NSFaceIDUsageDescription: "F-Insight usa Face ID para login seguro e rápido.",
      NSCameraUsageDescription: "F-Insight usa a câmera para escanear QR codes.",
      NSPhotoLibraryUsageDescription: "F-Insight acessa suas fotos para personalizar seu perfil.",
      UIBackgroundModes: ["remote-notification"],
      ITSAppUsesNonExemptEncryption: false
    },
    config: {
      usesNonExemptEncryption: false
    },
    associatedDomains: ["applinks:f-insight.org"],
    privacyManifests: {
      NSPrivacyAccessedAPITypes: [
        {
          NSPrivacyAccessedAPIType: "NSPrivacyAccessedAPICategoryUserDefaults",
          NSPrivacyAccessedAPITypeReasons: ["CA92.1"]
        }
      ]
    }
  },
  
  // Android Configuration
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#0a0f1a"
    },
    package: "org.finsight.mobile",
    versionCode: 1,
    permissions: [
      "INTERNET",
      "ACCESS_NETWORK_STATE",
      "RECEIVE_BOOT_COMPLETED",
      "VIBRATE",
      "USE_BIOMETRIC",
      "USE_FINGERPRINT",
      "WAKE_LOCK"
    ],
    googleServicesFile: "./google-services.json",
    intentFilters: [
      {
        action: "VIEW",
        autoVerify: true,
        data: [
          {
            scheme: "https",
            host: "f-insight.org",
            pathPrefix: "/app"
          }
        ],
        category: ["BROWSABLE", "DEFAULT"]
      }
    ]
  },
  
  // Web Configuration (PWA)
  web: {
    favicon: "./assets/favicon.png",
    bundler: "metro",
    output: "single",
    themeColor: "#14b8a6",
    backgroundColor: "#0a0f1a",
    name: "F-Insight",
    shortName: "F-Insight",
    description: "Análise financeira inteligente para investidores",
    lang: "pt-BR",
    orientation: "portrait",
    display: "standalone",
    startUrl: "/",
    scope: "/"
  },
  
  // Expo Plugins
  plugins: [
    "expo-router",
    "expo-secure-store",
    "expo-local-authentication",
    [
      "expo-notifications",
      {
        icon: "./assets/notification-icon.png",
        color: "#14b8a6",
        sounds: ["./assets/sounds/notification.wav"],
        androidMode: "default",
        androidCollapsedTitle: "F-Insight"
      }
    ],
    [
      "expo-build-properties",
      {
        android: {
          compileSdkVersion: 34,
          targetSdkVersion: 34,
          buildToolsVersion: "34.0.0",
          minSdkVersion: 24,
          enableProguardInReleaseBuilds: true,
          enableShrinkResourcesInReleaseBuilds: true
        },
        ios: {
          deploymentTarget: "15.0",
          useFrameworks: "static"
        }
      }
    ],
    [
      "expo-in-app-purchases",
      {
        enableAndroidBillingClient: true
      }
    ]
  ],
  
  // Expo Configuration
  extra: {
    eas: {
      projectId: "finsight-mobile"
    },
    // RevenueCat API Keys
    revenueCatApiKeyIOS: process.env.REVENUECAT_API_KEY_IOS || "",
    revenueCatApiKeyAndroid: process.env.REVENUECAT_API_KEY_ANDROID || "",
    // API Configuration
    apiUrl: process.env.EXPO_PUBLIC_API_URL || "https://f-insight.org/api",
    wsUrl: process.env.EXPO_PUBLIC_WS_URL || "wss://f-insight.org/ws",
    environment: process.env.EXPO_PUBLIC_ENV || "development"
  },
  
  // Owner and Updates
  owner: "finsight",
  runtimeVersion: {
    policy: "appVersion"
  },
  updates: {
    url: "https://u.expo.dev/finsight-mobile",
    fallbackToCacheTimeout: 30000
  },
  
  // Experiments
  experiments: {
    typedRoutes: true
  },
  
  // Scheme for deep linking
  scheme: "finsight"
};
