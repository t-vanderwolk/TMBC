"use client";

import {
  type Dispatch,
  type FormEvent,
  type SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import AdminTable, { type AdminTableColumn } from "@/components/dashboard/admin/AdminTable";
import { EmptyState } from "@/components/dashboard/shared/EmptyState";
import type {
  AdminAffiliatePartner,
  AdminBlogAffiliateLink,
  AdminBlogLinksPayload,
  AffiliateAnalyticsRow,
  AffiliatePartnerStatus,
  AffiliateNetwork,
  AffiliatePosition,
} from "@/types/adminAffiliates";

type TabId = "partners" | "blogLinks" | "analytics";

const TAB_LABELS: Record<TabId, string> = {
  partners: "Partners",
  blogLinks: "Blog Links",
  analytics: "Click Analytics",
};

const NETWORK_OPTIONS: AffiliateNetwork[] = ["CJ", "IMPACT", "AWIN", "SHAREASALE", "MYREGISTRY", "DIRECT"];
const POSITION_OPTIONS: AffiliatePosition[] = ["INLINE", "CALLOUT", "END_CARD"];

const fetchJson = async <T,>(url: string, init?: RequestInit): Promise<T> => {
  const headers = new Headers(init?.headers ?? {});
  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const response = await fetch(url, {
    ...init,
    headers,
    credentials: "same-origin",
    cache: "no-store",
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.error ?? "Unable to complete request");
  }
  return payload.data;
};

const humanDate = (value?: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString();
};

export default function AdminAffiliatesPanel() {
  const [activeTab, setActiveTab] = useState<TabId>("partners");

  const [partners, setPartners] = useState<AdminAffiliatePartner[]>([]);
  const [partnersLoading, setPartnersLoading] = useState(false);
  const [partnersError, setPartnersError] = useState("");
  const [partnerSaving, setPartnerSaving] = useState<Record<string, boolean>>({});

  const [linksPayload, setLinksPayload] = useState<AdminBlogLinksPayload | null>(null);
  const [linksLoading, setLinksLoading] = useState(false);
  const [linksError, setLinksError] = useState("");

  const [analytics, setAnalytics] = useState<AffiliateAnalyticsRow[]>([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState("");

  const [partnerFilter, setPartnerFilter] = useState<string | null>(null);
  const [noteEditing, setNoteEditing] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");

  const loadPartners = useCallback(async () => {
    setPartnersError("");
    setPartnersLoading(true);
    try {
      const data = await fetchJson<AdminAffiliatePartner[]>("/api/admin/affiliates/partners");
      setPartners(data);
    } catch (error) {
      setPartnersError((error as Error).message);
    } finally {
      setPartnersLoading(false);
    }
  }, []);

  const loadLinks = useCallback(async () => {
    setLinksError("");
    setLinksLoading(true);
    try {
      const payload = await fetchJson<AdminBlogLinksPayload>("/api/admin/affiliates/blog-links");
      setLinksPayload(payload);
    } catch (error) {
      setLinksError((error as Error).message);
    } finally {
      setLinksLoading(false);
    }
  }, []);

  const loadAnalytics = useCallback(async () => {
    setAnalyticsError("");
    setAnalyticsLoading(true);
    try {
      const data = await fetchJson<AffiliateAnalyticsRow[]>("/api/admin/affiliates/analytics/clicks");
      setAnalytics(data);
    } catch (error) {
      setAnalyticsError((error as Error).message);
    } finally {
      setAnalyticsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPartners();
    void loadLinks();
    void loadAnalytics();
  }, [loadPartners, loadLinks, loadAnalytics]);

  const updatePartnerNote = useCallback(
    async (partnerId: string, note: string | null) => {
      setPartnerSaving((prev) => ({ ...prev, [partnerId]: true }));
      try {
        await fetchJson("/api/admin/affiliates/partners/" + partnerId, {
          method: "PATCH",
          body: JSON.stringify({ note }),
        });
        await loadPartners();
      } catch (error) {
        console.error(error);
      } finally {
        setPartnerSaving((prev) => ({ ...prev, [partnerId]: false }));
      }
    },
    [loadPartners],
  );

  const togglePartnerStatus = useCallback(
    async (partner: AdminAffiliatePartner) => {
      const nextStatus: AffiliatePartnerStatus = partner.status === "ACTIVE" ? "PAUSED" : "ACTIVE";
      setPartnerSaving((prev) => ({ ...prev, [partner.id]: true }));
      try {
        await fetchJson("/api/admin/affiliates/partners/" + partner.id, {
          method: "PATCH",
          body: JSON.stringify({ status: nextStatus }),
        });
        await Promise.all([loadPartners(), loadLinks()]);
      } catch (error) {
        console.error(error);
      } finally {
        setPartnerSaving((prev) => ({ ...prev, [partner.id]: false }));
      }
    },
    [loadLinks, loadPartners],
  );

  const handleViewLinks = (partnerName: string) => {
    setPartnerFilter(partnerName);
    setActiveTab("blogLinks");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 rounded-[2rem] border border-[#E5D4DB] bg-[#FDF6F9] p-6 shadow-[0_20px_50px_rgba(62,47,53,0.12)]">
        <p className="text-xs uppercase tracking-[0.5em] text-[#C8A1B4]">Admin · Affiliates</p>
        <h1 className="text-3xl font-serif text-[#3E2F35]">Affiliate partners &amp; links</h1>
        <p className="text-sm text-[#3E2F35]/70">
          Manage partner programs, keep destination URLs secure, and monitor clicks before revenue hits the public experience.
        </p>
      </div>

      <section className="rounded-[2rem] border border-[#E5D4DB] bg-white/70 p-5 shadow-[0_15px_35px_rgba(62,47,53,0.08)]">
        <div className="flex flex-wrap gap-3">
          {(Object.keys(TAB_LABELS) as TabId[]).map((tab) => {
            const isActive = tab === activeTab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`flex-1 min-w-[120px] rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-[#F7EBF1] text-[#3E2F35] shadow-[0_10px_30px_rgba(200,161,180,0.25)]"
                    : "bg-white text-[#3E2F35]/80 hover:bg-[#F5F0F3]"
                }`}
              >
                {TAB_LABELS[tab]}
              </button>
            );
          })}
        </div>

        <div className="mt-6">
          {activeTab === "partners" && (
            <PartnersTab
              partners={partners}
              loading={partnersLoading}
              error={partnersError}
              saving={partnerSaving}
              onToggleStatus={togglePartnerStatus}
              onEditNote={(partnerId) => {
                setNoteEditing(partnerId);
                const current = partners.find((partner) => partner.id === partnerId);
                setNoteDraft(current?.note ?? "");
              }}
              onSaveNote={async (partnerId, note) => {
                await updatePartnerNote(partnerId, note);
                setNoteEditing(null);
              }}
              onCancelNote={() => setNoteEditing(null)}
              editingNoteId={noteEditing}
              noteDraft={noteDraft}
              setNoteDraft={setNoteDraft}
              onViewLinks={handleViewLinks}
            />
          )}

          {activeTab === "blogLinks" && linksPayload && (
            <BlogLinksTab
              payload={linksPayload}
              loading={linksLoading}
              error={linksError}
              partnerFilter={partnerFilter}
              onClearFilter={() => setPartnerFilter(null)}
              onReload={async () => {
                await loadLinks();
                await loadPartners();
              }}
            />
          )}

          {activeTab === "analytics" && (
            <AnalyticsTab data={analytics} loading={analyticsLoading} error={analyticsError} />
          )}
        </div>
      </section>
    </div>
  );
}

type PartnersTabProps = {
  partners: AdminAffiliatePartner[];
  loading: boolean;
  error: string;
  saving: Record<string, boolean>;
  onToggleStatus: (partner: AdminAffiliatePartner) => void;
  onEditNote: (partnerId: string) => void;
  onSaveNote: (partnerId: string, note: string | null) => Promise<void>;
  onCancelNote: () => void;
  noteDraft: string;
  editingNoteId: string | null;
  setNoteDraft: (value: string) => void;
  onViewLinks: (partnerName: string) => void;
};

function PartnersTab({
  partners,
  loading,
  error,
  saving,
  onToggleStatus,
  onEditNote,
  onSaveNote,
  onCancelNote,
  noteDraft,
  editingNoteId,
  setNoteDraft,
  onViewLinks,
}: PartnersTabProps) {
  const columns = useMemo<AdminTableColumn<AdminAffiliatePartner>[]>(
    () => [
      {
        header: "Partner",
        render: (row: AdminAffiliatePartner) => (
          <div className="space-y-1">
            <p className="font-semibold text-[#3E2F35]">{row.name}</p>
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#C8A1B4]">{row.network}</p>
          </div>
        ),
      },
      {
        header: "Usage",
        accessor: "usage",
        className: "text-center",
      },
      {
        header: "Status",
        render: (row: AdminAffiliatePartner) => (
          <span
            className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.3em] ${
              row.status === "ACTIVE"
                ? "bg-[#D8F1E4] text-[#1F644B]"
                : "bg-[#FDE7E3] text-[#9D3B2D]"
            }`}
          >
            {row.status}
          </span>
        ),
        align: "center",
      },
      {
        header: "Links",
        render: (row: AdminAffiliatePartner) => (
          <div className="text-sm text-[#3E2F35]">
            <p className="font-semibold text-[#3E2F35]">{row.blogLinkCount}</p>
            <p className="text-[0.65rem] uppercase tracking-[0.3em] text-[#C8A1B4]">Blog</p>
            <p className="text-[0.65rem] text-[#3E2F35]/70">{row.activeLinkCount} active</p>
          </div>
        ),
        className: "text-center",
      },
      {
        header: "Last click",
        render: (row: AdminAffiliatePartner) => (
          <p className="text-sm text-[#3E2F35]">{humanDate(row.lastClickAt)}</p>
        ),
      },
      {
        header: "Notes",
        render: (row: AdminAffiliatePartner) => {
          if (editingNoteId === row.id) {
            return (
              <div className="space-y-2">
                <textarea
                  className="w-full rounded-2xl border border-[#E7D9E1] bg-white px-3 py-2 text-sm text-[#3E2F35] focus:outline-none focus:ring-2 focus:ring-[#C8A1B4]"
                  value={noteDraft}
                  onChange={(event) => setNoteDraft(event.target.value)}
                  rows={3}
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onSaveNote(row.id, noteDraft || null)}
                    className="rounded-full bg-[#C29EB3] px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-white transition hover:bg-[#AE8CA3]"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={onCancelNote}
                    className="rounded-full border border-[#E5D4DB] px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-[#3E2F35]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            );
          }

          if (!row.note) {
            return <p className="text-xs text-[#3E2F35]/70">No notes yet</p>;
          }
          return <p className="text-xs text-[#3E2F35]/70">{row.note}</p>;
        },
      },
      {
        header: "Actions",
        render: (row: AdminAffiliatePartner) => {
          const isSaving = saving[row.id];
          return (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={isSaving}
                onClick={() => onToggleStatus(row)}
                className="rounded-full border border-[#E5D4DB] px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-[#3E2F35] disabled:opacity-50"
              >
                {row.status === "ACTIVE" ? "Pause" : "Resume"}
              </button>
              <button
                type="button"
                onClick={() => onEditNote(row.id)}
                className="rounded-full border border-[#E5D4DB] px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-[#3E2F35]"
              >
                Edit notes
              </button>
              <button
                type="button"
                onClick={() => onViewLinks(row.name)}
                className="rounded-full bg-[#C29EB3] px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-white transition hover:bg-[#AE8CA3]"
              >
                View links
              </button>
            </div>
          );
        },
      },
    ],
    [editingNoteId, noteDraft, onCancelNote, onEditNote, onToggleStatus, onViewLinks, saving, setNoteDraft],
  );

  if (loading) {
    return <p className="text-sm text-[#3E2F35]/70">Loading partners…</p>;
  }

  if (error) {
    return <p className="text-sm text-[#c0392b]">Error: {error}</p>;
  }

  if (!partners.length) {
    return (
      <EmptyState
        title="No affiliates yet"
        description="Once partners are seeded, their links and analytics will appear here."
      />
    );
  }

  return (
    <AdminTable columns={columns} rows={partners} rowKey={(row) => row.id} />
  );
}

type BlogLinksTabProps = {
  payload: AdminBlogLinksPayload;
  loading: boolean;
  error: string;
  partnerFilter: string | null;
  onClearFilter: () => void;
  onReload: () => void;
};

type LinkDestinationEdit = Record<string, string>;

function BlogLinksTab({ payload, loading, error, partnerFilter, onClearFilter, onReload }: BlogLinksTabProps) {
  const [destinationDrafts, setDestinationDrafts] = useState<LinkDestinationEdit>({});
  const [savingLink, setSavingLink] = useState<Record<string, boolean>>({});
  const filteredLinks = useMemo(() => {
    if (!partnerFilter) return payload.links;
    return payload.links.filter((link) => link.partnerName === partnerFilter);
  }, [partnerFilter, payload.links]);

  const handleDestinationChange = (id: string, value: string) => {
    setDestinationDrafts((prev) => ({ ...prev, [id]: value }));
  };

  const saveDestination = async (linkId: string) => {
    const draft = destinationDrafts[linkId];
    if (!draft) return;
    setSavingLink((prev) => ({ ...prev, [linkId]: true }));
    try {
      await fetchJson(`/api/admin/affiliates/blog-links/${linkId}`, {
        method: "PATCH",
        body: JSON.stringify({ destinationUrl: draft }),
      });
      await onReload();
      setDestinationDrafts((prev) => ({ ...prev, [linkId]: "" }));
    } catch (error) {
      console.error(error);
    } finally {
      setSavingLink((prev) => ({ ...prev, [linkId]: false }));
    }
  };

  const toggleStatus = async (link: AdminBlogAffiliateLink) => {
    const nextStatus: AffiliatePartnerStatus = link.status === "ACTIVE" ? "PAUSED" : "ACTIVE";
    setSavingLink((prev) => ({ ...prev, [link.id]: true }));
    try {
      await fetchJson(`/api/admin/affiliates/blog-links/${link.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus }),
      });
      await onReload();
    } catch (error) {
      console.error(error);
    } finally {
      setSavingLink((prev) => ({ ...prev, [link.id]: false }));
    }
  };

  const togglePrimary = async (link: AdminBlogAffiliateLink) => {
    setSavingLink((prev) => ({ ...prev, [link.id]: true }));
    try {
      await fetchJson(`/api/admin/affiliates/blog-links/${link.id}`, {
        method: "PATCH",
        body: JSON.stringify({ isPrimary: !link.isPrimary }),
      });
      await onReload();
    } catch (error) {
      console.error(error);
    } finally {
      setSavingLink((prev) => ({ ...prev, [link.id]: false }));
    }
  };

  if (loading) {
    return <p className="text-sm text-[#3E2F35]/70">Loading blog links…</p>;
  }

  if (error) {
    return <p className="text-sm text-[#c0392b]">Error: {error}</p>;
  }

  if (!filteredLinks.length) {
    return (
      <div className="space-y-4">
        {!!partnerFilter && (
          <div className="flex items-center justify-between rounded-2xl border border-[#E5D4DB] px-4 py-3 text-sm text-[#3E2F35]">
            <span>Filtering by {partnerFilter}</span>
            <button
              type="button"
              onClick={onClearFilter}
              className="text-xs uppercase tracking-[0.4em] text-[#AB6B8E]"
            >
              Clear filter
            </button>
          </div>
        )}
        <EmptyState
          title="No affiliate links"
          description="Create a link to get started."
        />
        <AddLinkForm payload={payload} onReload={onReload} setDestinationDrafts={setDestinationDrafts} />
      </div>
    );
  }

  const columns: AdminTableColumn<AdminBlogAffiliateLink>[] = [
    {
      header: "Blog post",
      render: (row: AdminBlogAffiliateLink) => (
        <div className="space-y-1">
          <p className="font-semibold text-[#3E2F35]">{row.blogPost.title}</p>
          <p className="text-[0.65rem] uppercase tracking-[0.3em] text-[#C8A1B4]">{row.blogPost.slug}</p>
        </div>
      ),
    },
    { header: "Partner", accessor: "partnerName" },
    { header: "CTA", accessor: "label" },
    { header: "Position", accessor: "position", className: "text-center" },
    {
      header: "Primary",
      render: (row: AdminBlogAffiliateLink) => (
        <span className="text-center text-sm text-[#3E2F35]">{row.isPrimary ? "✓" : "—"}</span>
      ),
      align: "center",
    },
    {
      header: "Status",
      render: (row: AdminBlogAffiliateLink) => (
        <span
          className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.3em] ${
            row.status === "ACTIVE"
              ? "bg-[#D8F1E4] text-[#1F644B]"
              : "bg-[#FDE7E3] text-[#9D3B2D]"
          }`}
        >
          {row.status}
        </span>
      ),
      align: "center",
    },
    {
      header: "Clicks",
      accessor: "clickCount",
      align: "center",
    },
    {
      header: "Destination URL",
      render: (row: AdminBlogAffiliateLink) => (
        <div className="flex gap-2">
          <input
            type="text"
            className="w-full rounded-2xl border border-[#E5D4DB] px-3 py-1 text-sm text-[#3E2F35]"
            value={destinationDrafts[row.id] ?? row.destinationUrl}
            onChange={(event) => handleDestinationChange(row.id, event.target.value)}
          />
          <button
            type="button"
            onClick={() => saveDestination(row.id)}
            disabled={!destinationDrafts[row.id]}
            className="rounded-full bg-[#C29EB3] px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-white disabled:opacity-50"
          >
            Save
          </button>
        </div>
      ),
    },
    {
      header: "Actions",
      render: (row: AdminBlogAffiliateLink) => (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => toggleStatus(row)}
            disabled={savingLink[row.id]}
            className="rounded-full border border-[#E5D4DB] px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-[#3E2F35]"
          >
            {row.status === "ACTIVE" ? "Pause" : "Resume"}
          </button>
          <button
            type="button"
            onClick={() => togglePrimary(row)}
            disabled={savingLink[row.id]}
            className="rounded-full border border-[#E5D4DB] px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-[#3E2F35]"
          >
            {row.isPrimary ? "Primary" : "Make primary"}
          </button>
        </div>
      ),
    },
  ] as const;

  return (
    <div className="space-y-4">
      {!!partnerFilter && (
        <div className="flex items-center justify-between rounded-2xl border border-[#E5D4DB] px-4 py-3 text-sm text-[#3E2F35]">
          <span>Filtering by {partnerFilter}</span>
          <button
            type="button"
            onClick={onClearFilter}
            className="text-xs uppercase tracking-[0.4em] text-[#AB6B8E]"
          >
            Clear filter
          </button>
        </div>
      )}
      <AddLinkForm payload={payload} onReload={onReload} setDestinationDrafts={setDestinationDrafts} />
      <div className="overflow-x-auto">
        <AdminTable columns={columns} rows={filteredLinks} rowKey={(row) => row.id} />
      </div>
    </div>
  );
}

type AddLinkFormProps = {
  payload: AdminBlogLinksPayload;
  onReload: () => void;
  setDestinationDrafts: Dispatch<SetStateAction<LinkDestinationEdit>>;
};

function AddLinkForm({ payload, onReload, setDestinationDrafts }: AddLinkFormProps) {
  const [form, setForm] = useState({
    blogPostId: payload.posts[0]?.id ?? "",
    partnerId: payload.partners[0]?.id ?? "",
    label: "",
    destinationUrl: "",
    network: NETWORK_OPTIONS[0],
    position: POSITION_OPTIONS[2],
    isPrimary: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const partnerName = payload.partners.find((partner) => partner.id === form.partnerId)?.name ?? "";
  const hasRequirements = payload.posts.length > 0 && payload.partners.length > 0;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!hasRequirements) {
      setError("Add a published blog post and partner before creating links.");
      return;
    }

    if (!form.blogPostId || !partnerName || !form.label || !form.destinationUrl) {
      setError("Please complete all fields.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await fetchJson("/api/admin/affiliates/blog-links", {
        method: "POST",
        body: JSON.stringify({
          blogPostId: form.blogPostId,
          partnerName,
          label: form.label,
          destinationUrl: form.destinationUrl,
          network: form.network,
          position: form.position,
          isPrimary: form.isPrimary,
        }),
      });
      setForm((prev) => ({
        ...prev,
        label: "",
        destinationUrl: "",
        isPrimary: false,
      }));
      setDestinationDrafts({});
      await onReload();
    } catch (submitError) {
      setError((submitError as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl border border-[#E5D4DB] p-4">
      <p className="text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">Add affiliate link</p>
      <div className="grid gap-3 md:grid-cols-3">
        <label className="text-xs text-[#3E2F35]/70">
          Blog post
          <select
            value={form.blogPostId}
            onChange={(event) => handleChange("blogPostId", event.target.value)}
            className="mt-1 w-full rounded-2xl border border-[#E7D9E1] px-3 py-2 text-sm text-[#3E2F35]"
          >
            {payload.posts.map((post) => (
              <option key={post.id} value={post.id}>
                {post.title}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-[#3E2F35]/70">
          Partner
          <select
            value={form.partnerId}
            onChange={(event) => handleChange("partnerId", event.target.value)}
            className="mt-1 w-full rounded-2xl border border-[#E7D9E1] px-3 py-2 text-sm text-[#3E2F35]"
          >
            {payload.partners.map((partner) => (
              <option key={partner.id} value={partner.id}>
                {partner.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-[#3E2F35]/70">
          Network
          <select
            value={form.network}
            onChange={(event) => handleChange("network", event.target.value)}
            className="mt-1 w-full rounded-2xl border border-[#E7D9E1] px-3 py-2 text-sm text-[#3E2F35]"
          >
            {NETWORK_OPTIONS.map((network) => (
              <option key={network} value={network}>
                {network}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <label className="text-xs text-[#3E2F35]/70">
          CTA label
          <input
            type="text"
            value={form.label}
            onChange={(event) => handleChange("label", event.target.value)}
            className="mt-1 w-full rounded-2xl border border-[#E7D9E1] px-3 py-2 text-sm text-[#3E2F35]"
          />
        </label>
        <label className="text-xs text-[#3E2F35]/70">
          Destination URL
          <input
            type="text"
            value={form.destinationUrl}
            onChange={(event) => handleChange("destinationUrl", event.target.value)}
            className="mt-1 w-full rounded-2xl border border-[#E7D9E1] px-3 py-2 text-sm text-[#3E2F35]"
          />
        </label>
        <label className="text-xs text-[#3E2F35]/70">
          Position
          <select
            value={form.position}
            onChange={(event) => handleChange("position", event.target.value)}
            className="mt-1 w-full rounded-2xl border border-[#E7D9E1] px-3 py-2 text-sm text-[#3E2F35]"
          >
            {POSITION_OPTIONS.map((position) => (
              <option key={position} value={position}>
                {position}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-[#3E2F35]">
          <input
            type="checkbox"
            checked={form.isPrimary}
            onChange={(event) => handleChange("isPrimary", event.target.checked)}
          />
          Mark as primary
        </label>
        <button
          type="submit"
          disabled={submitting || !hasRequirements}
          className="rounded-full bg-[#C29EB3] px-5 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-white disabled:opacity-50"
        >
          Add link
        </button>
      </div>
      {!hasRequirements && (
        <p className="text-xs text-[#c0392b]">
          Publish a blog and add at least one partner before creating links.
        </p>
      )}
      {error && <p className="text-xs text-[#c0392b]">{error}</p>}
    </form>
  );
}

type AnalyticsTabProps = {
  data: AffiliateAnalyticsRow[];
  loading: boolean;
  error: string;
};

function AnalyticsTab({ data, loading, error }: AnalyticsTabProps) {
  if (loading) {
    return <p className="text-sm text-[#3E2F35]/70">Loading analytics…</p>;
  }

  if (error) {
    return <p className="text-sm text-[#c0392b]">Error: {error}</p>;
  }

  if (!data.length) {
    return (
      <EmptyState
        title="Clicks will appear here"
        description="Once traffic routes through affiliate links, the analytics summary will populate."
      />
    );
  }

  return (
    <div className="space-y-4">
      {data.map((row) => (
        <div
          key={`${row.blogPostId}-${row.partnerName}`}
          className="space-y-3 rounded-2xl border border-[#E5D4DB] bg-white/90 p-4"
        >
          <div className="flex flex-col gap-1">
            <p className="text-lg font-semibold text-[#3E2F35]">{row.blogPostTitle}</p>
            <p className="text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">{row.blogPostSlug}</p>
            <p className="text-sm text-[#3E2F35]/80">Partner: {row.partnerName}</p>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-[#3E2F35]">
            <span className="font-semibold">{row.totalClicks} clicks</span>
            <span>Last clicked {humanDate(row.lastClickedAt)}</span>
          </div>
          <div className="grid gap-2 text-xs text-[#3E2F35]/80 md:grid-cols-2">
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.3em] text-[#C8A1B4]">Daily</p>
              <div className="flex flex-wrap gap-2">
                {row.clicksByDay.slice(-5).map((daily) => (
                  <span
                    key={daily.date}
                    className="rounded-full border border-[#E5D4DB] px-3 py-1"
                  >
                    {daily.date}: {daily.count}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.3em] text-[#C8A1B4]">Weekly</p>
              <div className="flex flex-wrap gap-2">
                {row.clicksByWeek.slice(-4).map((weekly) => (
                  <span key={weekly.week} className="rounded-full border border-[#E5D4DB] px-3 py-1">
                    {weekly.week}: {weekly.count}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
