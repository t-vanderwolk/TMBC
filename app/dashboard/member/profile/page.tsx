import { getUserOrThrow } from "@/lib/auth/getUser";
import { getMemberSettingsData } from "@/lib/services/server/memberSettings.service";
import PreferencesSection from "@/components/dashboard/member/profile/PreferencesSection";
import ProfileDetailsForm from "@/components/dashboard/member/profile/ProfileDetailsForm";
import PartnerProfileForm from "@/components/dashboard/member/profile/PartnerProfileForm";

const formatDateInputValue = (value?: Date | string | null) => {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (!Number.isFinite(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

export default async function MemberProfilePage() {
  const user = await getUserOrThrow();
  const { profile, partnerProfile } = await getMemberSettingsData(user.id);

  const initialProfile = {
    firstName: profile?.firstName ?? user.name?.split(" ")[0] ?? "",
    lastName: profile?.lastName ?? "",
    preferredName: profile?.preferredName ?? "",
    city: profile?.city ?? "",
    state: profile?.state ?? "",
    dueDate: formatDateInputValue(profile?.dueDate ?? user.dueDate),
    location: user.location ?? "",
  };

  const initialPartner = {
    name: partnerProfile?.name ?? "",
    roleLabel: partnerProfile?.roleLabel ?? "",
    notes: partnerProfile?.notes ?? "",
  };

  return (
    <main className="space-y-8 px-4 py-10 sm:px-6 lg:px-10">
      <section className="space-y-2 rounded-[32px] border border-[#E3D0D7] bg-white/90 p-6 shadow-[0_30px_90px_rgba(189,147,189,0.15)]">
        <p className="text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">Profile & context</p>
        <h1 className="font-serif text-3xl text-[#3E2F35]">Update your story quietly</h1>
        <p className="text-sm text-[#3E2F35]/70">
          Change what matters, keep your mentor in the loop, and never worry about restarting anything.
        </p>
      </section>

      <section className="space-y-6 rounded-[32px] border border-[#E3D0D7] bg-white/90 p-6 shadow-[0_25px_80px_rgba(189,147,189,0.15)]">
        <ProfileDetailsForm initial={initialProfile} />
      </section>

      <section className="space-y-6 rounded-[32px] border border-[#E3D0D7] bg-white/90 p-6 shadow-[0_25px_80px_rgba(189,147,189,0.15)]">
        <PreferencesSection />
      </section>

      <section className="space-y-6 rounded-[32px] border border-[#E3D0D7] bg-white/90 p-6 shadow-[0_25px_80px_rgba(189,147,189,0.15)]">
        <PartnerProfileForm initial={initialPartner} />
      </section>
    </main>
  );
}
