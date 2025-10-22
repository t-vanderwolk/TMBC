import React from "react";
import { KeyboardAvoidingView, Platform, Switch, TextInput, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import TMText from "../../components/TMText";
import TMButton from "../../components/TMButton";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { supabase } from "../../lib/supabase";
import ScreenContainer from "../../components/ScreenContainer";
import TMCard from "../../components/TMCard";
import { colors } from "../../styles/theme";

type ProfileQuestionnaireProps = NativeStackScreenProps<
  RootStackParamList,
  "ProfileQuestionnaire"
>;

export default function ProfileQuestionnaireScreen({
  navigation,
  route,
}: ProfileQuestionnaireProps) {
  const { inviteCodeId, inviteCode } = route.params;

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [dueDate, setDueDate] = React.useState("");
  const [nurseryStyle, setNurseryStyle] = React.useState("");
  const [topConcerns, setTopConcerns] = React.useState("");
  const [registryReady, setRegistryReady] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleSubmit = React.useCallback(async () => {
    if (loading) return;

    setErrorMessage(null);

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    const trimmedName = name.trim();

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", trimmedEmail)
      .maybeSingle();

    const { data: signUpData, error: signUpError } = await supabase.auth
      .signUp({
        email: trimmedEmail,
        password,
        options: {
          data: {
            full_name: trimmedName || undefined,
          },
        },
      });

    if (signUpError) {
      setErrorMessage(signUpError.message);
      setLoading(false);
      return;
    }

    let userId = signUpData.user?.id ?? signUpData.session?.user.id;

    if (!userId) {
      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });
      if (signInError) {
        setErrorMessage(signInError.message);
        setLoading(false);
        return;
      }
      userId = signInData.session?.user.id;
    }

    if (!userId) {
      setErrorMessage(
        "We couldn't finalize your account. Please contact support."
      );
      setLoading(false);
      return;
    }

    const profilePayload = {
      id: existingProfile?.id ?? userId,
      user_id: userId,
      email: trimmedEmail,
      full_name: trimmedName || existingProfile?.full_name || null,
      name: trimmedName || existingProfile?.name || null,
      role: "member" as const,
      onboarding_completed: true,
      mentor_id: existingProfile?.mentor_id ?? null,
    };

    const { error: profileError } = await supabase
      .from("profiles")
      .upsert(profilePayload, { onConflict: "email" });

    if (profileError) {
      setErrorMessage(
        "We couldn't save your profile. Please double-check the details and try again."
      );
      setLoading(false);
      return;
    }

    const {
      data: questionnaireData,
      error: questionnaireError,
    } = await supabase
      .from("profile_questionnaire")
      .upsert(
        {
          profile_id: profilePayload.id,
          due_date: dueDate ? dueDate : null,
          nursery_style: nurseryStyle.trim() || null,
          top_concerns: topConcerns.trim() || null,
          registry_ready: registryReady,
        },
        { onConflict: "profile_id" }
      )
      .select()
      .single();

    if (questionnaireError || !questionnaireData) {
      setErrorMessage(
        "We saved your profile but not the questionnaire. Please try again."
      );
      setLoading(false);
      return;
    }

    const {
      data: updatedInvite,
      error: updateError,
    } = await supabase
      .from("invite_codes")
      .update({
        used: true,
        used_at: new Date().toISOString(),
        assigned_to: profilePayload.id,
      })
      .eq("id", inviteCodeId)
      .eq("used", false)
      .select()
      .maybeSingle();

    if (updateError || !updatedInvite) {
      setErrorMessage(
        "We couldn't finalize your invite. Please contact support with your code."
      );
      setLoading(false);
      return;
    }

    setLoading(false);

    navigation.reset({
      index: 0,
      routes: [{ name: "MemberDashboard" }],
    });
  }, [
    dueDate,
    email,
    inviteCodeId,
    loading,
    name,
    navigation,
    nurseryStyle,
    registryReady,
    topConcerns,
  ]);

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
            Final Step
          </TMText>
          <TMText className="font-greatVibes text-4xl text-charcoal text-center">
            Tell Us About You
          </TMText>
          <TMText className="text-charcoal text-base text-center">
            Invite code <TMText className="text-mauve font-semibold">{inviteCode}</TMText>
          </TMText>
          <TMText className="text-charcoal/75 text-base text-center">
            Share a few details so we can tailor your concierge experience,
            Academy path, and community circles.
          </TMText>
        </TMCard>

        <TMCard className="gap-5">
          <View className="gap-4">
            <View>
              <TMText className="text-charcoal text-sm mb-2 font-semibold">
                Full name
              </TMText>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Taylor Smith"
                placeholderTextColor={colors.mauve}
                className="rounded-2xl border border-mauve/30 bg-white px-4 py-3 text-charcoal"
              />
            </View>

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
                placeholderTextColor={colors.mauve}
                className="rounded-2xl border border-mauve/30 bg-white px-4 py-3 text-charcoal"
              />
            </View>

            <View>
              <TMText className="text-charcoal text-sm mb-2 font-semibold">
                Estimated due date
              </TMText>
              <TextInput
                value={dueDate}
                onChangeText={setDueDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.mauve}
                className="rounded-2xl border border-mauve/30 bg-white px-4 py-3 text-charcoal"
              />
            </View>

            <View>
              <TMText className="text-charcoal text-sm mb-2 font-semibold">
                Nursery style inspiration
              </TMText>
              <TextInput
                value={nurseryStyle}
                onChangeText={setNurseryStyle}
                multiline
                numberOfLines={3}
                placeholder="Soft neutrals with mauve accents"
                placeholderTextColor={colors.mauve}
                className="rounded-2xl border border-mauve/30 bg-white px-4 py-3 text-charcoal"
              />
            </View>

              <View>
                <TMText className="text-charcoal text-sm mb-2 font-semibold">
                  Top parenting concerns
                </TMText>
                <TextInput
                  value={topConcerns}
                  onChangeText={setTopConcerns}
                  multiline
                  numberOfLines={4}
                  placeholder="Sleep support, registry planning, nursery setup"
                  placeholderTextColor={colors.mauve}
                  className="rounded-2xl border border-mauve/30 bg-white px-4 py-3 text-charcoal"
                />
              </View>

              <View className="gap-3">
                <TMText className="text-charcoal text-sm font-semibold">
                  Create a password
                </TMText>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter a secure password"
                  placeholderTextColor={colors.mauve}
                  secureTextEntry
                  className="rounded-2xl border border-mauve/30 bg-white px-4 py-3 text-charcoal"
                />
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm password"
                  placeholderTextColor={colors.mauve}
                  secureTextEntry
                  className="rounded-2xl border border-mauve/30 bg-white px-4 py-3 text-charcoal"
                />
              </View>

            <View className="flex-row items-center justify-between rounded-2xl border border-mauve/30 bg-white px-4 py-3">
              <View className="flex-1 pr-3">
                <TMText className="text-charcoal text-base font-semibold">
                  Registry almost ready?
                </TMText>
                <TMText className="text-charcoal text-xs mt-1">
                  Toggle on if you already have your registry in progress.
                </TMText>
              </View>
              <Switch
                value={registryReady}
                onValueChange={setRegistryReady}
                trackColor={{ false: colors.blush, true: colors.mauve }}
                thumbColor={colors.ivory}
              />
            </View>
          </View>

          {errorMessage ? (
            <TMText className="text-gold text-sm">{errorMessage}</TMText>
          ) : null}

          <TMButton
            label={loading ? "Saving..." : "Access My Dashboard"}
            onPress={handleSubmit}
            disabled={loading}
          />
        </TMCard>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}
