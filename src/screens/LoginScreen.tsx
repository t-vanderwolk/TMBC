import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TMText from "../components/TMText";
import TMButton from "../components/TMButton";

export default function LoginScreen({ navigation }: any) {
  return (
    <SafeAreaView className="flex-1 bg-ivory p-6">
      <View className="gap-4">
        <TMText variant="heading">Member Login</TMText>
        <TMText>
          Welcome back! Continue to the dashboard to explore your concierge
          resources.
        </TMText>
        <TMButton
          title="Go to Dashboard"
          onPress={() => navigation.navigate("Dashboard")}
        />
      </View>
    </SafeAreaView>
  );
}
