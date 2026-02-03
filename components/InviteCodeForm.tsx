"use client";

import { FormEvent, useState } from "react";

const INPUT_CLASSES =
  "w-full rounded-full border border-[#D9C48E]/60 bg-white px-4 py-3 text-sm text-[#3E2F35] placeholder:text-[#3E2F35]/60 focus:border-[#C8A1B4] focus:outline-none focus:ring-1 focus:ring-[#C8A1B4]";
const BUTTON_CLASSES =
  "inline-flex w-full items-center justify-center rounded-full bg-[#C8A1B4] px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] shadow-[0_8px_30px_rgba(200,161,180,0.15)] transition hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed";

export default function InviteCodeForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (submitted) return;
    if (!email.trim()) return;

    setSubmitted(true);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35]/80">
        Email
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@email.com"
          required
          className={INPUT_CLASSES}
        />
      </label>
      <button type="submit" className={BUTTON_CLASSES} disabled={submitted}>
        {submitted ? "Request received" : "Send invite request"}
      </button>
      <p className="text-xs text-[#3E2F35]/70" aria-live="polite">
        {submitted
          ? "We’re archiving your request and will reply with private next steps."
          : "We reply within two business days with a bespoke onboarding note."}
      </p>
    </form>
  );
}
