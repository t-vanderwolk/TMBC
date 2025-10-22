import React from "react";
import { View } from "react-native";
import { Feather } from "@expo/vector-icons";
import ScreenContainer from "../../components/ScreenContainer";
import TMCard from "../../components/TMCard";
import TMText from "../../components/TMText";
import TMButton from "../../components/TMButton";
import { supabase } from "../../lib/supabase";
import type { Database } from "../../lib/database.types";
import { colors } from "../../styles/theme";
import { useAuth } from "../../hooks/useAuth";

type WaitlistRequest =
  Database["public"]["Tables"]["waitlist_requests"]["Row"];
type InviteCode = Database["public"]["Tables"]["invite_codes"]["Row"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

const ICONS: Record<
  "waitlist" | "invite" | "role",
  React.ComponentProps<typeof Feather>["name"]
> = {
  waitlist: "mail",
  invite: "tag",
  role: "briefcase",
};

function generateInviteCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "TMBC-";
  for (let i = 0; i < 6; i += 1) {
    const index = Math.floor(Math.random() * alphabet.length);
    code += alphabet[index];
  }
  return code;
}

export default function AdminDashboardScreen() {
  const { refreshProfile } = useAuth();
  const [waitlist, setWaitlist] = React.useState<WaitlistRequest[]>([]);
  const [invites, setInvites] = React.useState<InviteCode[]>([]);
  const [profiles, setProfiles] = React.useState<ProfileRow[]>([]);
  const [busyId, setBusyId] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    const [{ data: waitlistData }, { data: inviteData }, { data: profileData }] =
      await Promise.all([
        supabase
          .from("waitlist_requests")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("invite_codes")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false }),
      ]);

    if (waitlistData) setWaitlist(waitlistData);
    if (inviteData) setInvites(inviteData);
    if (profileData) setProfiles(profileData);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleApproveRequest = React.useCallback(
    async (request: WaitlistRequest) => {
      setBusyId(request.id);
      const inviteCode = generateInviteCode();
      const approvedAt = new Date().toISOString();

      const { error: waitlistError } = await supabase
        .from("waitlist_requests")
        .update({
          approved: true,
          approved_at: approvedAt,
          invite_code: inviteCode,
        })
        .eq("id", request.id);

      if (waitlistError) {
        console.error("Failed to approve request:", waitlistError);
        setBusyId(null);
        return;
      }

      const { error: inviteError } = await supabase.from("invite_codes").insert({
        code: inviteCode,
        approved: true,
        used: false,
      });

      if (inviteError) {
        console.error("Failed to create invite:", inviteError);
        setBusyId(null);
        return;
      }

      await loadData();
      setBusyId(null);
    },
    [loadData]
  );

  const handleRoleChange = React.useCallback(
    async (profileId: string, role: ProfileRow["role"]) => {
      setBusyId(profileId);
      const { error } = await supabase
        .from("profiles")
        .update({ role })
        .eq("id", profileId);
      if (error) {
        console.error("Failed to update role:", error);
      } else {
        await Promise.all([loadData(), refreshProfile()]);
      }
      setBusyId(null);
    },
    [loadData, refreshProfile]
  );

  const pendingRequests = waitlist.filter((item) => !item.approved);
  const activeInvites = invites.filter((invite) => !invite.used);

  return (
    <ScreenContainer
      activeRoute="AdminDashboard"
      contentClassName="gap-6 pb-16"
    >
      <TMCard className="gap-3 bg-ivory/95">
        <View className="flex-row items-center gap-3">
          <View className="h-12 w-12 rounded-full bg-mauve/15 items-center justify-center">
            <Feather name={ICONS.waitlist} size={24} color={colors.mauve} />
          </View>
          <TMText className="font-greatVibes text-4xl text-charcoal">
            TMBC Admin Console
          </TMText>
        </View>
        <TMText className="text-charcoal/75 text-base">
          Review community waitlist, issue one-time invite codes, and calibrate
          roles to keep the experience curated.
        </TMText>
      </TMCard>

      <TMCard className="gap-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View className="h-10 w-10 rounded-full bg-mauve/15 items-center justify-center">
              <Feather name={ICONS.waitlist} size={20} color={colors.mauve} />
            </View>
            <TMText className="font-playfair text-lg text-charcoal">
              Waitlist Requests
            </TMText>
          </View>
          <TMText className="text-mauve font-semibold">
            {pendingRequests.length} pending
          </TMText>
        </View>

        {pendingRequests.length === 0 ? (
          <TMText className="text-charcoal/60 text-sm">
            No pending requests. New submissions will appear here instantly.
          </TMText>
        ) : (
          pendingRequests.map((request) => (
            <TMCard key={request.id} className="gap-3 bg-white/90">
              <TMText className="font-nunito text-charcoal font-semibold">
                {request.name ?? "Awaiting name"}
              </TMText>
              <TMText className="text-charcoal/70 text-sm">
                {request.email} • Prefers role: {request.role_preference}
              </TMText>
              <TMButton
                label="Approve & Generate Invite"
                onPress={() => handleApproveRequest(request)}
                disabled={busyId === request.id}
              />
            </TMCard>
          ))
        )}
      </TMCard>

      <TMCard className="gap-4 bg-white/90">
        <View className="flex-row items-center gap-3">
          <View className="h-10 w-10 rounded-full bg-gold/20 items-center justify-center">
            <Feather name={ICONS.invite} size={20} color={colors.charcoal} />
          </View>
          <TMText className="font-playfair text-lg text-charcoal">
            Active Invites
          </TMText>
        </View>
        {activeInvites.length === 0 ? (
          <TMText className="text-charcoal/60 text-sm">
            All invites have been used. Approve a waitlist request to generate a
            new code.
          </TMText>
        ) : (
          activeInvites.slice(0, 5).map((invite) => (
            <TMCard
              key={invite.id}
              className="flex-row items-center justify-between bg-ivory/90"
            >
              <View>
                <TMText className="font-nunito text-charcoal font-semibold">
                  {invite.code}
                </TMText>
                <TMText className="text-charcoal/60 text-xs">
                  {invite.approved ? "Approved" : "Pending approval"} •{" "}
                  {invite.used ? "Used" : "Unused"}
                </TMText>
              </View>
              <TMText className="text-mauve text-xs">
                Created {new Date(invite.created_at).toLocaleDateString()}
              </TMText>
            </TMCard>
          ))
        )}
      </TMCard>

      <TMCard className="gap-4">
        <View className="flex-row items-center gap-3">
          <View className="h-10 w-10 rounded-full bg-blush/20 items-center justify-center">
            <Feather name={ICONS.role} size={20} color={colors.charcoal} />
          </View>
          <TMText className="font-playfair text-lg text-charcoal">
            Role Management
          </TMText>
        </View>
        {profiles.length === 0 ? (
          <TMText className="text-charcoal/60 text-sm">
            No profiles found yet. As members onboard, you can adjust their
            access level here.
          </TMText>
        ) : (
          profiles.slice(0, 6).map((profileRow) => (
            <TMCard key={profileRow.id} className="gap-2 bg-white/90">
              <TMText className="font-nunito text-charcoal font-semibold">
                {profileRow.full_name ?? profileRow.email}
              </TMText>
              <TMText className="text-charcoal/60 text-xs">
                {profileRow.email} • Current role: {profileRow.role}
              </TMText>
              <View className="flex-row gap-2">
                {(["member", "mentor", "admin"] as const).map((roleOption) => (
                  <TMButton
                    key={roleOption}
                    label={roleOption}
                    variant={
                      profileRow.role === roleOption ? "secondary" : "outline"
                    }
                    onPress={() => handleRoleChange(profileRow.id, roleOption)}
                    disabled={busyId === profileRow.id}
                    className="px-4"
                  />
                ))}
              </View>
            </TMCard>
          ))
        )}
      </TMCard>
    </ScreenContainer>
  );
}
