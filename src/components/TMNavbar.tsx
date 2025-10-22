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
import { colors } from "../styles/theme";
import { useAuth } from "../hooks/useAuth";

export type MainNavRoute =
  | "MemberDashboard"
  | "MentorDashboard"
  | "AdminDashboard"
  | "AdminInvites"
  | "Academy"
  | "Registry"
  | "Community"
  | "Concierge"
  | "Journal";

type NavLink = {
  label: string;
  route: MainNavRoute;
};

type TMNavbarProps = {
  activeRoute: MainNavRoute;
  links?: NavLink[];
};

type RoleKey = "admin" | "mentor" | "member";

const ROLE_LINKS: Record<RoleKey, NavLink[]> = {
  admin: [
    { label: "Dashboard", route: "AdminDashboard" },
    { label: "Invites", route: "AdminInvites" },
    { label: "Community", route: "Community" },
  ],
  mentor: [
    { label: "My Members", route: "MentorDashboard" },
    { label: "Registry", route: "Registry" },
    { label: "Community", route: "Community" },
    { label: "Concierge", route: "Concierge" },
    { label: "Journal", route: "Journal" },
  ],
  member: [
    { label: "Learn", route: "Academy" },
    { label: "Prepare", route: "Registry" },
    { label: "Connect", route: "Community" },
    { label: "Concierge", route: "Concierge" },
    { label: "Journal", route: "Journal" },
  ],
};

export default function TMNavbar({ activeRoute, links }: TMNavbarProps) {
  const { role } = useAuth();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [signingOut, setSigningOut] = React.useState(false);

  const computedLinks = React.useMemo(() => {
    if (links?.length) return links;
    if (!role) return [];
    return ROLE_LINKS[role] ?? [];
  }, [links, role]);

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

  if (computedLinks.length === 0) {
    return null;
  }

  return (
    <View className="bg-ivory/95 px-6 py-4 border-b border-blush/30">
      <View className="flex-row items-center justify-between mb-3">
        <TMText className="font-greatVibes text-3xl text-charcoal">
          Taylor-Made Baby Co.
        </TMText>
        <TouchableOpacity
          onPress={handleSignOut}
          className="flex-row items-center gap-2 px-4 py-2 rounded-full border border-gold bg-white/80"
          disabled={signingOut}
        >
          {signingOut ? (
            <ActivityIndicator size="small" color={colors.mauve} />
          ) : null}
          <TMText className="font-nunito text-sm font-semibold text-charcoal">
            {signingOut ? "Signing out..." : "Log Out"}
          </TMText>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12 }}
      >
        {computedLinks.map((link) => {
          const isActive = link.route === activeRoute;
          return (
            <TouchableOpacity
              key={link.route}
              onPress={() => handleNavigate(link.route)}
              className={`px-4 py-2 rounded-full border ${
                isActive
                  ? "bg-mauve border-mauve shadow-soft"
                  : "bg-white/70 border-transparent"
              }`}
            >
              <TMText
                className={`text-sm font-semibold font-nunito ${
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
