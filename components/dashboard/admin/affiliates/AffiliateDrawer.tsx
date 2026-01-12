"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

import { authedFetch } from "@/lib/authedFetch";
import type {
  AffiliateBlogSettings,
  AffiliateIds,
  AffiliateNetwork,
  AffiliatePartnerRole,
  AffiliatePartnerStatus,
  AffiliateRegistrySettings,
  AffiliateVisibility,
  AdminAffiliatePartner,
} from "@/types/adminAffiliates";

type AffiliateDrawerProps = {
  partnerId: string;
  onClose: () => void;
  onSaved: () => void;
};

const CTA_OPTIONS: AffiliateBlogSettings["defaultCta"][] = ["Shop", "Explore", "Learn More"];
const NETWORKS: AffiliateNetwork[] = ["CJ", "IMPACT", "AWIN", "SHAREASALE", "MYREGISTRY", "DIRECT"];
const STATUS_OPTIONS: AffiliatePartnerStatus[] = ["ACTIVE", "AT_RISK", "PAUSED"];

type FormState = {
  name: string;
  network: AffiliateNetwork;
  defaultLink: string;
  cookieWindow: string;
  commissionRate: string;
  status: AffiliatePartnerStatus;
  category: string;
  role: AffiliatePartnerRole;
  internalNotes: string;
  visibility: AffiliateVisibility;
  blogSettings: AffiliateBlogSettings;
  registrySettings: {
    retailerTier: AffiliateRegistrySettings["retailerTier"] | "";
    priority: string;
    categoryExclusions: string;
    fallbackToBrandDirect: boolean;
  };
  affiliateIds: AffiliateIds;
};

const defaultFormState: FormState = {
  name: "",
  network: "CJ",
  defaultLink: "",
  cookieWindow: "",
  commissionRate: "",
  status: "ACTIVE",
  category: "",
  role: "Brand",
  internalNotes: "",
  visibility: { blogEligible: true, registryEligible: true, mentorVisible: true },
  blogSettings: { eligible: true, defaultCta: "Shop", placement: "END_CARD", primaryEligible: true },
  registrySettings: { retailerTier: "", priority: "", categoryExclusions: "", fallbackToBrandDirect: false },
  affiliateIds: {},
};

export default function AffiliateDrawer({ partnerId, onClose, onSaved }: AffiliateDrawerProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<FormState>(defaultFormState);
  const [partner, setPartner] = useState<AdminAffiliatePartner | null>(null);

  const loadPartner = useCallback(async () => {
    if (!partnerId) return;
    setLoading(true);
    setError("");
    try {
      const response = await authedFetch(`/api/admin/affiliates/partners/${partnerId}`, { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error ?? "Unable to load partner.");
      }
      const data = payload?.data as AdminAffiliatePartner;
      setPartner(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load partner.");
    } finally {
      setLoading(false);
    }
  }, [partnerId]);

  useEffect(() => {
    void loadPartner();
  }, [loadPartner]);

  useEffect(() => {
    if (!partner) {
      setForm(defaultFormState);
      return;
    }
    setForm({
      name: partner.name,
      network: partner.network,
      defaultLink: partner.defaultLink ?? "",
      cookieWindow: partner.cookieWindow !== null ? String(partner.cookieWindow) : "",
      commissionRate: partner.commissionRate ?? "",
      status: partner.status,
      category: partner.category ?? "",
      role: partner.role,
      internalNotes: partner.internalNotes ?? "",
      visibility: partner.visibility,
      blogSettings: partner.blogSettings,
      registrySettings: {
        retailerTier: partner.registrySettings.retailerTier ?? "",
        priority:
          partner.registrySettings.priority !== undefined && partner.registrySettings.priority !== null
            ? String(partner.registrySettings.priority)
            : "",
        categoryExclusions: partner.registrySettings.categoryExclusions.join("\n"),
        fallbackToBrandDirect: partner.registrySettings.fallbackToBrandDirect,
      },
      affiliateIds: partner.affiliateIds ?? {},
    });
  }, [partner]);

  const confirmAction = (message: string) => {
    if (typeof window === "undefined") return true;
    return window.confirm(message);
  };

  const handleVisibilityToggle = (key: keyof AffiliateVisibility, value: boolean) => {
    if (
      !value &&
      !confirmAction(
        `Remove ${key === "blogEligible" ? "blog END_CARD eligibility" : "registry routing eligibility"}?`,
      )
    ) {
      return;
    }
    setForm((prev) => ({ ...prev, visibility: { ...prev.visibility, [key]: value } }));
  };

  const handleStatusChange = (nextStatus: AffiliatePartnerStatus) => {
    if (nextStatus === "PAUSED" && partner?.status !== "PAUSED") {
      if (!confirmAction("Pausing a partner stops affiliate routing—continue?")) {
        return;
      }
    }
    setForm((prev) => ({ ...prev, status: nextStatus }));
  };

  const handleBlogSettingToggle = (key: keyof AffiliateBlogSettings, value: boolean) => {
    if (key === "eligible" && !value && !confirmAction("Remove blog eligibility from this partner?")) {
      return;
    }
    setForm((prev) => ({ ...prev, blogSettings: { ...prev.blogSettings, [key]: value } }));
  };

  const handleAffiliateIdChange = (network: AffiliateNetwork, value: string) => {
    setForm((prev) => ({
      ...prev,
      affiliateIds: {
        ...prev.affiliateIds,
        [network]: value,
      },
    }));
  };

  const categoryExclusionsList = useMemo(() => {
    return form.registrySettings.categoryExclusions
      .split(/[\n,]+/)
      .map((value) => value.trim())
      .filter(Boolean);
  }, [form.registrySettings.categoryExclusions]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!partnerId) return;
    setSaving(true);
    setError("");
    try {
      const payload: Record<string, unknown> = {
        name: form.name.trim(),
        network: form.network,
        defaultLink: form.defaultLink.trim() || null,
        commissionRate: form.commissionRate.trim() || null,
        status: form.status,
        category: form.category.trim() || null,
        role: form.role,
        internalNotes: form.internalNotes.trim() || null,
        visibility: form.visibility,
        blogSettings: {
          ...form.blogSettings,
          defaultCta: form.blogSettings.defaultCta,
        },
        registrySettings: {
          ...form.registrySettings,
          categoryExclusions: categoryExclusionsList,
          priority: form.registrySettings.priority ? Number(form.registrySettings.priority) : undefined,
        },
      };
      const cookieWindowValue =
        form.cookieWindow.trim() === "" ? undefined : Number(form.cookieWindow.trim());
      if (cookieWindowValue !== undefined && !Number.isNaN(cookieWindowValue)) {
        payload.cookieWindow = cookieWindowValue;
      }
      const affiliateIdsPayload: Record<AffiliateNetwork, string> = {} as Record<AffiliateNetwork, string>;
      NETWORKS.forEach((network) => {
        const value = form.affiliateIds[network];
        if (typeof value === "string" && value.trim()) {
          affiliateIdsPayload[network] = value.trim();
        }
      });
      if (Object.keys(affiliateIdsPayload).length) {
        payload.affiliateIds = affiliateIdsPayload;
      }

      const response = await authedFetch(`/api/admin/affiliates/partners/${partnerId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error ?? "Unable to save partner.");
      }
      onSaved();
      await loadPartner();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save partner.");
    } finally {
      setSaving(false);
    }
  };

  if (!partnerId) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} aria-hidden />
      <div className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col overflow-y-auto bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[#C29EB3]">Affiliate partner</p>
            <h2 className="text-2xl font-semibold text-[#3E2F35]">{partner?.name ?? partnerId}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-semibold uppercase tracking-[0.35em] text-[#3E2F35]"
          >
            Close
          </button>
        </div>
        <p className="mt-1 text-sm text-[#3E2F35]/70">
          Manage visibility, routing, and internal context without exposing secrets to mentors.
        </p>

        {loading ? (
          <div className="mt-6 rounded-2xl border border-[#E5D4DB] bg-[#F6F1F3] px-4 py-3 text-sm text-[#3E2F35]/70">
            Loading partner data…
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {error ? (
              <div className="rounded-2xl border border-[#F0CCD7] bg-[#FFF4FA] px-4 py-3 text-sm text-[#8B4A61]">
                {error}
              </div>
            ) : null}

            <section className="space-y-3 rounded-3xl border border-[#E5D4DB] bg-white p-4">
              <h3 className="text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">Primary settings</h3>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="text-xs text-[#3E2F35]/70">
                  Brand name
                  <input
                    value={form.name}
                    onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                    className="mt-1 w-full rounded-2xl border border-[#E5D4DB] px-3 py-2 text-sm text-[#3E2F35]"
                  />
                </label>
                <label className="text-xs text-[#3E2F35]/70">
                  Network
                  <select
                    value={form.network}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, network: event.target.value as AffiliateNetwork }))
                    }
                    className="mt-1 w-full rounded-2xl border border-[#E5D4DB] px-3 py-2 text-sm text-[#3E2F35]"
                  >
                    {NETWORKS.map((network) => (
                      <option key={network} value={network}>
                        {network}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="text-xs text-[#3E2F35]/70">
                  Affiliate URL base
                  <input
                    value={form.defaultLink}
                    onChange={(event) => setForm((prev) => ({ ...prev, defaultLink: event.target.value }))}
                    className="mt-1 w-full rounded-2xl border border-[#E5D4DB] px-3 py-2 text-sm text-[#3E2F35]"
                  />
                </label>
                <label className="text-xs text-[#3E2F35]/70">
                  Cookie window (days)
                  <input
                    value={form.cookieWindow}
                    onChange={(event) => setForm((prev) => ({ ...prev, cookieWindow: event.target.value }))}
                    type="number"
                    min={0}
                    className="mt-1 w-full rounded-2xl border border-[#E5D4DB] px-3 py-2 text-sm text-[#3E2F35]"
                  />
                </label>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="text-xs text-[#3E2F35]/70">
                  Commission rate / payout
                  <input
                    value={form.commissionRate}
                    onChange={(event) => setForm((prev) => ({ ...prev, commissionRate: event.target.value }))}
                    className="mt-1 w-full rounded-2xl border border-[#E5D4DB] px-3 py-2 text-sm text-[#3E2F35]"
                  />
                </label>
                <label className="text-xs text-[#3E2F35]/70">
                  Status
                  <select
                    value={form.status}
                    onChange={(event) => handleStatusChange(event.target.value as AffiliatePartnerStatus)}
                    className="mt-1 w-full rounded-2xl border border-[#E5D4DB] px-3 py-2 text-sm text-[#3E2F35]"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status === "AT_RISK" ? "At-Risk" : status}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="text-xs text-[#3E2F35]/70">
                  Category
                  <input
                    value={form.category}
                    onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
                    className="mt-1 w-full rounded-2xl border border-[#E5D4DB] px-3 py-2 text-sm text-[#3E2F35]"
                  />
                </label>
                <label className="text-xs text-[#3E2F35]/70">
                  Role
                  <select
                    value={form.role}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, role: event.target.value as AffiliatePartnerRole }))
                    }
                    className="mt-1 w-full rounded-2xl border border-[#E5D4DB] px-3 py-2 text-sm text-[#3E2F35]"
                  >
                    {["Brand", "Retailer", "Infrastructure"].map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </section>

            <section className="space-y-3 rounded-3xl border border-[#E5D4DB] bg-white p-4">
              <h3 className="text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">Visibility</h3>
              <div className="grid gap-3 md:grid-cols-3">
                {(
                  [
                    ["Blog END_CARD eligible", "blogEligible"],
                    ["Registry routing", "registryEligible"],
                    ["Visible to mentors", "mentorVisible"],
                  ] as [string, keyof AffiliateVisibility][]
                ).map(([label, key]) => (
                  <label
                    key={key}
                    className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-[#3E2F35]/70"
                  >
                    <input
                      type="checkbox"
                      checked={form.visibility[key]}
                      onChange={(event) => handleVisibilityToggle(key, event.target.checked)}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </section>

            <section className="space-y-3 rounded-3xl border border-[#E5D4DB] bg-white p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">Blog settings</h3>
                <span className="text-[0.6rem] uppercase tracking-[0.4em] text-[#A4556A]">
                  Placement: END_CARD
                </span>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-[#3E2F35]/70">
                  <input
                    type="checkbox"
                    checked={form.blogSettings.eligible}
                    onChange={(event) => handleBlogSettingToggle("eligible", event.target.checked)}
                  />
                  Blog eligible
                </label>
                <label className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-[#3E2F35]/70">
                  <input
                    type="checkbox"
                    checked={form.blogSettings.primaryEligible}
                    onChange={(event) => handleBlogSettingToggle("primaryEligible", event.target.checked)}
                  />
                  Primary eligible
                </label>
              </div>
              <label className="text-xs text-[#3E2F35]/70">
                Default CTA label
                <select
                  value={form.blogSettings.defaultCta}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      blogSettings: {
                        ...prev.blogSettings,
                        defaultCta: event.target.value as AffiliateBlogSettings["defaultCta"],
                      },
                    }))
                  }
                  className="mt-1 w-full rounded-2xl border border-[#E5D4DB] px-3 py-2 text-sm text-[#3E2F35]"
                >
                  {CTA_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </section>

            {form.role === "Retailer" ? (
              <section className="space-y-3 rounded-3xl border border-[#E5D4DB] bg-white p-4">
                <h3 className="text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">Registry routing</h3>
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="text-xs text-[#3E2F35]/70">
                    Retailer tier
                    <select
                      value={form.registrySettings.retailerTier}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          registrySettings: {
                            ...prev.registrySettings,
                            retailerTier: event.target.value as AffiliateRegistrySettings["retailerTier"] | "",
                          },
                        }))
                      }
                      className="mt-1 w-full rounded-2xl border border-[#E5D4DB] px-3 py-2 text-sm text-[#3E2F35]"
                    >
                      <option value="">Unassigned</option>
                      <option value="Tier-1">Tier-1</option>
                      <option value="Tier-2">Tier-2</option>
                    </select>
                  </label>
                  <label className="text-xs text-[#3E2F35]/70">
                    Priority order
                    <input
                      type="number"
                      min={0}
                      value={form.registrySettings.priority}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          registrySettings: { ...prev.registrySettings, priority: event.target.value },
                        }))
                      }
                      className="mt-1 w-full rounded-2xl border border-[#E5D4DB] px-3 py-2 text-sm text-[#3E2F35]"
                    />
                  </label>
                </div>
                <label className="text-xs text-[#3E2F35]/70">
                  Category exclusions
                  <textarea
                    value={form.registrySettings.categoryExclusions}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        registrySettings: { ...prev.registrySettings, categoryExclusions: event.target.value },
                      }))
                    }
                    rows={3}
                    className="mt-1 w-full rounded-2xl border border-[#E5D4DB] px-3 py-2 text-sm text-[#3E2F35]"
                  />
                  <p className="mt-1 text-[0.6rem] text-[#3E2F35]/70">
                    Enter newline or comma delimited categories to skip during registry routing.
                  </p>
                </label>
                <label className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-[#3E2F35]/70">
                  <input
                    type="checkbox"
                    checked={form.registrySettings.fallbackToBrandDirect}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        registrySettings: {
                          ...prev.registrySettings,
                          fallbackToBrandDirect: event.target.checked,
                        },
                      }))
                    }
                  />
                  Fallback to brand-direct
                </label>
              </section>
            ) : null}

            <section className="space-y-3 rounded-3xl border border-[#E5D4DB] bg-white p-4">
              <h3 className="text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">Affiliate IDs</h3>
              <div className="grid gap-3 md:grid-cols-2">
                {NETWORKS.map((network) => (
                  <label key={network} className="text-xs text-[#3E2F35]/70">
                    {network} ID
                    <input
                      value={form.affiliateIds[network] ?? ""}
                      onChange={(event) => handleAffiliateIdChange(network, event.target.value)}
                      className="mt-1 w-full rounded-2xl border border-[#E5D4DB] px-3 py-2 text-sm text-[#3E2F35]"
                    />
                  </label>
                ))}
              </div>
            </section>

            <section className="space-y-3 rounded-3xl border border-[#E5D4DB] bg-white p-4">
              <h3 className="text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">Internal notes / warnings</h3>
              <textarea
                value={form.internalNotes}
                onChange={(event) => setForm((prev) => ({ ...prev, internalNotes: event.target.value }))}
                rows={4}
                className="w-full rounded-2xl border border-[#E5D4DB] px-3 py-2 text-sm text-[#3E2F35]"
              />
            </section>

            <div className="flex items-center justify-between gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-[#2B7C6F] px-6 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-white disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
              <p className="text-[0.6rem] uppercase tracking-[0.35em] text-[#3E2F35]/60">
                Clicks: {partner?.clickCount ?? "—"} · Blog links: {partner?.blogLinkCount ?? "—"}
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
