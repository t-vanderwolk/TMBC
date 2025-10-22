import React from "react";
import { View } from "react-native";
import { Feather } from "@expo/vector-icons";
import ScreenContainer from "../../components/ScreenContainer";
import TMText from "../../components/TMText";
import TMCard from "../../components/TMCard";
import TMButton from "../../components/TMButton";
import { colors } from "../../styles/theme";

const conciergeHighlights = [
  {
    title: "Nursery Vision Board",
    icon: "image",
    detail: "Upload inspo photos and we&apos;ll reply with shoppable links.",
  },
  {
    title: "Personalized Checklist",
    icon: "check-square",
    detail: "We tailor your prep list for trimester, lifestyle, and space.",
  },
];

export default function ConciergeScreen() {
  return (
    <ScreenContainer activeRoute="Concierge" contentClassName="gap-6 pb-16">
      <TMCard className="gap-3 bg-mauve/15 border-mauve/30">
        <TMText className="text-mauve text-sm font-semibold uppercase tracking-[0.3em]">
          Concierge Desk
        </TMText>
        <TMText className="font-greatVibes text-4xl text-charcoal">
          Your Dedicated Support Team
        </TMText>
        <TMText className="text-charcoal/75 text-base">
          Ask us anything. We&apos;ll craft responses that fit your family, your
          space, and your style.
        </TMText>
      </TMCard>

      <View className="gap-4">
        {conciergeHighlights.map((highlight) => (
          <TMCard key={highlight.title} className="gap-3">
            <View className="flex-row items-center gap-4">
              <View className="h-12 w-12 rounded-full bg-gold/20 items-center justify-center">
                <Feather name={highlight.icon as any} size={22} color={colors.charcoal} />
              </View>
              <TMText className="font-nunito text-lg text-charcoal font-semibold">
                {highlight.title}
              </TMText>
            </View>
            <TMText className="text-charcoal/70 text-sm">
              {highlight.detail}
            </TMText>
            <TMButton label="Get Started" variant="secondary" onPress={() => {}} />
          </TMCard>
        ))}
      </View>

      <TMCard className="gap-3">
        <TMText className="font-playfair text-lg text-charcoal">
          Office Hours
        </TMText>
        <TMText className="text-charcoal/70 text-sm">
          Book a 30-minute video session to walk through space planning or your
          current checklist.
        </TMText>
        <TMButton label="Schedule with Concierge" onPress={() => {}} />
      </TMCard>
    </ScreenContainer>
  );
}
