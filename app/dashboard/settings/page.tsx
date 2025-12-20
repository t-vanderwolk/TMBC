import { getUserOrThrow } from "@/lib/auth/getUser";
import { redirect } from "next/navigation";

import HouseholdForm, { type HouseholdData } from "@/components/dashboard/member/settings/HouseholdForm";
import OnboardingEditor from "@/components/dashboard/member/settings/OnboardingEditor";
import ProfileForm from "@/components/dashboard/member/settings/ProfileForm";
import RegenerateButton from "@/components/dashboard/member/settings/RegenerateButton";
import SettingsTabs from "@/components/dashboard/member/settings/SettingsTabs";
import PinterestSyncCard from "@/components/dashboard/member/settings/PinterestSyncCard";
import { getMemberSettingsData } from "@/lib/services/server/memberSettings.service";
import { CuratedRegistry } from "@/lib/registry/recommendations";

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
  const recommendations = onboardingProfile?.recommendations as CuratedRegistry | null | undefined;

  const tabs = [
    { id: "profile", label: "Profile Info", description: "Name, email, photo" },
    { id: "household", label: "Household", description: "Partner & caregiving roles" },
    { id: "preferences", label: "Preferences", description: "Questionnaire answers" },
    { id: "recommendations", label: "Registry Suggestions", description: "Recommendations & refresh" },
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

      <section id="recommendations" className="space-y-6">
        <RegenerateButton lastUpdated={onboardingProfile?.updatedAt?.toISOString() ?? null} />
        {recommendations && (
          <div className="rounded-3xl border border-[#E3D0D7] bg-white/90 p-6 shadow-[0_30px_90px_rgba(189,147,189,0.25)]">
            <div className="flex flex-wrap gap-2">
              {recommendations.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#E3D0D7] px-3 py-1 text-[0.65rem] uppercase tracking-[0.3em] text-[#3E2F35]/70"
                >
                  {tag.replace(/_/g, " ")}
                </span>
              ))}
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {recommendations.categories.map((category) => (
                <article
                  key={category.id}
                  className="rounded-2xl border border-[#E3D0D7] bg-[#FFF8F6] p-4"
                >
                  <p className="text-xs uppercase tracking-[0.35em] text-[#C8A1B4]">{category.title}</p>
                  <p className="mt-1 text-sm text-[#3E2F35]">{category.reason}</p>
                  <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#3E2F35]/60">
                    Priority {category.priority}
                  </p>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>

      <section>
        <PinterestSyncCard />
      </section>
    </div>
  );
}
