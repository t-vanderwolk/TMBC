import React from "react";
import { View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NavigationProp } from "@react-navigation/native";
import TMText from "../../components/TMText";
import { supabase } from "../../lib/supabase";
import ScreenContainer from "../../components/ScreenContainer";
import TMCard from "../../components/TMCard";
import TMButton from "../../components/TMButton";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import type { MainNavRoute } from "../../components/TMNavbar";

export default function DashboardScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  React.useEffect(() => {
    const fetchProfiles = async () => {
      const { data, error } = await supabase.from("profiles").select("*");

      if (error) {
        console.error("Supabase profiles error:", error);
        return;
      }

      console.log("Supabase profiles data:", data);
    };

    fetchProfiles();
  }, []);

  return (
    <ScreenContainer
      activeRoute="Dashboard"
      contentClassName="px-6 pt-6 gap-6"
    >
      <View className="bg-white/70 rounded-3xl px-6 py-6 shadow-sm border border-mauve/10">
        <TMText className="text-charcoal text-sm font-semibold uppercase tracking-widest">
          Welcome Back
        </TMText>
        <TMText className="text-mauve text-3xl font-bold mt-1">
          Your Taylor-Made Journey
        </TMText>
        <TMText className="text-charcoal/80 text-base mt-3">
          Here&apos;s what we curated for you today. Explore each space to stay
          supported, inspired, and organized.
        </TMText>
      </View>

      <View className="gap-4">
        <TMText className="text-charcoal text-xl font-semibold">
          Spotlight
        </TMText>
        <TMCard className="flex-row items-center gap-4 border border-mauve/10">
          <View className="h-12 w-12 rounded-full bg-mauve/15 items-center justify-center">
            <Feather name="calendar" size={24} color="#C8A1B4" />
          </View>
          <View className="flex-1">
            <TMText className="text-charcoal font-semibold">
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
        <TMText className="text-charcoal text-xl font-semibold">
          Quick Actions
        </TMText>
        <View className="flex-row flex-wrap gap-4">
          {(
            [
              { label: "Academy", icon: "book-open", route: "Academy" },
              { label: "Registry", icon: "gift", route: "Registry" },
              { label: "Community", icon: "users", route: "Community" },
              { label: "Concierge", icon: "message-circle", route: "Concierge" },
              { label: "Journal", icon: "feather", route: "Journal" },
            ] as Array<{ label: string; icon: FeatherName; route: MainNavRoute }>
          ).map((item) => (
            <TMCard
              key={item.label}
              className="w-[47%] gap-3 border border-mauve/10"
            >
              <View className="h-10 w-10 rounded-full bg-blush/30 items-center justify-center">
                <Feather name={item.icon} size={20} color="#3E2F35" />
              </View>
              <TMText className="text-charcoal text-lg font-semibold">
                {item.label}
              </TMText>
              <TMText className="text-charcoal/70 text-sm">
                Step into your {item.label.toLowerCase()} hub.
              </TMText>
              <TMButton
                label="Open"
                variant="ghost"
                className="px-0"
                textClassName="text-mauve"
                onPress={() => navigation.navigate(item.route)}
              />
            </TMCard>
          ))}
        </View>
      </View>

      <View className="gap-4 mb-12">
        <TMText className="text-charcoal text-xl font-semibold">
          Today&apos;s Notes
        </TMText>
        <TMCard className="border border-mauve/10">
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
type FeatherName = React.ComponentProps<typeof Feather>["name"];
