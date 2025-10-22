import React from "react";
import { View } from "react-native";
import { Feather } from "@expo/vector-icons";
import ScreenContainer from "../../components/ScreenContainer";
import TMText from "../../components/TMText";
import TMCard from "../../components/TMCard";
import TMButton from "../../components/TMButton";
import { colors } from "../../styles/theme";

const circles = [
  {
    name: "Due Date Buddies",
    members: "12 members",
    icon: "users",
    blurb: "Share weekly wins with parents due the same month as you.",
  },
  {
    name: "Mentor Moments",
    members: "5 mentors",
    icon: "star",
    blurb: "Drop a question and our mentors reply with lived experience.",
  },
];

export default function CommunityScreen() {
  return (
    <ScreenContainer activeRoute="Community" contentClassName="gap-6 pb-16">
      <TMCard className="gap-3 bg-blush/15 border-blush/30">
        <TMText className="text-mauve text-sm font-semibold uppercase tracking-[0.3em]">
          Community Circles
        </TMText>
        <TMText className="font-greatVibes text-4xl text-charcoal">
          Gentle Spaces, Real Conversations
        </TMText>
        <TMText className="text-charcoal/75 text-base">
          Connect with other parents walking a similar path. Celebrate the tiny
          wins, ask the tender questions.
        </TMText>
      </TMCard>

      <View className="gap-4">
        {circles.map((circle) => (
          <TMCard key={circle.name} className="gap-3">
            <View className="flex-row items-center gap-4">
              <View className="h-12 w-12 rounded-full bg-mauve/12 items-center justify-center">
                <Feather name={circle.icon as any} size={22} color={colors.mauve} />
              </View>
              <View className="flex-1">
                <TMText className="font-nunito text-lg text-charcoal font-semibold">
                  {circle.name}
                </TMText>
                <TMText className="text-charcoal/60 text-sm">
                  {circle.members}
                </TMText>
              </View>
              <TMButton label="Join" variant="secondary" onPress={() => {}} />
            </View>
            <TMText className="text-charcoal/70 text-sm">
              {circle.blurb}
            </TMText>
          </TMCard>
        ))}
      </View>

      <TMCard className="gap-3">
        <TMText className="font-playfair text-lg text-charcoal">
          Community Guidelines
        </TMText>
        <TMText className="text-charcoal/70 text-sm">
          We keep this circle intimate and kind. Your concierge is always on
          standby to moderate or support.
        </TMText>
        <TMButton label="View Guidelines" variant="outline" onPress={() => {}} />
      </TMCard>
    </ScreenContainer>
  );
}
