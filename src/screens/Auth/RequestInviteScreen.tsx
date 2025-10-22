import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import TMText from "../../components/TMText";
import TMButton from "../../components/TMButton";
import { supabase } from "../../lib/supabase";
import ScreenContainer from "../../components/ScreenContainer";
import TMCard from "../../components/TMCard";
import { colors } from "../../styles/theme";

const roleOptions = [
  { label: "Member", value: "member" as const },
  { label: "Mentor", value: "mentor" as const },
];

export default function RequestInviteScreen() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [rolePreference, setRolePreference] =
    React.useState<"member" | "mentor">("member");
  const [loading, setLoading] = React.useState(false);
  const [statusMessage, setStatusMessage] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleSubmit = React.useCallback(async () => {
    if (loading) return;

    setStatusMessage(null);
    setErrorMessage(null);

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("waitlist_requests").insert({
      name: name.trim() || null,
      email: trimmedEmail,
      role_preference: rolePreference,
    });

    if (error) {
      if (error.code === "23505") {
        setErrorMessage(
          "This email is already on the waitlist. We'll be in touch soon!"
        );
      } else {
        setErrorMessage(
          "Something went wrong submitting your request. Please try again."
        );
      }
      setLoading(false);
      return;
    }

    setStatusMessage(
      "You're on the waitlist! We'll review your request and email your invite code soon."
    );
    setName("");
    setEmail("");
    setRolePreference("member");
    setLoading(false);
  }, [email, loading, name, rolePreference]);

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
            Join Taylor-Made Baby Co.
          </TMText>
          <TMText className="font-greatVibes text-4xl text-charcoal text-center">
            Request an Invite
          </TMText>
          <TMText className="text-charcoal/75 text-base text-center">
            Tell us a little about yourself so we can match you with the right
            concierge team and community circles.
          </TMText>
        </TMCard>

        <TMCard className="gap-5">
          <View className="gap-3">
            <View>
              <TMText className="text-charcoal text-sm mb-2 font-semibold">
                Name
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
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={colors.mauve}
                className="rounded-2xl border border-mauve/30 bg-white px-4 py-3 text-charcoal"
              />
            </View>

            <View>
              <TMText className="text-charcoal text-sm mb-3 font-semibold">
                I'd like to join as a...
              </TMText>
              <View className="flex-row rounded-full bg-white p-1 border border-mauve/30">
                {roleOptions.map((option) => {
                  const isActive = option.value === rolePreference;
                  return (
                    <TouchableOpacity
                      key={option.value}
                      className={`flex-1 rounded-full px-4 py-2 ${
                        isActive ? "bg-mauve" : "bg-transparent"
                      }`}
                      onPress={() => setRolePreference(option.value)}
                      accessibilityRole="button"
                      accessibilityState={{ selected: isActive }}
                    >
                      <TMText
                        className={`text-center text-base font-semibold ${
                          isActive ? "text-ivory" : "text-charcoal"
                        }`}
                      >
                        {option.label}
                      </TMText>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>

          {errorMessage ? (
            <TMText className="text-gold text-sm">{errorMessage}</TMText>
          ) : null}

          {statusMessage ? (
            <TMText className="text-mauve text-sm">{statusMessage}</TMText>
          ) : null}

          <TMButton
            label={loading ? "Submitting..." : "Join the Waitlist"}
            onPress={handleSubmit}
            disabled={loading}
          />
        </TMCard>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}
