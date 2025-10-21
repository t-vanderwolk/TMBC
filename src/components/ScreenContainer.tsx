import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TMNavbar, { MainNavRoute } from "./TMNavbar";

type ScreenContainerProps = {
  children: React.ReactNode;
  activeRoute?: MainNavRoute;
  scrollable?: boolean;
  contentClassName?: string;
  keyboardShouldPersistTaps?: "always" | "handled" | "never";
};

export default function ScreenContainer({
  children,
  activeRoute,
  scrollable = true,
  contentClassName,
  keyboardShouldPersistTaps,
}: ScreenContainerProps) {
  const content = scrollable ? (
    <ScrollView
      className="flex-1"
      contentContainerClassName={`pb-12 ${contentClassName ?? ""}`}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
    >
      {children}
    </ScrollView>
  ) : (
    <View className={`flex-1 ${contentClassName ?? ""}`}>{children}</View>
  );

  return (
    <SafeAreaView className="flex-1 bg-ivory">
      <View pointerEvents="none" className="flex-1">
        <View className="absolute -top-20 -right-10 h-52 w-52 rounded-full bg-mauve/10" />
        <View className="absolute top-40 -left-16 h-64 w-64 rounded-full bg-blush/10" />
      </View>
      {activeRoute ? <TMNavbar activeRoute={activeRoute} /> : null}
      {content}
    </SafeAreaView>
  );
}
