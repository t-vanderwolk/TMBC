import React from "react";
import { KeyboardAvoidingView, Platform, TextInput, View } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import TMText from "../../components/TMText";
import TMButton from "../../components/TMButton";
import { supabase } from "../../lib/supabase";
import { RootStackParamList } from "../../navigation/AppNavigator";
import ScreenContainer from "../../components/ScreenContainer";
import TMCard from "../../components/TMCard";
import { colors } from "../../styles/theme";

type InvitationCodeNavigation = NativeStackNavigationProp<
  RootStackParamList,
  "InvitationCode"
>;

export default function InvitationCodeScreen() {
  const navigation = useNavigation<InvitationCodeNavigation>();
  const [inviteCode, setInviteCode] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleValidate = React.useCallback(async () => {
    if (loading) return;

    setErrorMessage(null);
    const code = inviteCode.trim().toUpperCase();

    if (!code) {
      setErrorMessage("Please enter your invite code.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("invite_codes")
      .select("*")
      .eq("code", code)
      .maybeSingle();

    if (error || !data) {
      setErrorMessage("That invite code wasn't found. Check and try again.");
      setLoading(false);
      return;
    }

    if (!data.approved) {
      setErrorMessage(
        "This code hasn't been activated yet. Hang tight or contact support."
      );
      setLoading(false);
      return;
    }

    if (data.used) {
      setErrorMessage("This code has already been used. Request a new invite if needed.");
      setLoading(false);
      return;
    }

    setLoading(false);
    navigation.navigate("ProfileQuestionnaire", {
      inviteCodeId: data.id,
      inviteCode: data.code,
    });
  }, [inviteCode, loading, navigation]);

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <ScreenContainer
        scrollable
        keyboardShouldPersistTaps="handled"
        contentClassName="py-12 gap-8"
      >
        <TMCard className="gap-3 bg-white/70">
          <TMText className="text-mauve text-sm font-semibold uppercase tracking-[0.3em] text-center">
            Welcome In
          </TMText>
          <TMText className="font-greatVibes text-4xl text-charcoal text-center">
            Enter Your Invite Code
          </TMText>
          <TMText className="text-charcoal/75 text-base text-center">
            Validate your one-time code to unlock your Taylor-Made Baby Co.
            membership and questionnaire.
          </TMText>
        </TMCard>

        <TMCard className="gap-5">
          <View>
            <TMText className="text-charcoal text-sm font-semibold text-center mb-3">
              Invite Code
            </TMText>
            <TextInput
              value={inviteCode}
              onChangeText={setInviteCode}
              autoCapitalize="characters"
              placeholder="TMBC-2025"
              placeholderTextColor={colors.mauve}
              className="rounded-2xl border border-mauve/30 bg-white px-4 py-3 text-center text-lg tracking-[4px] text-charcoal"
            />
          </View>

          {errorMessage ? (
            <TMText className="text-gold text-sm text-center">
              {errorMessage}
            </TMText>
          ) : null}

          <TMButton
            label={loading ? "Validating..." : "Continue"}
            onPress={handleValidate}
            disabled={loading}
          />
        </TMCard>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}
