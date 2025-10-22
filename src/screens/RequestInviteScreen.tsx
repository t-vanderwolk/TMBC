import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TMText from "../components/TMText";
import TMButton from "../components/TMButton";

export default function RequestInviteScreen({ navigation }: any) {
  return (
    <SafeAreaView className="flex-1 bg-ivory p-6">
      <View className="gap-4">
        <TMText variant="heading">Request an Invite</TMText>
        <TMText>
          Share your details and we will send an invitation to join Taylor-Made
          Baby Co.
        </TMText>
        <TMButton
          title="Continue"
          onPress={() => navigation.navigate("InvitationCode")}
        />
      </View>
    </SafeAreaView>
  );
}
