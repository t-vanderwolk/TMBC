"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import type { CuratedRegistry } from "@/lib/registry/recommendations";
import { QUESTIONNAIRE_SCHEMA, type QuestionnaireField } from "@/lib/onboarding/questionnaireSchema";
import { QuestionnaireSourceValue, QuestionnaireStatus } from "@/lib/types/questionnaire";

type AnswersForm = Record<string, string>;

type QuestionnaireFlowProps = {
  source: QuestionnaireSourceValue;
  title?: string;
  description?: string;
  finalButtonLabel?: string;
  onSuccess?: (result: {
    recommendations?: CuratedRegistry;
    tags?: string[];
  }) => void;
  onComplete?: () => void;
};

export default function QuestionnaireFlow({
  source,
  title = "TMBC Intelligent Onboarding",
  description = "We stitch your preferences into living intelligence for your registry, academy, and mentor.",
  finalButtonLabel = "See recommendations",
  onSuccess,
  onComplete,
}: QuestionnaireFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<AnswersForm>({});
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  const sections = QUESTIONNAIRE_SCHEMA.sections;
  const currentSection = sections[currentStep];
  const totalSteps = sections.length;

  useEffect(() => {
    let mounted = true;
    const loadQuestionnaire = async () => {
      try {
        const response = await fetch("/api/onboarding/questionnaire");
        if (!response.ok) {
          throw new Error("Unable to load questionnaire");
        }
        const payload = await response.json();
        const existingAnswers: Record<string, unknown> = payload?.questionnaire?.answers ?? {};
        if (!mounted) return;
        setAnswers(
          Object.fromEntries(
            Object.entries(existingAnswers).map(([key, value]) => [key, value == null ? "" : String(value)]),
          ),
        );
      } catch {
        // Ignore load errors.
      } finally {
        if (mounted) setLoaded(true);
      }
    };
    void loadQuestionnaire();
    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (field: QuestionnaireField, value: string) => {
    setAnswers((prev) => ({ ...prev, [field.name]: value }));
  };

  const isFinalStep = currentStep === totalSteps - 1;
  const progressLabel = useMemo(
    () => `${currentStep + 1} / ${totalSteps}`,
    [currentStep, totalSteps],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const response = await fetch("/api/onboarding/questionnaire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers,
          status: isFinalStep ? QuestionnaireStatus.COMPLETED : QuestionnaireStatus.DRAFT,
          source,
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.error || "Unable to save your responses.");
      }

      setAnswers(
        Object.fromEntries(
          Object.entries(payload?.questionnaire?.answers ?? {}).map(([key, value]) => [
            key,
            value == null ? "" : String(value),
          ]),
        ),
      );

      onSuccess?.({
        recommendations: payload?.recommendations,
        tags: payload?.questionnaire?.tags,
      });

      if (isFinalStep) {
        onComplete?.();
        return;
      }

      setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save your responses.");
    } finally {
      setStatus("idle");
    }
  };

  return (
    <div className="space-y-8">
      <header className="space-y-2 rounded-[32px] border border-[#E3C6D4] bg-white/95 p-6 shadow-[0_30px_90px_rgba(189,147,189,0.18)]">
        <p className="text-[0.65rem] uppercase tracking-[0.6em] text-[#C8A1B4]">Questionnaire v1.2</p>
        <h1 className="font-serif text-3xl text-[#3E2F35]">{title}</h1>
        <p className="text-sm text-[#3E2F35]/70">{description}</p>
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.4em] text-[#BFA9C1]">
          <span>{currentSection.title}</span>
          <span>{progressLabel}</span>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-[32px] border border-[#E3D0D7] bg-white/90 p-8 shadow-[0_35px_60px_rgba(180,143,164,0.2)]">
        <p className="text-sm text-[#3E2F35]/70">{currentSection.summary}</p>

        <div className="space-y-4">
          {currentSection.fields.map((field) => (
            <label key={field.name} className="flex flex-col gap-2 text-sm text-[#3E2F35]">
              <span className="font-semibold text-[#3E2F35]">{field.label}</span>
              {field.type === "textarea" ? (
                <textarea
                  rows={field.rows ?? 4}
                  value={answers[field.name] ?? ""}
                  placeholder={field.placeholder}
                  onChange={(event) => handleChange(field, event.target.value)}
                  className="rounded-2xl border border-[#E3C6D4] px-4 py-3 text-sm text-[#3E2F35] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#F3DEE5]"
                />
              ) : (
                <input
                  type="text"
                  value={answers[field.name] ?? ""}
                  placeholder={field.placeholder}
                  onChange={(event) => handleChange(field, event.target.value)}
                  className="rounded-2xl border border-[#E3C6D4] px-4 py-3 text-sm text-[#3E2F35] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#F3DEE5]"
                />
              )}
            </label>
          ))}
        </div>

        {error && (
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#D0465F]">{error}</p>
        )}

        <div className="flex items-center justify-between gap-3">
          {currentStep > 0 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
              className="rounded-full border border-[#E3D0D7] px-6 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#3E2F35]"
            >
              Back
            </button>
          ) : (
            <span />
          )}
          <button
            type="submit"
            disabled={status === "loading" || !loaded}
            className="rounded-full bg-[#C8A1B4] px-6 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white shadow-[0_15px_40px_rgba(189,147,189,0.5)] disabled:opacity-70"
          >
            {status === "loading" ? "Saving…" : isFinalStep ? finalButtonLabel : "Save & continue"}
          </button>
        </div>
      </form>
    </div>
  );
}
