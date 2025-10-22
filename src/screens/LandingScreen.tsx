import React from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TMText from "../components/TMText";
import TMButton from "../components/TMButton";

export default function LandingScreen({ navigation }: any) {
  return (
    <SafeAreaView className="flex-1 bg-ivory p-6">
      <ScrollView showsVerticalScrollIndicator={false} className="gap-6">
        <TMText variant="heading">
          Welcome to Taylor-Made Baby Co.
        </TMText>
        <TMButton
          title="Request Invite"
          onPress={() => navigation.navigate("RequestInvite")}
        />
        <TMButton
          title="I Have an Invite Code"
          onPress={() => navigation.navigate("InvitationCode")}
        />
        <TMButton
          title="Member Login"
          onPress={() => navigation.navigate("Login")}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
