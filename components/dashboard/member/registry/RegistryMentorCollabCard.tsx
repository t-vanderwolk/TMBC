"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type CollaborationPayload = {
  mentor: { name: string | null; email: string | null } | null;
  collaboration: {
    requestedAt: string | null;
    confirmedAt: string | null;
    mentorEmail: string | null;
  };
  guidedInviteUrl: string | null;
  instructions: string[];
};

const API_BASE = "/api/registry/collaboration";

const fetchState = async () => {
  const response = await fetch(API_BASE, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Unable to load mentor collaboration.");
  }
  return response.json();
};

const postState = async (path: string) => {
  const response = await fetch(path, { method: "POST", cache: "no-store" });
  if (!response.ok) {
    throw new Error("Unable to update mentor collaboration.");
  }
  return response.json();
};

export default function RegistryMentorCollabCard() {
  const [state, setState] = useState<CollaborationPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const payload = await fetchState();
        setState(payload);
        setError("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load mentor collaboration.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const mentorName = state?.mentor?.name || "your mentor";
  const mentorEmail = state?.collaboration?.mentorEmail || state?.mentor?.email || null;
  const requested = Boolean(state?.collaboration?.requestedAt);
  const confirmed = Boolean(state?.collaboration?.confirmedAt);
  const guidance = useMemo(() => state?.instructions ?? [], [state?.instructions]);
  const guidedInviteUrl = state?.guidedInviteUrl ?? null;

  const handleCopy = useCallback(async () => {
    if (!mentorEmail) return;
    try {
      await navigator.clipboard.writeText(mentorEmail);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [mentorEmail]);

  const handleRequest = useCallback(async () => {
    try {
      setWorking(true);
      const payload = await postState(`${API_BASE}/request`);
      setState(payload);
      if (payload?.guidedInviteUrl) {
        window.open(payload.guidedInviteUrl, "_blank", "noopener,noreferrer");
      }
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to request collaboration.");
    } finally {
      setWorking(false);
    }
  }, []);

  const handleConfirm = useCallback(async () => {
    try {
      setWorking(true);
      const payload = await postState(`${API_BASE}/confirm`);
      setState(payload);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to confirm collaboration.");
    } finally {
      setWorking(false);
    }
  }, []);

  return (
    <section className="rounded-[28px] border border-[#E3C6D4] bg-[#FFF7FB] p-5 shadow-sm">
      <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[#C8A1B4]">Mentor collaboration</p>

      {error && (
        <div className="mt-3 rounded-2xl border border-[#F0CCD7] bg-[#FFF4FA] px-4 py-2 text-xs text-[#8B4A61]">
          {error}
        </div>
      )}

      {loading ? (
        <p className="mt-3 text-sm text-[#3E2F35]/70">Preparing your collaboration details...</p>
      ) : confirmed ? (
        <>
          <h2 className="mt-3 text-lg font-semibold text-[#3E2F35]">
            Collaboration enabled (member confirmed)
          </h2>
          <p className="mt-2 text-sm text-[#3E2F35]/70">
            Managed in MyRegistry - you stay in control.
          </p>
        </>
      ) : requested ? (
        <>
          <h2 className="mt-3 text-lg font-semibold text-[#3E2F35]">Almost done</h2>
          <p className="mt-2 text-sm text-[#3E2F35]/70">
            Add {mentorName} as a collaborator in MyRegistry, then confirm here.
          </p>
        </>
      ) : (
        <>
          <h2 className="mt-3 text-lg font-semibold text-[#3E2F35]">
            Want your mentor to view your registry directly?
          </h2>
          <p className="mt-2 text-sm text-[#3E2F35]/70">
            Want a second set of eyes? You can optionally add your mentor as a collaborator in
            MyRegistry. We will take you right to the right place - you stay in control.
          </p>
        </>
      )}

      {!mentorEmail && !loading && (
        <p className="mt-3 text-xs text-[#3E2F35]/60">
          We will show the invite flow once your mentor is assigned.
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {!confirmed && (
          <button
            type="button"
            onClick={requested ? handleConfirm : handleRequest}
            disabled={working || !mentorEmail}
            className="rounded-full bg-[#C8A1B4] px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-sm transition hover:bg-[#B98AA5] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {working
              ? "Working..."
              : requested
              ? "I added my mentor"
              : "Add mentor in MyRegistry"}
          </button>
        )}
        {guidedInviteUrl && (requested || confirmed) && (
          <a
            href={guidedInviteUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8B4A61]"
          >
            {confirmed ? "Manage collaborators in MyRegistry" : "Open MyRegistry again"}
          </a>
        )}
      </div>

      {!confirmed && !requested && (
        <p className="mt-3 text-xs text-[#3E2F35]/60">
          Why this matters: a shared view keeps your registry aligned without extra screenshot
          threads.
        </p>
      )}

      {mentorEmail && (requested || confirmed) && (
        <div className="mt-4 rounded-2xl border border-[#F0CCD7] bg-white/80 px-4 py-3 text-sm text-[#3E2F35]/80">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs uppercase tracking-[0.35em] text-[#C8A1B4]">Mentor email</span>
            <button
              type="button"
              onClick={handleCopy}
              className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-[#8B4A61]"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <p className="mt-1 text-sm font-semibold text-[#3E2F35]">{mentorEmail}</p>
        </div>
      )}

      {guidance.length > 0 && (requested || confirmed) && (
        <div className="mt-4 space-y-2 text-xs text-[#3E2F35]/70">
          <p className="uppercase tracking-[0.35em] text-[#C8A1B4]">Quick steps</p>
          <ol className="list-decimal space-y-1 pl-4">
            {guidance.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      )}

      <div className="mt-4 space-y-1 text-xs text-[#3E2F35]/60">
        <p>This is optional.</p>
        <p>You are in control. TMBC does not manage collaborator permissions - MyRegistry does.</p>
        <p>We never see your MyRegistry password.</p>
      </div>
    </section>
  );
}
