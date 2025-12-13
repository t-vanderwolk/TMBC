"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

import { getInviteRequests, inviteRequestApi } from "@/lib/api";
import { loadSession } from "@/lib/auth";

type InviteRequest = {
  id: string;
  email: string;
  dueDate?: string | null;
  vibe?: string | null;
  supportNeeds?: string | null;
  createdAt: string;
  status: string;
};

const determineWindow = (value?: string | null) => {
  if (!value) return "Planning";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Planning";
  const weeks = (date.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 7);
  if (weeks <= 13) return "First trimester";
  if (weeks <= 26) return "Second trimester";
  return "Third trimester";
};

export default function AdminWaitlistPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<InviteRequest[]>([]);
  const [loading, setLoading] = useState(true);
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
        console.error("Unable to load waitlist", err);
      } finally {
        setLoading(false);
      }
    };

    void fetchRequests();
  }, [router, session]);

  const groups = useMemo(() => {
    const bucket: Record<string, InviteRequest[]> = {};
    requests.forEach((request) => {
      const window = determineWindow(request.dueDate);
      const windowBucket = bucket[window] ?? [];
      windowBucket.push(request);
      bucket[window] = windowBucket;
    });
    return bucket;
  }, [requests]);

  const windows = useMemo(() => Object.keys(groups), [groups]);

  const handleDecline = async (id: string) => {
    console.log("Decline waitlist", id);
  };

  const handleApprove = async (id: string) => {
    try {
      await inviteRequestApi.approve({ requestId: id, adminId: String(session?.payload?.userId ?? session?.payload?.id) });
      setRequests((prev) => prev.filter((request) => request.id !== id));
    } catch (err) {
      console.error("Unable to approve invite from waitlist", err);
    }
  };

  if (!session) {
    return null;
  }

  return (
    <div className="space-y-8">
      <header className="rounded-[3rem] border border-white/70 bg-white/80 p-6 shadow-soft">
        <p className="text-sm uppercase tracking-[0.5em] text-[#C8A1B4]">Admin · Waitlist</p>
        <h1 className="text-4xl text-[#3E2F35]">Families awaiting a Taylor-Made welcome</h1>
        <p className="mt-2 text-sm text-[#3E2F35]/70">
          Review due dates, vibe notes, and support needs grouped by trimester.
        </p>
      </header>

      {loading ? (
        <div className="rounded-[2rem] border border-[#E3C6D4] bg-white/90 p-6 text-center text-sm uppercase tracking-[0.4em] text-[#C8A1B4]">
          Loading waitlist entries…
        </div>
      ) : (
        windows.map((window) => {
          const windowRequests = groups[window] ?? [];
          return (
            <section
              key={window}
              className="space-y-4 rounded-[2rem] border border-[#E3C6D4] bg-white/90 p-6 shadow-[0_20px_60px_rgba(180,143,164,0.15)]"
            >
              <h2 className="text-xl font-semibold text-[#3E2F35]">{window}</h2>
              <div className="space-y-4">
                {windowRequests.map((request) => (
                  <article
                    key={request.id}
                    className="flex flex-col gap-4 rounded-[1.75rem] border border-[#E3C6D4]/60 bg-[#FFFAF8]/80 p-4 lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div className="space-y-1">
                      <p className="text-lg font-semibold text-[#3E2F35]">{request.email}</p>
                      <p className="text-sm text-[#3E2F35]/70">
                        Due date: {request.dueDate ? new Date(request.dueDate).toLocaleDateString() : "TBD"}
                      </p>
                      <p className="text-xs uppercase tracking-[0.4em] text-[#3E2F35]/60">
                        Vibe: {request.vibe ?? "Calm + curious"}
                      </p>
                      <p className="text-xs text-[#3E2F35]/70">
                        Support: {request.supportNeeds ?? "Mentor notes pending"}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.3em]">
                      <button
                        onClick={() => handleApprove(request.id)}
                        className="rounded-full bg-[#C8A1B4] px-4 py-2 text-white transition hover:bg-[#b98aa5]"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleDecline(request.id)}
                        className="rounded-full border border-[#E3C6D4] px-4 py-2 text-[#3E2F35] transition hover:border-[#B98AA5]"
                      >
                        Decline
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
