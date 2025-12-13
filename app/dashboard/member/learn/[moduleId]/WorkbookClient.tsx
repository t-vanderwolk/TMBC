"use client";

import { useEffect, useRef, useState } from "react";

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
  prompts: string[];
};

const AUTOSAVE_DELAY = 650;

export default function WorkbookClient({ moduleId, prompts }: WorkbookClientProps) {
  const [responses, setResponses] = useState<Record<string, WorkbookPromptState>>(() =>
    prompts.reduce((acc, prompt) => {
      acc[prompt] = { value: "", status: "idle" };
      return acc;
    }, {} as Record<string, WorkbookPromptState>),
  );
  const timersRef = useRef<Record<string, ReturnType<typeof setTimeout> | null>>(
    prompts.reduce((acc, prompt) => {
      acc[prompt] = null;
      return acc;
    }, {} as Record<string, ReturnType<typeof setTimeout> | null>),
  );

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
          const promptState = responses[prompt] ?? { value: "", status: "idle" };
          return (
            <div key={prompt} className="space-y-2 rounded-2xl border border-[#F1D5DA] bg-[#FFF8F6] p-4">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#A4556A]">
                {prompt}
              </p>
              <textarea
                className="h-28 w-full rounded-2xl border border-[#E3C6D4] bg-white/80 p-3 text-sm leading-relaxed text-[#3E2F35] outline-none transition focus:border-[#C8A1B4]"
                value={promptState.value}
                onChange={(event) => handleChange(prompt, event.target.value)}
                onBlur={() => handleBlur(prompt)}
                placeholder="Begin typing your reflection..."
              />
              <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#3E2F35]/60">
                {statusText(promptState.status)}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
