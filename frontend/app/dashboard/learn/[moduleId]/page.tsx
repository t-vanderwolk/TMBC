"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { completeModule, getModuleDetail } from "@/lib/api/academy";

type ModuleSection = {
  title: string;
  detail: string;
};

type ModuleDetail = {
  id: string;
  title: string;
  description?: string;
  journey?: string;
  sections?: ModuleSection[];
  bullets?: string[];
  resources?: string[];
  mentorNotes?: string[] | string;
  progress?: number;
  completed?: boolean;
};

type ModulePageProps = {
  params: {
    moduleId: string;
  };
};

const toSections = (module: ModuleDetail | null): ModuleSection[] => {
  if (!module) return [];
  if (module.sections && module.sections.length) {
    return module.sections;
  }
  if (module.bullets && module.bullets.length) {
    return [
      {
        title: "Overview",
        detail: module.bullets.join("\n\n"),
      },
    ];
  }
  return [
    {
      title: "Overview",
      detail: module.description ?? "A calm, curated module to guide you forward.",
    },
  ];
};

const mentorNotesList = (module: ModuleDetail | null) => {
  if (!module) return [];
  if (Array.isArray(module.mentorNotes)) return module.mentorNotes;
  if (typeof module.mentorNotes === "string") return [module.mentorNotes];
  return [];
};

export default function ModuleDetailPage({ params }: ModulePageProps) {
  const router = useRouter();
  const [module, setModule] = useState<ModuleDetail | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [actionError, setActionError] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const sections = useMemo(() => toSections(module), [module]);
  const notes = useMemo(() => mentorNotesList(module), [module]);
  const progressValue = module?.progress ?? (module?.completed ? 100 : 0);

  useEffect(() => {
    if (typeof window === "undefined") {
      setAuthChecked(true);
      return;
    }
    const stored = localStorage.getItem("tm_user");
    if (!stored) {
      router.replace("/login");
      setAuthChecked(true);
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      setToken(parsed?.token ?? null);
    } catch {
      localStorage.removeItem("tm_user");
      router.replace("/login");
    } finally {
      setAuthChecked(true);
    }
  }, [router]);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setFetchError("");
    getModuleDetail(params.moduleId, token)
      .then((response) => {
        setModule(response.data);
      })
      .catch(() => {
        setFetchError("We could not load that module just yet.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params.moduleId, token]);

  const handleComplete = () => {
    if (!token || !module) return;
    setSaving(true);
    completeModule(params.moduleId, token)
      .then(() => {
        setModule((prev) => (prev ? { ...prev, completed: true, progress: 100 } : prev));
        setActionError("");
      })
      .catch(() => {
        setActionError("Unable to mark this module complete.");
      })
      .finally(() => {
        setSaving(false);
      });
  };

  if (!authChecked || loading) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-20 text-sm uppercase tracking-[0.6em] text-[#C8A1B4]">
        Aligning your module details…
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="px-4 py-10 text-sm text-[#C8A1B4]">
        <p>{fetchError}</p>
      </div>
    );
  }

  return (
    <main className="space-y-8 px-4 py-8 text-[#3E2F35] sm:px-6">
      <section className="rounded-[2.5rem] border border-[#EAD4D8] bg-gradient-to-br from-[#FFF8F6] via-[#FBE9EE] to-[#F0D4D9] p-6 shadow-[0_25px_70px_rgba(192,153,170,0.3)]">
        <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#3E2F35]/70">
          {module?.journey ?? "Studio module"}
        </p>
        <h1 className="mt-2 font-serif text-3xl text-[#3E2F35]">{module?.title}</h1>
        <p className="mt-2 text-sm text-[#3E2F35]/70">{module?.description}</p>
        <div className="mt-4 flex items-center gap-3">
          <span className="rounded-full border border-[#3E2F35]/20 bg-white/80 px-3 py-1 text-xs uppercase tracking-[0.4em] text-[#3E2F35]/80">
            {module?.completed ? "Completed" : `${progressValue}% complete`}
          </span>
          <span className="text-xs uppercase tracking-[0.3em] text-[#3E2F35]/60">
            {module?.progress ? "Detailed progress" : "Mentor approved"}
          </span>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <section className="space-y-4">
          {sections.map((section) => {
            const isOpen = section.title === activeSection;
            return (
              <article
                key={section.title}
                className="rounded-[2rem] border border-[#E3C6D4] bg-white/90 p-5 shadow-[0_18px_60px_rgba(180,143,164,0.2)]"
              >
                <button
                  type="button"
                  onClick={() => setActiveSection(isOpen ? null : section.title)}
                  className="flex w-full items-center justify-between text-left text-sm font-semibold uppercase tracking-[0.35em] text-[#3E2F35]/70"
                >
                  <span>{section.title}</span>
                  <span>{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && (
                  <div className="mt-4 space-y-3 text-sm text-[#3E2F35]/80">
                    {section.detail.split("\n\n").map((paragraph, index) => (
                      <p key={`${section.title}-${index}`}>{paragraph}</p>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
          {module?.resources?.length ? (
            <div className="rounded-[2rem] border border-dashed border-[#E3C6D4] bg-[#FFFAF8]/70 p-5 text-sm text-[#3E2F35]/70">
              <p className="text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">Resources</p>
              <ul className="mt-3 space-y-2">
                {module.resources.map((resource) => (
                  <li key={resource} className="rounded-full border border-[#E3C6D4] bg-white/80 px-3 py-1 text-xs uppercase tracking-[0.3em] text-[#3E2F35]/70">
                    {resource}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
        <aside className="space-y-5">
          <div className="rounded-[2rem] border border-[#E3C6D4] bg-white/90 p-5 shadow-[0_18px_60px_rgba(180,143,164,0.2)]">
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#C8A1B4]">Mentor notes</p>
            {notes.length ? (
              <ul className="mt-3 space-y-3 text-sm text-[#3E2F35]/80">
                {notes.map((note) => (
                  <li key={note} className="rounded-xl bg-[#FFF2F6] p-3 text-sm">
                    {note}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-[#3E2F35]/60">
                Notes will appear here from your mentor soon.
              </p>
            )}
          </div>
          <div className="rounded-[2rem] border border-[#E3C6D4] bg-gradient-to-br from-[#FFF8F6] via-[#FBE9EE] to-[#F0D4D9] p-5 shadow-[0_18px_60px_rgba(180,143,164,0.2)]">
            <p className="text-xs uppercase tracking-[0.3em] text-[#3E2F35]/60">Complete module</p>
            <p className="mt-2 text-sm text-[#3E2F35]/80">
              Mark this module complete once rituals are woven into your day so we can celebrate your progress.
            </p>
            <button
              type="button"
              onClick={handleComplete}
              disabled={module?.completed || saving}
              className="mt-4 w-full rounded-full bg-[#C8A1B4] px-4 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-[#b98aa5] disabled:opacity-60"
            >
              {module?.completed ? "Completed" : saving ? "Saving…" : "Mark as complete"}
            </button>
            {actionError && (
              <p className="mt-3 text-xs text-red-600">{actionError}</p>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
