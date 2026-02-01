"use server";

import { EmptyState } from "@/components/dashboard/shared/EmptyState";
import { listInviteRequests } from "@/lib/services/server/inviteRequest.service";
import { approveWaitlistEntry, rejectWaitlistEntry } from "./actions";

export default async function AdminWaitlistPage() {
  const requests = await listInviteRequests();

  return (
    <div className="space-y-8">
      <header className="rounded-[2rem] border border-[#E5D4DB] bg-[#FDF6F9] p-6 shadow-[0_20px_50px_rgba(62,47,53,0.12)]">
        <p className="text-xs uppercase tracking-[0.5em] text-[#C8A1B4]">Admin · Waitlist</p>
        <h1 className="mt-1 text-4xl font-serif text-[#3E2F35]">Invite requests</h1>
        <p className="mt-2 text-sm text-[#3E2F35]/70">
          Approve incoming invite requests, generate codes, and keep the queue moving.
        </p>
      </header>

      {requests.length === 0 ? (
        <EmptyState
          title="No pending requests"
          description="Invite requests will appear here once families reach out."
        />
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <article
              key={request.id}
              className="flex flex-col justify-between gap-4 rounded-[1.75rem] border border-[#E5D4DB] bg-white/90 p-5 shadow-[0_15px_40px_rgba(62,47,53,0.08)] lg:flex-row lg:items-center"
            >
              <div>
                <p className="text-lg font-semibold text-[#3E2F35]">
                  {request.firstName ?? "Member"} {request.lastName ?? ""}
                </p>
                <p className="text-sm uppercase tracking-[0.35em] text-[#3E2F35]/60">{request.email}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">
                  Status: {request.status}
                </p>
                <p className="text-xs text-[#3E2F35]/70">
                  Submitted {new Date(request.createdAt).toLocaleDateString()}
                </p>
                {request.message && (
                  <p className="mt-2 text-sm text-[#3E2F35]/70">{request.message}</p>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                {request.inviteCode && (
                  <span className="rounded-full border border-[#E5D4DB] px-4 py-2 text-[0.6rem] uppercase tracking-[0.4em] text-[#3E2F35]">
                    Code {request.inviteCode}
                  </span>
                )}
                <form action={approveWaitlistEntry}>
                  <input type="hidden" name="requestId" value={request.id} />
                  <button
                    type="submit"
                    className="rounded-full bg-[#C29EB3] px-5 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-white transition hover:bg-[#AE8CA3]"
                    disabled={request.status === "approved"}
                  >
                    {request.status === "approved" ? "Approved" : "Approve"}
                  </button>
                </form>
                <form action={rejectWaitlistEntry}>
                  <input type="hidden" name="requestId" value={request.id} />
                  <button
                    type="submit"
                    className="rounded-full border border-[#E5D4DB] px-5 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-[#3E2F35] transition hover:border-[#C29EB3]"
                    disabled={request.status === "rejected"}
                  >
                    {request.status === "rejected" ? "Rejected" : "Reject"}
                  </button>
                </form>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
