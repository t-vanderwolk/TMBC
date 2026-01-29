import Image from "next/image";
import type { StaticImageData } from "next/image";
import Link from "next/link";
import experienceHero from "@/assets/images/abouthomehero.png";
import academyPreview from "@/assets/images/academypreview.png";
import planPreview from "@/assets/images/planpreview.png";
import connectPreview from "@/assets/images/connectpreview.png";
import reflectPreview from "@/assets/images/reflectpreview.png";

type SectionPreview = {
  src: StaticImageData;
  alt: string;
};

type ExperienceSection = {
  id: string;
  label: string;
  title: string;
  body: string[];
  preview: SectionPreview;
};

const experienceSections: ExperienceSection[] = [
  {
    id: "learn",
    label: "LEARN",
    title: "Education that keeps pace with what you already know.",
    body: [
      "The Academy delivers calm, guided modules that break each gear category into digestible context and mentor prompts.",
      "You move forward when you feel ready, keeping confidence higher than convenience and questions closer than timelines.",
    ],
    preview: {
      src: academyPreview,
      alt: "Gentle Academy preview with calm learning modules",
    },
  },
  {
    id: "plan",
    label: "PLAN",
    title: "Registry decisions, grounded in your home and rhythm.",
    body: [
      "Mentors help you build a thoughtful registry without pressure, auto-generated lists, or noise.",
      "Every recommendation is backed by conversation, real-world context, and a pace that protects your bandwidth.",
    ],
    preview: {
      src: planPreview,
      alt: "Calm planning preview showing registry guidance",
    },
  },
  {
    id: "connect",
    label: "CONNECT",
    title: "Human support and small circles for steady momentum.",
    body: [
      "A mentor pairing keeps the conversation as focused as you need, with optional small groups that welcome questions, reassurance, and shared pacing.",
      "Community rooms stay intentional—no performance, just calm, moderated check-ins with folks moving through the same chapters.",
    ],
    preview: {
      src: connectPreview,
      alt: "Soft connect preview with gentle messaging circles",
    },
  },
  {
    id: "reflect",
    label: "REFLECT",
    title: "Meaning-making that honors how this season feels.",
    body: [
      "Journaling prompts, keepsake moments, and a private reflection vault capture what you value without obligation.",
      "Mentors keep that journal warm with gratitude checks so every milestone lands in context, not chaos.",
    ],
    preview: {
      src: reflectPreview,
      alt: "Reflection preview showing curated keepsakes and notes",
    },
  },
];

const sectionBackgrounds = [
  { backgroundColor: "var(--step-bg-blush)" },
  { backgroundColor: "var(--step-bg-ivory)" },
  { backgroundColor: "var(--step-bg-mauve)" },
  {
    background:
      "linear-gradient(180deg, var(--step-bg-ivory) 0%, rgba(252,250,246,0) 100%)",
  },
];

const gradientFade = Object.freeze({
  background:
    "linear-gradient(180deg, rgba(252,250,246,0) 0%, rgba(252,250,246,0.9) 70%, rgba(252,250,246,1) 100%)",
});

function PreviewImage({ preview }: { preview: SectionPreview }) {
  return (
    <div className="relative w-full max-w-[600px] h-full min-h-[420px]">
      <div className="relative h-full w-full">
        <Image
          src={preview.src}
          alt={preview.alt}
          fill
          sizes="(min-width: 1024px) 600px, 90vw"
          className="rounded-[32px] object-contain"
        />
      </div>
    </div>
  );
}

export default function ExperiencePage() {
  return (
    <main className="bg-[#fef9f6] text-[#1F1C1A]">
      <section
        className="relative w-screen min-h-[520px] sm:min-h-[600px] lg:min-h-[680px] overflow-hidden pt-2 sm:pt-3 lg:pt-4 pb-16 sm:pb-20 lg:pb-24"
        style={{ backgroundColor: "var(--step-bg-blush)" }}
      >
        <div className="absolute inset-0">
          <div className="relative h-full w-full">
            <Image
              src={experienceHero}
              alt="Taylor-Made Baby Co. hero art"
              fill
              priority
              sizes="100vw"
              className="object-cover object-right lg:object-[80%_50%]"
            />
          </div>
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          {/* Hero spacing mirrors home/how-it-works for editorial continuity. */}
          <div className="relative max-w-[640px] space-y-6 lg:max-w-[720px] pt-6 sm:pt-8 lg:pt-0">
            <p className="text-[11px] tracking-[0.18em] uppercase text-neutral-600 font-semibold mb-3">
              THE EXPERIENCE
            </p>
            <h1 className="font-playfair text-[48px] lg:text-[64px] leading-[1.15] tracking-[-0.01em] mb-4 sm:mb-5 max-w-[32ch] lg:max-w-[40ch]">
              A guided experience designed to support you—step by step.
            </h1>
            <p className="max-w-lg text-[15px] leading-[1.5] text-neutral-600 lg:text-[17px]">
              Mentor-led pacing, calm next steps, and one intentional path through Learn · Plan · Connect · Reflect.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 pb-8 sm:pb-10 lg:pb-0">
              <Link
                href="/request-invite"
                className="inline-flex w-full items-center justify-center rounded-full bg-[var(--tmbc-blush-primary)] px-6 py-3.5 text-[14px] font-semibold tracking-[0.3em] text-white transition hover:bg-[var(--tmbc-blush-primary-hover)] sm:w-auto"
              >
                Request an Invite
              </Link>
              <Link
                href="#learn"
                className="text-[11px] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)]/80 transition hover:text-[var(--tmbc-charcoal)]"
              >
                See the experience ↓
              </Link>
            </div>
          </div>
        </div>
      </section>
      <div className="h-40 w-full" aria-hidden style={gradientFade} />

      {experienceSections.map((section, index) => (
        <section
          key={section.id}
          id={section.id}
          style={sectionBackgrounds[index]}
          className="relative py-28 min-h-[520px]"
        >
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid items-stretch gap-16 md:grid-cols-2">
              <div className="max-w-xl space-y-5">
                <p className="text-[11px] uppercase tracking-[0.4em] text-[var(--tmbc-mauveGray)]">
                  {section.label}
                </p>
                <h2 className="font-playfair text-[32px] sm:text-[36px] leading-[1.2] text-neutral-900/95">
                  {section.title}
                </h2>
                <div className="space-y-3 text-[17px] leading-[1.9] text-neutral-600">
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className="m-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
              <div className="flex justify-center h-full">
                <PreviewImage preview={section.preview} />
              </div>
            </div>
          </div>
        </section>
      ))}

      <section
        className="py-20 sm:py-24"
        style={{
          background:
            "radial-gradient(circle at top center, rgba(243,214,223,0.2), transparent 65%)",
        }}
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center space-y-8">
          <p className="text-[11px] uppercase tracking-[0.4em] text-neutral-500">INVITE-ONLY</p>
          <h2 className="font-playfair text-[32px] sm:text-[38px] leading-[1.2] text-neutral-900">
            Join a calm, mentor-led experience exactly when you are ready.
          </h2>
          <p className="text-[16px] leading-[1.7] text-neutral-600">
            We stay intentionally small so you receive thoughtful pacing, real mentors, and steady next steps.
          </p>
          <div className="flex flex-col items-center gap-3">
            <Link
              href="/request-invite"
              className="inline-flex h-11 items-center justify-center rounded-full bg-neutral-900 px-6 text-[12px] uppercase tracking-[0.4em] text-white transition hover:bg-neutral-800"
            >
              Request an Invite
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
