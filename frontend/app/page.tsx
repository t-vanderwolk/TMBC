'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { blogPosts } from '@/data/blogPosts';

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

const latestBlogPosts = [...blogPosts]
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 3);

export default function HomePage() {
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmitInvite = () => {
    if (!inviteCode) {
      setError('Please enter a valid invite code.');
      return;
    }

    setError('');
    router.push(`/requestinvite?code=${inviteCode}`);
  };

  return (
    <div className="section-wrap space-y-16">
      <section className="text-center">
        <div className="rounded-[32px] border border-white/70 bg-gradient-to-br from-white via-tmIvory to-tmBlush/50 p-10 shadow-soft">
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6 }}
          variants={heroVariants}
          className="mx-auto max-w-3xl space-y-6"
        >
          <p className="text-sm uppercase tracking-[0.4em] text-tmMauve">Taylor-Made Baby Co.</p>
          <h1 className="text-4xl text-tmCharcoal sm:text-5xl">
            Baby Prep,{' '}
            <span className="font-script text-5xl text-tmMauve sm:text-6xl">
              Taylor-Made
            </span>
            .
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

          <div className="mt-10 flex w-full flex-col items-center gap-4">
            <input
              type="text"
              placeholder="Enter your invite code"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              className="w-full max-w-md rounded-full border border-tmDust bg-white px-4 py-3 text-sm text-tmCharcoal placeholder:text-[#C1AEB6]"
            />

            <button
              onClick={handleSubmitInvite}
              className="w-full max-w-md rounded-full bg-tmMauve px-7 py-3 text-sm tracking-wide text-white shadow-sm transition hover:bg-tmMauveDark"
            >
              Use Invite Code
            </button>

            {error && <p className="text-sm font-medium text-red-500">{error}</p>}
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
            <p className="text-sm uppercase tracking-[0.4em] text-tmMauve">From the Blog</p>
            <h2 className="text-3xl">Concierge insights & gear guides</h2>
          </div>
          <Link href="/blog" className="btn-ghost">
            View all articles
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {latestBlogPosts.map((post) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className="overflow-hidden rounded-3xl border border-tmBlush/50 bg-white/90 shadow-soft"
            >
              <div className="relative h-40 w-full">
                <Image
                  src={post.heroImage}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col gap-3 p-5">
                <p className="text-xs uppercase tracking-[0.4em] text-tmMauve">
                  {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ·{' '}
                  {post.readTime}
                </p>
                <h3 className="text-xl text-tmCharcoal">{post.title}</h3>
                <p className="text-sm text-tmCharcoal/80">{post.description}</p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-tmMauve"
                >
                  Read Article <span aria-hidden>→</span>
                </Link>
              </div>
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
