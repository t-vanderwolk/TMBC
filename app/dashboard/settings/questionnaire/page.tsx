"use client";

import { useState } from "react";

import QuestionnaireFlow from "@/components/onboarding/QuestionnaireFlow";
import { QuestionnaireSource, type QuestionnaireSourceValue } from "@/lib/types/questionnaire";

const source: QuestionnaireSourceValue = QuestionnaireSource.SETTINGS;

export default function SettingsQuestionnairePage() {
  const [statusMessage, setStatusMessage] = useState("");

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-[#E3D0D7] bg-white/90 p-6 shadow-[0_20px_60px_rgba(62,47,53,0.15)]">
        <p className="text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">Questionnaire editor</p>
        <h1 className="font-serif text-3xl text-[#3E2F35]">Update your onboarding context</h1>
        <p className="text-sm text-[#3E2F35]/70">
          Edit your preferences so your mentor can keep your plan aligned. This helps your mentor understand your lifestyle.
        </p>
      </section>

      <QuestionnaireFlow
        source={source}
        title="Questionnaire editor"
        description="Update the details you shared so your concierge systems stay current."
        finalButtonLabel="Save updates"
        onSuccess={({ tags }) => {
          if (tags?.length) {
            setStatusMessage(`Tags updated: ${tags.join(", ")}`);
          }
        }}
        onComplete={() => setStatusMessage("Preferences saved. Your mentor can review the update.")}
      />

      {statusMessage && (
        <div className="rounded-2xl border border-[#C8A1B4] bg-[#FFF8F4] px-4 py-3 text-sm text-[#3E2F35]">
          {statusMessage}
        </div>
      )}
    </div>
  );
}
