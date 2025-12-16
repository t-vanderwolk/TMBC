"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";

type MentorNote = {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

type MentorNotesDrawerProps = {
  open: boolean;
  memberId?: string;
  onClose: () => void;
};

const formatTimestamp = (value: string) =>
  new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const MentorNotesDrawer = ({ open, memberId, onClose }: MentorNotesDrawerProps) => {
  const [notes, setNotes] = useState<MentorNote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  const fetchNotes = useCallback(async () => {
    if (!memberId || !open) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/mentor/notes?memberId=${memberId}&limit=10`, {
        cache: "no-store",
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error ?? "Unable to load notes.");
      }
      const payload = await response.json();
      setNotes(payload.notes ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load notes.");
    } finally {
      setLoading(false);
    }
  }, [memberId, open]);

  useEffect(() => {
    if (!open) return;
    fetchNotes();
  }, [open, fetchNotes]);

  const handleAdd = async () => {
    if (!memberId || !draft.trim()) return;
    setSaving(true);
    try {
      const response = await fetch("/api/mentor/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          memberId,
          content: draft.trim(),
        }),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error ?? "Unable to save note.");
      }
      const payload = await response.json();
      setNotes((prev) => [payload.note, ...prev].slice(0, 10));
      setDraft("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save note.");
    } finally {
      setSaving(false);
    }
  };

  const handleEditSave = async (noteId: string) => {
    if (!editingText.trim()) return;
    try {
      const response = await fetch(`/api/mentor/notes/${noteId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: editingText.trim() }),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error ?? "Unable to update note.");
      }
      const payload = await response.json();
      setNotes((prev) =>
        prev.map((note) => (note.id === noteId ? payload.note : note)),
      );
      setEditingId(null);
      setEditingText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update note.");
    }
  };

  const handleClose = () => {
    setError(null);
    setDraft("");
    setEditingId(null);
    setEditingText("");
    onClose();
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black/30" onClick={handleClose} />
      <section className="relative ml-auto flex h-full w-full max-w-md flex-col overflow-hidden rounded-tl-[32px] rounded-bl-[32px] border border-[#E3C6D4] bg-white/95 p-6 shadow-[0_25px_60px_rgba(192,153,170,0.35)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[#3E2F35]/70">
              Mentor Notes (Private)
            </p>
            <h3 className="text-lg font-serif text-[#3E2F35]">Quiet context for {memberId}</h3>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full border border-[#E3C6D4] p-2 text-[#3E2F35]/70 hover:text-[#3E2F35]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 flex-1 space-y-4 overflow-y-auto">
          {loading && (
            <p className="text-sm text-[#3E2F35]/70">Loading private notes…</p>
          )}
          {error && (
            <p className="text-sm text-[#CA415B]">{error}</p>
          )}
          {!loading && !notes.length && (
            <div className="rounded-[20px] border border-dashed border-[#E3C6D4] px-4 py-3 text-sm text-[#3E2F35]/70">
              No notes yet — add your first insight.
            </div>
          )}
          {notes.map((note) => (
            <div key={note.id} className="space-y-2 rounded-[20px] border border-[#F1D5DA] bg-[#FFF8F6] px-4 py-3">
              <div className="flex items-center justify-between text-[0.65rem] uppercase tracking-[0.35em] text-[#3E2F35]/60">
                <span>Private</span>
                <span>{formatTimestamp(note.createdAt)}</span>
              </div>
              {editingId === note.id ? (
                <div className="space-y-2">
                  <textarea
                    className="w-full rounded-[16px] border border-[#E3C6D4] bg-white px-3 py-2 text-sm text-[#3E2F35]"
                    rows={3}
                    value={editingText}
                    onChange={(event) => setEditingText(event.target.value)}
                  />
                  <div className="flex justify-end gap-2 text-xs uppercase tracking-[0.35em] text-[#3E2F35]/70">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setEditingText("");
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditSave(note.id)}
                      className="rounded-full bg-[#B98AA5] px-4 py-1 text-white"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm text-[#3E2F35]">{note.content}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(note.id);
                      setEditingText(note.content);
                    }}
                    className="text-[0.65rem] uppercase tracking-[0.35em] text-[#3E2F35]/60"
                  >
                    Edit
                  </button>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-2">
          <label className="text-[0.65rem] uppercase tracking-[0.45em] text-[#3E2F35]/60">
            Add insight
          </label>
          <textarea
            className="w-full rounded-[16px] border border-[#E3C6D4] bg-[#FFFAF8] px-3 py-2 text-sm text-[#3E2F35]"
            rows={3}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Capture a preference, follow-up, or gentle reminder."
          />
          <button
            type="button"
            disabled={!draft.trim() || saving}
            onClick={handleAdd}
            className="w-full rounded-[20px] bg-[#B98AA5] px-4 py-2 text-sm font-semibold uppercase tracking-[0.35em] text-white disabled:bg-[#E3C6D4]"
          >
            {saving ? "Saving…" : "Save note"}
          </button>
        </div>
      </section>
    </div>
  );
};

export default MentorNotesDrawer;
