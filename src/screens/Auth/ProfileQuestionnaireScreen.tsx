import React from "react";
import { KeyboardAvoidingView, Platform, Switch, TextInput, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import TMText from "../../components/TMText";
import TMButton from "../../components/TMButton";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { supabase } from "../../lib/supabase";
import ScreenContainer from "../../components/ScreenContainer";
import TMCard from "../../components/TMCard";

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

    setLoading(true);

    const {
      data: profileData,
      error: profileError,
    } = await supabase
      .from("profiles")
      .insert({
        email: trimmedEmail,
        full_name: trimmedName || null,
        name: trimmedName || null,
        role: "member",
      })
      .select()
      .single();

    if (profileError || !profileData) {
      if ((profileError?.code ?? "") === "23505") {
        setErrorMessage(
          "We already have a profile for this email. Try logging in or request support."
        );
      } else {
        setErrorMessage(
          "We couldn't save your profile. Please double-check the details and try again."
        );
      }
      setLoading(false);
      return;
    }

    const {
      data: questionnaireData,
      error: questionnaireError,
    } = await supabase
      .from("profile_questionnaire")
      .insert({
        profile_id: profileData.id,
        due_date: dueDate ? dueDate : null,
        nursery_style: nurseryStyle.trim() || null,
        top_concerns: topConcerns.trim() || null,
        registry_ready: registryReady,
      })
      .select()
      .single();

    if (questionnaireError || !questionnaireData) {
      await supabase.from("profiles").delete().eq("id", profileData.id);
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
        assigned_to: profileData.id,
      })
      .eq("id", inviteCodeId)
      .eq("used", false)
      .select()
      .maybeSingle();

    if (updateError || !updatedInvite) {
      await supabase
        .from("profile_questionnaire")
        .delete()
        .eq("id", questionnaireData.id);
      await supabase.from("profiles").delete().eq("id", profileData.id);
      setErrorMessage(
        "We couldn't finalize your invite. Please contact support with your code."
      );
      setLoading(false);
      return;
    }

    setLoading(false);

    navigation.reset({
      index: 0,
      routes: [{ name: "Dashboard" }],
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
        contentClassName="px-6 py-12 gap-8"
      >
        <TMCard className="gap-3 bg-white/70">
          <TMText className="text-mauve text-sm font-semibold uppercase tracking-widest text-center">
            Final Step
          </TMText>
          <TMText className="text-charcoal text-2xl font-bold text-center">
            Tell Us About You
          </TMText>
          <TMText className="text-charcoal text-base text-center">
            Invite code <TMText className="text-mauve font-semibold">{inviteCode}</TMText>
          </TMText>
          <TMText className="text-charcoal/75 text-sm text-center">
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
                placeholderTextColor="#C8A1B4"
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
                placeholderTextColor="#C8A1B4"
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
                placeholderTextColor="#C8A1B4"
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
                placeholderTextColor="#C8A1B4"
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
                placeholderTextColor="#C8A1B4"
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
                trackColor={{ false: "#EAC9D1", true: "#C8A1B4" }}
                thumbColor={registryReady ? "#FFFAF8" : "#FFFAF8"}
              />
            </View>
          </View>

          {errorMessage ? (
            <TMText className="text-red-500 text-sm">{errorMessage}</TMText>
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
