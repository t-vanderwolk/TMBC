"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { onboardingApi } from "@/lib/api";

const RequestInvitePage = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    dueDate: "",
    city: "",
    referral: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateField =
    (field: keyof typeof form) => (event: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    try {
      setLoading(true);
      await onboardingApi.requestInvite({
        ...form,
        dueDate: form.dueDate || undefined,
      });
      router.push("/thank-you");
    } catch (err: any) {
      const message = err?.response?.data?.error || "Unable to submit request";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 text-[var(--tmbc-charcoal)]">
      <section className="marketing-section">
        <div className="mx-auto max-w-lg rounded-[32px] border border-[var(--tmbc-mauve)]/30 bg-white/90 p-8 shadow-[0_25px_60px_rgba(199,166,199,0.25)]">
          <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-60">Invite request</p>
          <h1 className="mt-2 font-serif text-3xl sm:text-4xl">Request an Invitation</h1>
          <p className="text-base text-[var(--tmbc-charcoal)] text-opacity-70">
            Share a few details and our concierge will reply with a personalized onboarding note and invite timeline.
          </p>
          <form onSubmit={submit} className="marketing-form mt-6">
            <label>
              <span>Full name</span>
              <input
                placeholder="Full name"
                value={form.name}
                onChange={updateField("name")}
                required
              />
            </label>
            <label>
              <span>Email</span>
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={updateField("email")}
                required
              />
            </label>
            <label>
              <span>Due date</span>
              <input
                type="date"
                placeholder="Due date"
                value={form.dueDate}
                onChange={updateField("dueDate")}
              />
            </label>
            <label>
              <span>City</span>
              <input placeholder="City" value={form.city} onChange={updateField("city")} />
            </label>
            <label>
              <span>Referral source</span>
              <input placeholder="Referral source" value={form.referral} onChange={updateField("referral")} />
            </label>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" className="marketing-btn marketing-btn-primary uppercase tracking-[0.35em]" disabled={loading}>
              {loading ? "Sending..." : "Request Invite"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default RequestInvitePage;
