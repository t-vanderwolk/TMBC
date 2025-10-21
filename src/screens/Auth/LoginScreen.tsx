import React from "react";
import { KeyboardAvoidingView, Platform, TextInput, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import TMText from "../../components/TMText";
import TMButton from "../../components/TMButton";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { supabase } from "../../lib/supabase";
import ScreenContainer from "../../components/ScreenContainer";
import TMCard from "../../components/TMCard";

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleLogin = React.useCallback(async () => {
    if (loading) return;

    setErrorMessage(null);

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setErrorMessage("Please enter the email you used to create your account.");
      return;
    }

    if (!password.trim()) {
      setErrorMessage("Please enter your password.");
      return;
    }

    setLoading(true);

    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

    if (authError || !authData.session) {
      setErrorMessage(
        authError?.message ??
          "We could not sign you in with those credentials. Try again."
      );
      setLoading(false);
      return;
    }

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", authData.session.user.id)
      .maybeSingle();

    if (profileError || !profileData) {
      setErrorMessage(
        "We signed you in, but couldn't find your profile. Please contact support."
      );
      setLoading(false);
      return;
    }

    setLoading(false);

    navigation.reset({
      index: 0,
      routes: [{ name: "Dashboard" }],
    });
  }, [email, loading, navigation, password]);

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <ScreenContainer
        scrollable
        keyboardShouldPersistTaps="handled"
        contentClassName="px-6 py-12 gap-8"
      >
        <TMCard className="gap-3 bg-white/70">
          <TMText className="text-mauve text-sm font-semibold uppercase tracking-widest text-center">
            Welcome Back
          </TMText>
          <TMText className="text-charcoal text-2xl font-bold text-center">
            Sign in to Continue
          </TMText>
          <TMText className="text-charcoal/75 text-sm text-center">
            Use the email and password you created after redeeming your invite
            code.
          </TMText>
        </TMCard>

        <TMCard className="gap-5">
          <View>
            <TMText className="text-charcoal text-sm mb-2 font-semibold">
              Email
            </TMText>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@email.com"
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor="#C8A1B4"
              className="rounded-2xl border border-mauve/30 bg-white px-4 py-3 text-charcoal"
            />
          </View>

          <View>
            <TMText className="text-charcoal text-sm mb-2 font-semibold">
              Password
            </TMText>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor="#C8A1B4"
              secureTextEntry
              className="rounded-2xl border border-mauve/30 bg-white px-4 py-3 text-charcoal"
            />
          </View>

          {errorMessage ? (
            <TMText className="text-red-500 text-sm">{errorMessage}</TMText>
          ) : null}

          <TMButton
            label={loading ? "Signing in..." : "Sign In"}
            onPress={handleLogin}
            disabled={loading}
          />
        </TMCard>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}
