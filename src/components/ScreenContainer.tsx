import React from "react";
import { Animated, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TMNavbar, { MainNavRoute } from "./TMNavbar";

type NavLink = {
  label: string;
  route: MainNavRoute;
};

type ScreenContainerProps = {
  children: React.ReactNode;
  activeRoute?: MainNavRoute;
  scrollable?: boolean;
  contentClassName?: string;
  keyboardShouldPersistTaps?: "always" | "handled" | "never";
  navLinks?: NavLink[];
};

export default function ScreenContainer({
  children,
  activeRoute,
  scrollable = true,
  contentClassName,
  keyboardShouldPersistTaps,
  navLinks,
}: ScreenContainerProps) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const defaultPadding = "px-6 py-6";
  const contentClasses = contentClassName
    ? `${defaultPadding} ${contentClassName}`
    : defaultPadding;

  const content = scrollable ? (
    <ScrollView
      className="flex-1"
      contentContainerClassName={`${contentClasses} pb-16`}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
    >
      {children}
    </ScrollView>
  ) : (
    <View className={`flex-1 ${contentClasses}`}>{children}</View>
  );

  return (
    <SafeAreaView className="flex-1 bg-ivory">
      <View pointerEvents="none" className="absolute inset-0">
        <View className="absolute -top-24 -right-16 h-64 w-64 rounded-full bg-mauve/10" />
        <View className="absolute top-32 -left-24 h-72 w-72 rounded-full bg-blush/10" />
      </View>
      {activeRoute ? <TMNavbar activeRoute={activeRoute} links={navLinks} /> : null}
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>{content}</Animated.View>
    </SafeAreaView>
  );
}
