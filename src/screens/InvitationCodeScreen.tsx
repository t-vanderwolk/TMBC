import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TMText from "../components/TMText";
import TMButton from "../components/TMButton";

export default function InvitationCodeScreen({ navigation }: any) {
  return (
    <SafeAreaView className="flex-1 bg-ivory p-6">
      <View className="gap-4">
        <TMText variant="heading">Enter Your Invitation Code</TMText>
        <TMText>
          Redeem your invitation to unlock the concierge experience tailored to
          your family.
        </TMText>
        <TMButton
          title="Next"
          onPress={() => navigation.navigate("ProfileQuestionnaire")}
        />
      </View>
    </SafeAreaView>
  );
}
