import React from "react";
import { View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NavigationProp } from "@react-navigation/native";
import TMText from "../../components/TMText";
import ScreenContainer from "../../components/ScreenContainer";
import TMCard from "../../components/TMCard";
import TMButton from "../../components/TMButton";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import type { MainNavRoute } from "../../components/TMNavbar";
import { colors } from "../../styles/theme";
import { useAuth } from "../../hooks/useAuth";

type FeatherName = React.ComponentProps<typeof Feather>["name"];

export default function MemberDashboardScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { profile } = useAuth();

  const quickActions: Array<{ label: string; icon: FeatherName; route: MainNavRoute }> = React.useMemo(
    () => [
      { label: "Learn", icon: "book-open", route: "Academy" },
      { label: "Prepare", icon: "gift", route: "Registry" },
      { label: "Connect", icon: "users", route: "Community" },
      { label: "Concierge", icon: "message-circle", route: "Concierge" },
      { label: "Journal", icon: "feather", route: "Journal" },
    ],
    []
  );

  return (
    <ScreenContainer activeRoute="MemberDashboard" contentClassName="gap-6 pt-4">
      <TMCard className="gap-3 bg-ivory/95">
        <TMText className="text-sm font-semibold uppercase tracking-[0.3em] text-charcoal/70">
          Welcome Back
        </TMText>
        <TMText className="font-greatVibes text-4xl text-mauve">
          Your Taylor-Made Journey
        </TMText>
        <TMText className="font-nunito text-base text-charcoal/80">
          {profile?.full_name
            ? `Hi ${profile.full_name.split(" ")[0]}, here is your personalized outlook for today.`
            : "Here&apos;s what we curated for you today. Explore each space to stay supported, inspired, and organized."}
        </TMText>
      </TMCard>

      <View className="gap-4">
        <TMText className="font-playfair text-xl text-charcoal">
          Spotlight
        </TMText>
        <TMCard className="flex-row items-center gap-4">
          <View className="h-12 w-12 rounded-full bg-mauve/15 items-center justify-center">
            <Feather name="calendar" size={24} color={colors.mauve} />
          </View>
          <View className="flex-1">
            <TMText className="font-nunito text-base text-charcoal font-semibold">
              Upcoming Concierge Session
            </TMText>
            <TMText className="text-charcoal/70 text-sm">
              Review your nursery checklist before the weekend call.
            </TMText>
          </View>
          <TMButton
            label="View"
            onPress={() => {}}
            variant="outline"
            className="px-5"
          />
        </TMCard>
      </View>

      <View className="gap-4">
        <TMText className="font-playfair text-xl text-charcoal">
          Quick Actions
        </TMText>
        <View className="flex-row flex-wrap gap-4">
          {quickActions.map((item) => (
            <TMCard key={item.label} className="w-[47%] gap-3">
              <View className="h-10 w-10 rounded-full bg-blush/30 items-center justify-center">
                <Feather name={item.icon} size={20} color={colors.charcoal} />
              </View>
              <TMText className="font-nunito text-lg text-charcoal font-semibold">
                {item.label}
              </TMText>
              <TMText className="text-charcoal/70 text-sm">
                Step into your {item.label.toLowerCase()} hub.
              </TMText>
              <TMButton
                label="Open"
                variant="outline"
                className="px-0"
                onPress={() => navigation.navigate(item.route)}
              />
            </TMCard>
          ))}
        </View>
      </View>

      <View className="gap-4 mb-12">
        <TMText className="font-playfair text-xl text-charcoal">
          Today&apos;s Notes
        </TMText>
        <TMCard>
          <TMText className="text-charcoal/70 text-sm">
            Keep a quick reflection about today&apos;s milestone, or jot down a
            reminder for your concierge.
          </TMText>
          <TMButton
            label="Write a journal entry"
            variant="secondary"
            className="mt-4"
            onPress={() => {}}
          />
        </TMCard>
      </View>
    </ScreenContainer>
  );
}
