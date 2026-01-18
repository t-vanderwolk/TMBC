"use client";

import { useState } from "react";

import QuestionnaireFlow from "@/components/onboarding/QuestionnaireFlow";
import { QuestionnaireSource } from "@/lib/types/questionnaire";

export default function PreferencesSection() {
  const [statusMessage, setStatusMessage] = useState("");

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.35em] text-[#C8A1B4]">Your preferences</p>
        <p className="text-sm text-[#3E2F35]/70">
          These answers help your mentor guide you — you can update them anytime as things change.
        </p>
      </div>
      <QuestionnaireFlow
        endpoint="/api/member/settings/questionnaire"
        source={QuestionnaireSource.SETTINGS}
        title="Preferences"
        description="Update the details you already shared so your mentor and concierge systems stay current."
        finalButtonLabel="Save updates"
        onSuccess={({ tags }) => {
          if (tags?.length) {
            setStatusMessage(`Tags updated: ${tags.join(", ")}`);
            return;
          }
          setStatusMessage("Preferences saved.");
        }}
        onComplete={() => {
          setStatusMessage("Preferences saved.");
        }}
      />
      {statusMessage ? (
        <p className="text-xs text-[#3E2F35]/70" aria-live="polite">
          {statusMessage}
        </p>
      ) : null}
    </div>
  );
}
