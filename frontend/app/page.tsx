'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const heroVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const howItWorks = [
  { title: 'Learn', detail: 'Personalized education that cuts through the noise for expecting families.' },
  { title: 'Plan', detail: 'Build a registry, fourth-trimester plan, and concierge calendar in one hub.' },
  { title: 'Connect', detail: 'Meet vetted mentors and join weekly live sessions to workshop every milestone.' },
  { title: 'Grow', detail: 'Lean on the TMBC community as your family—and confidence—expand.' },
];

const membershipHighlights = [
  'Invite-only concierge onboarding',
  'Mentor-to-member accountability model',
  'Weekly community Zoom touchpoints',
  'Affiliate Perks of the Week drops',
];

const blogCards = [
  { title: 'Stroller Guide', description: 'Navigate the stroller aisle with zero overwhelm and total style.' },
  { title: 'Car Seat Guide', description: 'Safety meets aesthetics in our top car seat picks for modern parents.' },
];

export default function HomePage() {
  return (
    <div className="section-wrap space-y-16">
      <section className="text-center">
        <div className="card-surface">
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6 }}
          variants={heroVariants}
          className="mx-auto max-w-3xl space-y-6"
        >
          <p className="text-sm uppercase tracking-[0.4em] text-tmCharcoal/80">Taylor-Made Baby Co.</p>
          <h1 className="text-4xl sm:text-5xl">
            Baby Prep, <span className="text-tmMauve">Taylor-Made.</span>
          </h1>
          <p className="text-lg text-tmCharcoal/80">
            Because parenting should start with confidence, not confusion.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/requestinvite" className="btn-primary">
              Request Invite
            </Link>
            <Link href="/how-it-works" className="btn-secondary">
              How It Works
            </Link>
          </div>
        </motion.div>
        </div>
      </section>

      <section>
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.4em] text-tmMauve">Preview</p>
          <h2 className="text-3xl">How It Works</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {howItWorks.map((step) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className="card-surface"
            >
              <h3 className="text-2xl">{step.title}</h3>
              <p className="mt-2 text-sm text-tmCharcoal/80">{step.detail}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section>
        <div className="card-surface space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-tmMauve">Membership</p>
            <h2 className="text-3xl">Concierge support beyond the registry.</h2>
          </div>
          <Link href="/membership" className="btn-ghost">
            View membership
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {membershipHighlights.map((item) => (
            <div key={item} className="card-surface">
              {item}
            </div>
          ))}
        </div>
        </div>
      </section>

      <section>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-tmMauve">On the journal</p>
            <h2 className="text-3xl">Latest Blog Highlights</h2>
          </div>
          <Link href="/blog" className="btn-ghost">
            Read the blog
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {blogCards.map((card) => (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className="card-surface"
            >
              <h3 className="text-2xl">{card.title}</h3>
              <p className="mt-2 text-sm text-tmCharcoal/80">{card.description}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-tmMauve">Coming soon</span>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="contact">
        <div className="card-surface">
        <h2 className="text-3xl">Contact the Concierge Team</h2>
        <p className="mt-2 text-sm text-tmCharcoal/80">
          Leave a note and we will be in touch within 48 hours.
        </p>
        <form className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-tmCharcoal">Name</label>
            <input className="w-full" placeholder="Your name" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-tmCharcoal">Email</label>
            <input className="w-full" placeholder="you@email.com" />
          </div>
          <div className="col-span-full flex flex-col gap-2">
            <label className="text-sm font-semibold text-tmCharcoal">Message</label>
            <textarea className="min-h-[140px] w-full rounded-3xl border-tmDust bg-white px-4 py-3 text-sm text-tmCharcoal placeholder:text-[#C1AEB6]" placeholder="How can we support you?" />
          </div>
          <div className="col-span-full">
            <button type="button" className="btn-primary">
              Submit
            </button>
          </div>
        </form>
        </div>
      </section>
    </div>
  );
}
