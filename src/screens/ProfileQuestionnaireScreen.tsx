import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TMText from "../components/TMText";
import TMButton from "../components/TMButton";

export default function ProfileQuestionnaireScreen({ navigation }: any) {
  return (
    <SafeAreaView className="flex-1 bg-ivory p-6">
      <View className="gap-4">
        <TMText variant="heading">Tell Us About Your Journey</TMText>
        <TMText>
          Complete a few questions so we can tailor your concierge experience.
        </TMText>
        <TMButton
          title="Submit"
          onPress={() => navigation.navigate("Dashboard")}
        />
      </View>
    </SafeAreaView>
  );
}
