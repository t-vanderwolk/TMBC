import React from "react";
import { View } from "react-native";
import { Feather } from "@expo/vector-icons";
import ScreenContainer from "../../components/ScreenContainer";
import TMText from "../../components/TMText";
import TMCard from "../../components/TMCard";
import TMButton from "../../components/TMButton";
import { colors } from "../../styles/theme";

const featuredModules = [
  {
    title: "Fourth Trimester Essentials",
    duration: "18 min video",
    icon: "film",
    summary: "Dr. Rivera shares calming routines for new parents and babies.",
  },
  {
    title: "Sleep Signals 101",
    duration: "12 min lesson",
    icon: "moon",
    summary: "Understand sleepy cues and build your gentle wind-down ritual.",
  },
];

export default function AcademyScreen() {
  return (
    <ScreenContainer activeRoute="Academy" contentClassName="gap-6 pb-16">
      <TMCard className="gap-3 bg-ivory/95">
        <TMText className="text-mauve text-sm font-semibold uppercase tracking-[0.3em]">
          Learning Library
        </TMText>
        <TMText className="font-greatVibes text-4xl text-charcoal">
          Weekly Academy Picks
        </TMText>
        <TMText className="text-charcoal/75 text-base">
          Curated sessions that match your baby&apos;s milestones and your current
          focus.
        </TMText>
      </TMCard>

      <View className="gap-4">
        {featuredModules.map((module) => (
          <TMCard key={module.title} className="gap-4">
            <View className="flex-row items-center gap-4">
              <View className="h-12 w-12 rounded-full bg-mauve/15 items-center justify-center">
                <Feather name={module.icon as any} size={22} color={colors.mauve} />
              </View>
              <View className="flex-1 gap-1">
                <TMText className="font-nunito text-lg text-charcoal font-semibold">
                  {module.title}
                </TMText>
                <TMText className="text-charcoal/60 text-sm">
                  {module.duration}
                </TMText>
              </View>
            </View>
            <TMText className="text-charcoal/70 text-sm">
              {module.summary}
            </TMText>
            <TMButton label="Start Lesson" variant="secondary" onPress={() => {}} />
          </TMCard>
        ))}
      </View>

      <TMCard className="gap-3 bg-blush/15 border-blush/40">
        <TMText className="font-playfair text-lg text-charcoal">
          Need a guided path?
        </TMText>
        <TMText className="text-charcoal/70 text-sm">
          Message your concierge and we will personalize a course list for your
          family&apos;s season.
        </TMText>
        <TMButton
          label="Message Concierge"
          variant="outline"
          onPress={() => {}}
        />
      </TMCard>
    </ScreenContainer>
  );
}
