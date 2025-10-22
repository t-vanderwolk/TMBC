import React from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NavigationProp } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import ScreenContainer from "../../components/ScreenContainer";
import TMCard from "../../components/TMCard";
import TMText from "../../components/TMText";
import TMButton from "../../components/TMButton";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../hooks/useAuth";
import type { Database } from "../../lib/database.types";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import { colors } from "../../styles/theme";
import type { MainNavRoute } from "../../components/TMNavbar";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type AnnouncementRow = Database["public"]["Tables"]["announcements"]["Row"];

export default function MentorDashboardScreen() {
  const { profile } = useAuth();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [mentees, setMentees] = React.useState<ProfileRow[]>([]);
  const [announcements, setAnnouncements] = React.useState<AnnouncementRow[]>(
    []
  );

  React.useEffect(() => {
    const load = async () => {
      if (!profile?.id) return;
      const [{ data: menteeData }, { data: announcementData }] =
        await Promise.all([
          supabase
            .from("profiles")
            .select("*")
            .eq("mentor_id", profile.id)
            .order("created_at", { ascending: false }),
          supabase
            .from("announcements")
            .select("*")
            .or("audience.eq.all,audience.eq.mentor")
            .order("starts_at", { ascending: false })
            .limit(3),
        ]);

      if (menteeData) setMentees(menteeData);
      if (announcementData) setAnnouncements(announcementData);
    };

    load();
  }, [profile?.id]);

  const quickLinks: Array<{
    label: string;
    description: string;
    icon: React.ComponentProps<typeof Feather>["name"];
    route: MainNavRoute;
  }> = React.useMemo(
    () => [
      {
        label: "Registry",
        description: "Review selections before member check-ins.",
        icon: "gift",
        route: "Registry",
      },
      {
        label: "Concierge",
        description: "Coordinate care plans and share resources.",
        icon: "message-circle",
        route: "Concierge",
      },
      {
        label: "Journal",
        description: "Read shared reflections ahead of sessions.",
        icon: "book",
        route: "Journal",
      },
    ],
    []
  );

  return (
    <ScreenContainer
      activeRoute="MentorDashboard"
      contentClassName="gap-6 pb-16"
    >
      <TMCard className="gap-3 bg-ivory/95">
        <TMText className="text-mauve text-sm font-semibold uppercase tracking-[0.3em]">
          Mentor Console
        </TMText>
        <TMText className="font-greatVibes text-4xl text-charcoal">
          Support Your Families
        </TMText>
        <TMText className="text-charcoal/75 text-base">
          View your mentees, catch announcements, and jump into the tools you
          need most often.
        </TMText>
      </TMCard>

      <TMCard className="gap-4">
        <View className="flex-row items-center gap-3">
          <View className="h-10 w-10 rounded-full bg-mauve/15 items-center justify-center">
            <Feather name="users" size={20} color={colors.mauve} />
          </View>
          <TMText className="font-playfair text-lg text-charcoal">
            My Members
          </TMText>
        </View>
        {mentees.length === 0 ? (
          <TMText className="text-charcoal/60 text-sm">
            Once members choose you as a mentor, they will appear here.
          </TMText>
        ) : (
          mentees.map((mentee) => (
            <TMCard key={mentee.id} className="gap-2 bg-white/90">
              <TMText className="font-nunito text-charcoal font-semibold">
                {mentee.full_name ?? mentee.email}
              </TMText>
              <TMText className="text-charcoal/60 text-xs">
                {mentee.email} • Due {mentee.due_date ?? "TBD"}
              </TMText>
            </TMCard>
          ))
        )}
      </TMCard>

      <TMCard className="gap-4 bg-white/90">
        <View className="flex-row items-center gap-3">
          <View className="h-10 w-10 rounded-full bg-gold/20 items-center justify-center">
            <Feather name="volume-2" size={20} color={colors.charcoal} />
          </View>
          <TMText className="font-playfair text-lg text-charcoal">
            Announcements
          </TMText>
        </View>
        {announcements.length === 0 ? (
          <TMText className="text-charcoal/60 text-sm">
            No new announcements. We&apos;ll let you know when updates arrive.
          </TMText>
        ) : (
          announcements.map((announcement) => (
            <TMCard key={announcement.id} className="gap-2 bg-ivory/90">
              <TMText className="font-nunito text-charcoal font-semibold">
                {announcement.title}
              </TMText>
              <TMText className="text-charcoal/70 text-sm">
                {announcement.body}
              </TMText>
            </TMCard>
          ))
        )}
      </TMCard>

      <View className="gap-4">
        <TMText className="font-playfair text-lg text-charcoal">
          Quick Links
        </TMText>
        <View className="flex-row flex-wrap gap-4">
          {quickLinks.map((link) => (
            <TMCard key={link.label} className="w-[47%] gap-3">
              <View className="h-10 w-10 rounded-full bg-blush/30 items-center justify-center">
                <Feather name={link.icon} size={20} color={colors.charcoal} />
              </View>
              <TMText className="font-nunito text-lg text-charcoal font-semibold">
                {link.label}
              </TMText>
              <TMText className="text-charcoal/70 text-sm">
                {link.description}
              </TMText>
              <TMButton
                label="Open"
                variant="outline"
                className="px-0"
                onPress={() => navigation.navigate(link.route)}
              />
            </TMCard>
          ))}
        </View>
      </View>
    </ScreenContainer>
  );
}
