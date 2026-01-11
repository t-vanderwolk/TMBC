import Link from "next/link";
import MarketingHero from "@/components/marketing/MarketingHero";
import MarketingContent from "@/components/marketing/MarketingContent";
import ImageFrame from "@/components/marketing/ImageFrame";
import MobilePreviewImage from "@/components/marketing/MobilePreviewImage";

const connectMeaning = [
  {
    title: "Moderated presence",
    description:
      "Every room is led by mentors who keep the space cordial, focused, and free from noise that feels like a feed.",
  },
  {
    title: "Intentional pacing",
    description:
      "We open gatherings with purpose so you can enter when it feels right, not because you’re chasing activity.",
  },
  {
    title: "Safety first",
    description:
      "Mentors and moderators quietly reset tone if conversations drift toward comparison or performance.",
  },
];

const mentorCircles = [
  {
    title: "Circles framed by mentors",
    description:
      "Mentors introduce prompts, guide the pause, and keep the dialogue gentle so every parent feels heard.",
  },
  {
    title: "Context, not metrics",
    description:
      "You receive summaries and mirror reflections, not constant notifications or engagement counts.",
  },
  {
    title: "Invitations over pressure",
    description:
      "Moderators invite participation, but staying quiet is always acceptable and treated as part of the rhythm.",
  },
];

const quietBelonging = [
  "Observe conversations until you feel ready to respond.",
  "There are no public feeds; you’re welcomed like a neighbor, not an audience.",
  "Every interaction is private, intentional, and modeled by mentors who keep the tone kind.",
];

export default function ConnectPage() {
  return (
    <>
      <MarketingHero
        imageSrc="/assets/images/section-background-soft-ribbon.png"
        imageAlt="Editorial hero artwork for the Connect pillar."
        imageWidth={1536}
        imageHeight={1024}
        headline="You’re not meant to do this alone."
        supportingText="Connect is a mentor-led village of calm rooms that meet you when you’re ready."
        primaryCta={{
          label: "Request Your Invite",
          href: "/request-invite",
          className: "marketing-btn marketing-btn-primary-medium uppercase tracking-[0.35em]",
        }}
        secondaryCta={{
          label: "How It Works (quietly)",
          href: "/how-it-works",
        }}
        motion
      />

      <MarketingContent>
        <div className="marketing-content space-y-24 md:space-y-32 text-[var(--tmbc-charcoal)]">
          <section className="marketing-section marketing-card bg-[var(--tmbc-ivory)]/90 px-8 py-20 md:py-28">
            <div className="flex flex-col items-center gap-3 text-center">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                What “Connect” means here
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
                Connection without noise.
              </h2>
              <p className="max-w-3xl text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
                Our rooms are curated, moderated, and anchored by mentors so the space feels like a breath, not a feed.
              </p>
            </div>
            <div className="mt-12 space-y-4 md:hidden">
              {connectMeaning.map((meaning) => (
                <details
                  key={meaning.title}
                  className="group rounded-[26px] border border-[var(--tmbc-charcoal)]/10 bg-white/90 p-5"
                >
                  <summary className="cursor-pointer list-none text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)]/70">
                    {meaning.title}
                  </summary>
                  <p className="mt-3 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">{meaning.description}</p>
                </details>
              ))}
            </div>
            <div className="mt-12 hidden gap-6 md:grid md:grid-cols-3">
              {connectMeaning.map((meaning) => (
                <div key={meaning.title} className="marketing-card bg-white/80 p-6">
                  <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-50">
                    {meaning.title}
                  </p>
                  <p className="mt-4 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">{meaning.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="flex flex-col items-center my-24 md:my-32 space-y-6">
            <div className="max-w-3xl text-center text-sm text-[var(--tmbc-charcoal)] text-opacity-80">
              Tiny anchors that explain the calm: showing how mentors open rooms, invite presence, and ease you into connection.
            </div>
            <ImageFrame className="max-w-[1000px]">
              <img
                src="/assets/images/connectexplained.png"
                alt="How Taylor-Made Baby Co. connects parents through chats, groups, and shared journeys"
                className="w-full rounded-[28px]"
                loading="lazy"
              />
            </ImageFrame>
            <p className="max-w-3xl text-center text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
              We keep the tone gentle so you can listen, speak, and reflect alongside other parents without a spotlight.
            </p>
            <ImageFrame className="max-w-[720px]">
              <img
                src="/assets/images/girltalk.jpeg"
                alt="Expecting parents connecting through conversation and shared experiences"
                className="w-full rounded-[26px]"
                loading="lazy"
              />
            </ImageFrame>
          </section>

          <section className="marketing-section marketing-card bg-white/80 px-8 py-20 md:py-28 border-y border-[var(--tmbc-charcoal)]/10">
            <div className="flex flex-col gap-3">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                Mentor-guided circles
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
                Mentors frame the rhythm so you don’t have to perform.
              </h2>
              <p className="max-w-3xl text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
                The preview below shows how messaging, prompts, and circles stay calm under mentor guidance.
              </p>
            </div>
            <div className="mt-8 flex w-full justify-center">
              <ImageFrame className="w-full max-w-[80%] md:max-w-[360px]">
                <MobilePreviewImage
                  src="/assets/images/connectpreview.png"
                  alt="Taylor-Made Baby Co. connection circle preview showing guided rooms."
                  width={360}
                  height={720}
                />
              </ImageFrame>
            </div>
            <div className="mt-12 space-y-3 md:hidden">
              {mentorCircles.map((circle) => (
                <details
                  key={circle.title}
                  className="group rounded-[26px] border border-[var(--tmbc-charcoal)]/10 bg-[var(--tmbc-ivory)]/70 p-5"
                >
                  <summary className="cursor-pointer list-none text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)]/70">
                    {circle.title}
                  </summary>
                  <p className="mt-3 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">{circle.description}</p>
                </details>
              ))}
            </div>
            <div className="mt-12 hidden gap-6 md:grid md:grid-cols-3">
              {mentorCircles.map((circle) => (
                <div key={circle.title} className="marketing-card bg-[var(--tmbc-ivory)]/80 p-6">
                  <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-50">
                    {circle.title}
                  </p>
                  <p className="mt-4 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">{circle.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="marketing-section marketing-card bg-[var(--tmbc-ivory)]/90 px-8 py-20 md:py-28 border-y border-[var(--tmbc-charcoal)]/5">
            <div className="flex flex-col gap-3 text-center">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                A quiet kind of belonging
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
                Listen, observe, and answer when you’re ready.
              </h2>
              <p className="max-w-3xl text-sm text-[var(--tmbc-charcoal)] text-opacity-70 mx-auto">
                There is no feed to scroll, no trending threads, and no invite to overshare. Participation happens on your terms
                so the circle stays calm.
              </p>
            </div>
            <ul className="mt-8 space-y-2 text-sm text-[var(--tmbc-charcoal)] text-opacity-80 leading-relaxed">
              {quietBelonging.map((note) => (
                <li key={note}>• {note}</li>
              ))}
            </ul>
          </section>

          <section className="marketing-section marketing-card bg-[var(--tmbc-ivory)]/90 px-8 py-20 md:py-28">
            <div className="flex flex-col items-center gap-6 text-center">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                Closing reassurance
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
                Connection stays calm beside learning and planning.
              </h2>
              <p className="marketing-subtitle mt-3 mb-6 text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
                The Connect pillar supports your learning and planning moments by offering a breathing room, not a
                feed. When it feels right, request an invite and keep the circle gentle.
              </p>
              <p className="max-w-3xl text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
                Mentors keep the room paced, no one rushes, and every invite is curated so the care stays steady.
              </p>
            <Link
              href="/request-invite"
              className="marketing-btn marketing-btn-primary marketing-btn-primary-medium uppercase tracking-[0.35em]"
            >
              Join by invitation
            </Link>
            </div>
          </section>
        </div>
      </MarketingContent>
    </>
  );
}
