"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import QuestionnaireFlow from "@/components/onboarding/QuestionnaireFlow";
import { QuestionnaireSource } from "@/lib/types/questionnaire";
import { loadStoredUser, saveUser } from "@/lib/auth/userStore";

type QuestionnaireRunnerProps = {
  userId: string;
};

export default function QuestionnaireRunner({ userId }: QuestionnaireRunnerProps) {
  const router = useRouter();
  const [completionError, setCompletionError] = useState("");
  const [finalizing, setFinalizing] = useState(false);

  const handleComplete = async () => {
    if (finalizing) return;
    setCompletionError("");
    setFinalizing(true);

    try {
      const response = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.error || "Unable to finalize onboarding.");
      }

      const storedUser = loadStoredUser();
      if (storedUser) {
        saveUser({ ...storedUser, onboardingComplete: true });
      }

      router.push("/onboarding/results");
    } catch (error) {
      setCompletionError(error instanceof Error ? error.message : "Unable to finalize onboarding.");
    } finally {
      setFinalizing(false);
    }
  };

  return (
    <>
      <QuestionnaireFlow source={QuestionnaireSource.INITIAL} onComplete={handleComplete} />
      {completionError && (
        <p className="mt-6 text-sm text-red-600">{completionError}</p>
      )}
    </>
  );
}
