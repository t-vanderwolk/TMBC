"use client";

import { useMemo, useState } from "react";

type VibeOption = {
  id: string;
  label: string;
  description: string;
  names: string[];
};

const VIBE_OPTIONS: VibeOption[] = [
  {
    id: "cloud",
    label: "Cotton cloud",
    description: "Soft, airy names whispered at bedtime.",
    names: ["Juniper", "Lumi", "Iris", "Ellis", "Calla", "Bram"],
  },
  {
    id: "harbor",
    label: "Harbor calm",
    description: "Steady names that feel anchored and gentle.",
    names: ["Marin", "Soren", "Rowan", "Mara", "Finn", "Nora"],
  },
  {
    id: "luxe",
    label: "Luxe pause",
    description: "Lyrical, polished names with a quiet glow.",
    names: ["Seren", "Cassian", "Ivo", "Evelyn", "Hawthorn", "Elle"],
  },
];

const TRUST_NOTE_ID = "baby-name-trust-note";

const MICROCOPY_LINES = [
  "Just seeing how it flows — nothing official.",
  "Try it on. Take it off. No pressure.",
  "You’re allowed to like it… or immediately hate it.",
];

export function assembleName(
  first?: string,
  middle?: string,
  generated?: string,
  last?: string,
) {
  return [first, middle, generated, last].filter(Boolean).join(" ");
}

export default function BabyNameGenerator() {
  const defaultVibe = VIBE_OPTIONS[0];
  if (!defaultVibe) {
    return null;
  }
  const [selectedVibeId, setSelectedVibeId] = useState(defaultVibe.id);
  const [knownFirstName, setKnownFirstName] = useState("");
  const [knownMiddleName, setKnownMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [generatedName, setGeneratedName] = useState<string | null>(null);
  const [microcopyIndex, setMicrocopyIndex] = useState(0);

  const selectedVibe =
    VIBE_OPTIONS.find((vibe) => vibe.id === selectedVibeId) ?? defaultVibe;

  const hasPreview = Boolean(generatedName);

  const assembledName = useMemo(() => {
    if (!hasPreview) {
      return "";
    }
    return assembleName(
      knownFirstName.trim() || undefined,
      knownMiddleName.trim() || undefined,
      generatedName ?? undefined,
      lastName.trim() || undefined,
    );
  }, [generatedName, hasPreview, knownFirstName, knownMiddleName, lastName]);

  const microcopyLine = MICROCOPY_LINES[microcopyIndex % MICROCOPY_LINES.length];

  const handleGenerate = () => {
    if (!selectedVibe.names.length) {
      return;
    }
    const randomIndex = Math.floor(Math.random() * selectedVibe.names.length);
    const generated = selectedVibe.names[randomIndex];
    if (!generated) {
      return;
    }
    setGeneratedName(generated);
    setMicrocopyIndex((prev) => prev + 1);
  };

  const inputClass =
    "w-full rounded-xl border border-member-border-soft bg-member-background-card px-3 py-2 text-sm text-member-text-primary placeholder:text-member-text-secondary focus:border-member-accent-primary focus:outline-none focus:ring-2 focus:ring-member-state-focus/40";

  return (
    <section className="rounded-[36px] border border-member-border-default/70 bg-member-background-card p-6 shadow-soft">
      <div className="space-y-5">
        <header className="space-y-2">
          <p className="text-[0.65rem] uppercase tracking-[0.5em] text-member-accent-secondary">
            Baby Name Generator
          </p>
          <h2 className="font-serif text-2xl text-member-text-primary">
            Tap a vibe, keep your own piece of it.
          </h2>
        </header>

        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.4em] text-member-text-secondary">Pick a vibe</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {VIBE_OPTIONS.map((vibe) => {
              const isActive = vibe.id === selectedVibeId;
              return (
                <button
                  key={vibe.id}
                  type="button"
                  aria-pressed={isActive}
                  className={`flex flex-col gap-1 rounded-2xl border px-3 py-2 text-left text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-member-state-focus ${
                    isActive
                      ? "border-member-accent-primary bg-member-accent-primary text-member-text-inverse shadow-[0_12px_30px_rgba(62,47,53,0.2)]"
                      : "border-member-border-default/60 bg-member-background-card text-member-text-secondary hover:bg-member-background-soft"
                  }`}
                  onClick={() => setSelectedVibeId(vibe.id)}
                >
                  <span className="tracking-[0.35em] text-[0.55rem]">{vibe.label}</span>
                  <span className="text-[0.65rem] leading-tight text-member-text-secondary">
                    {vibe.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3 rounded-2xl border border-member-border-soft bg-member-background-soft p-4 text-sm">
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-[0.4em] text-member-text-secondary">
              Already have a name in mind?
            </label>
            <p className="text-[0.6rem] text-member-text-secondary">
              Add the pieces of the name you already know—they remain exactly as typed.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label
                htmlFor="first-name"
                className="text-[0.65rem] uppercase tracking-[0.35em] text-member-text-secondary"
              >
                First name (optional)
              </label>
              <input
                id="first-name"
                type="text"
                value={knownFirstName}
                onChange={(event) => setKnownFirstName(event.target.value)}
                placeholder="First name"
                aria-describedby={TRUST_NOTE_ID}
                className={inputClass}
              />
            </div>
            <div className="space-y-1">
              <label
                htmlFor="middle-name"
                className="text-[0.65rem] uppercase tracking-[0.35em] text-member-text-secondary"
              >
                Middle name (optional)
              </label>
              <input
                id="middle-name"
                type="text"
                value={knownMiddleName}
                onChange={(event) => setKnownMiddleName(event.target.value)}
                placeholder="Middle name"
                aria-describedby={TRUST_NOTE_ID}
                className={inputClass}
              />
            </div>
          </div>
          <div className="space-y-1">
            <label htmlFor="last-name" className="text-xs uppercase tracking-[0.4em] text-member-text-secondary">
              Last name (optional)
            </label>
            <input
              id="last-name"
              type="text"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              placeholder="Only if you want to see how it sounds"
              aria-describedby={TRUST_NOTE_ID}
              className={inputClass}
            />
          </div>
          <p id={TRUST_NOTE_ID} className="text-[0.65rem] text-member-text-secondary">
            We’ll never assume names — this is just for fun.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          className="w-full rounded-[24px] bg-member-accent-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-member-text-inverse transition duration-200 hover:-translate-y-[0.5px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-member-state-focus/40"
        >
          Generate name
        </button>

        <div
          className="flex min-h-[96px] flex-col justify-center rounded-3xl border border-member-border-soft bg-member-background-card p-5 text-center"
          aria-live="polite"
        >
          {hasPreview ? (
            <>
              <p className="text-3xl font-serif text-member-text-primary">
                {assembledName || generatedName}
              </p>
              <p className="mt-2 text-[0.65rem] text-member-text-secondary">{microcopyLine}</p>
            </>
          ) : (
            <p className="text-sm text-member-text-secondary">
              Choose a vibe and tap “Generate name” to preview a playful pairing.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
