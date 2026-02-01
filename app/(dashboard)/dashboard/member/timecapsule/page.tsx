"use server";

import Link from "next/link";
import EmotionTrigger from "@/components/tmbc/EmotionTrigger";
import TimeCapsuleCard from "@/components/tmbc/TimeCapsuleCard";
import TimeCapsuleEditor from "@/components/tmbc/TimeCapsuleEditor";
import VaultAnimation from "@/components/tmbc/VaultAnimation";
import StyledButton from "@/components/tmbc/StyledButton";
import { fetchUserTimeCapsules } from "@/lib/api/placeholders";

export default async function TimeCapsuleIndexPage() {
  const capsules = await fetchUserTimeCapsules();

  return (
    <div className="space-y-8">
      <header className="space-y-2 rounded-[2rem] border border-[#E3C6D4] bg-white/90 p-6 shadow-[0_18px_60px_rgba(180,143,164,0.2)]">
        <p className="text-xs uppercase tracking-[0.35em] text-[#C7A6C9]">Time capsule</p>
        <h1 className="font-serif text-3xl text-[#3E2F35]">Vault</h1>
        <p className="text-sm text-[#3E2F35]/70">Capture letters, audio, or videos for future eyes.</p>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/timecapsule/new">
            <StyledButton>Add new capsule</StyledButton>
          </Link>
          <VaultAnimation />
        </div>
      </header>
      <div className="grid gap-4 lg:grid-cols-2">
        {capsules.map((capsule) => (
          <Link key={capsule.id} href={`/dashboard/timecapsule/${capsule.id}`}>
            <TimeCapsuleCard
              title={capsule.title}
              type={capsule.type}
              preview={capsule.preview ?? "A thoughtful memento."}
              scheduledFor={capsule.scheduledFor}
            />
          </Link>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
        <TimeCapsuleEditor />
        <EmotionTrigger />
      </div>
    </div>
  );
}
