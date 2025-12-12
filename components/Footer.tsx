"use client";

import Link from "next/link";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden rounded-[48px] border border-[var(--tmbc-mauve)] bg-gradient-to-br from-[var(--tmbc-blush)] via-[var(--tmbc-ivory)] to-[var(--tmbc-charcoal)]/5 px-8 py-12 text-[var(--tmbc-charcoal)] shadow-[0_35px_90px_rgba(199,166,199,0.3)]">
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="flex h-full items-center justify-center text-[6rem] uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)]/10">
          TM
        </div>
      </div>

      <div className="relative mx-auto grid max-w-screen-xl gap-8 md:grid-cols-3">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)]/60">About</p>
          <p className="text-[0.9rem] leading-relaxed text-[var(--tmbc-charcoal)]">
            Invite-only concierge care that lets you learn, plan, and connect with calm confidence.
          </p>
          <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)]/70">
            Learn · Plan · Connect
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)]/60">For Parents</p>
          <Link
            href="/request-invite"
            className="block text-[0.9rem] font-semibold text-[var(--tmbc-mauve)] transition hover:text-[var(--tmbc-gold)]"
          >
            Request invite
          </Link>
          <Link
            href="/membership#faqs"
            className="block text-[0.85rem] text-[var(--tmbc-charcoal)]/80 transition hover:text-[var(--tmbc-mauve)]"
          >
            FAQs
          </Link>
          <a
            href="mailto:hello@taylormadebaby.co"
            className="block text-[0.85rem] text-[var(--tmbc-charcoal)]/80 transition hover:text-[var(--tmbc-mauve)]"
          >
            Contact
          </a>
        </div>

        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)]/60">For Mentors & Partners</p>
          <a
            href="mailto:hello@taylormadebaby.co?subject=Mentor%20interest"
            className="block text-[0.9rem] font-semibold text-[var(--tmbc-mauve)] transition hover:text-[var(--tmbc-gold)]"
          >
            Mentor interest
          </a>
          <a
            href="mailto:hello@taylormadebaby.co?subject=Brand%20partnerships"
            className="block text-[0.85rem] text-[var(--tmbc-charcoal)]/80 transition hover:text-[var(--tmbc-mauve)]"
          >
            Brand partnerships
          </a>
          <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)]/70">
            Invite-only · Concierge community
          </p>
        </div>
      </div>

      <div className="relative mt-10 border-t border-[var(--tmbc-charcoal)]/20 pt-4 text-center text-[0.7rem] uppercase tracking-[0.3em] text-[var(--tmbc-charcoal)]/60">
        © {new Date().getFullYear()} Taylor-Made Baby Co. · Baby prep, Taylor-Made.
      </div>
    </footer>
  );
};

export default Footer;
