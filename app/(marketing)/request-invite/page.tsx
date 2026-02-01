"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import ImageFrame from "@/components/marketing/ImageFrame";
import { onboardingApi } from "@/lib/api";
import inviteEnvelopeImage from "@/assets/images/envelope.png";
import inviteIconsImage from "@/assets/images/inviteicons.png";

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
        <div className="mx-auto max-w-[90%] md:max-w-lg rounded-[32px] border border-[var(--tmbc-mauve)]/30 bg-white/90 p-8 shadow-[0_25px_60px_rgba(199,166,199,0.25)]">
          <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-60">Invite request</p>
          <h1 className="mt-2 font-serif text-2xl md:text-4xl">Request an Invitation</h1>
          <p className="text-sm text-[var(--tmbc-charcoal)] text-opacity-80">
            TMBC stays invite-only to make sure mentoring is personal. Share a few details and we’ll respond with quiet next steps.
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-60">
            Orientation, review, and matching happen before the invite lands.
          </p>
          <div className="flex justify-center my-24 md:my-32">
            <ImageFrame className="max-w-[960px]">
                <Image
                  src={inviteEnvelopeImage}
                  alt="Invite-only onboarding process from request to mentorship and guided experience"
                  className="w-full rounded-[26px]"
                  width={inviteEnvelopeImage.width}
                  height={inviteEnvelopeImage.height}
                />
            </ImageFrame>
          </div>
          <div className="mt-6 flex justify-center">
          <ImageFrame className="max-w-[520px] border-[var(--tmbc-mauve)]/30">
            <Image
              src={inviteIconsImage}
              alt="How the Taylor-Made Baby Co. invitation process works"
              width={inviteIconsImage.width}
              height={inviteIconsImage.height}
              className="w-full h-auto"
            />
          </ImageFrame>
          </div>
          <form onSubmit={submit} className="marketing-form mt-6 space-y-4">
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
            <button type="submit" className="mkt-btn-primary uppercase tracking-[0.35em]" disabled={loading}>
              {loading ? "Sending..." : "Request an Invite"}
            </button>
            <p className="text-xs text-[var(--tmbc-charcoal)] text-opacity-60">
              The invite stays in your inbox for as long as you need. No follow-up pressure.
            </p>
          </form>
        </div>
      </section>
    </div>
  );
};

export default RequestInvitePage;
