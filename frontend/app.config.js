import "dotenv/config";

export default {
  expo: {
    name: "frontend",
    slug: "nestwell",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",

    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },

    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.panda2387.nestwell",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },

    android: {
      package: "com.anonymous.frontend",

      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY,
        },
      },

      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/android-icon-foreground.png",
        backgroundImage: "./assets/android-icon-background.png",
        monochromeImage: "./assets/android-icon-monochrome.png",
      },

      predictiveBackGestureEnabled: false,
    },

    web: {
      favicon: "./assets/favicon.png",
    },

    extra: {
      eas: {
        projectId: "4dbab289-07f9-474a-916c-fcbfe3f2b20a",
      },
    },

    owner: "panda2387s-organization",
  },
};