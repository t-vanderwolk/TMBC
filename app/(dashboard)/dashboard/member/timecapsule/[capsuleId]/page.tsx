"use server";

import EmotionTrigger from "@/components/tmbc/EmotionTrigger";
import TimeCapsuleCard from "@/components/tmbc/TimeCapsuleCard";
import { fetchUserTimeCapsules } from "@/lib/api/placeholders";

export default async function CapsuleDetail({ params }: { params: { capsuleId: string } }) {
  const capsules = await fetchUserTimeCapsules();
  const capsule = capsules.find((item) => item.id === params.capsuleId) ?? capsules[0];

  if (!capsule) {
    return null;
  }

  return (
    <div className="space-y-6">
      <TimeCapsuleCard
        title={capsule.title}
        type={capsule.type}
        preview={capsule.preview}
        scheduledFor={capsule.scheduledFor}
      />
      <p className="text-sm text-[#3E2F35]/70">
        In this capsule we noticed: {capsule.preview ?? "A gentle whisper."}
      </p>
      <EmotionTrigger />
    </div>
  );
}
