import React from "react";
import { useFonts } from "expo-font";

export const FONT_SOURCES = {
  GreatVibes: require("../../assets/fonts/GreatVibes-Regular.ttf"),
  Nunito: require("../../assets/fonts/Nunito-Regular.ttf"),
  PlayfairDisplay: require("../../assets/fonts/PlayfairDisplay-Regular.ttf"),
} as const;

export function useBrandFonts() {
  const [loaded, error] = useFonts(FONT_SOURCES);

  React.useEffect(() => {
    if (error) {
      console.error("Failed to load brand fonts:", error);
    }
  }, [error]);

  return {
    fontsLoaded: loaded,
    fontsReady: loaded || Boolean(error),
    error,
  };
}
