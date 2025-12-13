"use client";

import { useEffect, useRef, useState } from "react";
import type { WorkbookPrompt } from "@/lib/academy/workbookPrompts";
import { shareWorkbookReflection } from "@/lib/api/community";

type WorkbookPromptState = {
  value: string;
  status: "idle" | "saving" | "saved" | "error";
};

type WorkbookResponse = {
  prompt: string;
  response: string;
};

type WorkbookClientProps = {
  moduleId: string;
  prompts: WorkbookPrompt[];
};

type ShareStatus = "idle" | "sharing" | "shared" | "error";

type ShareMeta = {
  anonymous: boolean;
  status: ShareStatus;
  message?: string;
};

const AUTOSAVE_DELAY = 650;

const initializeResponses = (prompts: WorkbookPrompt[]) =>
  prompts.reduce((acc, prompt) => {
    acc[prompt.prompt] = { value: "", status: "idle" };
    return acc;
  }, {} as Record<string, WorkbookPromptState>);

const initializeTimers = (prompts: WorkbookPrompt[]) =>
  prompts.reduce((acc, prompt) => {
    acc[prompt.prompt] = null;
    return acc;
  }, {} as Record<string, ReturnType<typeof setTimeout> | null>);

export default function WorkbookClient({ moduleId, prompts }: WorkbookClientProps) {
  const [responses, setResponses] = useState<Record<string, WorkbookPromptState>>(() =>
    initializeResponses(prompts),
  );
  const timersRef = useRef<Record<string, ReturnType<typeof setTimeout> | null>>(
    initializeTimers(prompts),
  );
  const [shareMeta, setShareMeta] = useState<Record<string, ShareMeta>>({});

  useEffect(() => {
    Object.values(timersRef.current).forEach((timer) => {
      if (timer) {
        clearTimeout(timer);
      }
    });
    timersRef.current = initializeTimers(prompts);
    setResponses(initializeResponses(prompts));
  }, [prompts]);

  useEffect(() => {
    let mounted = true;
    fetch(`/api/workbook/${moduleId}`)
      .then((res) => res.json())
      .then((data: { entries: WorkbookResponse[] }) => {
        if (!mounted || !data?.entries) return;
        setResponses((prev) => {
          const cloned = { ...prev };
          data.entries.forEach((entry) => {
            if (cloned[entry.prompt]) {
              cloned[entry.prompt] = { value: entry.response ?? "", status: "saved" };
            } else {
              cloned[entry.prompt] = { value: entry.response ?? "", status: "saved" };
            }
          });
          return cloned;
        });
      });

    return () => {
      mounted = false;
    };
  }, [moduleId]);

  const saveResponse = async (prompt: string, value: string) => {
    setResponses((prev) => ({
      ...prev,
      [prompt]: { value, status: "saving" },
    }));

    try {
      const response = await fetch(`/api/workbook/${moduleId}`, {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, response: value }),
      });

      if (!response.ok) {
        throw new Error("Unable to save reflection");
      }

      setResponses((prev) => ({
        ...prev,
        [prompt]: { value, status: "saved" },
      }));
    } catch {
      setResponses((prev) => ({
        ...prev,
        [prompt]: { value, status: "error" },
      }));
    }
  };

  const scheduleSave = (prompt: string, value: string) => {
    if (timersRef.current[prompt]) {
      clearTimeout(timersRef.current[prompt]!);
    }

    timersRef.current[prompt] = setTimeout(() => {
      saveResponse(prompt, value);
      timersRef.current[prompt] = null;
    }, AUTOSAVE_DELAY);
  };

  const handleChange = (prompt: string, value: string) => {
    setResponses((prev) => ({
      ...prev,
      [prompt]: { value, status: "idle" },
    }));
    scheduleSave(prompt, value);
  };

  const handleBlur = (prompt: string) => {
    const promptState = responses[prompt];
    if (!promptState) return;
    if (timersRef.current[prompt]) {
      clearTimeout(timersRef.current[prompt]!);
      timersRef.current[prompt] = null;
    }
    if (promptState.status === "saving") return;
    saveResponse(prompt, promptState.value);
  };

  const statusText = (status: WorkbookPromptState["status"]) => {
    if (status === "saving") return "Saving…";
    if (status === "saved") return "Saved";
    if (status === "error") return "Save failed";
    return "";
  };

  const getShareMeta = (promptId: string): ShareMeta => {
    const stored = shareMeta[promptId];
    return {
      anonymous: stored?.anonymous ?? false,
      status: stored?.status ?? "idle",
      message: stored?.message,
    };
  };

  const handleShare = async (prompt: WorkbookPrompt) => {
    const promptState = responses[prompt.prompt];
    if (!promptState?.value.trim()) {
      setShareMeta((prev) => ({
        ...prev,
        [prompt.id]: { ...(prev[prompt.id] ?? { anonymous: false, status: "idle" }), status: "error", message: "Write your reflection before sharing." },
      }));
      return;
    }

    setShareMeta((prev) => ({
      ...prev,
      [prompt.id]: { ...(prev[prompt.id] ?? { anonymous: false, status: "idle" }), status: "sharing" },
    }));

    try {
      await shareWorkbookReflection({
        moduleId,
        promptTitle: prompt.title,
        response: promptState.value,
        section: prompt.section,
        anonymous: getShareMeta(prompt.id).anonymous,
      });

      setShareMeta((prev) => ({
        ...prev,
        [prompt.id]: {
          ...(prev[prompt.id] ?? { anonymous: false, status: "idle" }),
          status: "shared",
          message: "Shared with the community.",
        },
      }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to share reflection right now.";
      setShareMeta((prev) => ({
        ...prev,
        [prompt.id]: {
          ...(prev[prompt.id] ?? { anonymous: false, status: "idle" }),
          status: "error",
          message,
        },
      }));
    }
  };

  return (
    <section className="space-y-4 rounded-[2.25rem] border border-[#E3C6D4] bg-white/90 p-6 shadow-[0_25px_70px_rgba(192,153,170,0.15)]">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">Workbook reflections</p>
        <h3 className="text-2xl font-serif text-[#3E2F35]">This space is just for you.</h3>
        <p className="text-sm leading-relaxed text-[#3E2F35]/70">
          Note what resonates, what feels uncertain, or anything you want to revisit later.
        </p>
      </div>

        <div className="space-y-5">
          {prompts.map((prompt) => {
            const promptState = responses[prompt.prompt] ?? { value: "", status: "idle" };
            const share = getShareMeta(prompt.id);
            const sectionLabel = prompt.section === "APPLY"
              ? "Applied change"
              : prompt.section === "INTEGRATE"
                ? "Integration note"
                : "Reflection";
            return (
              <div
                key={prompt.id}
                className="space-y-2 rounded-2xl border border-[#F1D5DA] bg-[#FFF8F6] p-4"
              >
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#A4556A]">
                {prompt.title}
              </p>
              <p className="text-sm leading-relaxed text-[#3E2F35]/80">{prompt.prompt}</p>
              <textarea
                className="h-28 w-full rounded-2xl border border-[#E3C6D4] bg-white/80 p-3 text-sm leading-relaxed text-[#3E2F35] outline-none transition focus:border-[#C8A1B4]"
                value={promptState.value}
                onChange={(event) => handleChange(prompt.prompt, event.target.value)}
                onBlur={() => handleBlur(prompt.prompt)}
                placeholder="Begin typing your reflection..."
              />
              <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#3E2F35]/60">
                {statusText(promptState.status)}
              </p>
              <div className="mt-4 space-y-2 text-[0.7rem] text-[#3E2F35]/70">
                <label className="flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.35em] text-[#3E2F35]/60">
                  <input
                    type="checkbox"
                    checked={share.anonymous}
                    onChange={(event) =>
                      setShareMeta((prev) => ({
                        ...prev,
                        [prompt.id]: {
                          ...(prev[prompt.id] ?? { anonymous: false, status: "idle" }),
                          anonymous: event.target.checked,
                        },
                      }))
                    }
                  />
                  Share anonymously
                </label>
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => handleShare(prompt)}
                    disabled={share.status === "sharing"}
                    className="rounded-full border border-[#C8A1B4] bg-transparent px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-[#3E2F35] transition hover:border-[#A4556A] hover:text-[#A4556A] disabled:opacity-60"
                  >
                    {share.status === "sharing"
                      ? "Sharing…"
                      : share.status === "shared"
                        ? "Shared"
                        : "Share reflection"}
                  </button>
                  <span className="text-[0.65rem] uppercase tracking-[0.35em] text-[#A4556A]">
                    {sectionLabel}
                  </span>
                </div>
                {share.message && (
                  <p className="text-[0.6rem] text-[#3E2F35]/60">{share.message}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
