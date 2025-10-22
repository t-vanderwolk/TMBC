import React, { useCallback } from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import TMText from "../../components/TMText";
import TMButton from "../../components/TMButton";
import TMCard from "../../components/TMCard";
import ScreenContainer from "../../components/ScreenContainer";

type OnboardingNavigation = NativeStackNavigationProp<
  RootStackParamList,
  "Onboarding"
>;

export default function OnboardingScreen() {
  const navigation = useNavigation<OnboardingNavigation>();

  // Navigation handlers
  const goToRequestInvite = useCallback(() => {
    navigation.navigate("RequestInvite");
  }, [navigation]);

  const goToInvitation = useCallback(() => {
    navigation.navigate("InvitationCode");
  }, [navigation]);

  const goToLogin = useCallback(() => {
    navigation.navigate("Login");
  }, [navigation]);

  return (
    <ScreenContainer scrollable contentClassName="py-12 gap-10">
      <View className="items-center">
        <TMText variant="heading" className="mb-3">
          Taylor-Made Baby Co.
        </TMText>
        <TMText variant="subheading" className="max-w-md">
          A concierge membership for modern parents—curated registry guides,
          trusted mentors, and gentle community, all in one place.
        </TMText>
      </View>

      <View className="gap-5">
        <TMCard className="items-center gap-2 bg-white/70">
          <TMText variant="subheading" className="text-charcoal text-center">
            Your journey, thoughtfully tailored.
          </TMText>
          <TMText className="text-charcoal/70 text-base text-center">
            We pair expert concierge support with learning paths and a private
            circle of caregivers who get it.
          </TMText>
        </TMCard>

        <View className="flex-row flex-wrap gap-4 justify-center">
          {[
            "Concierge guidance on demand",
            "Curated learning experiences",
            "Intentional community & mentors",
          ].map((highlight) => (
            <TMCard key={highlight} className="w-[48%] items-center gap-2">
              <TMText className="text-mauve text-sm font-semibold text-center">
                {highlight}
              </TMText>
            </TMCard>
          ))}
        </View>
      </View>

      <View className="gap-3 mt-4">
        <TMButton label="Request an Invite" onPress={goToRequestInvite} />
        <TMButton
          label="I Have an Invite Code"
          onPress={goToInvitation}
          variant="secondary"
        />
        <TMButton
          label="Member Login"
          onPress={goToLogin}
          variant="outline"
        />
      </View>
    </ScreenContainer>
  );
}
