import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TMText from "../components/TMText";
import TMButton from "../components/TMButton";

export default function DashboardScreen({ navigation }: any) {
  return (
    <SafeAreaView className="flex-1 bg-ivory p-6">
      <ScrollView showsVerticalScrollIndicator={false} className="gap-6">
        <TMText variant="heading">Your Taylor-Made Concierge</TMText>
        <TMText>
          Explore curated learning paths, connect with mentors, and manage your
          registry in one place.
        </TMText>
        <View className="gap-3">
          <TMButton
            title="Back to Landing"
            variant="secondary"
            onPress={() => navigation.navigate("Landing")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
