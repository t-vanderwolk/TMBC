"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { inviteRequestApi } from "@/lib/api";
import { getInviteRequests } from "@/lib/api/admin";
import { loadSession } from "@/lib/auth";

type InviteRequest = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  status: string;
  inviteCode?: string | null;
  message?: string;
};

export default function AdminInvites() {
  const router = useRouter();
  const [requests, setRequests] = useState<InviteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const session = loadSession();

  useEffect(() => {
    const role = String(session?.payload?.role ?? "").toLowerCase();
    if (role !== "admin") {
      router.replace("/dashboard");
      return;
    }

    const fetchRequests = async () => {
      setLoading(true);
      try {
        const response = await getInviteRequests();
        setRequests(response.data?.data ?? response.data ?? []);
      } catch (err) {
        console.error("Unable to load invite requests", err);
      } finally {
        setLoading(false);
      }
    };

    void fetchRequests();
  }, [router, session]);

  const adminId = session?.payload?.userId ?? session?.payload?.id;

  const handleApprove = async (requestId: string) => {
    if (!adminId) return;
    setProcessing(requestId);
    try {
      const response = await inviteRequestApi.approve({ requestId, adminId });
      const inviteCode = response.data?.inviteCode ?? response.data?.code;
      setRequests((prev) =>
        prev.map((request) =>
          request.id === requestId
            ? { ...request, status: "approved", inviteCode }
            : request,
        ),
      );
    } catch (err) {
      console.error("Invite approval failed", err);
    } finally {
      setProcessing(null);
    }
  };

  const pending = useMemo(
    () => requests.filter((request) => request.status === "pending"),
    [requests],
  );

  if (!session) {
    return null;
  }

  return (
    <div className="space-y-8">
      <header className="rounded-[2rem] border border-[#E3C6D4] bg-white/90 p-6 shadow-[0_20px_60px_rgba(180,143,164,0.2)]">
        <p className="text-xs uppercase tracking-[0.45em] text-[#3E2F35]/60">Admin · Invites</p>
        <h1 className="text-3xl font-serif text-[#3E2F35]">Invite requests</h1>
        <p className="mt-2 text-sm text-[#3E2F35]/70">
          Approve families, generate codes, and deliver warm invites with one click.
        </p>
      </header>

      {loading ? (
        <div className="rounded-[2rem] border border-[#E3C6D4] bg-white/80 p-6 text-center text-sm uppercase tracking-[0.4em] text-[#C8A1B4]">
          Loading pending requests…
        </div>
      ) : (
        <div className="space-y-4">
          {pending.length === 0 && (
            <p className="rounded-[1.5rem] border border-dashed border-[#E3C6D4] bg-[#FFFAF8]/80 p-6 text-sm text-[#3E2F35]/70">
              No pending requests right now.
            </p>
          )}
          {pending.map((request) => (
            <article
              key={request.id}
              className="flex flex-col gap-4 rounded-[2rem] border border-[#E3C6D4] bg-white/90 p-6 shadow-[0_12px_40px_rgba(180,143,164,0.2)] lg:flex-row lg:items-center lg:justify-between"
            >
              <div>
                <p className="text-lg font-semibold text-[#3E2F35]">
                  {request.firstName ?? "Member"} {request.lastName ?? ""}
                </p>
                <p className="text-sm uppercase tracking-[0.3em] text-[#3E2F35]/60">{request.email}</p>
                {request.message && (
                  <p className="mt-2 text-sm text-[#3E2F35]/70">{request.message}</p>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                {request.inviteCode && (
                  <span className="rounded-full border border-[#C8A1B4]/40 px-4 py-2 text-xs uppercase tracking-[0.3em] text-[#3E2F35]">
                    Code {request.inviteCode}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => handleApprove(request.id)}
                  disabled={processing === request.id}
                  className="rounded-full bg-[#C8A1B4] px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-[#b88aa5] disabled:opacity-70"
                >
                  {request.inviteCode ? "Renew code" : "Approve invite"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
