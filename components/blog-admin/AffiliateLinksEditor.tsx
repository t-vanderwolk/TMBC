"use client";

import { AffiliatePosition } from "@prisma/client";
import { useCallback, useEffect, useMemo, useState } from "react";

export type AffiliateLinkSummary = {
  id: string;
  partnerName: string;
  label: string;
  position: AffiliatePosition;
  network: string;
  isPrimary: boolean;
  status: "ACTIVE" | "PAUSED";
  destinationUrl: string;
  clickCount: number;
  createdAt: string;
};

type AffiliateLinksEditorProps = {
  postId: string;
  initialLinks?: AffiliateLinkSummary[];
};

type LinkEditForm = Partial<{
  partnerName: string;
  label: string;
  position: AffiliatePosition;
  network: string;
  destinationUrl: string;
  isPrimary: boolean;
  status: "ACTIVE" | "PAUSED";
}>;

const NETWORK_MAP: Record<string, string> = {
  CJ: "CJ",
  IMPACT: "IMPACT",
  AWIN: "AWIN",
  SHAREASALE: "SHAREASALE",
  MYREGISTRY: "MYREGISTRY",
  DIRECT: "DIRECT",
  AMAZON: "DIRECT",
};

const POSITIONS: AffiliatePosition[] = ["INLINE", "CALLOUT", "END_CARD"];

export default function AffiliateLinksEditor({ postId, initialLinks = [] }: AffiliateLinksEditorProps) {
  const [links, setLinks] = useState<AffiliateLinkSummary[]>(initialLinks);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    partnerName: "",
    label: "",
    position: "END_CARD" as AffiliatePosition,
    network: "CJ",
    destinationUrl: "",
    isPrimary: false,
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [editForms, setEditForms] = useState<Record<string, LinkEditForm>>({});

  const networkOptions = useMemo(() => Object.keys(NETWORK_MAP), []);

  useEffect(() => {
    setLinks(initialLinks);
  }, [initialLinks]);

  const resolveNetwork = (value: string) => {
    const key = value.trim().toUpperCase();
    return NETWORK_MAP[key] ?? NETWORK_MAP.DIRECT;
  };

  const fetchLinks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/blog/${postId}/links`, { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error ?? "Unable to fetch links.");
      }
      setLinks(payload?.data ?? []);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Unable to load links.");
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    void fetchLinks();
  }, [fetchLinks]);

  const handleAdd = async () => {
    setActionLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/blog/${postId}/links`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partnerName: form.partnerName.trim(),
          label: form.label.trim(),
          position: form.position,
          network: resolveNetwork(form.network),
          destinationUrl: form.destinationUrl.trim(),
          isPrimary: form.isPrimary,
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error ?? "Unable to create link.");
      }
      setForm({
        partnerName: "",
        label: "",
        position: "END_CARD",
        network: "CJ",
        destinationUrl: "",
        isPrimary: false,
      });
      setLinks(payload?.data ?? []);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to create link.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async (linkId: string) => {
    setActionLoading(true);
    setError("");
    const edit = editForms[linkId];
    if (!edit) {
      setActionLoading(false);
      return;
    }
    try {
      const payload: Record<string, unknown> = {};
      if (edit.destinationUrl) payload.destinationUrl = edit.destinationUrl.trim();
      if (edit.label) payload.label = edit.label.trim();
      if (edit.position) payload.position = edit.position;
      if (typeof edit.isPrimary === "boolean") payload.isPrimary = edit.isPrimary;
      if (edit.status) payload.status = edit.status;
      if (edit.partnerName) payload.partnerName = edit.partnerName.trim();
      if (edit.network) payload.network = resolveNetwork(edit.network);

      await fetch(`/api/admin/blog/${postId}/links/${linkId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.error ?? "Unable to update link.");
        }
        return data;
      });

      await fetchLinks();
      setEditForms((prev) => {
        const next = { ...prev };
        delete next[linkId];
        return next;
      });
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Unable to update link.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (linkId: string) => {
    setActionLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/blog/${postId}/links/${linkId}`, {
        method: "DELETE",
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error ?? "Unable to delete link.");
      }
      setLinks(payload?.data ?? []);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete link.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <section className="space-y-4 rounded-[28px] border border-[#E3C6D4] bg-white/95 p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[0.55rem] uppercase tracking-[0.4em] text-[#C8A1B4]">Affiliate links</p>
          <p className="text-sm text-[#3E2F35]/70">
            Manage redirect partners tied to this post.
          </p>
        </div>
        {loading ? <p className="text-xs text-[#3E2F35]/60">Loading links...</p> : null}
      </div>

      {error ? (
        <div className="rounded-[20px] border border-[#F0CCD7] bg-[#FFF4FA] px-4 py-2 text-xs text-[#8B4A61]">
          {error}
        </div>
      ) : null}

      <div className="space-y-3 rounded-[20px] border border-dashed border-[#E3C6D4] p-4">
        <p className="text-xs uppercase tracking-[0.35em] text-[#A4556A]">Add new link</p>
        <div className="grid gap-3 md:grid-cols-2">
          <input
            value={form.partnerName}
            onChange={(event) => setForm((prev) => ({ ...prev, partnerName: event.target.value }))}
            placeholder="Partner name"
            className="rounded-2xl border border-[#E3C6D4] bg-white/90 px-3 py-2 text-sm text-[#3E2F35]"
          />
          <input
            value={form.label}
            onChange={(event) => setForm((prev) => ({ ...prev, label: event.target.value }))}
            placeholder="Link label"
            className="rounded-2xl border border-[#E3C6D4] bg-white/90 px-3 py-2 text-sm text-[#3E2F35]"
          />
          <select
            value={form.position}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, position: event.target.value as AffiliatePosition }))
            }
            className="rounded-2xl border border-[#E3C6D4] bg-white/90 px-3 py-2 text-sm text-[#3E2F35]"
          >
            {POSITIONS.map((position) => (
              <option key={position} value={position}>
                {position.replace("_", " ")}
              </option>
            ))}
          </select>
          <select
            value={form.network}
            onChange={(event) => setForm((prev) => ({ ...prev, network: event.target.value }))}
            className="rounded-2xl border border-[#E3C6D4] bg-white/90 px-3 py-2 text-sm text-[#3E2F35]"
          >
            {networkOptions.map((network) => (
              <option key={network} value={network}>
                {network}
              </option>
            ))}
          </select>
          <input
            value={form.destinationUrl}
            onChange={(event) => setForm((prev) => ({ ...prev, destinationUrl: event.target.value }))}
            placeholder="Destination URL"
            className="col-span-2 rounded-2xl border border-[#E3C6D4] bg-white/90 px-3 py-2 text-sm text-[#3E2F35]"
          />
          <label className="flex items-center gap-2 text-sm text-[#3E2F35]">
            <input
              type="checkbox"
              checked={form.isPrimary}
              onChange={(event) => setForm((prev) => ({ ...prev, isPrimary: event.target.checked }))}
              className="h-4 w-4 rounded border border-[#E3C6D4] text-[#A4556A]"
            />
            Set as primary link
          </label>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={actionLoading}
          className="inline-flex items-center justify-center rounded-full bg-[#C8A1B4] px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white disabled:opacity-60"
        >
          {actionLoading ? "Saving..." : "Add link"}
        </button>
      </div>

      {links.length ? (
        <div className="space-y-3">
          {links.map((link) => (
            <article key={link.id} className="space-y-2 rounded-[20px] border border-[#E3C6D4] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-[#3E2F35]">{link.partnerName}</p>
                  <p className="text-xs text-[#3E2F35]/70">{link.label}</p>
                  <p className="text-[0.65rem] text-[#3E2F35]/70">
                    Position: {link.position} · Network: {link.network}
                  </p>
                </div>
                <div className="space-y-1 text-right text-[0.65rem] text-[#3E2F35]/60">
                  <p>{link.isPrimary ? "Primary" : "Secondary"}</p>
                  <p>Clicks: {link.clickCount}</p>
                  <p>Status: {link.status}</p>
                </div>
              </div>
              <details className="space-y-2">
                <summary className="text-xs font-semibold uppercase tracking-[0.35em] text-[#A4556A]">
                  Edit link
                </summary>
                <div className="space-y-2">
                  <input
                    value={editForms[link.id]?.partnerName ?? link.partnerName}
                    onChange={(event) =>
                      setEditForms((prev) => ({
                        ...prev,
                        [link.id]: {
                          ...prev[link.id],
                          partnerName: event.target.value,
                        },
                      }))
                    }
                    placeholder="Partner name"
                    className="w-full rounded-2xl border border-[#E3C6D4] bg-white/90 px-3 py-2 text-sm text-[#3E2F35]"
                  />
                  <input
                    value={editForms[link.id]?.label ?? link.label}
                    onChange={(event) =>
                      setEditForms((prev) => ({
                        ...prev,
                        [link.id]: {
                          ...prev[link.id],
                          label: event.target.value,
                        },
                      }))
                    }
                    placeholder="Label"
                    className="w-full rounded-2xl border border-[#E3C6D4] bg-white/90 px-3 py-2 text-sm text-[#3E2F35]"
                  />
                  <select
                    value={editForms[link.id]?.position ?? link.position}
                    onChange={(event) =>
                      setEditForms((prev) => ({
                        ...prev,
                        [link.id]: {
                          ...prev[link.id],
                          position: event.target.value as AffiliatePosition,
                        },
                      }))
                    }
                    className="w-full rounded-2xl border border-[#E3C6D4] bg-white/90 px-3 py-2 text-sm text-[#3E2F35]"
                  >
                    {POSITIONS.map((position) => (
                      <option key={position} value={position}>
                        {position}
                      </option>
                    ))}
                  </select>
                  <input
                    value={editForms[link.id]?.network ?? link.network}
                    onChange={(event) =>
                      setEditForms((prev) => ({
                        ...prev,
                        [link.id]: {
                          ...prev[link.id],
                          network: event.target.value,
                        },
                      }))
                    }
                    placeholder="Network"
                    className="w-full rounded-2xl border border-[#E3C6D4] bg-white/90 px-3 py-2 text-sm text-[#3E2F35]"
                  />
                  <input
                    value={editForms[link.id]?.destinationUrl ?? link.destinationUrl}
                    onChange={(event) =>
                      setEditForms((prev) => ({
                        ...prev,
                        [link.id]: {
                          ...prev[link.id],
                          destinationUrl: event.target.value,
                        },
                      }))
                    }
                    placeholder="Destination URL"
                    className="w-full rounded-2xl border border-[#E3C6D4] bg-white/90 px-3 py-2 text-sm text-[#3E2F35]"
                  />
                  <div className="flex items-center gap-3 text-sm text-[#3E2F35]">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={editForms[link.id]?.isPrimary ?? link.isPrimary}
                        onChange={(event) =>
                          setEditForms((prev) => ({
                            ...prev,
                            [link.id]: {
                              ...prev[link.id],
                              isPrimary: event.target.checked,
                            },
                          }))
                        }
                        className="h-4 w-4 rounded border border-[#E3C6D4] text-[#A4556A]"
                      />
                      Primary
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      Status:
                      <select
                        value={editForms[link.id]?.status ?? link.status}
                        onChange={(event) =>
                          setEditForms((prev) => ({
                            ...prev,
                            [link.id]: {
                              ...prev[link.id],
                              status: event.target.value as "ACTIVE" | "PAUSED",
                            },
                          }))
                        }
                        className="rounded-2xl border border-[#E3C6D4] bg-white/90 px-2 py-1 text-xs text-[#3E2F35]"
                      >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="PAUSED">PAUSED</option>
                      </select>
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => handleUpdate(link.id)}
                      disabled={actionLoading}
                      className="rounded-full bg-[#C8A1B4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white disabled:opacity-60"
                    >
                      {actionLoading ? "Saving..." : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(link.id)}
                      disabled={actionLoading}
                      className="rounded-full border border-[#A4556A] px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#A4556A] disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </details>
            </article>
          ))}
        </div>
      ) : (
        <p className="text-xs text-[#3E2F35]/60">No affiliate links yet.</p>
      )}
    </section>
  );
}
