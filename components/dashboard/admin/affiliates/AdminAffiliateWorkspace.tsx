"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import AdminTable, { type AdminTableColumn } from "@/components/dashboard/admin/AdminTable";
import AffiliateDrawer from "@/components/dashboard/admin/affiliates/AffiliateDrawer";
import { authedFetch } from "@/lib/authedFetch";
import type {
  AffiliateNetwork,
  AffiliatePartnerRole,
  AffiliatePartnerStatus,
  AdminAffiliatePartner,
} from "@/types/adminAffiliates";

type SortKey = "network" | "commission" | "status";

const NETWORK_OPTIONS: ("ALL" | AffiliateNetwork)[] = [
  "ALL",
  "CJ",
  "IMPACT",
  "AWIN",
  "SHAREASALE",
  "MYREGISTRY",
  "DIRECT",
];

const ROLE_OPTIONS: ("ALL" | AffiliatePartnerRole)[] = ["ALL", "Brand", "Retailer", "Infrastructure"];

const STATUS_ORDER: Record<AffiliatePartnerStatus, number> = {
  ACTIVE: 0,
  AT_RISK: 1,
  PAUSED: 2,
};

const statusClasses: Record<AffiliatePartnerStatus, string> = {
  ACTIVE: "bg-[#D8F1E4] text-[#1F644B]",
  AT_RISK: "bg-[#FEF3C7] text-[#7A4B14]",
  PAUSED: "bg-[#FDE7E3] text-[#9D3B2D]",
};

type AdminAffiliateWorkspaceProps = {
  activePartnerId?: string;
};

export default function AdminAffiliateWorkspace({ activePartnerId }: AdminAffiliateWorkspaceProps) {
  const router = useRouter();
  const [partners, setPartners] = useState<AdminAffiliatePartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [filters, setFilters] = useState({
    network: "ALL" as "ALL" | AffiliateNetwork,
    role: "ALL" as "ALL" | AffiliatePartnerRole,
    blogOnly: false,
    registryOnly: false,
  });
  const [sortConfig, setSortConfig] = useState({ key: "network" as SortKey, direction: "asc" as "asc" | "desc" });
  const [drawerPartnerId, setDrawerPartnerId] = useState<string | undefined>(activePartnerId);

  useEffect(() => {
    setDrawerPartnerId(activePartnerId);
  }, [activePartnerId]);

  const loadPartners = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await authedFetch("/api/admin/affiliates/partners", { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error ?? "Unable to load affiliate partners.");
      }
      setPartners(payload?.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load affiliate partners.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPartners();
  }, [loadPartners, refreshTrigger]);

  const refreshPartners = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const filteredPartners = useMemo(() => {
    return partners.filter((partner) => {
      if (filters.network !== "ALL" && partner.network !== filters.network) {
        return false;
      }
      if (filters.role !== "ALL" && partner.role !== filters.role) {
        return false;
      }
      if (filters.blogOnly && !partner.visibility.blogEligible) {
        return false;
      }
      if (filters.registryOnly && !partner.visibility.registryEligible) {
        return false;
      }
      return true;
    });
  }, [filters, partners]);

  const sortedPartners = useMemo(() => {
    const sorted = [...filteredPartners];
    const direction = sortConfig.direction === "asc" ? 1 : -1;

    const parseCommission = (value: string | null): number | null => {
      if (!value) return null;
      const numeric = Number(value.replace(/[^0-9.\-]+/g, ""));
      return Number.isNaN(numeric) ? null : numeric;
    };

    sorted.sort((a, b) => {
      if (sortConfig.key === "network") {
        return a.network.localeCompare(b.network) * direction;
      }
      if (sortConfig.key === "commission") {
        const aValue = parseCommission(a.commissionRate);
        const bValue = parseCommission(b.commissionRate);
        if (aValue !== null && bValue !== null) {
          return (aValue - bValue) * direction;
        }
        if (aValue !== null) return -direction;
        if (bValue !== null) return direction;
        return (a.commissionRate ?? "").localeCompare(b.commissionRate ?? "") * direction;
      }
      return (STATUS_ORDER[a.status] - STATUS_ORDER[b.status]) * direction;
    });

    return sorted;
  }, [filteredPartners, sortConfig]);

  const sortBy = (key: SortKey) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const handleView = (partnerId: string) => {
    router.push(`/dashboard/admin/affiliates/${partnerId}`);
    setDrawerPartnerId(partnerId);
  };

  const handleDrawerClose = () => {
    router.push("/dashboard/admin/affiliates");
    setDrawerPartnerId(undefined);
  };

  const columns: AdminTableColumn<AdminAffiliatePartner>[] = [
    {
      header: "Brand",
      render: (row) => (
        <div className="space-y-1">
          <p className="font-semibold text-[#3E2F35]">{row.name}</p>
          <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#C8A1B4]">{row.network}</p>
        </div>
      ),
    },
    {
      header: "Category",
      render: (row) => row.category ?? "—",
      className: "text-center",
    },
    {
      header: "Role",
      accessor: "role",
      className: "text-center",
    },
    {
      header: "Status",
      render: (row) => (
        <span
          className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.3em] ${statusClasses[row.status]}`}
        >
          {row.status === "AT_RISK" ? "At-Risk" : row.status}
        </span>
      ),
      align: "center",
    },
    {
      header: "Commission",
      render: (row) => row.commissionRate ?? "—",
      align: "center",
    },
    {
      header: "Visibility",
      render: (row) => {
        const flags = [];
        if (row.visibility.blogEligible) flags.push("Blog");
        if (row.visibility.registryEligible) flags.push("Registry");
        if (row.visibility.mentorVisible) flags.push("Mentor");
        if (!flags.length) flags.push("None");
        return (
          <div className="flex flex-wrap gap-2">
            {flags.map((flag) => (
              <span
                key={flag}
                className="rounded-full border border-[#E5D4DB] px-3 py-1 text-[0.6rem] uppercase tracking-[0.4em] text-[#3E2F35]"
              >
                {flag}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      header: "Actions",
      render: (row) => (
        <button
          type="button"
          onClick={() => handleView(row.id)}
          className="rounded-full bg-[#C29EB3] px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-[#AE8CA3]"
        >
          View / Edit
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <header className="space-y-2 rounded-[28px] bg-[#FFF9F5] p-5 shadow-sm">
        <p className="text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">Admin · Affiliates</p>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-serif text-3xl text-[#3E2F35]">Affiliate control center</h1>
          <div className="flex flex-wrap items-center gap-3 text-[0.65rem] uppercase tracking-[0.35em] text-[#3E2F35]">
            <button
              type="button"
              onClick={refreshPartners}
              className="rounded-full border border-[#E5D4DB] px-4 py-1 text-xs font-semibold text-[#3E2F35]"
            >
              Refresh
            </button>
            <span>Sort by:</span>
            {(["network", "commission", "status"] as SortKey[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => sortBy(key)}
                className={`rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] ${
                  sortConfig.key === key
                    ? "bg-[#C8A1B4] text-white"
                    : "border border-[#E5D4DB] text-[#3E2F35]"
                }`}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
                {sortConfig.key === key ? (sortConfig.direction === "asc" ? " ↑" : " ↓") : ""}
              </button>
            ))}
          </div>
        </div>
        <p className="text-sm text-[#3E2F35]/70">
          Control visibility, routing, and payout detail for every affiliate partner.
        </p>
      </header>

      <section className="space-y-4 rounded-[28px] border border-[#E3C6D4] bg-white/95 p-5 shadow-sm">
        <div className="flex flex-wrap gap-3">
          <label className="flex-1 min-w-[160px] text-xs uppercase tracking-[0.35em] text-[#3E2F35]/70">
            Network
            <select
              value={filters.network}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, network: event.target.value as "ALL" | AffiliateNetwork }))
              }
              className="mt-1 w-full rounded-2xl border border-[#E5D4DB] bg-white px-3 py-2 text-sm text-[#3E2F35]"
            >
              {NETWORK_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="flex-1 min-w-[160px] text-xs uppercase tracking-[0.35em] text-[#3E2F35]/70">
            Role
            <select
              value={filters.role}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, role: event.target.value as "ALL" | AffiliatePartnerRole }))
              }
              className="mt-1 w-full rounded-2xl border border-[#E5D4DB] bg-white px-3 py-2 text-sm text-[#3E2F35]"
            >
              {ROLE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-[#3E2F35]/70">
            <input
              type="checkbox"
              checked={filters.blogOnly}
              onChange={(event) => setFilters((prev) => ({ ...prev, blogOnly: event.target.checked }))}
            />
            Blog eligible only
          </label>
          <label className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-[#3E2F35]/70">
            <input
              type="checkbox"
              checked={filters.registryOnly}
              onChange={(event) => setFilters((prev) => ({ ...prev, registryOnly: event.target.checked }))}
            />
            Registry eligible only
          </label>
        </div>

        {loading ? (
          <p className="text-sm text-[#3E2F35]/70">Loading partners…</p>
        ) : error ? (
          <p className="text-sm text-[#c0392b]">Error: {error}</p>
        ) : (
          <AdminTable
            columns={columns}
            rows={sortedPartners}
            rowKey={(row) => row.id}
            className="rounded-3xl border border-[#E5D4DB]"
          />
        )}
      </section>

      {drawerPartnerId ? (
        <AffiliateDrawer partnerId={drawerPartnerId} onClose={handleDrawerClose} onSaved={refreshPartners} />
      ) : null}
    </div>
  );
}
