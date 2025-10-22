import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LandingScreen from "../screens/LandingScreen";
import RequestInviteScreen from "../screens/RequestInviteScreen";
import InvitationCodeScreen from "../screens/InvitationCodeScreen";
import ProfileQuestionnaireScreen from "../screens/ProfileQuestionnaireScreen";
import LoginScreen from "../screens/LoginScreen";
import DashboardScreen from "../screens/DashboardScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen name="RequestInvite" component={RequestInviteScreen} />
        <Stack.Screen
          name="InvitationCode"
          component={InvitationCodeScreen}
        />
        <Stack.Screen
          name="ProfileQuestionnaire"
          component={ProfileQuestionnaireScreen}
        />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
