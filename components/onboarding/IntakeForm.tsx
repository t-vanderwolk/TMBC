"use client";

import { FormEvent, ReactNode, useState } from "react";
import { useRouter } from "next/navigation";

type IntakeFormProps = {
  step: string;
  nextStep: string;
  title: string;
  description: ReactNode;
  submitText?: string;
  children: ReactNode;
};

export default function OnboardingIntakeForm({
  step,
  nextStep,
  title,
  description,
  submitText = "Save & continue",
  children,
}: IntakeFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setError("");

    const formData = new FormData(event.currentTarget);
    const payload: Record<string, string> = {};
    formData.forEach((value, key) => {
      payload[key] = value.toString();
    });

    try {
      const response = await fetch("/api/onboarding/intake", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error ?? "Unable to save your responses.");
      }

      const target = payload.nextStep ?? data?.nextStep ?? nextStep;
      if (target) {
        router.push(target);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to save your responses.";
      setError(message);
    } finally {
      setStatus("idle");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-[2.5rem] border border-[#E3C6D4] bg-white/90 p-8 shadow-[0_35px_60px_rgba(180,143,164,0.2)]"
    >
      <input type="hidden" name="step" value={step} />
      <input type="hidden" name="nextStep" value={nextStep} />

      <h2 className="font-serif text-3xl text-[#3E2F35]">{title}</h2>
      <p className="text-sm text-[#3E2F35]/70">{description}</p>

      <div className="space-y-3">{children}</div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-full bg-tmMauve px-4 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-white disabled:opacity-70"
      >
        {status === "loading" ? "Saving…" : submitText}
      </button>

      {error && (
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#D0465F]">
          {error}
        </p>
      )}
    </form>
  );
}
