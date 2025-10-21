import React from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NavigationProp } from "@react-navigation/native";
import TMText from "./TMText";
import { supabase } from "../lib/supabase";
import type { RootStackParamList } from "../navigation/AppNavigator";

export type MainNavRoute =
  | "Dashboard"
  | "Academy"
  | "Registry"
  | "Community"
  | "Concierge"
  | "Journal";

type TMNavbarProps = {
  activeRoute: MainNavRoute;
};

const navLinks: Array<{
  label: string;
  route: MainNavRoute;
}> = [
  { label: "Dashboard", route: "Dashboard" },
  { label: "Academy", route: "Academy" },
  { label: "Registry", route: "Registry" },
  { label: "Community", route: "Community" },
  { label: "Concierge", route: "Concierge" },
  { label: "Journal", route: "Journal" },
];

export default function TMNavbar({ activeRoute }: TMNavbarProps) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [signingOut, setSigningOut] = React.useState(false);

  const handleNavigate = React.useCallback(
    (route: MainNavRoute) => {
      if (route === activeRoute) return;
      navigation.navigate(route);
    },
    [activeRoute, navigation]
  );

  const handleSignOut = React.useCallback(async () => {
    if (signingOut) return;
    setSigningOut(true);

    const { error } = await supabase.auth.signOut();

    if (error) {
      setSigningOut(false);
      Alert.alert("Sign out failed", error.message);
      return;
    }

    navigation.reset({
      index: 0,
      routes: [{ name: "Onboarding" as const }],
    });
  }, [navigation, signingOut]);

  return (
    <View className="bg-ivory px-4 py-4 border-b border-mauve/20">
      <View className="flex-row items-center justify-between mb-3">
        <TMText className="text-mauve text-2xl font-bold">
          Taylor-Made Baby Co.
        </TMText>
        <TouchableOpacity
          onPress={handleSignOut}
          className="flex-row items-center gap-2 px-3 py-2 rounded-full border border-mauve/40"
          disabled={signingOut}
        >
          {signingOut ? (
            <ActivityIndicator size="small" color="#C8A1B4" />
          ) : null}
          <TMText className="text-charcoal font-semibold">
            {signingOut ? "Signing out..." : "Log Out"}
          </TMText>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12 }}
      >
        {navLinks.map((link) => {
          const isActive = link.route === activeRoute;
          return (
            <TouchableOpacity
              key={link.route}
              onPress={() => handleNavigate(link.route)}
              className={`px-3 py-2 rounded-full ${
                isActive ? "bg-mauve" : "bg-white"
              }`}
            >
              <TMText
                className={`text-sm font-semibold ${
                  isActive ? "text-ivory" : "text-charcoal"
                }`}
              >
                {link.label}
              </TMText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
