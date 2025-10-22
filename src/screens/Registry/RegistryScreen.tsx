import React from "react";
import { View } from "react-native";
import { Feather } from "@expo/vector-icons";
import ScreenContainer from "../../components/ScreenContainer";
import TMText from "../../components/TMText";
import TMCard from "../../components/TMCard";
import TMButton from "../../components/TMButton";
import { colors } from "../../styles/theme";

const categories = [
  {
    title: "Nursery Style",
    icon: "home",
    description: "Layer blush textiles and gold accents into your ivory base.",
  },
  {
    title: "Daily Care",
    icon: "heart",
    description: "Bottles, calm corner essentials, and midnight nursing aids.",
  },
  {
    title: "On-the-Go",
    icon: "briefcase",
    description: "Curated diaper bag picks so you can pack light and luxe.",
  },
];

export default function RegistryScreen() {
  return (
    <ScreenContainer activeRoute="Registry" contentClassName="gap-6 pb-16">
      <TMCard className="gap-3 bg-gold/15 border-gold/30">
        <TMText className="text-mauve text-sm font-semibold uppercase tracking-[0.3em]">
          Registry Concierge
        </TMText>
        <TMText className="font-greatVibes text-4xl text-charcoal">
          Curate Your Signature Collection
        </TMText>
        <TMText className="text-charcoal/75 text-base">
          We&apos;ll help you build a registry that matches your parenting style
          and aesthetic vision.
        </TMText>
      </TMCard>

      <View className="gap-4">
        {categories.map((category) => (
          <TMCard key={category.title} className="gap-3 border-mauve/10">
            <View className="flex-row items-center gap-4">
              <View className="h-12 w-12 rounded-full bg-mauve/12 items-center justify-center">
                <Feather name={category.icon as any} size={22} color={colors.mauve} />
              </View>
              <TMText className="font-nunito text-lg text-charcoal font-semibold">
                {category.title}
              </TMText>
            </View>
            <TMText className="text-charcoal/70 text-sm">
              {category.description}
            </TMText>
            <TMButton label="View Picks" variant="secondary" onPress={() => {}} />
          </TMCard>
        ))}
      </View>

      <TMCard className="gap-3">
        <TMText className="font-playfair text-lg text-charcoal">
          Concierge Tip
        </TMText>
        <TMText className="text-charcoal/70 text-sm">
          Invite friends to shop by category and mark items as purchased so we
          can refresh your recommendations in real time.
        </TMText>
        <TMButton label="Share Registry" variant="outline" onPress={() => {}} />
      </TMCard>
    </ScreenContainer>
  );
}
