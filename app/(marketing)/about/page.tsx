import Link from "next/link";

const problemCards = [
  {
    title: "The volume is high",
    body: "Every checklist shouts louder than the midnight spit-up clean-up, making your next decision feel urgent.",
  },
  {
    title: "The signal gets buried",
    body: "Feeds full of curated nurseries leave your inbox untouched and your sleep schedule in a different timezone.",
  },
  {
    title: "Decision fatigue hits",
    body: "Decision fatigue settles in when every screen demands a “complete” tap while you're still wondering what day it is.",
  },
];

const philosophy = [
  {
    title: "Calm over urgency",
    body: "We let you breathe while designing each step, so your calendar stays spacious and your hearts stay settled.",
  },
  {
    title: "Guidance over information",
    body: "Mentors translate the noise into next steps you can actually act on, without the pressure to keep chasing trends.",
  },
  {
    title: "Pacing over pressure",
    body: "We honor your season—moving forward when you feel ready and pausing when you need to catch your breath.",
  },
];

const howWeActSteps = [
  {
    step: "Step 01",
    title: "We listen first",
    body: "We pair every parent with a mentor who listens first, then suggests the next calm move.",
  },
  {
    step: "Step 02",
    title: "We build the roadmap",
    body: "We build a roadmap that folds community, education, and registry intent into meaningful moments.",
  },
  {
    step: "Step 03",
    title: "We keep it light",
    body: "We keep check-ins light, confidential, and scheduled around your rhythm—not ours.",
  },
];

const whoThisIsFor = {
  for: [
    "Parents craving clarity (not noise)",
    "Overwhelmed planners who want a calm next step",
    "Families who prefer human guidance over hype",
  ],
  notFor: [
    "Trend-chasing purchase sprints",
    "Automated, impersonal recommendations",
    "Tell me what to buy in 30 seconds energy",
  ],
};

const section = "mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8";
const sectionY = "py-16 sm:py-20";
const eyebrow = "text-[11px] tracking-[0.34em] uppercase text-neutral-500";
const h1 = "mt-4 text-[44px] sm:text-[64px] leading-[0.95] tracking-[-0.02em] text-neutral-900";
const h2 = "mt-4 text-3xl sm:text-4xl leading-tight tracking-tight text-neutral-900";
const lead = "mt-6 text-[16px] sm:text-[18px] leading-relaxed text-neutral-600 max-w-prose";
const microLead = "mt-6 text-[15px] leading-relaxed text-neutral-600 max-w-prose";
const whisper = "mt-4 text-[15px] leading-relaxed text-neutral-500 italic max-w-prose";
const bridge = "mt-10 text-[16px] sm:text-[18px] leading-relaxed text-neutral-700 max-w-prose";
const divider = "mt-14 h-px w-full bg-neutral-200/60";
const cardGrid = "mt-10 grid gap-6 md:grid-cols-3";
const card = "rounded-3xl border border-neutral-200 bg-white/70 p-8";
const cardTitleLg = "text-xl font-semibold text-neutral-900";
const cardTitleMd = "text-lg font-semibold text-neutral-900";
const cardBodySm = "mt-2 text-[14px] leading-relaxed text-neutral-600";
const cardBody = "mt-3 text-[15px] leading-relaxed text-neutral-600";
const imgWrap = "rounded-[32px] overflow-hidden bg-white/60 ring-1 ring-black/5 shadow-[0_20px_60px_rgba(0,0,0,0.06)]";
const bannerRatio = "aspect-[21/9]";
const imgEl = "h-full w-full object-cover";
const bowWrapper = "mt-10 flex items-center justify-center gap-2";
const bowDot = "h-1 w-1 rounded-full bg-neutral-400";
const bowLine = "h-[1px] w-20 rounded-full bg-neutral-200/70";

function BowDivider() {
  return (
    <div className={bowWrapper}>
      <span className={bowDot} />
      <span className={bowLine} />
      <span className={bowDot} />
    </div>
  );
}

export default function AboutPage() {
  return (
    <>
      <section className={`${section} ${sectionY} pt-10 sm:pt-14`}>
        <div className="grid items-start gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6 space-y-6">
            <p className={eyebrow}>About</p>
            <h1 className={h1}>Why Taylor-Made Baby Co. exists.</h1>
            <p className={lead}>
              We guide you through each season with calm clarity, mentor-led pacing, and intentional next steps.
            </p>
            <p className={whisper}>Because Google at 2 a.m. is not a care plan.</p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Link href="/request-invite" className="mkt-btn-primary inline-flex">
                Request an Invite
              </Link>
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className={`${imgWrap} mt-10`}>
              <div className={bannerRatio}>
                <img
                  src="/images/marketing/hero-marketing-signature.png"
                  alt="Taylor-Made Baby Co. hero art"
                  className={imgEl}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <BowDivider />

      <section className={`${section} ${sectionY}`}>
        <p className={eyebrow}>The part nobody warns you about</p>
        <h2 className={h2}>Preparation feels loud before the first baby cue.</h2>
        <p className={lead}>
          We meet families whose inboxes are full but their questions are left unanswered. The noise is louder
          than the actual next move, so we designed a calm, human response.
        </p>
        <p className={microLead}>If it feels loud, you’re not behind. You’re just in the noise.</p>
        <div className={cardGrid}>
          {problemCards.map((cardInfo) => (
            <div key={cardInfo.title} className={card}>
              <h3 className={cardTitleMd}>{cardInfo.title}</h3>
              <p className={cardBody}>{cardInfo.body}</p>
            </div>
          ))}
        </div>
        <div className={divider} />
      </section>
      <BowDivider />

      <section className={`${section} ${sectionY}`}>
        <p className={eyebrow}>Our operating system</p>
        <div className="mt-8 h-px w-full bg-neutral-200/60" />
        <div className={cardGrid}>
          {philosophy.map((item) => (
            <div key={item.title} className={card}>
              <h3 className={cardTitleLg}>{item.title}</h3>
              <p className={cardBody}>{item.body}</p>
            </div>
          ))}
        </div>
        <div className={divider} />
      </section>
      <p className={bridge}>Calm is the vibe. Structure is the method. A real human is the secret sauce.</p>
      <BowDivider />

      <section className={`${section} ${sectionY}`}>
        <p className={eyebrow}>What we actually do</p>
        <div className={cardGrid}>
          {howWeActSteps.map((item) => (
            <div key={item.title} className={card}>
              <p className={eyebrow}>{item.step}</p>
              <h3 className="mt-3 text-lg font-semibold text-neutral-900">{item.title}</h3>
              {item.step === "Step 01" && (
                <p className="mt-2 text-[12px] tracking-[0.18em] uppercase text-neutral-500">
                  No judgment. Just clarity.
                </p>
              )}
              {item.step === "Step 02" && (
                <p className="mt-2 text-[12px] tracking-[0.18em] uppercase text-neutral-500">
                  No pressure. Just a plan.
                </p>
              )}
              {item.step === "Step 03" && (
                <p className="mt-2 text-[12px] tracking-[0.18em] uppercase text-neutral-500">
                  No chaos. Just next steps.
                </p>
              )}
              <p className={cardBodySm}>{item.body}</p>
            </div>
          ))}
        </div>
        <div className={divider} />
      </section>
      <BowDivider />

      <section className={`${section} ${sectionY}`}>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className={card}>
            <p className={eyebrow}>Made for</p>
            <ul className="mt-4 space-y-3 text-[15px] text-neutral-700">
              {whoThisIsFor.for.map((item) => (
                <li key={item} className="flex gap-3 items-start">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-neutral-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className={card}>
            <p className={eyebrow}>Not our lane</p>
            <ul className="mt-4 space-y-3 text-[15px] text-neutral-700">
              {whoThisIsFor.notFor.map((item) => (
                <li key={item} className="flex gap-3 items-start">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-neutral-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className={divider} />
      </section>
      <BowDivider />

      <section className={`${section} ${sectionY}`}>
        <ul className="mt-8 space-y-4 max-w-prose">
          <li className="flex gap-3 items-start text-[16px] leading-relaxed text-neutral-600">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-neutral-400" />
            <span>We answer every request with a thoughtful response, not a rush to sell.</span>
          </li>
          <li className="flex gap-3 items-start text-[16px] leading-relaxed text-neutral-600">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-neutral-400" />
            <span>Our mentors stay present through the entire journey, not just a single checklist.</span>
          </li>
          <li className="flex gap-3 items-start text-[16px] leading-relaxed text-neutral-600">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-neutral-400" />
            <span>We keep the experience invite-only so intimacy stays private.</span>
          </li>
        </ul>
      </section>
      <BowDivider />

      <section className={`${section} ${sectionY}`}>
        <p className={eyebrow}>Tiny FAQ</p>
        <h2 className={h2}>Quick answers, gently.</h2>
        <div className="mt-10 grid gap-4">
          <details className="group rounded-3xl border border-neutral-200 bg-white/70 p-6">
            <summary className="cursor-pointer list-none text-[15px] font-semibold text-neutral-900 flex items-center justify-between">
              Do you tell me what to buy?
              <span className="text-neutral-400 group-open:rotate-45 transition-transform">+</span>
            </summary>
            <p className="mt-3 text-[14px] leading-relaxed text-neutral-600 max-w-prose">
              Nope. We help you decide what fits your life, your space, and your priorities—so your registry feels
              personal, not copy-pasted.
            </p>
          </details>
          <details className="group rounded-3xl border border-neutral-200 bg-white/70 p-6">
            <summary className="cursor-pointer list-none text-[15px] font-semibold text-neutral-900 flex items-center justify-between">
              Is this a registry service?
              <span className="text-neutral-400 group-open:rotate-45 transition-transform">+</span>
            </summary>
            <p className="mt-3 text-[14px] leading-relaxed text-neutral-600 max-w-prose">
              Planning first. Registry second. We focus on clarity and decisions—then the list becomes the easy part.
            </p>
          </details>
          <details className="group rounded-3xl border border-neutral-200 bg-white/70 p-6">
            <summary className="cursor-pointer list-none text-[15px] font-semibold text-neutral-900 flex items-center justify-between">
              Do I have to be “caught up” before joining?
              <span className="text-neutral-400 group-open:rotate-45 transition-transform">+</span>
            </summary>
            <p className="mt-3 text-[14px] leading-relaxed text-neutral-600 max-w-prose">
              Absolutely not. Overwhelmed counts as ready. We’ll start with the next calm step—not the whole internet.
            </p>
          </details>
        </div>
      </section>
      <BowDivider />

      <section className={`${section} ${sectionY}`}>
        <div className="mt-12 rounded-3xl border border-neutral-200 bg-white/70 p-10">
          <p className="text-[18px] leading-relaxed text-neutral-700 max-w-prose">
            Tell us where you are in the season — we’ll meet you there.
          </p>
          <p className="mt-4 text-[16px] sm:text-[18px] leading-relaxed text-neutral-700 max-w-prose">
            Bring your questions. We’ll bring the calm.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link href="/request-invite" className="mkt-btn-primary">
              Request an Invite
            </Link>
          </div>
          <p className="mt-4 text-[14px] leading-relaxed text-neutral-600 max-w-prose">
            Still overwhelmed? That counts as “ready.”
          </p>
          <p className="mt-4 text-[12px] tracking-[0.22em] uppercase text-neutral-500">
            No urgency. No pressure.
          </p>
        </div>
      </section>
    </>
  );
}
