"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { inviteFlowApi } from "@/lib/api";

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
      await inviteFlowApi.requestInvite({
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
    <div className="onboarding">
      <div className="max-w-lg mx-auto p-10 space-y-6">
        <h1 className="font-serif text-4xl text-[#3E2F35]">Request an Invitation</h1>

        <form onSubmit={submit} className="space-y-4">
          <input className="input" placeholder="Full name" value={form.name} onChange={updateField("name")} required />
          <input className="input" type="email" placeholder="Email" value={form.email} onChange={updateField("email")} required />
          <input className="input" type="date" placeholder="Due date" value={form.dueDate} onChange={updateField("dueDate")} />
          <input className="input" placeholder="City" value={form.city} onChange={updateField("city")} />
          <input className="input" placeholder="Referral source" value={form.referral} onChange={updateField("referral")} />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button className="btn-primary w-full text-center" type="submit" disabled={loading}>
            {loading ? "Sending..." : "Request Invite"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestInvitePage;
