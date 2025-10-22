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

type InviteCode = Database["public"]["Tables"]["invite_codes"]["Row"];
type WaitlistRequest =
  Database["public"]["Tables"]["waitlist_requests"]["Row"];

function formatStatus(invite: InviteCode) {
  if (invite.used) return "Used";
  if (!invite.approved) return "Awaiting approval";
  return "Ready";
}

export default function AdminInvitesScreen() {
  const [invites, setInvites] = React.useState<InviteCode[]>([]);
  const [waitlist, setWaitlist] = React.useState<WaitlistRequest[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [busyId, setBusyId] = React.useState<string | null>(null);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    const [{ data: inviteData }, { data: waitlistData }] = await Promise.all([
      supabase
        .from("invite_codes")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("waitlist_requests")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);

    if (inviteData) setInvites(inviteData);
    if (waitlistData) setWaitlist(waitlistData);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const toggleApproval = React.useCallback(
    async (invite: InviteCode) => {
      if (invite.used) return;
      setBusyId(invite.id);
      const { error } = await supabase
        .from("invite_codes")
        .update({ approved: !invite.approved })
        .eq("id", invite.id);
      if (error) {
        console.error("Failed to toggle approval:", error);
      } else {
        await loadData();
      }
      setBusyId(null);
    },
    [loadData]
  );

  const unusedCodes = invites.filter((invite) => !invite.used);

  return (
    <ScreenContainer
      activeRoute="AdminInvites"
      contentClassName="gap-6 pb-16"
    >
      <TMCard className="gap-3 bg-ivory/95">
        <TMText className="font-greatVibes text-4xl text-charcoal">
          Invite Center
        </TMText>
        <TMText className="text-charcoal/75 text-base">
          Track invite codes, resend approvals, and monitor waitlist health at
          a glance.
        </TMText>
      </TMCard>

      <TMCard className="gap-3">
        <View className="flex-row items-center gap-3">
          <View className="h-10 w-10 rounded-full bg-mauve/15 items-center justify-center">
            <Feather name="list" size={20} color={colors.mauve} />
          </View>
          <TMText className="font-playfair text-lg text-charcoal">
            Unused Invite Codes
          </TMText>
        </View>
        {loading ? (
          <TMText className="text-charcoal/60 text-sm">
            Loading recent codes...
          </TMText>
        ) : unusedCodes.length === 0 ? (
          <TMText className="text-charcoal/60 text-sm">
            All invite codes have been redeemed.
          </TMText>
        ) : (
          unusedCodes.slice(0, 8).map((invite) => (
            <TMCard key={invite.id} className="flex-row items-center justify-between bg-white/90">
              <View>
                <TMText className="font-nunito text-charcoal font-semibold">
                  {invite.code}
                </TMText>
                <TMText className="text-charcoal/60 text-xs">
                  Status: {formatStatus(invite)}
                </TMText>
              </View>
              <TMButton
                label={invite.approved ? "Pause" : "Approve"}
                variant={invite.approved ? "outline" : "secondary"}
                onPress={() => toggleApproval(invite)}
                disabled={busyId === invite.id}
                className="px-4"
              />
            </TMCard>
          ))
        )}
      </TMCard>

      <TMCard className="gap-3">
        <View className="flex-row items-center gap-3">
          <View className="h-10 w-10 rounded-full bg-gold/20 items-center justify-center">
            <Feather name="activity" size={20} color={colors.charcoal} />
          </View>
          <TMText className="font-playfair text-lg text-charcoal">
            Recent Waitlist Activity
          </TMText>
        </View>
        {loading ? (
          <TMText className="text-charcoal/60 text-sm">
            Loading waitlist insights...
          </TMText>
        ) : (
          waitlist.slice(0, 5).map((request) => (
            <TMCard key={request.id} className="gap-2 bg-white/90">
              <TMText className="font-nunito text-charcoal font-semibold">
                {request.name ?? request.email}
              </TMText>
              <TMText className="text-charcoal/60 text-xs">
                {request.email} • {request.role_preference}
              </TMText>
              <TMText className="text-charcoal/60 text-xs">
                {request.approved
                  ? `Approved ${new Date(request.approved_at ?? "").toLocaleDateString()}`
                  : "Awaiting approval"}
              </TMText>
            </TMCard>
          ))
        )}
      </TMCard>
    </ScreenContainer>
  );
}
