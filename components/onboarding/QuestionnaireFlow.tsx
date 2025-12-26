"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

import {
  QUESTIONNAIRE_SCHEMA,
  type QuestionnaireQuestion,
} from "@/lib/onboarding/questionnaireSchema";
import { QuestionnaireSourceValue, QuestionnaireStatus } from "@/lib/types/questionnaire";

type AnswerValue = string | string[];
type AnswersForm = Record<string, AnswerValue>;

type QuestionnaireFlowProps = {
  source: QuestionnaireSourceValue;
  endpoint?: string;
  title?: string;
  description?: string;
  finalButtonLabel?: string;
  onSuccess?: (result: {
    tags?: string[];
  }) => void;
  onComplete?: () => void;
};

export default function QuestionnaireFlow({
  source,
  endpoint,
  title = "TMBC Intelligent Onboarding",
  description = "Share your rhythms and preferences so your mentor can guide you. This helps your mentor understand your lifestyle.",
  finalButtonLabel = "Finish onboarding",
  onSuccess,
  onComplete,
}: QuestionnaireFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<AnswersForm>({});
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [autoSaveState, setAutoSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef<string>("");
  const isHydratingRef = useRef(true);

  const sections = QUESTIONNAIRE_SCHEMA.sections;
  const currentSection = sections[currentStep] ?? sections[0];
  const totalSteps = sections.length;

  useEffect(() => {
    let mounted = true;
    const loadQuestionnaire = async () => {
      try {
        const response = await fetch(endpoint ?? "/api/onboarding/questionnaire");
        if (!response.ok) {
          throw new Error("Unable to load questionnaire");
        }
        const payload = await response.json();
        const existingAnswers: Record<string, unknown> = payload?.questionnaire?.answers ?? {};
        if (!mounted) return;
        const normalizedAnswers = Object.entries(existingAnswers).reduce((acc, [key, value]) => {
          if (Array.isArray(value)) {
            acc[key] = value.filter((entry) => entry != null).map((entry) => String(entry));
          } else if (value == null) {
            acc[key] = "";
          } else {
            acc[key] = String(value);
          }
          return acc;
        }, {} as AnswersForm);
        setAnswers(normalizedAnswers);
        lastSavedRef.current = JSON.stringify(normalizedAnswers);
      } catch {
        // Ignore load errors.
      } finally {
        if (mounted) {
          setLoaded(true);
          isHydratingRef.current = false;
        }
      }
    };
    void loadQuestionnaire();
    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (question: QuestionnaireQuestion, value: string) => {
    if (question.type === "multi") {
      setAnswers((prev) => {
        const existing = Array.isArray(prev[question.id]) ? (prev[question.id] as string[]) : [];
        const next = existing.includes(value)
          ? existing.filter((entry) => entry !== value)
          : [...existing, value];
        return { ...prev, [question.id]: next };
      });
      return;
    }

    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  };

  const isFinalStep = currentStep === totalSteps - 1;
  const progressLabel = useMemo(
    () => `${currentStep + 1} / ${totalSteps}`,
    [currentStep, totalSteps],
  );

  const saveQuestionnaire = async (nextStatus: QuestionnaireStatus, isAutoSave = false) => {
    try {
      const response = await fetch(endpoint ?? "/api/onboarding/questionnaire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers,
          status: nextStatus,
          source,
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.error || "Unable to save your responses.");
      }

      const normalizedAnswers = Object.entries(payload?.questionnaire?.answers ?? {}).reduce((acc, [key, value]) => {
        if (Array.isArray(value)) {
          acc[key] = value.filter((entry) => entry != null).map((entry) => String(entry));
        } else if (value == null) {
          acc[key] = "";
        } else {
          acc[key] = String(value);
        }
        return acc;
      }, {} as AnswersForm);
      setAnswers(normalizedAnswers);
      lastSavedRef.current = JSON.stringify(normalizedAnswers);

      onSuccess?.({
        tags: payload?.questionnaire?.tags,
      });

      if (!isAutoSave) {
        setAutoSaveState("idle");
      }

      return payload;
    } catch (err) {
      if (isAutoSave) {
        setAutoSaveState("error");
        return null;
      }
      throw err;
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setError("");

    try {
      await saveQuestionnaire(isFinalStep ? QuestionnaireStatus.COMPLETED : QuestionnaireStatus.DRAFT);

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

  useEffect(() => {
    if (!loaded || isHydratingRef.current) {
      return;
    }

    const serialized = JSON.stringify(answers);
    if (serialized === lastSavedRef.current) {
      return;
    }

    if (autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current);
    }

    autoSaveTimer.current = setTimeout(async () => {
      setAutoSaveState("saving");
      const result = await saveQuestionnaire(QuestionnaireStatus.DRAFT, true);
      if (result) {
        lastSavedRef.current = serialized;
        setAutoSaveState("saved");
      }
    }, 900);

    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
    };
  }, [answers, loaded]);

  useEffect(() => {
    if (!loaded) return;
    const timeout = setTimeout(() => {
      setAutoSaveState("idle");
    }, 2000);
    return () => clearTimeout(timeout);
  }, [autoSaveState, loaded]);

  if (!currentSection) {
    return null;
  }

  const visibleQuestions = currentSection.questions.filter((question) => {
    if (!question.dependsOn) return true;
    const parentValue = answers[question.dependsOn.id];
    const expected = question.dependsOn.value;
    if (Array.isArray(parentValue)) {
      return Array.isArray(expected)
        ? expected.some((value) => parentValue.includes(value))
        : parentValue.includes(expected);
    }
    return parentValue === expected;
  });

  const isOptionSelected = (question: QuestionnaireQuestion, value: string) => {
    const stored = answers[question.id];
    if (question.type === "multi") {
      return Array.isArray(stored) && stored.includes(value);
    }
    return stored === value;
  };

  const isStepComplete = visibleQuestions.every((question) => {
    if (!question.required) return true;
    const value = answers[question.id];
    if (question.type === "multi") {
      return Array.isArray(value) && value.length > 0;
    }
    return typeof value === "string" && value.length > 0;
  });

  return (
    <div className="space-y-8">
      <header className="space-y-2 rounded-[32px] border border-[#E3C6D4] bg-white/95 p-6 shadow-[0_30px_90px_rgba(189,147,189,0.18)]">
        <p className="text-[0.65rem] uppercase tracking-[0.6em] text-[#C8A1B4]">
          Questionnaire v{QUESTIONNAIRE_SCHEMA.version}
        </p>
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
          {visibleQuestions.map((question) => (
            <fieldset key={question.id} className="space-y-3">
              <legend className="text-sm font-semibold text-[#3E2F35]">{question.label}</legend>
              {question.description && (
                <p className="text-xs text-[#3E2F35]/70">{question.description}</p>
              )}
              <div className="grid gap-2 sm:grid-cols-2">
                {question.options.map((option) => {
                  const inputId = `${question.id}-${option.value}`;
                  const selected = isOptionSelected(question, option.value);
                  return (
                    <label
                      key={inputId}
                      htmlFor={inputId}
                      className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition ${
                        selected
                          ? "border-[#C8A1B4] bg-[#F9F1F4] text-[#3E2F35]"
                          : "border-[#E3C6D4] bg-white text-[#3E2F35]/80"
                      }`}
                    >
                      <input
                        id={inputId}
                        name={question.id}
                        type={question.type === "multi" ? "checkbox" : "radio"}
                        checked={selected}
                        onChange={() => handleChange(question, option.value)}
                        className="h-4 w-4 accent-[#C8A1B4]"
                      />
                      <span>{option.label}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
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
          <div className="flex items-center gap-3">
            {autoSaveState !== "idle" && (
              <span className="text-[0.6rem] uppercase tracking-[0.35em] text-[#C8A1B4]">
                {autoSaveState === "saving"
                  ? "Saving"
                  : autoSaveState === "saved"
                    ? "Saved"
                    : "Save failed"}
              </span>
            )}
            <button
              type="submit"
              disabled={status === "loading" || !loaded || !isStepComplete}
              className="rounded-full bg-[#C8A1B4] px-6 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white shadow-[0_15px_40px_rgba(189,147,189,0.5)] disabled:opacity-70"
            >
              {status === "loading" ? "Saving…" : isFinalStep ? finalButtonLabel : "Save & continue"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
