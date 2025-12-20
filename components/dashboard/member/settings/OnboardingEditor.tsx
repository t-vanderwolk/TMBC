"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import QuestionnaireFlow from "@/components/onboarding/QuestionnaireFlow";
import { QuestionnaireSource } from "@/lib/types/questionnaire";

export default function OnboardingEditor() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);

  return (
    <div className="space-y-4 rounded-3xl border border-[#E3D0D7] bg-white/90 p-6 shadow-[0_30px_90px_rgba(189,147,189,0.25)]">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#C8A1B4]">Preferences</p>
          <h2 className="text-2xl font-serif text-[#3E2F35]">Edit my onboarding answers</h2>
          <p className="text-sm text-[#3E2F35]/70">
            Update your preferences without restarting onboarding. Mentors may see the new answers, and
            your registry stays intact.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="rounded-full border border-[#C29EB3] px-6 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[#C29EB3]"
        >
          Edit my preferences
        </button>
      </div>

      <div className="text-xs uppercase tracking-[0.35em] text-[#C8A1B4]">
        This will not remove items already on your registry. You can update this anytime.
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#12040a]/60 p-4">
          <div className="relative w-full max-w-4xl rounded-[2rem] bg-white/95 p-6 shadow-[0_30px_90px_rgba(189,147,189,0.35)]">
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-4 top-4 text-xl text-[#3E2F35]"
              aria-label="Close questionnaire"
            >
              ×
            </button>
            <QuestionnaireFlow
              endpoint="/api/member/settings/questionnaire"
              source={QuestionnaireSource.SETTINGS}
              title="Update my preferences"
              finalButtonLabel="Save preferences"
              onComplete={() => {
                handleClose();
                router.refresh();
              }}
              onSuccess={() => {
                router.refresh();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
