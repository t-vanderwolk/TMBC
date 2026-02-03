"use client";

// Marketing background cadence is intentional.
// Do not reorder or recolor section backgrounds.
// Pattern: white → ivory → white → blush

// Marketing visual guardrails:
// - All cards/panels use canonical marketing-card / marketing-panel styles
// - No borders, transforms, or hover animations
// - Elevation is soft and consistent across pages

import Image from "next/image";
import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import MarketingHero from "@/components/marketing/MarketingHero";
import ImageFrame from "@/components/marketing/ImageFrame";
import { MarketingHeading } from "@/components/marketing/Typography";
import { onboardingApi } from "@/lib/api";
import inviteEnvelopeImage from "@/assets/images/envelope.png";
import { HERO_IMAGE_REGISTRY } from "@/lib/heroImages";
import { ILLUSTRATIONS } from "@/lib/images";

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
    <div className="text-[var(--tmbc-charcoal)]">
      <MarketingHero
        eyebrow="Invite request"
        headline="Request an Invitation"
        lead="TMBC stays invite-only to make sure mentoring is personal. Share a few details and we’ll respond with quiet next steps."
        postLeadMicroLine="Orientation, review, and matching happen before the invite lands."
        primaryCta={{
          label: "Request an Invite",
          href: "#request-invite-form",
        }}
        secondaryCta={{
          label: "See how it works",
          href: "/how-it-works",
        }}
        className="bg-[--tmbc-bg-ivory]"
        textContainerClassName="mx-auto max-w-[90%] md:max-w-lg px-6 text-center space-y-6"
        headlineClassName="mt-2"
        leadClassName="text-sm text-[var(--tmbc-charcoal)] text-opacity-80"
        postLeadMicroLineClassName="text-xs uppercase tracking-[0.35em] text-opacity-60"
        heroImage={HERO_IMAGE_REGISTRY.heroMarketingSignature}
      />
      <section id="request-invite-form" className="bg-[--tmbc-bg-ivory] py-16">
        <div className="marketing-card marketing-card-padding mx-auto max-w-[90%] md:max-w-lg space-y-4 text-[var(--tmbc-charcoal)]">
          <form onSubmit={submit} className="marketing-form mt-6 space-y-4">
            <label>
              <span>Full name</span>
              <input
                placeholder="Full name"
                value={form.name}
                onChange={updateField('name')}
                required
              />
            </label>
            <label>
              <span>Email</span>
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={updateField('email')}
                required
              />
            </label>
            <label>
              <span>Due date</span>
              <input
                type="date"
                placeholder="Due date"
                value={form.dueDate}
                onChange={updateField('dueDate')}
              />
            </label>
            <label>
              <span>City</span>
              <input placeholder="City" value={form.city} onChange={updateField('city')} />
            </label>
            <label>
              <span>Referral source</span>
              <input placeholder="Referral source" value={form.referral} onChange={updateField('referral')} />
            </label>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" className="mkt-btn-primary uppercase tracking-[0.35em]" disabled={loading}>
              {loading ? 'Sending...' : 'Request an Invite'}
            </button>
            <p className="text-xs text-[var(--tmbc-charcoal)] text-opacity-60">
              The invite stays in your inbox for as long as you need. No follow-up pressure.
            </p>
          </form>
        </div>
      </section>
      <section className="bg-[--tmbc-bg-white] py-16">
        <div className="flex flex-col items-center gap-12">
          <div className="flex justify-center w-full">
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
          <div className="flex justify-center w-full">
            <ImageFrame className="max-w-[520px] border-[var(--tmbc-mauve)]/30">
              <Image
                src={ILLUSTRATIONS.INVITE_ICONS}
                alt="How the Taylor-Made Baby Co. invitation process works"
                width={ILLUSTRATIONS.INVITE_ICONS.width}
                height={ILLUSTRATIONS.INVITE_ICONS.height}
                className="w-full h-auto"
              />
            </ImageFrame>
          </div>
        </div>
      </section>
      <section className="bg-[--tmbc-bg-blush] py-12">
        <div className="mx-auto max-w-[90%] md:max-w-lg text-center px-6">
          <p className="text-sm text-[var(--tmbc-charcoal)] text-opacity-80">
            Each request is read by a human so care stays calm, responsive, and deeply personal.
          </p>
        </div>
      </section>
    </div>
  );
};


export default RequestInvitePage;
