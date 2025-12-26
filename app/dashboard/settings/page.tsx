import { getUserOrThrow } from "@/lib/auth/getUser";
import { redirect } from "next/navigation";

import HouseholdForm, { type HouseholdData } from "@/components/dashboard/member/settings/HouseholdForm";
import OnboardingEditor from "@/components/dashboard/member/settings/OnboardingEditor";
import ProfileForm from "@/components/dashboard/member/settings/ProfileForm";
import SettingsTabs from "@/components/dashboard/member/settings/SettingsTabs";
import PinterestSyncCard from "@/components/dashboard/member/settings/PinterestSyncCard";
import { getMemberSettingsData } from "@/lib/services/server/memberSettings.service";

export default async function MemberSettingsPage() {
  const user = await getUserOrThrow();
  if (user.role !== "MEMBER") {
    redirect("/login");
  }

  const { profile, onboardingProfile } = await getMemberSettingsData(user.id);
  const household = (
    (onboardingProfile?.answers as Record<string, unknown>)?.household as
      | HouseholdData
      | undefined
  ) ?? undefined;
  const tabs = [
    { id: "profile", label: "Profile Info", description: "Name, email, photo" },
    { id: "household", label: "Household", description: "Partner & caregiving roles" },
    { id: "preferences", label: "Preferences", description: "Questionnaire answers" },
  ];

  return (
    <div className="space-y-8">
      <SettingsTabs tabs={tabs} />

      <section id="profile">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">Member · Profile</p>
          <h1 className="text-3xl font-serif text-[#3E2F35]">Profile info</h1>
        </div>
        <ProfileForm
          user={{
            email: user.email,
            firstName: profile?.firstName ?? user.name?.split(" ").shift() ?? "",
            lastName: profile?.lastName ?? user.name?.split(" ").slice(1).join(" ") ?? "",
          }}
          profileImage={profile?.imageUrl ?? null}
        />
      </section>

      <section id="household">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">Member · Household</p>
          <h2 className="text-2xl font-serif text-[#3E2F35]">Household & support</h2>
        </div>
        <HouseholdForm household={household} />
      </section>

      <section id="preferences">
        <OnboardingEditor />
      </section>

      <section>
        <PinterestSyncCard />
      </section>
    </div>
  );
}
