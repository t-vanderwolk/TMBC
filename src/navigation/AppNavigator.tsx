import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnboardingScreen from "../screens/Onboarding/OnboardingScreen";
import DashboardScreen from "../screens/Dashboard/DashboardScreen";
import AcademyScreen from "../screens/Academy/AcademyScreen";
import RegistryScreen from "../screens/Registry/RegistryScreen";
import CommunityScreen from "../screens/Community/CommunityScreen";
import ConciergeScreen from "../screens/Concierge/ConciergeScreen";
import JournalScreen from "../screens/Journal/JournalScreen";
import RequestInviteScreen from "../screens/Auth/RequestInviteScreen";
import InvitationCodeScreen from "../screens/Auth/InvitationCodeScreen";
import ProfileQuestionnaireScreen from "../screens/Auth/ProfileQuestionnaireScreen";
import LoginScreen from "../screens/Auth/LoginScreen";

export type RootStackParamList = {
  Onboarding: undefined;
  RequestInvite: undefined;
  InvitationCode: undefined;
  ProfileQuestionnaire: { inviteCodeId: string; inviteCode: string };
  Login: undefined;
  Dashboard: undefined;
  Academy: undefined;
  Registry: undefined;
  Community: undefined;
  Concierge: undefined;
  Journal: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Onboarding"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="RequestInvite" component={RequestInviteScreen} />
        <Stack.Screen name="InvitationCode" component={InvitationCodeScreen} />
        <Stack.Screen
          name="ProfileQuestionnaire"
          component={ProfileQuestionnaireScreen}
        />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Academy" component={AcademyScreen} />
        <Stack.Screen name="Registry" component={RegistryScreen} />
        <Stack.Screen name="Community" component={CommunityScreen} />
        <Stack.Screen name="Concierge" component={ConciergeScreen} />
        <Stack.Screen name="Journal" component={JournalScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
