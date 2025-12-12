export default {
  expo: {
    name: "recipe-ai-app",
    slug: "recipe-ai-app",
    version: "1.0.0",
    orientation: "portrait",
    scheme: "recipeaiapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    
    // Ortam değişkenlerini buraya ekleyin
    extra: {
      geminiApiKey: process.env.EXPO_PUBLIC_GEMINI_KEY,
    },
    
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE"
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false
    },
    web: {
      output: "static"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000"
          }
        }
      ]
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true
    }
  }
};