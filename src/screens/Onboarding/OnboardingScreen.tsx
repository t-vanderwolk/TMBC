import React from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import TMText from "../../components/TMText";
import TMButton from "../../components/TMButton";
import TMCard from "../../components/TMCard";
import ScreenContainer from "../../components/ScreenContainer";
import { RootStackParamList } from "../../navigation/AppNavigator";

type OnboardingNavigation = NativeStackNavigationProp<
  RootStackParamList,
  "Onboarding"
>;

export default function OnboardingScreen() {
  const navigation = useNavigation<OnboardingNavigation>();

  const goToRequestInvite = React.useCallback(() => {
    navigation.navigate("RequestInvite");
  }, [navigation]);

  const goToInvitation = React.useCallback(() => {
    navigation.navigate("InvitationCode");
  }, [navigation]);

  const goToLogin = React.useCallback(() => {
    navigation.navigate("Login");
  }, [navigation]);

  return (
    <ScreenContainer scrollable contentClassName="px-6 py-16 gap-10">
      <View className="gap-4 items-center">
        <TMText className="text-mauve text-4xl font-bold text-center">
          Taylor-Made Baby Co.
        </TMText>
        <TMText className="text-charcoal text-base text-center max-w-md">
          A concierge membership for modern parents—curated registry guides,
          trusted mentors, and gentle community, all in one place.
        </TMText>
      </View>

      <View className="gap-4">
        <TMCard className="gap-2">
          <TMText className="text-charcoal text-lg font-semibold text-center">
            Your journey, thoughtfully tailored.
          </TMText>
          <TMText className="text-charcoal/70 text-sm text-center">
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
            <TMCard
              key={highlight}
              className="w-[48%] items-center gap-2 bg-white/60"
            >
              <TMText className="text-mauve text-sm font-semibold text-center">
                {highlight}
              </TMText>
            </TMCard>
          ))}
        </View>
      </View>

      <View className="gap-3">
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
