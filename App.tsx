import React, { useCallback, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import AppNavigator from "./src/navigation/AppNavigator";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    GreatVibes: require("./assets/fonts/GreatVibes-Regular.ttf"),
    Nunito: require("./assets/fonts/Nunito-Regular.ttf"),
    PlayfairDisplay: require("./assets/fonts/PlayfairDisplay-Regular.ttf"),
  });

  useEffect(() => {
    if (fontError) {
      console.error("❌ Font loading error:", fontError);
    }
  }, [fontError]);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
      console.log("✅ Fonts ready, SplashScreen hidden");
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    console.log("⏳ Waiting for fonts...");
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <AppNavigator />
    </SafeAreaView>
  );
}
